# PROJECT SUMMARY — "Bé Vào Lớp 1"

> **Mục đích file này:** Đọc file này một lần là hiểu TOÀN BỘ bối cảnh, triết lý,
> quyết định thiết kế và trạng thái hiện tại của dự án — để tiếp tục phát triển
> đúng hướng mà không cần hỏi lại từ đầu. Dành cho Claude Code / AI / lập trình viên mới.

---

## 1. DỰ ÁN LÀ GÌ

Ứng dụng web giúp **bé 5-6 tuổi chuẩn bị vào lớp 1**, **trọng tâm là RÈN LUYỆN SỰ TẬP TRUNG**,
bổ trợ thêm toán và tiếng Anh. Bé học qua các trò chơi ngắn, vui, có theo dõi tiến bộ.

- **Người dùng chính:** 1 bé (đã biết đọc/viết số & chữ cơ bản, đã học toán tư duy nên
  cộng được tới ~50, đang mới bắt đầu học tiếng Anh). Cấu trúc hỗ trợ **nhiều bé** để
  sau này thêm bé thứ 2.
- **Phụ huynh:** người Việt, giao tiếp tiếng Việt. Toàn bộ UI tiếng Việt.
- **Thiết bị:** laptop (chuột / phím mũi tên) và điện thoại (chạm). KHÔNG có iPad.
  → Mọi thao tác chỉ là BẤM/CHẠM, nút to, dễ nhắm. Mê cung hỗ trợ cả phím mũi tên.
- **Không có đăng nhập** (gia đình dùng riêng). Lưu Supabase, fallback localStorage.

---

## 2. MINDSET & TRIẾT LÝ CỐT LÕI (QUAN TRỌNG NHẤT — ĐỪNG ĐI LỆCH)

1. **TẬP TRUNG LÀ TRỌNG TÂM, không phải kiến thức.** Đây là bài học rút ra trong quá
   trình làm: ban đầu app thiên về toán/tiếng Anh, nhưng "làm được bài toán" chỉ chứng
   tỏ bé BIẾT KIẾN THỨC, không có nghĩa là rèn được KHẢ NĂNG TẬP TRUNG. Vì vậy app phải
   có các trò **thiết kế riêng để luyện các thành phần của sự chú ý**, và các trò này
   phải chiếm phần lớn mỗi buổi.

2. **4 thành phần của sự chú ý** mà app rèn (mỗi trò luyện 1 thành phần):
   - Trí nhớ làm việc (working memory) → trò "Nhớ rồi tìm" (MemoryFind)
   - Ức chế / kìm bốc đồng (inhibitory control) → trò "Đừng bấm nhầm" (GoNoGo, kiểu Go/No-Go)
   - Chú ý chọn lọc (selective attention) → trò "Tìm giữa nhiễu" (SearchTarget)
   - Chú ý duy trì (sustained attention) → trò "Bấm theo nhịp" (RhythmTap)

3. **Tỷ lệ mỗi buổi:** 8 hoạt động = **6 rèn tập trung + 2 kiến thức (đổi gió)**.
   Kiến thức (toán/đếm/tiếng Anh) được CHÈN XEN KẼ, không dồn cục, để buổi học đỡ đơn điệu.

4. **Độ khó bám chuẩn Common Core** (chuẩn giáo dục Mỹ, K→Lớp 2). Mỗi cấp ghi rõ mã
   chuẩn (vd K.OA.A.5). Toán cho phép lên tới phạm vi 50 (vượt tuổi — vì bé học toán tư duy).

5. **Độ khó tăng theo CẢ HAI chiều:** (a) tự nâng cấp khi bé làm tốt ≥90% qua vài buổi,
   tự hạ khi <50% để bé không nản; (b) phụ huynh chỉnh tay trong "Góc phụ huynh".

6. **Đo tiến bộ KHÔNG chỉ bằng độ chính xác** mà còn bằng CẤP ĐỘ bé đạt được ở từng môn.

