import { describe, expect, it } from "vitest";
import type { Word } from "./data";
import { answerVariants, gradeTyping, pickDistractors, spokenForm } from "./logic";

const w = (id: number, word: string, type: string, meaning: string): Word => ({
  id,
  word,
  type,
  ipa: "",
  meaning,
});

describe("gradeTyping", () => {
  it("không phân biệt hoa thường và khoảng trắng", () => {
    expect(gradeTyping("  Abandon ", "abandon")).toBe("correct");
    expect(gradeTyping("according  to", "according to")).toBe("correct");
  });

  it("chấp nhận mọi cách viết và bỏ chú thích trong ngoặc", () => {
    expect(gradeTyping("behavior", "behaviour, behavior")).toBe("correct");
    expect(gradeTyping("august", "August (abbr Aug)")).toBe("correct");
    expect(answerVariants("millimetre, millimeter (abbr mm)")).toEqual(["millimetre", "millimeter"]);
  });

  it("sai 1 ký tự là gần đúng, từ ngắn thì không", () => {
    expect(gradeTyping("abandn", "abandon")).toBe("close");
    expect(gradeTyping("acept", "accept")).toBe("close");
    expect(gradeTyping("ad", "at")).toBe("wrong");
    expect(gradeTyping("abndn", "abandon")).toBe("wrong");
    expect(gradeTyping("", "abandon")).toBe("wrong");
  });

  it("coi các kiểu dấu nháy là như nhau", () => {
    expect(gradeTyping("sb's", "sb’s")).toBe("correct");
  });
});

describe("spokenForm", () => {
  it("lấy cách viết đầu tiên", () => {
    expect(spokenForm("August (abbr Aug)")).toBe("August");
    expect(spokenForm("behaviour, behavior")).toBe("behaviour");
  });
});

describe("pickDistractors", () => {
  const pool = [
    w(1, "run", "v", "chạy"),
    w(2, "walk", "v", "đi bộ"),
    w(3, "eat", "v", "ăn"),
    w(4, "jog", "v", "chạy"),
    w(5, "red", "adj", "đỏ"),
    w(6, "blue", "adj", "xanh"),
    w(7, "sleep", "v", "ngủ"),
  ];

  it("ưu tiên cùng loại từ, không trùng đáp án đúng, không lặp", () => {
    for (let i = 0; i < 20; i++) {
      const picked = pickDistractors(pool, pool[0], "meaning");
      const meanings = picked.map((p) => p.meaning);
      expect(picked).toHaveLength(3);
      expect(meanings).not.toContain("chạy");
      expect(new Set(meanings).size).toBe(3);
      expect(picked.every((p) => p.type === "v")).toBe(true);
    }
  });

  it("bổ sung từ loại khác khi không đủ", () => {
    const picked = pickDistractors(pool, pool[4], "word");
    expect(picked).toHaveLength(3);
    expect(picked[0].type).toBe("adj");
  });
});
