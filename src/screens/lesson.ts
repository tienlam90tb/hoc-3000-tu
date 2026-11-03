import { lessonCount, lessonWords, type Word } from "../data";
import { isMastered } from "../storage";
import { app, esc, header, speakButton, wordMeta } from "../ui";

export function renderLesson(words: Word[], n: number) {
  const total = lessonCount(words);
  const ws = lessonWords(words, n);
  if (!ws.length) {
    location.hash = "#/";
    return;
  }

  app.innerHTML = `
    ${header(`Bài ${n}`, "#/")}
    <main>
      <div class="grid2">
        <a class="btn primary" href="#/quiz/${n}?dir=en">Trắc nghiệm Anh → Việt</a>
        <a class="btn primary" href="#/quiz/${n}?dir=vi">Trắc nghiệm Việt → Anh</a>
        <a class="btn" href="#/type/${n}?mode=listen">Nghe rồi gõ từ</a>
        <a class="btn" href="#/type/${n}?mode=meaning">Xem nghĩa rồi gõ từ</a>
      </div>
      <ul class="word-list">
        ${ws
          .map(
            (w) => `
          <li class="${isMastered(w.id) ? "mastered" : ""}">
            <div class="wl-main">
              <b>${esc(w.word)}</b> ${wordMeta(w)}
              <div>${esc(w.meaning)}</div>
            </div>
            ${speakButton(w)}
          </li>`,
          )
          .join("")}
      </ul>
      <nav class="row">
        ${n > 1 ? `<a class="btn ghost" href="#/lesson/${n - 1}">‹ Bài ${n - 1}</a>` : "<span></span>"}
        ${n < total ? `<a class="btn ghost" href="#/lesson/${n + 1}">Bài ${n + 1} ›</a>` : "<span></span>"}
      </nav>
    </main>`;
}