7. **Tông giọng:** ấm áp, khích lệ, không phạt gay gắt. Sai thì gợi ý nhẹ nhàng.
   Giao diện trẻ thơ: màu pastel, font Baloo 2 + Nunito, emoji, hiệu ứng vui.

8. **Sự trung thực với phụ huynh:** App là CÔNG CỤ LUYỆN TẬP tại nhà, KHÔNG phải đánh
   giá hay can thiệp y khoa. Khoa học còn tranh luận việc "game tập trung" cải thiện
   tập trung đời thực tới đâu. Luôn giữ thái độ thành thật này, không thổi phồng.

---

## 3. TRẠNG THÁI HIỆN TẠI (đã làm xong)

✅ Project Vite + React hoàn chỉnh, build sạch (86 modules), chạy được.
✅ 10 loại hoạt động (xem mục 5).
✅ Hệ thống cấp độ bám Common Core (`src/lib/levels.js`), tự nâng cấp + chỉnh tay.
✅ Nhiều bé, mỗi bé có avatar + thành tích + cấp độ riêng.
✅ Theo dõi tiến bộ: biểu đồ độ chính xác, huy hiệu, chuỗi ngày, sao.
✅ Góc phụ huynh: tổng quan, phân tích kỹ năng, nhận xét, điều chỉnh cấp độ.
✅ Supabase (lưu đám mây) + fallback localStorage khi chưa cấu hình.
✅ Tài liệu: README.md, SETUP-SUPABASE.md, DEPLOY-NETLIFY.md, supabase-schema.sql.

### Việc còn ngỏ / ý tưởng tương lai (chưa làm)
- [ ] **Đặt tên tiếng Anh cho app** (đang cân nhắc; gợi ý: FocusKid, SmartCub, BrightMind...).
      Hiện tiêu đề vẫn là "Bé Vào Lớp 1". Khi chốt tên cần đổi ở: `index.html` (title),
      `src/App.jsx` (chữ ".title" ở Home & ChildPicker), có thể cả README.
- [x] Âm thanh (tiếng khen, hiệu ứng) — đã có: tổng hợp bằng Web Audio trong
      `src/lib/sound.js` (đúng/sai/hoàn thành/sao/lên cấp/tap). Icon loa bật-tắt ở header,
      mặc định bật, lưu localStorage.
- [x] Phát âm tiếng Anh (text-to-speech) cho phần từ vựng — đã có: Web Speech API
      (`speak()` trong `sound.js`), tự đọc đề + nút loa 🔊 trong EnglishTask.
- [ ] Thêm đăng nhập nếu sau này chia sẻ cho nhiều gia đình (đã tách sẵn lớp storage).
- [ ] Nhờ giáo viên mầm non review nội dung sư phạm.
- [ ] Cân nhắc điều chỉnh tốc độ trò GoNoGo / RhythmTap sau khi test với bé thật.

---

## 4. KIẾN TRÚC KỸ THUẬT

- **Stack:** Vite 5 + React 18 (không TypeScript). CSS thuần trong `src/index.css`
  (không Tailwind). Không dùng react-router (điều hướng bằng state `screen`).
- **Deploy:** GitHub → Netlify (có `netlify.toml`). Build: `npm run build`, publish `dist`.
- **Database:** Supabase (Postgres). Hai bảng: `children`, `sessions` (xem `supabase-schema.sql`).
  - Biến môi trường: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (đặt trong `.env` khi chạy
    máy, hoặc Netlify Environment variables khi deploy).
  - RLS bật nhưng policy MỞ (public read/write) vì không đăng nhập. Dữ liệu chỉ là thành
    tích học tập, không nhạy cảm. Nếu thêm đăng nhập sau này → đổi policy sang auth.uid().
- **Quan trọng:** KHÔNG dùng localStorage/sessionStorage trong artifact preview của Claude.ai
  (bị chặn) — nhưng trong project Vite chạy ở máy/Netlify thì localStorage chạy bình thường.

