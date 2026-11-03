# Học 3000 từ tiếng Anh

Web app (PWA) học 3379 từ thông dụng (danh sách Oxford 3000 kèm nghĩa tiếng Việt): xem từ theo bài 20 từ, trắc nghiệm Anh↔Việt, nghe rồi gõ, xem nghĩa rồi gõ, ôn từ sai. Tiến độ lưu trên trình duyệt, chạy offline sau lần mở đầu.

Deploy lên GitHub Pages: `npm run deploy` (chạy test, build rồi đẩy `dist/` lên nhánh `gh-pages`).

## Cài lên iPhone / iPad

1. Mở link GitHub Pages bằng **Safari**.
2. Bấm nút Chia sẻ → **Thêm vào MH chính** (Add to Home Screen).
3. Mở app từ icon "3000 từ". Sau lần mở đầu, app dùng được khi không có mạng.

Trên Android: mở bằng Chrome → menu ⋮ → **Cài đặt ứng dụng**. Tiến độ học lưu riêng trên từng máy; muốn chuyển sang máy khác thì vào Cài đặt → Sao lưu ra file, rồi Khôi phục trên máy kia.

## Chạy

```sh
npm install
npm run dev            # mở http://localhost:5173
npm run dev -- --host  # mở trên điện thoại cùng Wi-Fi bằng địa chỉ IP máy tính
npm test               # test logic chấm điểm
npm run build          # bản build trong dist/
```

Cài lên màn hình chính (chạy như app, dùng offline) cần HTTPS, tức là phải deploy `dist/` lên Netlify, Vercel hoặc GitHub Pages. Trên iPhone, mở bằng Safari rồi chọn Chia sẻ → Thêm vào MH chính.

## Dữ liệu

`data/words.json` được tách từ PDF gốc (không đưa lên repo) bằng `scripts/extract.py`, dùng đường kẻ bảng trong PDF để ghép ô. Sau khi tách, dữ liệu được sửa thêm:

- `data/ipa.json`: phiên âm IPA chuẩn Anh (kiểu Oxford) cho mọi từ, thay cho phiên âm sai trong PDF.
- `data/overrides.json`: 328 chỗ sửa nghĩa, loại từ, chính tả (mỗi chỗ có ghi lý do).
- Bỏ 17 từ bị lặp ngay dòng sau trong PDF.

Phiên âm và các chỗ sửa do AI duyệt, có thể còn sót lỗi.

```sh
python3 -m venv .venv && .venv/bin/pip install pdfplumber
npm run extract   # tạo data/words.json và chép vào public/
```

Muốn sửa thêm từ nào thì thêm vào `data/overrides.json` (khóa là STT gốc) rồi chạy lại `npm run extract`:

```json
{ "386": { "meaning": "rộng, rộng lớn" } }
```

## Học thế nào thì tính là thuộc

Một từ được tính "đã thuộc" khi đúng liên tiếp 2 lần ở trắc nghiệm và 2 lần ở gõ từ. Từ có số lần sai nhiều hơn số lần đúng sẽ vào mục "Ôn từ sai" (mỗi lượt tối đa 20 từ, sai nhiều nhất trước).
