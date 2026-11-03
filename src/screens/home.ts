import { lessonCount, lessonWords, LESSON_SIZE, type Word } from "../data";
import { normalize } from "../logic";
import { getProgress, isMastered, needsReview } from "../storage";
import { app, esc, header, progressBar } from "../ui";

export function renderHome(words: Word[]) {
  const mastered = words.filter((w) => isMastered(w.id)).length;
  const studied = words.filter((w) => getProgress(w.id)).length;
  const review = words.filter((w) => needsReview(w.id)).length;

  const lessons = Array.from({ length: lessonCount(words) }, (_, i) => {
    const n = i + 1;
    const ws = lessonWords(words, n);
    const done = ws.filter((w) => isMastered(w.id)).length;
    const started = ws.some((w) => getProgress(w.id));
    return { n, ws, done, started };
  });

  app.innerHTML = `
    ${header("Học 3000 từ", undefined, `<a class="icon-btn" href="#/settings" aria-label="Cài đặt">⚙︎</a>`)}
    <main>
      <section class="card stats">
        <div><b>${mastered}</b><span>đã thuộc</span></div>
        <div><b>${studied}</b><span>đã học</span></div>
        <div><b>${words.length}</b><span>tổng số từ</span></div>
      </section>
      ${progressBar(mastered, words.length)}
      ${
        review
          ? `<div class="row">
               <a class="btn primary" href="#/quiz/review?dir=mix">Ôn ${Math.min(review, LESSON_SIZE)} từ sai: trắc nghiệm</a>
               <a class="btn" href="#/type/review?mode=listen">Ôn từ sai: gõ từ</a>
             </div>
             <p class="muted small">Có ${review} từ đang sai nhiều hơn đúng.</p>`
          : ""
      }
      <input class="search" type="search" placeholder="Tìm từ tiếng Anh hoặc nghĩa…" autocomplete="off" />
      <div class="search-results"></div>
      <ol class="lessons">
        ${lessons
          .map(
            ({ n, ws, done, started }) => `
          <li><a class="lesson ${done === ws.length ? "done" : started ? "started" : ""}" href="#/lesson/${n}">
            <span class="ln">Bài ${n}</span>
            <span class="lr">${esc(ws[0].word)} – ${esc(ws[ws.length - 1].word)}</span>
            ${progressBar(done, ws.length)}
          </a></li>`,
          )
          .join("")}
      </ol>
    </main>`;

  const input = app.querySelector<HTMLInputElement>(".search")!;
  const results = app.querySelector<HTMLDivElement>(".search-results")!;
  input.addEventListener("input", () => {
    const q = normalize(input.value);
    if (q.length < 2) {
      results.innerHTML = "";
      return;
    }
    // Số bài tính theo vị trí trong danh sách (STT gốc có chỗ nhảy do bỏ từ lặp).
    const hits = words
      .map((w, i) => ({ w, lesson: Math.floor(i / LESSON_SIZE) + 1 }))
      .filter(({ w }) => normalize(w.word).startsWith(q) || normalize(w.meaning).includes(q))
      .slice(0, 12);
    results.innerHTML = hits.length
      ? `<ul class="word-list compact">${hits
          .map(
            ({ w, lesson }) => `<li><a href="#/lesson/${lesson}" class="wl-main">
              <b>${esc(w.word)}</b> <span class="muted">· Bài ${lesson}</span>
              <div>${esc(w.meaning)}</div></a></li>`,
          )
          .join("")}</ul>`
      : `<p class="muted">Không tìm thấy.</p>`;
  });
}
