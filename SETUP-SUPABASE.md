# 🗄️ Hướng dẫn thiết lập Supabase

Làm theo các bước này để dữ liệu của bé được lưu trên đám mây (dùng được trên laptop, điện thoại, nhiều máy khác nhau).

> Bạn đã có tài khoản Supabase rồi, nên ta bắt đầu từ việc tạo project.

---

## Bước 1 — Tạo project mới

1. Đăng nhập vào [supabase.com](https://supabase.com) → bấm **New project**.
2. Đặt tên (ví dụ `be-vao-lop-1`), chọn mật khẩu database (lưu lại phòng khi cần), chọn Region gần Việt Nam nhất (ví dụ **Southeast Asia / Singapore**).
3. Bấm **Create new project** và chờ vài phút cho project khởi tạo xong.

## Bước 2 — Tạo các bảng dữ liệu

1. Trong project, mở mục **SQL Editor** (biểu tượng `</>` ở thanh bên trái).
2. Bấm **New query**.
3. Mở file `supabase-schema.sql` trong project này, **copy toàn bộ nội dung**, dán vào ô soạn thảo.
4. Bấm nút **Run** (góc dưới bên phải).

Nếu thấy báo "Success", các bảng `children` và `sessions` đã được tạo. Bạn có thể kiểm tra trong mục **Table Editor**.

> 📌 **Nếu bạn đã tạo bảng từ phiên bản cũ** (trước khi có hệ thống cấp độ), chạy thêm đoạn này trong SQL Editor để thêm hai cột mới:
> ```sql
> alter table public.children add column if not exists levels jsonb not null default '{}'::jsonb;
> alter table public.sessions add column if not exists per_type jsonb not null default '{}'::jsonb;
> ```

## Bước 3 — Lấy thông tin kết nối

1. Mở **Project Settings** (biểu tượng bánh răng ở dưới cùng thanh bên).
2. Vào mục **API**.
3. Bạn cần copy **hai** giá trị:
   - **Project URL** (dạng `https://xxxx.supabase.co`)
   - **anon public** key (một chuỗi dài bắt đầu bằng `eyJ...`)

> ⚠️ **Lưu ý:** Chỉ dùng key **anon public**. Tuyệt đối **không** dùng key `service_role` trong ứng dụng web — đó là key bí mật.

## Bước 4 — Khai báo cho ứng dụng

**Khi chạy ở máy:**

1. Trong thư mục project, tạo một file tên là `.env` (copy từ `.env.example`).
2. Điền hai giá trị vừa lấy:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

3. Khởi động lại `npm run dev`. Thanh nhắc màu vàng sẽ biến mất → nghĩa là đã nối đám mây thành công.

**Khi deploy Netlify:** xem file `DEPLOY-NETLIFY.md` (khai báo hai biến này trong phần Environment variables của Netlify).

---

## ❓ Về bảo mật khi không có đăng nhập

App này dùng riêng trong gia đình nên không có màn hình đăng nhập. Vì vậy:

- Key `anon public` được phép lộ ra trong code web — đây là thiết kế bình thường của Supabase.
- Các bảng đã bật **Row Level Security** với policy cho phép đọc/ghi công khai (xem trong file SQL).
- Dữ liệu chỉ là **tên bé và thành tích học tập** — không có thông tin nhạy cảm.

Mức bảo mật này phù hợp cho ứng dụng riêng tư của gia đình. Nếu sau này muốn chặt chẽ hơn (ví dụ chia sẻ cho nhiều gia đình), nên thêm đăng nhập và đổi policy sang dựa trên `auth.uid()`. Lúc đó chỉ cần sửa file `src/lib/storage.js` và `supabase-schema.sql`.

---

## ❓ Thêm bé thứ hai sau này

Không cần làm gì thêm về kỹ thuật! App đã hỗ trợ nhiều bé sẵn. Chỉ cần mở app → màn hình chọn bé → bấm **➕ Thêm bé mới**. Mỗi bé sẽ có thành tích, huy hiệu và báo cáo riêng.
