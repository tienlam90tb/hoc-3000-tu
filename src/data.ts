export interface Word {
  id: number;
  word: string;
  type: string;
  ipa: string;
  meaning: string;
}

export const LESSON_SIZE = 20;

let cache: Word[] | null = null;

export async function loadWords(): Promise<Word[]> {
  if (!cache) {
    const res = await fetch(`${import.meta.env.BASE_URL}words.json`);
    cache = (await res.json()) as Word[];
  }
  return cache;
}

export function lessonCount(words: Word[]): number {
  return Math.ceil(words.length / LESSON_SIZE);
}

/** Bài học đánh số từ 1. Danh sách gốc đã xếp theo thứ tự chữ cái. */
export function lessonWords(words: Word[], lesson: number): Word[] {
  const start = (lesson - 1) * LESSON_SIZE;
  return words.slice(start, start + LESSON_SIZE);
}
