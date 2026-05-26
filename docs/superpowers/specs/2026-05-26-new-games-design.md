# Thiết kế: Thêm trò chơi mới

**Ngày:** 2026-05-26
**Phạm vi:** Đợt 4 (âm thanh ✅ → trải nghiệm ✅ → **trò chơi mới**; đợt "theo dõi tiến bộ" tạm hoãn theo ý người dùng).
**Trạng thái:** Đã duyệt; code trực tiếp (bỏ qua writing-plans).

## Mục tiêu

Thêm 5 trò chơi mới, giữ tỷ lệ 6 tập trung : 2 kiến thức và KHÔNG làm buổi học dài
thêm (mỗi buổi vẫn 8 hoạt động). Trò mới vào "pool" và được chọn ngẫu nhiên.

## Các trò mới

### Nhóm rèn tập trung (vào pool extraFocus cùng maze/find/dots, chọn 2)

1. **Nhớ chuỗi 🎵 (`sequence`)** — kiểu Simon. 4 ô màu 2×2 sáng theo chuỗi + nốt nhạc
   (`playPad(i)` trong sound.js); bé lặp lại. Chuỗi dài dần, sai 1 bước là dừng.
   Điểm = đi được bao xa / đích. 4 cấp: đích 3→4→5→6, tốc độ nhanh dần. Kỹ năng: Tập trung.
2. **Đổi luật 🔀 (`shift`)** — linh hoạt nhận thức. Hiện 1 hình có màu+dạng; luật đổi qua
   lại "theo MÀU"/"theo HÌNH"; bé chọn ô khớp theo luật hiện hành. 4 cấp: lượt 6→10, đổi
   luật dày hơn (mỗi 3→2→2→1 lượt), lựa chọn 2→3. Điểm = đúng/lượt. Kỹ năng: Tập trung.
3. **Ghép đôi 🧩 (`pairs`)** — lật tìm cặp. Lưới úp, lật 2 ô tìm cặp giống. 4 cấp:
   3→4→6→8 cặp. Điểm = 100 − phạt lần lật sai (sàn 50). Kỹ năng: Tập trung.

### Nhóm kiến thức (vào pool cùng math/count/english, chọn 2)

4. **Hình học 🔷 (`shapes`)** — chuẩn K.G. "Đâu là hình TAM GIÁC?" → chọn hình đúng
   (vẽ bằng CSS, tách màu khỏi dạng). Cấp 1–3: 3→4→5 hình (lựa chọn 3→3→4). Cấp 4: hiện
   1 hình, hỏi "có mấy cạnh?" (chỉ dùng tam giác=3, vuông/chữ nhật=4 để không mơ hồ).
   Kỹ năng: Quan sát.

### Bổ sung vào trò Tiếng Anh (không phải trò riêng)

5. **Nghe & chọn** — english cấp 5, mode `listen`: chỉ phát âm từ (nút 🔊, không hiện
   chữ) → chọn hình đúng. `english` maxLevel 4→5. Tận dụng `speak()`.

## Tích hợp

- `src/lib/sound.js`: thêm `playPad(i)` (4 nốt cho Simon).
- `src/lib/game.js`: thêm `SHAPES` (key + tên tiếng Việt + số cạnh) và `SHAPE_COLORS`.
- `src/lib/levels.js`: tier cho sequence/shift/pairs/shapes + DEFAULT_LEVELS; english cấp 5.
- `src/App.jsx`: import 4 trò; thêm vào `ACTIVITY_TYPES` + `ACTIVITY_TYPES_META`; mở rộng
  pool trong `buildSession` (extraFocus += sequence,shift,pairs; knowledge += shapes).
- Tạo mới: `activities/SequenceMemory.jsx`, `RuleSwitch.jsx`, `MemoryPairs.jsx`, `ShapeFind.jsx`.
- Sửa `activities/EnglishTask.jsx` (mode listen + refactor chuỗi cần đọc).
- `src/index.css`: ô màu Simon, hình CSS (tròn/vuông/tam giác/chữ nhật/sao), thẻ lật.

## Hợp đồng — giữ nguyên

Mỗi trò nhận `{ level, onDone }`, gọi `onDone(score 0–100)` đúng một lần khi xong; tự lấy
cấu hình qua `getLevelConfig(type, level)`. Dùng âm thanh qua `lib/sound.js`.

## Ngoài phạm vi

- Cải thiện Góc phụ huynh (đợt "theo dõi tiến bộ", chưa làm).
- Rebalance độ khó toàn bộ (chờ test bé).
