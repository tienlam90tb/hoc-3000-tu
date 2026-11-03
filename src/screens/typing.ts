import type { Word } from "../data";
import { gradeTyping, shuffle, spokenForm } from "../logic";
import { speak, speechSupported } from "../speech";
import { record } from "../storage";
import { app, esc, header, progressBar, speakButton, summary, wordMeta } from "../ui";

export type TypingMode = "listen" | "meaning";

export function startTyping(opts: { items: Word[]; mode: TypingMode; title: string; backHref: string }) {
  const { title, backHref } = opts;
  // Không có giọng đọc thì không nghe được, chuyển sang xem nghĩa.
  const mode: TypingMode = speechSupported ? opts.mode : "meaning";

  let items = shuffle(opts.items);
  let index = 0;
  let wrong: Word[] = [];
  let state: "asking" | "retry" | "done" = "asking";

  function hint(w: Word): string {
    const target = spokenForm(w.word);
    return target.replace(/[A-Za-z]/g, "_").replace(/_/, target[0]).split("").join(" ");
  }

  function sayCurrent() {
    speak(spokenForm(items[index].word));
  }

  function show() {
    if (index >= items.length) return finish();
    state = "asking";
    const w = items[index];
    const prompt =
      mode === "listen"
        ? `<button class="big-speak" data-action="say" aria-label="Nghe lại">🔊</button>
           <div class="muted small">Bấm loa hoặc phím Ctrl để nghe lại</div>
           ${w.type ? `<div><span class="tag">${esc(w.type)}</span></div>` : ""}`
        : `<div class="prompt-meaning">${esc(w.meaning)}</div>
           ${w.type ? `<div><span class="tag">${esc(w.type)}</span></div>` : ""}`;

    app.innerHTML = `
      ${header(title, backHref, `<span class="counter">${index + 1}/${items.length}</span>`)}
      ${progressBar(index, items.length)}
      <main>
        <section class="card prompt">
          ${prompt}
          <div class="hint">${esc(hint(w))}</div>
        </section>
        <form class="type-form" autocomplete="off">
          <input class="type-input" name="answer" autocapitalize="off" autocorrect="off" spellcheck="false"
                 placeholder="Gõ từ tiếng Anh…" enterkeyhint="done" />
          <div class="row">
            <button type="button" class="btn ghost" data-action="skip">Không biết</button>
            <button type="submit" class="btn primary">Kiểm tra</button>
          </div>
        </form>
        <div class="feedback"></div>
      </main>`;
    app.querySelector<HTMLInputElement>(".type-input")!.focus();
    if (mode === "listen") sayCurrent();
  }

  function reveal(correct: boolean, typed: string) {
    const w = items[index];
    state = "done";
    record(w.id, "type", correct);
    if (!correct) wrong.push(w);
    const input = app.querySelector<HTMLInputElement>(".type-input")!;
    input.readOnly = true;
    input.classList.add(correct ? "right" : "wrong");
    app.querySelector<HTMLFormElement>(".type-form .row")!.innerHTML =
      `<button type="submit" class="btn primary">Tiếp (Enter)</button>`;
    app.querySelector(".feedback")!.innerHTML = `
      <div class="card ${correct ? "ok" : "bad"}">
        <b>${correct ? "Đúng rồi!" : typed ? `Bạn gõ: <s>${esc(typed)}</s>` : "Đáp án"}</b>
        <div class="prompt-word">${esc(w.word)} ${speakButton(w)}</div>
        <div>${wordMeta(w)}</div>
        <div>${esc(w.meaning)}</div>
      </div>`;
    speak(spokenForm(w.word));
    input.focus();
  }

  function submit() {
    const input = app.querySelector<HTMLInputElement>(".type-input")!;
    if (state === "done") {
      index++;
      return show();
    }
    const typed = input.value.trim();
    if (!typed) return;
    const grade = gradeTyping(typed, items[index].word);
    if (grade === "close" && state === "asking") {
      // Sai 1 ký tự lần đầu: cho thử lại, chưa tính điểm.
      state = "retry";
      app.querySelector(".feedback")!.innerHTML = `<div class="card warn"><b>Gần đúng!</b> Sai 1 ký tự, thử lại nhé.</div>`;
      input.select();
      return;
    }
    reveal(grade === "correct", typed);
  }

  function finish() {
    app.innerHTML = summary({ title, correct: items.length - wrong.length, total: items.length, wrong, backHref });
  }

  function restart(list: Word[]) {
    items = shuffle(list);
    index = 0;
    wrong = [];
    show();
  }

  app.onsubmit = (e) => {
    e.preventDefault();
    submit();
  };

  app.onclick = (e) => {
    const t = (e.target as HTMLElement).closest<HTMLElement>("[data-action]");
    if (!t) return;
    const action = t.dataset.action;
    if (action === "say") sayCurrent();
    else if (action === "skip" && state !== "done") reveal(false, "");
    else if (action === "retry-wrong") restart(wrong);
    else if (action === "restart") restart(opts.items);
  };

  document.onkeydown = (e) => {
    if (mode === "listen" && e.key === "Control" && index < items.length) sayCurrent();
  };

  show();
}
