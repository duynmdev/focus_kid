/* ============================================================
   HỆ THỐNG CẤP ĐỘ — bám chuẩn Common Core (K → Lớp 2)
   Mỗi loại bài có nhiều cấp, từ dễ tới khó.
   Mỗi cấp ghi chú "standard" để biết dựa trên chuẩn nào.
   ============================================================ */

/*
  Quy ước:
  - maxLevel: số cấp của loại bài đó (cấp bắt đầu là 1)
  - Bé bắt đầu ở cấp 1, hệ thống tự nâng khi làm tốt nhiều buổi.
  - Phụ huynh có thể chỉnh cấp tay trong "Góc phụ huynh".
*/

export const LEVELS = {
  // 🧮 PHÉP TÍNH — K.OA.A.5 (within 5), K.OA.A.2 (within 10),
  // 1.OA.C.6 (within 20), 2.OA (within 50 - vượt tuổi cho bé học toán tư duy)
  math: {
    maxLevel: 5,
    levels: {
      1: { label: "Cộng/trừ trong 5", max: 5, missing: false, std: "K.OA.A.5" },
      2: { label: "Cộng/trừ trong 10", max: 10, missing: false, std: "K.OA.A.2" },
      3: { label: "Cộng/trừ trong 20", max: 20, missing: false, std: "1.OA.C.6" },
      4: { label: "Cộng/trừ trong 50", max: 50, missing: false, std: "Lớp 2 (vượt tuổi)" },
      5: { label: "Tìm số còn thiếu", max: 20, missing: true, std: "1.OA.A.1 (unknown)" },
    },
  },

  // 🔢 NỐI SỐ — K.CC.A.3 (số tới 20)
  dots: {
    maxLevel: 4,
    levels: {
      1: { label: "Nối số 1–8", count: 8, std: "K.CC.A.3" },
      2: { label: "Nối số 1–12", count: 12, std: "K.CC.A.3" },
      3: { label: "Nối số 1–16", count: 16, std: "K.CC.A.3" },
      4: { label: "Nối số 1–20", count: 20, std: "K.CC.A.3" },
    },
  },

  // 🌀 MÊ CUNG — rèn tập trung & tư duy không gian (sinh ngẫu nhiên)
  maze: {
    maxLevel: 4,
    levels: {
      1: { label: "Mê cung nhỏ", size: 5, std: "Tập trung" },
      2: { label: "Mê cung vừa", size: 7, std: "Tập trung" },
      3: { label: "Mê cung lớn", size: 9, std: "Tập trung" },
      4: { label: "Mê cung khó", size: 11, std: "Tập trung" },
    },
  },

  // 🍓 ĐẾM & SO SÁNH — K.CC.B.5 (đếm tới 20), K.CC.C.6 (so sánh nhóm)
  count: {
    maxLevel: 4,
    levels: {
      1: { label: "Đếm tới 6", max: 6, compare: false, std: "K.CC.B.5" },
      2: { label: "Đếm tới 10", max: 10, compare: false, std: "K.CC.B.5" },
      3: { label: "So sánh nhóm", max: 10, compare: true, std: "K.CC.C.6" },
      4: { label: "Đếm tới 20", max: 20, compare: false, std: "K.CC.B.5" },
    },
  },

  // 🔍 TÌM KHÁC BIỆT — rèn quan sát (tăng nhiễu dần)
  find: {
    maxLevel: 4,
    levels: {
      1: { label: "9 ô, 1 khác", cells: 9, std: "Quan sát" },
      2: { label: "12 ô, 1 khác", cells: 12, std: "Quan sát" },
      3: { label: "16 ô, 1 khác", cells: 16, std: "Quan sát" },
      4: { label: "20 ô, 1 khác", cells: 20, std: "Quan sát" },
    },
  },

  // 🔤 TIẾNG ANH — chữ cái, ghép hoa/thường, từ vựng theo hình
  english: {
    maxLevel: 5,
    levels: {
      1: { label: "Nhận mặt chữ", mode: "letter", std: "Tiếng Anh — chữ cái" },
      2: { label: "Ghép hoa & thường", mode: "case", std: "Tiếng Anh — hoa/thường" },
      3: { label: "Hình → từ", mode: "pic2word", std: "Tiếng Anh — từ vựng" },
      4: { label: "Từ → hình", mode: "word2pic", std: "Tiếng Anh — đọc từ" },
      5: { label: "Nghe và chọn hình", mode: "listen", std: "Tiếng Anh — nghe hiểu" },
    },
  },

  // 🧠 NHỚ RỒI TÌM — rèn TRÍ NHỚ LÀM VIỆC (working memory)
  memory: {
    maxLevel: 4,
    levels: {
      1: { label: "Nhớ 1 hình", remember: 1, choices: 4, showMs: 3000, std: "Trí nhớ làm việc" },
      2: { label: "Nhớ 2 hình", remember: 2, choices: 6, showMs: 3500, std: "Trí nhớ làm việc" },
      3: { label: "Nhớ 3 hình", remember: 3, choices: 9, showMs: 4000, std: "Trí nhớ làm việc" },
      4: { label: "Nhớ 4 hình", remember: 4, choices: 12, showMs: 4500, std: "Trí nhớ làm việc" },
    },
  },

  // ✋ ĐỪNG BẤM NHẦM — rèn ỨC CHẾ (Go/No-Go, kìm bốc đồng)
  gonogo: {
    maxLevel: 4,
    levels: {
      // NOTE: số tốc độ cấp 1 làm mềm cho bé mới; xem lại sau khi test bé thật.
      1: { label: "Chậm rãi", rounds: 10, intervalMs: 2000, noGoRate: 0.3, std: "Ức chế (Go/No-Go)" },
      2: { label: "Vừa phải", rounds: 12, intervalMs: 1500, noGoRate: 0.35, std: "Ức chế (Go/No-Go)" },
      3: { label: "Nhanh", rounds: 14, intervalMs: 1200, noGoRate: 0.4, std: "Ức chế (Go/No-Go)" },
      4: { label: "Rất nhanh", rounds: 16, intervalMs: 1000, noGoRate: 0.45, std: "Ức chế (Go/No-Go)" },
    },
  },

  // 🎯 TÌM GIỮA NHIỄU — rèn CHÚ Ý CHỌN LỌC (selective attention)
  search: {
    maxLevel: 4,
    levels: {
      1: { label: "12 ô, 1 mục tiêu", cells: 12, targets: 1, std: "Chú ý chọn lọc" },
      2: { label: "16 ô, 2 mục tiêu", cells: 16, targets: 2, std: "Chú ý chọn lọc" },
      3: { label: "20 ô, 3 mục tiêu", cells: 20, targets: 3, std: "Chú ý chọn lọc" },
      4: { label: "25 ô, 4 mục tiêu", cells: 25, targets: 4, std: "Chú ý chọn lọc" },
    },
  },

  // 🥁 BẤM THEO NHỊP — rèn CHÚ Ý DUY TRÌ (sustained attention)
  rhythm: {
    maxLevel: 4,
    levels: {
      // NOTE: tốc độ cấp 1 làm mềm cho bé mới; xem lại sau khi test bé thật.
      1: { label: "8 nhịp", taps: 8, intervalMs: 1600, std: "Chú ý duy trì" },
      2: { label: "12 nhịp", taps: 12, intervalMs: 1200, std: "Chú ý duy trì" },
      3: { label: "16 nhịp", taps: 16, intervalMs: 1100, std: "Chú ý duy trì" },
      4: { label: "20 nhịp", taps: 20, intervalMs: 1000, std: "Chú ý duy trì" },
    },
  },

  // 🎵 NHỚ CHUỖI (Simon) — rèn TRÍ NHỚ LÀM VIỆC + chú ý duy trì
  sequence: {
    maxLevel: 4,
    levels: {
      1: { label: "Chuỗi tới 3", start: 2, target: 3, flashMs: 700, std: "Trí nhớ làm việc" },
      2: { label: "Chuỗi tới 4", start: 2, target: 4, flashMs: 600, std: "Trí nhớ làm việc" },
      3: { label: "Chuỗi tới 5", start: 2, target: 5, flashMs: 500, std: "Trí nhớ làm việc" },
      4: { label: "Chuỗi tới 6", start: 3, target: 6, flashMs: 430, std: "Trí nhớ làm việc" },
    },
  },

  // 🔀 ĐỔI LUẬT — rèn LINH HOẠT NHẬN THỨC (cognitive flexibility / set-shifting)
  shift: {
    maxLevel: 4,
    levels: {
      1: { label: "Ít đổi luật", trials: 6, switchEvery: 3, options: 2, std: "Linh hoạt nhận thức" },
      2: { label: "Đổi thường hơn", trials: 8, switchEvery: 2, options: 2, std: "Linh hoạt nhận thức" },
      3: { label: "3 lựa chọn", trials: 10, switchEvery: 2, options: 3, std: "Linh hoạt nhận thức" },
      4: { label: "Đổi liên tục", trials: 10, switchEvery: 1, options: 3, std: "Linh hoạt nhận thức" },
    },
  },

  // 🧩 GHÉP ĐÔI — lật tìm cặp, rèn trí nhớ vị trí
  pairs: {
    maxLevel: 4,
    levels: {
      1: { label: "3 cặp", pairs: 3, std: "Trí nhớ làm việc" },
      2: { label: "4 cặp", pairs: 4, std: "Trí nhớ làm việc" },
      3: { label: "6 cặp", pairs: 6, std: "Trí nhớ làm việc" },
      4: { label: "8 cặp", pairs: 8, std: "Trí nhớ làm việc" },
    },
  },

  // 🔷 HÌNH HỌC — nhận biết hình & số cạnh (Common Core K.G)
  shapes: {
    maxLevel: 4,
    levels: {
      1: { label: "3 hình cơ bản", shapesN: 3, options: 3, sides: false, std: "K.G.A.2" },
      2: { label: "4 hình", shapesN: 4, options: 3, sides: false, std: "K.G.A.2" },
      3: { label: "5 hình", shapesN: 5, options: 4, sides: false, std: "K.G.A.2" },
      4: { label: "Đếm số cạnh", shapesN: 5, options: 3, sides: true, std: "K.G.B.4" },
    },
  },
};

/* Cấp khởi đầu mặc định cho một bé mới */
export const DEFAULT_LEVELS = {
  math: 2, // bé học toán tư duy nên bắt đầu ở phạm vi 10
  dots: 1,
  maze: 2,
  count: 2,
  find: 2,
  english: 1, // bé mới bắt đầu tiếng Anh
  memory: 1,
  gonogo: 1,
  search: 1,
  rhythm: 1,
  sequence: 1,
  shift: 1,
  pairs: 2, // ghép đôi 3 cặp hơi dễ, bắt đầu ở 4 cặp
  shapes: 1,
};

/* Lấy cấu hình cấp hiện tại của một loại bài, có chặn biên */
export function getLevelConfig(type, level) {
  const def = LEVELS[type];
  if (!def) return null;
  const clamped = Math.max(1, Math.min(def.maxLevel, level || 1));
  return { ...def.levels[clamped], level: clamped, maxLevel: def.maxLevel };
}
