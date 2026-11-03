import "./style.css";
import { registerSW } from "virtual:pwa-register";
import { LESSON_SIZE, lessonWords, loadWords, type Word } from "./data";
import { speak } from "./speech";
import { getProgress, needsReview } from "./storage";
import { renderHome } from "./screens/home";
import { renderLesson } from "./screens/lesson";
import { startQuiz, type QuizDirection } from "./screens/quiz";
import { renderSettings } from "./screens/settings";
import { startTyping, type TypingMode } from "./screens/typing";
import { app } from "./ui";

registerSW({ immediate: true });

// Nút loa ở mọi màn hình.
document.addEventListener("click", (e) => {
  const btn = (e.target as HTMLElement).closest<HTMLElement>("[data-speak]");
  if (btn) {
    e.preventDefault();
    speak(btn.dataset.speak!);
  }
});

/** Từ cần ôn: sai nhiều nhất trước, mỗi lượt tối đa một bài. */
function reviewWords(words: Word[]): Word[] {
  const score = (w: Word) => {
    const p = getProgress(w.id)!;
    return p.wrong - p.right;
  };
  return words
    .filter((w) => needsReview(w.id))
    .sort((a, b) => score(b) - score(a))
    .slice(0, LESSON_SIZE);
}

async function route() {
  const words = await loadWords();
  app.onclick = null;
  app.onsubmit = null;
  document.onkeydown = null;
  window.scrollTo(0, 0);

  const [path, query = ""] = location.hash.replace(/^#\/?/, "").split("?");
  const params = new URLSearchParams(query);
  const [screen, arg] = path.split("/");

  if (screen === "lesson") return renderLesson(words, Number(arg));
  if (screen === "settings") return renderSettings();

  if (screen === "quiz" || screen === "type") {
    const isReview = arg === "review";
    const items = isReview ? reviewWords(words) : lessonWords(words, Number(arg));
    const backHref = isReview ? "#/" : `#/lesson/${arg}`;
    if (!items.length) {
      location.hash = backHref;
      return;
    }
    const title = isReview ? "Ôn từ sai" : `Bài ${arg}`;
    if (screen === "quiz") {
      const dir = (params.get("dir") ?? "en") as QuizDirection;
      return startQuiz({ all: words, items, dir, title, backHref });
    }
    const mode = (params.get("mode") ?? "listen") as TypingMode;
    return startTyping({ items, mode, title, backHref });
  }

  renderHome(words);
}

window.addEventListener("hashchange", route);
route().catch((err) => {
  app.innerHTML = `<main><p class="bad-text">Không tải được dữ liệu: ${String(err)}</p></main>`;
});
