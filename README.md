# 🎒 Bé Vào Lớp 1

Ứng dụng web giúp bé 5-6 tuổi **rèn luyện sự tập trung** và các kỹ năng cơ bản trước khi vào lớp 1, thông qua các trò chơi học tập vui nhộn. Có theo dõi tiến bộ, huy hiệu khen thưởng và báo cáo cho phụ huynh.

Chạy tốt trên **laptop và điện thoại**. Hỗ trợ **nhiều bé** (mỗi bé có thành tích riêng).

## Các hoạt động rèn luyện

App lấy **rèn luyện sự tập trung làm trọng tâm**. Mỗi buổi gồm 8 hoạt động: **6 trò rèn tập trung + 2 trò kiến thức** (toán/tiếng Anh xen vào để đổi gió).

**🎯 Nhóm rèn tập trung (trọng tâm) — luyện đúng 4 thành phần của sự chú ý:**

- 🧠 **Nhớ rồi tìm** — xem hình vài giây rồi tìm lại (trí nhớ làm việc)
- ✋ **Đừng bấm nhầm** — bấm khi thấy thỏ, NHỊN khi thấy mèo (ức chế / kìm bốc đồng, kiểu Go/No-Go)
- 🎯 **Tìm giữa nhiễu** — tìm tất cả mục tiêu giữa nhiều thứ gây nhiễu (chú ý chọn lọc)
- 🥁 **Bấm theo nhịp** — chạm đúng lúc sao sáng, suốt nhiều nhịp (chú ý duy trì)
- 🌀 **Mê cung** — sinh ngẫu nhiên, 4 kích thước (tập trung & không gian)
- 🔍 **Tìm vật khác biệt** — lưới to dần (quan sát)
- 🔢 **Nối số theo thứ tự** — 1–8 đến 1–20 (tập trung & nhận biết số)

**📚 Nhóm kiến thức (phụ, đổi gió):**

- 🧮 **Phép tính** — 5 cấp: phạm vi 5 → 10 → 20 → 50 → tìm số còn thiếu
- 🍓 **Đếm & so sánh** — đếm và so sánh nhóm nhiều/ít
- 🔤 **Tiếng Anh** — nhận mặt chữ → hoa/thường → hình↔từ vựng

Mỗi buổi kéo dài khoảng 15-20 phút.

> **Vì sao tách hai nhóm?** Làm được một bài toán cho thấy bé *biết kiến thức*, nhưng chưa chắc rèn được *khả năng tập trung*. Bốn trò chuyên biệt ở trên được thiết kế riêng để luyện các thành phần của sự chú ý (trí nhớ làm việc, ức chế, chú ý chọn lọc, chú ý duy trì) — giống như bài thể dục cho não. Đây là công cụ luyện tập tại nhà, không thay thế đánh giá của chuyên gia.

## Hệ thống cấp độ (bám chuẩn Common Core)

Mỗi loại bài có nhiều cấp độ, thiết kế bám theo chuẩn **Common Core State Standards** (Mẫu giáo → Lớp 2 của Mỹ). Ví dụ phép tính: phạm vi 5 (K.OA.A.5), phạm vi 10 (K.OA.A.2), phạm vi 20 (1.OA.C.6), phạm vi 50 (vượt tuổi, cho bé học toán tư duy).

- **Tự nâng cấp:** khi bé làm tốt (≥90%) ở vài buổi gần nhau, hệ thống tự nâng 1 cấp. Nếu bé gặp khó (<50%) thì tự hạ 1 cấp để không nản.
- **Phụ huynh chỉnh tay:** vào "Góc phụ huynh → Điều chỉnh cấp độ" để tăng/giảm cấp từng môn, có ghi rõ đang theo chuẩn nào.
- **Đo tiến bộ:** ngoài độ chính xác, app theo dõi cấp độ bé đạt được ở từng môn.

---

## ▶️ Chạy thử trên máy của bạn

Cần cài [Node.js](https://nodejs.org) (bản 18 trở lên) trước.

```bash
# 1. Cài các thư viện
npm install

# 2. Chạy ở chế độ phát triển
npm run dev
```

Mở trình duyệt tới địa chỉ hiện ra (thường là `http://localhost:5173`).

> 💡 **Chạy được ngay mà không cần Supabase.** Khi chưa cấu hình database,
> app tự lưu dữ liệu vào bộ nhớ trình duyệt (localStorage). Một thanh nhắc
> nhỏ màu vàng sẽ hiện ở trên cùng để báo điều này.

---

## 🗄️ Bật lưu trữ đám mây (Supabase)

Để dữ liệu lưu trên đám mây và dùng được trên nhiều máy, làm theo hướng dẫn trong file **[SETUP-SUPABASE.md](./SETUP-SUPABASE.md)**.

## 🚀 Đưa lên mạng (Netlify)

Để mọi người truy cập qua một đường link, làm theo **[DEPLOY-NETLIFY.md](./DEPLOY-NETLIFY.md)**.

---

## 📁 Cấu trúc thư mục

```
be-vao-lop-1/
├── index.html              # điểm vào
├── package.json            # khai báo thư viện & lệnh
├── vite.config.js          # cấu hình Vite
├── netlify.toml            # cấu hình deploy Netlify
├── supabase-schema.sql     # script tạo bảng database
├── .env.example            # mẫu biến môi trường
└── src/
    ├── main.jsx            # khởi động React
    ├── App.jsx             # màn hình & điều phối chính
    ├── index.css           # toàn bộ giao diện
    ├── lib/
    │   ├── supabase.js     # kết nối Supabase
    │   ├── storage.js      # lưu/đọc dữ liệu (Supabase hoặc localStorage)
    │   └── game.js         # tiện ích, huy hiệu, tính thống kê
    └── activities/         # 5 trò chơi học tập
        ├── ConnectDots.jsx
        ├── Maze.jsx
        ├── CountSort.jsx
        ├── FindDifferent.jsx
        └── MathTask.jsx
```

## 🔧 Muốn chỉnh sửa?

- **Đổi thang cấp độ / phạm vi số:** sửa `src/lib/levels.js` (file định nghĩa toàn bộ cấp độ, có ghi chú chuẩn)
- **Đổi cấp khởi đầu cho bé mới:** sửa `DEFAULT_LEVELS` trong `src/lib/levels.js`
- **Đổi tốc độ tự nâng cấp:** sửa hàm `suggestLevelChanges` trong `src/lib/game.js` (ngưỡng 90%/50%)
- **Thêm từ vựng tiếng Anh:** sửa mảng `ENGLISH_WORDS` trong `src/lib/game.js`
- **Thêm/bớt hoạt động mỗi buổi:** sửa mảng `base` trong hàm `buildSession` ở `src/App.jsx`
- **Đổi màu sắc:** sửa các biến `--c-*` ở đầu file `src/index.css`
- **Thêm huy hiệu:** sửa mảng `BADGES` trong `src/lib/game.js`