### Lớp lưu trữ trừu tượng (src/lib/storage.js)
Toàn app CHỈ gọi các hàm trong `storage.js`, KHÔNG gọi Supabase trực tiếp. Nhờ đó đổi
backend / thêm đăng nhập chỉ cần sửa 1 file. Các hàm: `listChildren`, `addChild`,
`renameChild`, `updateChildLevels`, `listSessions`, `addSession`. Mỗi hàm có nhánh
Supabase và nhánh localStorage (kiểm tra `isSupabaseConfigured`).

---

## 5. CẤU TRÚC FILE & VAI TRÒ

```
be-vao-lop-1-app/
├── index.html              # điểm vào, <title> = tên app
├── package.json            # deps: react, react-dom, @supabase/supabase-js; dev: vite, @vitejs/plugin-react
├── vite.config.js
├── netlify.toml            # build config + SPA redirect
├── supabase-schema.sql     # SQL tạo bảng (chạy 1 lần trong Supabase SQL Editor)
├── .env.example            # mẫu biến môi trường
├── README.md               # giới thiệu + hướng dẫn chạy + triết lý
├── SETUP-SUPABASE.md       # hướng dẫn tạo database từng bước
├── DEPLOY-NETLIFY.md       # hướng dẫn đẩy GitHub + nối Netlify
└── src/
    ├── main.jsx            # bootstrap React
    ├── App.jsx             # ⭐ TRUNG TÂM: điều phối màn hình, buildSession, tự nâng cấp,
    │                       #   các component màn hình (ChildPicker, Home, Session, Result,
    │                       #   Progress, Parent). ACTIVITY_TYPES định nghĩa 10 trò.
    ├── index.css           # toàn bộ style (biến --c-* ở đầu file để đổi màu)
    ├── lib/
    │   ├── supabase.js     # khởi tạo client từ env; export isSupabaseConfigured
    │   ├── storage.js      # lớp lưu trữ (Supabase | localStorage)
    │   ├── levels.js       # ⭐ định nghĩa CẤP ĐỘ mọi trò + DEFAULT_LEVELS + getLevelConfig
    │   └── game.js         # tiện ích (rnd, shuffle, ngày), EMOJI, ENGLISH_WORDS, ALPHABET,
    │                       #   generateMaze (DFS), BADGES, computeStats, suggestLevelChanges
    └── activities/         # 10 trò, mỗi trò nhận props { onDone(score 0-100), level }
        │   --- Nhóm RÈN TẬP TRUNG ---
        ├── MemoryFind.jsx      # 🧠 trí nhớ làm việc
        ├── GoNoGo.jsx          # ✋ ức chế (Go/No-Go); có yếu tố thời gian
        ├── SearchTarget.jsx    # 🎯 chú ý chọn lọc
        ├── RhythmTap.jsx       # 🥁 chú ý duy trì; có yếu tố thời gian
        ├── Maze.jsx            # 🌀 mê cung (sinh ngẫu nhiên, hỗ trợ phím mũi tên)
        ├── FindDifferent.jsx   # 🔍 tìm vật khác biệt
        ├── ConnectDots.jsx     # 🔢 nối số theo thứ tự
        │   --- Nhóm KIẾN THỨC (đổi gió) ---
        ├── CountSort.jsx       # 🍓 đếm & so sánh nhóm
        ├── MathTask.jsx        # 🧮 cộng/trừ (5 cấp tới phạm vi 50 + tìm số thiếu)
        └── EnglishTask.jsx     # 🔤 chữ cái / hoa-thường / hình↔từ vựng
```

### Hợp đồng (contract) của mỗi activity
- Nhận: `onDone(score)` với score 0-100, và `level` (số nguyên ≥1).
- Tự lấy cấu hình cấp bằng `getLevelConfig(type, level)` từ `lib/levels.js`.
- Khi bé hoàn thành, gọi `onDone(score)` (thường có delay ~700ms để bé thấy hiệu ứng).
- Dùng `key={`${step}-${typeKey}`}` ở App để remount khi sang bài mới.

