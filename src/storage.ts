export interface WordProgress {
  right: number;
  wrong: number;
  /** Số lần đúng liên tiếp ở trắc nghiệm / gõ từ. */
  quizStreak: number;
  typeStreak: number;
  last: number;
}

export interface Settings {
  rate: number;
  accent: "en-US" | "en-GB";
}

const PROGRESS_KEY = "hoc3000.progress.v1";
const SETTINGS_KEY = "hoc3000.settings.v1";
const MASTERY_STREAK = 2;

type ProgressMap = Record<string, WordProgress>;

let progress: ProgressMap = readJson(PROGRESS_KEY, {});
let settings: Settings = { rate: 0.9, accent: "en-US", ...readJson(SETTINGS_KEY, {}) };

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getProgress(id: number): WordProgress | undefined {
  return progress[id];
}

export function record(id: number, kind: "quiz" | "type", correct: boolean) {
  const p = progress[id] ?? { right: 0, wrong: 0, quizStreak: 0, typeStreak: 0, last: 0 };
  const streak = kind === "quiz" ? "quizStreak" : "typeStreak";
  if (correct) {
    p.right++;
    p[streak]++;
  } else {
    p.wrong++;
    p[streak] = 0;
  }
  p.last = Date.now();
  progress[id] = p;
  saveProgress();
}

/** Đã thuộc: đúng liên tiếp ít nhất 2 lần ở cả trắc nghiệm và gõ từ. */
export function isMastered(id: number): boolean {
  const p = progress[id];
  return !!p && p.quizStreak >= MASTERY_STREAK && p.typeStreak >= MASTERY_STREAK;
}

/** Từ cần ôn: đã làm và số lần sai nhiều hơn số lần đúng. */
export function needsReview(id: number): boolean {
  const p = progress[id];
  return !!p && p.wrong > p.right;
}

export function getSettings(): Settings {
  return settings;
}

export function updateSettings(patch: Partial<Settings>) {
  settings = { ...settings, ...patch };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportData(): string {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), progress, settings }, null, 1);
}

export function importData(text: string) {
  const data = JSON.parse(text) as { progress?: ProgressMap; settings?: Partial<Settings> };
  if (!data || typeof data.progress !== "object") throw new Error("File không đúng định dạng");
  progress = data.progress;
  saveProgress();
  if (data.settings) updateSettings(data.settings);
}

export function resetProgress() {
  progress = {};
  saveProgress();
}
