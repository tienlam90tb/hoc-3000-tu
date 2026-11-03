import type { Word } from "./data";
import { spokenForm } from "./logic";
import { speechSupported } from "./speech";

export const app = document.getElementById("app")!;

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

export function header(title: string, backHref?: string, right = ""): string {
  return `
    <header class="bar">
      ${backHref ? `<a class="icon-btn" href="${backHref}" aria-label="Quay lại">‹</a>` : `<span></span>`}
      <h1>${esc(title)}</h1>
      ${right || "<span></span>"}
    </header>`;
}

export function speakButton(word: Word, cls = ""): string {
  if (!speechSupported) return "";
  return `<button class="icon-btn speak ${cls}" data-speak="${esc(spokenForm(word.word))}" aria-label="Nghe">🔊</button>`;
}

export function wordMeta(word: Word): string {
  const parts = [word.type && `<span class="tag">${esc(word.type)}</span>`, word.ipa && `<span class="ipa">/${esc(word.ipa)}/</span>`];
  return parts.filter(Boolean).join(" ");
}

export function progressBar(done: number, total: number): string {
  const pct = total ? Math.round((done / total) * 100) : 0;
  return `<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><div style="width:${pct}%"></div></div>`;
}

/** Màn hình tổng kết sau một lượt học. */
export function summary(opts: {
  title: string;
  correct: number;
  total: number;
  wrong: Word[];
  backHref: string;
}): string {
  const { title, correct, total, wrong, backHref } = opts;
  return `
    ${header(title, backHref)}
    <main class="center">
      <div class="score">${correct}/${total}</div>
      <p class="muted">${correct === total ? "Tuyệt vời, đúng hết!" : `Sai ${wrong.length} từ`}</p>
      ${
        wrong.length
          ? `<ul class="word-list compact">${wrong
              .map(
                (w) => `<li><div class="wl-main"><b>${esc(w.word)}</b> ${wordMeta(w)}<div>${esc(w.meaning)}</div></div>${speakButton(w)}</li>`,
              )
              .join("")}</ul>
             <button class="btn primary" data-action="retry-wrong">Làm lại các từ sai</button>`
          : ""
      }
      <button class="btn" data-action="restart">Làm lại cả lượt</button>
      <a class="btn ghost" href="${backHref}">Quay lại</a>
    </main>`;
}
