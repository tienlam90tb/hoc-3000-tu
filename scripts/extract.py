"""Tách danh sách từ trong 3000.pdf ra data/words.json.

Chạy: .venv/bin/python scripts/extract.py  (cần pdfplumber trong .venv)

Mỗi trang có một bảng kẻ ô. Đường kẻ ngang cho ranh giới từng dòng; chữ được
chia cột theo x và vào dòng theo tâm y. Không dựa vào vị trí STT vì STT nằm
ở đỉnh ô còn các cột khác căn giữa.
"""

import json
import re
import sys
from pathlib import Path

import pdfplumber

ROOT = Path(__file__).resolve().parent.parent
PDF = ROOT / "3000.pdf"
OUT = ROOT / "data" / "words.json"
OVERRIDES = ROOT / "data" / "overrides.json"
IPA = ROOT / "data" / "ipa.json"

COLS = ["no", "word", "type", "ipa", "meaning"]
# Mốc x bắt đầu của các cột, giống nhau trên mọi trang (STT ≈2-13, từ ≈37,
# loại từ ≈212, phiên âm ≈306, nghĩa ≈416).
COL_STARTS = [0, 30, 200, 295, 405]
HEADER = {"No.", "Word", "Type", "Pronounce", "Meaning"}
# Loại từ đôi khi bị đặt nhầm vào cột từ, vd. "zero number".
TYPE_WORDS = {"number", "exclamation", "prefix", "modal"}


def col_of(x0: float) -> int:
    return max(i for i, s in enumerate(COL_STARTS) if x0 >= s)


def parse_page(page):
    tables = page.find_tables()
    if not tables:
        return []
    table = max(tables, key=lambda t: len(t.rows))
    bands = [(r.bbox[1], r.bbox[3]) for r in table.rows]

    cells = [{c: [] for c in COLS} for _ in bands]
    for w in page.extract_words():
        if w["text"] in HEADER:
            continue
        cy = (w["top"] + w["bottom"]) / 2
        for i, (top, bottom) in enumerate(bands):
            if top <= cy <= bottom:
                cells[i][COLS[col_of(w["x0"])]].append((round(w["top"]), w["x0"], w["text"]))
                break

    rows = []
    for cell in cells:
        no = " ".join(t for *_, t in sorted(cell["no"]))
        if not re.fullmatch(r"\d{1,4}", no):
            continue
        rec = {"id": int(no)}
        for c in COLS[1:]:
            # Sắp theo dòng chữ (top) rồi theo x.
            rec[c] = " ".join(t for *_, t in sorted(cell[c])).strip()
        rows.append(rec)
    return rows


def first_variant(word: str) -> str:
    # Phân biệt hoa thường: "may" (động từ khuyết thiếu) khác "May" (tháng 5).
    return re.sub(r"\([^)]*\)", "", word).split(",")[0].strip()


def clean(rec):
    word = rec["word"]
    if word in ("TRUE", "FALSE"):
        word = word.lower()
    parts = word.rsplit(" ", 1)
    if not rec["type"] and len(parts) == 2 and parts[1] in TYPE_WORDS:
        word, rec["type"] = parts
    return {
        "id": rec["id"],
        "word": word,
        "type": rec["type"],
        "ipa": rec["ipa"],
        "meaning": re.sub(r"\s+", " ", rec["meaning"]),
    }


def main():
    records = {}
    dupes = []
    with pdfplumber.open(PDF) as pdf:
        for page in pdf.pages:
            for rec in parse_page(page):
                if rec["id"] in records:
                    dupes.append(rec["id"])
                records[rec["id"]] = rec

    # Phiên âm trong PDF thường sai, nên dùng bản IPA đã duyệt nếu có.
    ipa = json.loads(IPA.read_text()) if IPA.exists() else {}
    for key, value in ipa.items():
        if int(key) in records:
            records[int(key)]["ipa"] = value

    overrides = json.loads(OVERRIDES.read_text()) if OVERRIDES.exists() else {}
    for key, fields in overrides.items():
        records.setdefault(int(key), {"id": int(key), "word": "", "type": "", "ipa": "", "meaning": ""})
        records[int(key)].update(fields)

    words = []
    repeated = []
    for n in sorted(records):
        w = clean(records[n])
        # PDF gốc có vài từ bị lặp ngay dòng sau (vd. "unacceptable" rồi
        # "unacceptable, acceptable"); giữ dòng đầu, bỏ dòng lặp.
        if words and first_variant(words[-1]["word"]) == first_variant(w["word"]):
            repeated.append(f"{n} {w['word']}")
            continue
        words.append(w)

    max_no = max(records)
    missing = [n for n in range(1, max_no + 1) if n not in records]
    empty = [w["id"] for w in words if not w["word"] or not w["meaning"]]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(words, ensure_ascii=False, indent=0))

    print(f"Tổng: {len(words)} từ, STT lớn nhất {max_no}")
    print(f"STT thiếu: {missing}")
    print(f"STT trùng: {dupes}")
    print(f"Bỏ {len(repeated)} từ lặp: {repeated}")
    print(f"Thiếu từ/nghĩa: {empty}")
    print(f"Thiếu loại từ: {[w['id'] for w in words if not w['type']]}")
    print(f"Thiếu phiên âm: {len([w for w in words if not w['ipa']])} từ")
    return 1 if missing or empty or dupes else 0


if __name__ == "__main__":
    sys.exit(main())
