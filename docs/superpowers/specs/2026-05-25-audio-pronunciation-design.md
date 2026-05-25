# Thiết kế: Âm thanh & Phát âm

**Ngày:** 2026-05-25
**Phạm vi:** Đợt 1 trong 4 đợt cải tiến (âm thanh → trải nghiệm trò chơi → theo dõi tiến bộ → trò chơi mới).
**Trạng thái:** Đã được phê duyệt thiết kế, chờ review spec.

## Mục tiêu

Thêm hiệu ứng âm thanh tổng hợp cho các sự kiện trong app và phát âm tiếng Anh cho
phần từ vựng, để tăng hứng thú và hỗ trợ học cho bé 5-6 tuổi. Không thêm thư viện
ngoài — chỉ dùng Web Audio API và Web Speech API có sẵn trong trình duyệt.

## Quyết định đã chốt (qua brainstorm)

- Hiệu ứng âm thanh: **tổng hợp bằng Web Audio** (không dùng file mp3/ogg).
- Phát âm tiếng Anh: **Web Speech API** (`SpeechSynthesis`, giọng en-US).
- Lời khen tiếng Việt: **giữ dạng chữ trên màn hình**, KHÔNG đọc TTS tiếng Việt
  (chất lượng giọng vi-VN trên trình duyệt không đều).
- Bật/tắt âm: **icon loa trên header**, mặc định **BẬT**, lưu `localStorage`.

## Kiến trúc

### Module trung tâm: `src/lib/sound.js` (tạo mới)

Cửa ngõ duy nhất tới mọi âm thanh — tương tự vai trò của `storage.js` với dữ liệu.
Component KHÔNG gọi Web Audio / SpeechSynthesis trực tiếp; chỉ gọi hàm trong file này.

Trách nhiệm:

1. **AudioContext singleton** — khởi tạo lazy ở lần phát âm đầu tiên; gọi `resume()`
   khi cần (trình duyệt chặn audio trước tương tác đầu tiên của người dùng). Bắt một
   listener `pointerdown`/`touchstart` một lần để unlock context sớm.
2. **Trạng thái mute** — lưu `localStorage` key `fk_sound_on` (mặc định bật khi chưa có
   giá trị). API:
   - `isSoundOn(): boolean`
   - `setSoundOn(on: boolean): void`
   - `subscribe(fn): unsubscribe` — cơ chế subscribe nhỏ để icon loa cập nhật khi state
     đổi (kể cả khi đổi ở header khác).
3. **Hàm hiệu ứng tổng hợp** (oscillator + gain envelope, mỗi âm ngắn ~150–500ms; bỏ qua
   nếu đang mute):
   - `playTap()` — chạm nút, rất khẽ.
   - `playCorrect()` — chuỗi nốt đi lên, vui.
   - `playWrong()` — nốt trầm nhẹ nhàng, KHÔNG gắt (giữ tông khích lệ).
   - `playComplete()` — giai điệu hoàn thành buổi.
   - `playStar(n)` — tiếng "lấp lánh" theo số sao (1–3).
   - `playLevelUp()` — fanfare ngắn khi lên cấp.
4. **`speak(text, lang = "en-US")`** — bọc `SpeechSynthesis`. Nếu máy không có giọng phù
   hợp → im lặng (không ném lỗi). Tôn trọng trạng thái mute. Hủy phát âm đang chạy trước
   khi phát câu mới (`cancel()` rồi `speak()`).

### Bản đồ sự kiện → âm

| Sự kiện | Âm | Vị trí hook |
|---|---|---|
| Chạm đáp án / nút chính | `playTap()` | mỗi activity + các nút lớn ở `App.jsx` |
| Trả lời đúng | `playCorrect()` | điểm phát hiện đúng trong từng activity |
| Trả lời sai | `playWrong()` | điểm phát hiện sai trong từng activity |
| Hết buổi → màn Result | `playComplete()` + `playStar(stars)` | `Result` component |
| Lên / xuống cấp | `playLevelUp()` | khi hiển thị `levelUps` (màn Result) |

### Phát âm tiếng Anh — `src/activities/EnglishTask.jsx`

- Tự đọc (`speak`) từ/chữ tiếng Anh khi đề bài xuất hiện, cho các mode có nội dung tiếng
  Anh ở phần đề (`letter`, `case`, `word2pic`). Mode `pic2word` đề là emoji nên đọc khi
  bé chọn đúng.
- Thêm **nút loa 🔊 cạnh đề bài** để bấm nghe lại bất cứ lúc nào.
- Khi chọn đúng: đọc lại từ đúng + `playCorrect()`.

### Icon loa trên header — `src/App.jsx`

- Thêm icon loa nhỏ (🔊 khi bật / 🔇 khi tắt) vào header ở **cả hai** nơi:
  - ChildPicker header (quanh dòng 331)
  - Home header (quanh dòng 400)
- Cả hai dùng chung state từ `sound.js` qua `subscribe`/`isSoundOn`. Chạm để toggle;
  tắt thì mute toàn bộ kể cả TTS. Trạng thái lưu `localStorage`.
- Một component nhỏ dùng lại được (vd `SoundToggle`) để tránh lặp code ở hai header.

### CSS — `src/index.css`

- Thêm style cho icon loa ở header (nút tròn nhỏ, dễ chạm, hợp tông pastel).
- Thêm style cho nút loa 🔊 trong EnglishTask (cạnh đề bài).

## Nguyên tắc & ràng buộc

- KHÔNG thêm dependency ngoài.
- Âm "sai" nhẹ nhàng, không phạt gắt (đúng triết lý khích lệ của app).
- Mọi hàm âm thanh phải tôn trọng mute và an toàn khi API không khả dụng (máy/trình
  duyệt thiếu Web Audio hoặc giọng TTS) — không làm app crash.
- Giữ toàn bộ UI tiếng Việt; nút loa không cần chữ (dùng icon).

## Các file bị ảnh hưởng

- **Tạo mới:** `src/lib/sound.js`
- **Sửa:** `src/App.jsx` (icon loa ở 2 header, âm hoàn thành/sao/lên cấp ở Result, tap ở
  nút lớn), `src/activities/EnglishTask.jsx` (phát âm + nút loa), `src/index.css` (style),
  và 10 file trong `src/activities/` (thêm 1–2 dòng gọi `playCorrect`/`playWrong`/`playTap`
  tại điểm phản hồi đúng/sai).

## Ngoài phạm vi (để đợt sau)

- TTS tiếng Việt cho lời khen.
- File âm thanh thu sẵn.
- Tinh chỉnh tốc độ/độ khó trò chơi (đợt 2).
- Cải thiện Góc phụ huynh (đợt 3).
- Trò chơi mới (đợt 4).