---

## 6. CÁC LOẠI HOẠT ĐỘNG & CẤP ĐỘ (chi tiết trong src/lib/levels.js)

| Trò | typeKey | maxLevel | Rèn gì | Chuẩn |
|-----|---------|----------|--------|-------|
| Nhớ rồi tìm | memory | 4 | trí nhớ làm việc | (tập trung) |
| Đừng bấm nhầm | gonogo | 4 | ức chế | Go/No-Go |
| Tìm giữa nhiễu | search | 4 | chú ý chọn lọc | (tập trung) |
| Bấm theo nhịp | rhythm | 4 | chú ý duy trì | (tập trung) |
| Mê cung | maze | 4 | tập trung/không gian | (tập trung) |
| Tìm khác biệt | find | 4 | quan sát | (quan sát) |
| Nối số | dots | 4 | tập trung/số | K.CC.A.3 |
| Đếm & so sánh | count | 4 | quan sát/đếm | K.CC.B.5, K.CC.C.6 |
| Phép tính | math | 5 | tư duy toán | K.OA, 1.OA, +lớp 2 |
| Tiếng Anh | english | 4 | tiếng Anh | (chữ cái/từ vựng) |

**DEFAULT_LEVELS** (cấp khởi đầu bé mới): math=2, dots=1, maze=2, count=2, find=2,
english=1, memory=1, gonogo=1, search=1, rhythm=1.

**math 5 cấp:** within 5 → within 10 → within 20 → within 50 → tìm số còn thiếu (a+?=res).
**english 4 cấp:** nhận mặt chữ → ghép hoa/thường → hình→từ → từ→hình.

---

## 7. LOGIC TỰ NÂNG CẤP (src/lib/game.js → suggestLevelChanges)

Xét tối đa 3 buổi gần nhất. Với mỗi loại bài: nếu trung bình điểm theo loại đó ≥90%
và chưa max → +1 cấp; nếu <50% và >1 → −1 cấp. Cần ≥2 buổi mới xét. Mỗi buổi lưu
`per_type` (điểm theo từng typeKey) và `per_skill` (điểm theo nhóm kỹ năng) để phục vụ
việc này và phần phân tích ở Góc phụ huynh.

---

## 8. QUY ƯỚC KHI PHÁT TRIỂN TIẾP

- **Giữ tỷ lệ 6 tập trung : 2 kiến thức.** Nếu thêm trò mới, phân loại đúng nhóm và
  cập nhật `buildSession` trong `App.jsx` cho cân.
- **Mọi trò phải có cấp độ** trong `levels.js` + cấp khởi đầu trong `DEFAULT_LEVELS`.
- **Thêm trò mới:** tạo file trong `activities/`, import vào `App.jsx`, thêm vào
  `ACTIVITY_TYPES` (có Comp, label, icon, skill) và `ACTIVITY_TYPES_META`.
- **Giữ tiếng Việt** cho toàn bộ UI. Tông khích lệ, không gay gắt.
- **Nút to, dễ chạm** (tối thiểu ~64px) vì người dùng là trẻ nhỏ.
- **Tránh** localStorage/sessionStorage trong môi trường artifact preview; trong Vite thì OK.
- **Test các trò có thời gian** (gonogo, rhythm) với tốc độ thực tế trước khi đẩy cho bé.

---

## 9. LỆNH HAY DÙNG

```bash
npm install        # cài deps
npm run dev        # chạy dev (http://localhost:5173)
npm run build      # build production → dist/
npm run preview    # xem thử bản build
```

Chạy được NGAY không cần Supabase (tự dùng localStorage, có banner vàng nhắc).
Muốn lưu đám mây: làm theo SETUP-SUPABASE.md.
Muốn lên mạng: làm theo DEPLOY-NETLIFY.md.
