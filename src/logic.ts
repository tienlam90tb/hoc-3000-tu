import type { Word } from "./data";

/** Các cách viết được chấp nhận: "behaviour, behavior" → 2 đáp án; bỏ phần "(abbr Aug)". */
export function answerVariants(word: string): string[] {
  return word
    .replace(/\([^)]*\)/g, "")
    .split(",")
    .map((s) => normalize(s))
    .filter(Boolean);
}

/** Từ dùng để đọc và hiển thị khi gõ: cách viết đầu tiên, không kèm chú thích. */
export function spokenForm(word: string): string {
  return word.replace(/\([^)]*\)/g, "").split(",")[0].trim();
}

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export function editDistance(a: string, b: string): number {
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return dp[b.length];
}

export type Grade = "correct" | "close" | "wrong";

/** Không phân biệt hoa thường; sai đúng 1 ký tự (với từ từ 4 chữ cái) là "gần đúng". */
export function gradeTyping(input: string, word: string): Grade {
  const typed = normalize(input);
  if (!typed) return "wrong";
  const variants = answerVariants(word);
  if (variants.includes(typed)) return "correct";
  if (variants.some((v) => v.length >= 4 && editDistance(typed, v) === 1)) return "close";
  return "wrong";
}

export function shuffle<T>(items: T[], rand: () => number = Math.random): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function mainType(type: string): string {
  return type.split(/[,\s]+/)[0] ?? "";
}

/**
 * Chọn n đáp án nhiễu cho câu trắc nghiệm, ưu tiên cùng loại từ để khó đoán hơn.
 * Bỏ các từ có cùng nội dung hiển thị với đáp án đúng.
 */
export function pickDistractors(
  pool: Word[],
  target: Word,
  field: "word" | "meaning",
  n = 3,
  rand: () => number = Math.random,
): Word[] {
  const shown = new Set([normalize(target[field])]);
  const candidates = shuffle(
    pool.filter((w) => w.id !== target.id),
    rand,
  );
  const type = mainType(target.type);
  const sameType = candidates.filter((w) => type && mainType(w.type) === type);
  const others = candidates.filter((w) => !(type && mainType(w.type) === type));

  const picked: Word[] = [];
  for (const w of [...sameType, ...others]) {
    const key = normalize(w[field]);
    if (shown.has(key)) continue;
    shown.add(key);
    picked.push(w);
    if (picked.length === n) break;
  }
  return picked;
}
