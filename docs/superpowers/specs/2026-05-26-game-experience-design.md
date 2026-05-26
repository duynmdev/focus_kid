# Thiết kế: Trải nghiệm trò chơi

**Ngày:** 2026-05-26
**Phạm vi:** Đợt 2 trong 4 đợt cải tiến (âm thanh ✅ → **trải nghiệm trò chơi** → theo dõi tiến bộ → trò chơi mới).
**Trạng thái:** Đã được phê duyệt thiết kế; người dùng yêu cầu code trực tiếp (bỏ qua bước viết plan).

## Mục tiêu

Cải thiện trải nghiệm chơi: vào trò có thời gian dễ chịu hơn, ăn mừng khi hoàn thành,
tạm dừng/thoát an toàn, và làm mềm điểm vào ở cấp 1 các trò có giờ.

## A. Vào trò có thời gian dễ chịu hơn (GoNoGo, RhythmTap)

- Sau khi bấm "Bắt đầu": **vài lượt tập thử** không tính điểm (nhãn "Tập thử").
  - GoNoGo: 2 lượt (1 GO 🐰 + 1 NO-GO 🐱).
  - RhythmTap: 2 nhịp thử.
- Rồi **đếm ngược "Sẵn sàng? 3 – 2 – 1"** trước khi vòng tính điểm chạy.
- Kỹ thuật: thêm phase `practice` và `countdown` vào state machine 2 trò.

## B. Hiệu ứng ăn mừng

- **Confetti khi hoàn thành buổi** (màn Result): component tự viết bằng DOM + CSS
  (KHÔNG thêm thư viện); vài chục mảnh rơi rồi tự dọn sau ~2.5s. Bắn nhiều hơn khi 3 sao.
- **Phản hồi "đúng" vui hơn**: animation pop + lấp lánh nhẹ ở dòng khen (CSS).
- KHÔNG bắn confetti mỗi câu đúng (gây rối/giật) — chỉ ở mốc lớn.

## C. Tạm dừng & thoát an toàn

- Nút ✕ giữa buổi: **hỏi xác nhận** trước khi thoát ("Thoát buổi học? Tiến trình buổi
  này sẽ không được lưu.") — tránh bé bấm nhầm mất buổi.
- Trò có thời gian: nút **Tạm dừng ⏸** → màn che "Đang tạm dừng" + nút Tiếp tục. Khi tạm
  dừng, đồng hồ dừng; tiếp tục lại từ đầu lượt/nhịp hiện tại (đơn giản, không khớp giữa khoảng).

## D. Tinh chỉnh độ khó (thận trọng — CHƯA test bé thật)

- Chỉ **làm mềm điểm vào** ở cấp 1 của 2 trò giờ:
  - GoNoGo cấp 1: `intervalMs` 1800 → 2000.
  - RhythmTap cấp 1: `intervalMs` 1400 → 1600 (cửa sổ bấm nới theo `intervalMs * 0.55`).
- Các cấp cao giữ nguyên. Ghi chú trong code rằng số này cần xem lại sau khi quan sát bé.

## Các file bị ảnh hưởng

- **Tạo mới:** `src/components/Confetti.jsx`
- **Sửa:** `src/activities/GoNoGo.jsx`, `src/activities/RhythmTap.jsx` (practice +
  countdown + pause), `src/App.jsx` (Session: xác nhận thoát; Result: render Confetti),
  `src/lib/levels.js` (số cấp 1), `src/index.css` (confetti, pause overlay, countdown, pop).

## Ngoài phạm vi (để đợt sau)

- Rebalance toàn bộ độ khó (chờ test bé thật).
- Cải thiện Góc phụ huynh (đợt 3).
- Trò chơi mới (đợt 4).
