# 🚀 Hướng dẫn đưa ứng dụng lên mạng với Netlify

Mục tiêu: đẩy code lên GitHub, rồi nối với Netlify để có một đường link truy cập được từ mọi máy. Sau này mỗi lần bạn sửa code và đẩy lên GitHub, Netlify sẽ **tự động cập nhật** trang web.

Cần có sẵn: tài khoản [GitHub](https://github.com) và tài khoản [Netlify](https://netlify.com) (đăng nhập bằng GitHub cho tiện).

---

## Phần 1 — Đưa code lên GitHub

### Cách A: Dùng dòng lệnh (nếu bạn quen Git)

Trong thư mục project, chạy:

```bash
git init
git add .
git commit -m "Phiên bản đầu tiên của Bé Vào Lớp 1"
git branch -M main
```

Lên GitHub tạo một repository mới (ví dụ tên `be-vao-lop-1`), **để trống**, đừng tạo kèm README. Sau đó copy địa chỉ repo và chạy:

```bash
git remote add origin https://github.com/TEN-CUA-BAN/be-vao-lop-1.git
git push -u origin main
```

### Cách B: Dùng GitHub Desktop (nếu chưa quen dòng lệnh)

1. Tải [GitHub Desktop](https://desktop.github.com), đăng nhập.
2. Bấm **File → Add local repository**, chọn thư mục project này.
3. Bấm **Publish repository** để đẩy lên GitHub.

> ✅ File `.gitignore` đã được chuẩn bị sẵn, nên thư mục `node_modules` và file `.env` (chứa key) **sẽ không bị đẩy lên** — đúng như mong muốn.

---

## Phần 2 — Nối với Netlify

1. Đăng nhập [Netlify](https://app.netlify.com).
2. Bấm **Add new site → Import an existing project**.
3. Chọn **GitHub**, cho phép Netlify truy cập, rồi chọn repo `be-vao-lop-1`.
4. Netlify thường tự nhận đúng cấu hình (nhờ file `netlify.toml` có sẵn). Kiểm tra:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. **Khoan bấm Deploy vội** — làm bước khai báo biến môi trường ở dưới trước.

---

## Phần 3 — Khai báo key Supabase (quan trọng)

Vì file `.env` không được đẩy lên GitHub, bạn phải nhập key trực tiếp vào Netlify.

1. Ở màn hình cấu hình deploy, tìm mục **Environment variables** (hoặc vào sau ở **Site configuration → Environment variables**).
2. Thêm **hai** biến (lấy giá trị từ Supabase — xem `SETUP-SUPABASE.md`):

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` (anon public key) |

3. Bây giờ bấm **Deploy**.

> ⚠️ Nếu bạn deploy **trước** rồi mới thêm biến, phải vào **Deploys → Trigger deploy → Deploy site** để build lại thì biến mới có hiệu lực.

---

## Phần 4 — Xong!

Sau 1-2 phút, Netlify cho bạn một đường link dạng `https://ten-ngau-nhien.netlify.app`. Mở thử trên điện thoại và laptop — dữ liệu sẽ đồng bộ qua Supabase.

### Mẹo nhỏ

- **Đổi tên link:** vào **Site configuration → Change site name** để đổi thành `be-cua-toi.netlify.app` chẳng hạn.
- **Thêm vào màn hình chính điện thoại:** mở link trên điện thoại → menu trình duyệt → "Thêm vào màn hình chính". App sẽ hiện như một ứng dụng thật.
- **Cập nhật về sau:** chỉ cần sửa code, `git push` (hoặc bấm Push trong GitHub Desktop), Netlify tự build lại.

---

## ❓ Gặp lỗi?

**Trang trắng / vẫn thấy thanh nhắc màu vàng:** Biến môi trường chưa đúng. Kiểm tra lại tên biến (phải có tiền tố `VITE_`), rồi trigger deploy lại.

**Build thất bại:** Mở tab **Deploys** trên Netlify, xem log để biết lỗi ở dòng nào. Thường là do thiếu file hoặc sai cú pháp — thử chạy `npm run build` ở máy trước để kiểm tra.

**Dữ liệu không lưu:** Kiểm tra đã chạy script `supabase-schema.sql` chưa, và policy bảo mật đã đúng chưa (xem `SETUP-SUPABASE.md`).
