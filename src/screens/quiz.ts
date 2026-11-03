import type { Word } from "../data";
import { pickDistractors, shuffle, spokenForm } from "../logic";
import { speak } from "../speech";
import { record } from "../storage";
import { app, esc, header, progressBar, speakButton, summary, wordMeta } from "../ui";

export type QuizDirection = "en" | "vi" | "mix";

interface Question {
  word: Word;
  dir: "en" | "vi";
  options: Word[];
}

export function startQuiz(opts: {
  all: Word[];
  items: Word[];
  dir: QuizDirection;
  title: string;
  backHref: string;
}) {
  const { all, dir, title, backHref } = opts;

  const build = (items: Word[]): Question[] =>
    shuffle(items).map((word) => {
      const d = dir === "mix" ? (Math.random() < 0.5 ? "en" : "vi") : dir;
      const field = d === "en" ? "meaning" : "word";
      return { word, dir: d, options: shuffle([word, ...pickDistractors(all, word, field)]) };
    });

  let questions = build(opts.items);
  let index = 0;
  let answered = false;
  let wrong: Word[] = [];

  function show() {
    if (index >= questions.length) return finish();
    answered = false;
    const q = questions[index];
    const prompt =
      q.dir === "en"
        ? `<div class="prompt-word">${esc(q.word.word)} ${speakButton(q.word)}</div><div>${wordMeta(q.word)}</div>`
        : `<div class="prompt-meaning">${esc(q.word.meaning)}</div>${q.word.type ? `<div><span class="tag">${esc(q.word.type)}</span></div>` : ""}`;

    app.innerHTML = `
      ${header(title, backHref, `<span class="counter">${index + 1}/${questions.length}</span>`)}
      ${progressBar(index, questions.length)}
      <main>
        <section class="card prompt">${prompt}</section>
        <div class="options">
          ${q.options
            .map(
              (o, i) => `<button class="option" data-option="${i}"><span class="key">${i + 1}</span>${esc(q.dir === "en" ? o.meaning : o.word)}</button>`,
            )
            .join("")}
        </div>
        <div class="feedback"></div>
      </main>`;
    if (q.dir === "en") speak(spokenForm(q.word.word));
  }

  function answer(i: number) {
    if (answered) return;
    answered = true;
    const q = questions[index];
    const chosen = q.options[i];
    const correct = chosen.id === q.word.id;
    record(q.word.id, "quiz", correct);
    if (!correct) wrong.push(q.word);

    app.querySelectorAll<HTMLButtonElement>(".option").forEach((btn, j) => {
      btn.disabled = true;
      if (q.options[j].id === q.word.id) btn.classList.add("right");
      else if (j === i) btn.classList.add("wrong");
    });
    app.querySelector(".feedback")!.innerHTML = `
      <div class="card ${correct ? "ok" : "bad"}">
        <b>${correct ? "Đúng rồi!" : "Chưa đúng"}</b>
        <div><b>${esc(q.word.word)}</b> ${wordMeta(q.word)} ${speakButton(q.word)}</div>
        <div>${esc(q.word.meaning)}</div>
      </div>
      <button class="btn primary" data-action="next">Tiếp (Enter)</button>`;
    if (q.dir === "vi" || !correct) speak(spokenForm(q.word.word));
  }

  function next() {
    index++;
    show();
  }

  function finish() {
    app.innerHTML = summary({
      title,
      correct: questions.length - wrong.length,
      total: questions.length,
      wrong,
      backHref,
    });
  }

  function restart(items: Word[]) {
    questions = build(items);
    index = 0;
    wrong = [];
    show();
  }

  app.onclick = (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-option],[data-action]");
    if (!t) return;
    if (t.dataset.option) answer(Number(t.dataset.option));
    else if (t.dataset.action === "next") next();
    else if (t.dataset.action === "retry-wrong") restart(wrong);
    else if (t.dataset.action === "restart") restart(questions.map((q) => q.word));
  };

  document.onkeydown = (e) => {
    if (index >= questions.length) return;
    if (!answered && /^[1-4]$/.test(e.key)) answer(Number(e.key) - 1);
    else if (answered && e.key === "Enter") next();
  };

  show();
}
