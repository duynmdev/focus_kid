/* ---------- Tiện ích ---------- */
export const rnd = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export const todayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
};

export const niceDate = (key) => {
  const [, m, d] = key.split("-");
  return `${d}/${m}`;
};

/* ---------- Emoji ---------- */
export const EMOJI = {
  animals: ["🐶", "🐱", "🐭", "🐰", "🦊", "🐻", "🐼", "🐨", "🦁", "🐯", "🐮", "🐷"],
  fruits: ["🍎", "🍌", "🍇", "🍓", "🍊", "🍉", "🍑", "🍍", "🥝", "🍒", "🥭", "🍐"],
  things: ["⚽", "🎈", "🚗", "✏️", "🎁", "⭐", "🌸", "🦋", "🚀", "🎸", "🪁", "🧸"],
};

/* ---------- Avatar cho bé ---------- */
export const AVATARS = ["🦁", "🐱", "🐶", "🐰", "🦊", "🐼", "🐨", "🦄", "🐸", "🐧"];

/* ---------- Từ vựng tiếng Anh (từ ngắn, có hình) ---------- */
export const ENGLISH_WORDS = [
  { word: "cat", emoji: "🐱" },
  { word: "dog", emoji: "🐶" },
  { word: "sun", emoji: "☀️" },
  { word: "cup", emoji: "☕" },
  { word: "car", emoji: "🚗" },
  { word: "bee", emoji: "🐝" },
  { word: "pig", emoji: "🐷" },
  { word: "fox", emoji: "🦊" },
  { word: "cow", emoji: "🐮" },
  { word: "owl", emoji: "🦉" },
  { word: "bus", emoji: "🚌" },
  { word: "hat", emoji: "🎩" },
  { word: "fish", emoji: "🐟" },
  { word: "star", emoji: "⭐" },
  { word: "frog", emoji: "🐸" },
  { word: "duck", emoji: "🦆" },
  { word: "bear", emoji: "🐻" },
  { word: "cake", emoji: "🍰" },
  { word: "ball", emoji: "⚽" },
  { word: "tree", emoji: "🌳" },
];

export const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/* ---------- Sinh mê cung ngẫu nhiên (thuật toán DFS) ---------- */
/* Trả về { grid, start, end }; grid n x n (n lẻ), 0=đường 1=tường */
export function generateMaze(n) {
  const size = n % 2 === 0 ? n + 1 : n;
  const grid = Array.from({ length: size }, () => Array(size).fill(1));

  const carve = (r, c) => {
    grid[r][c] = 0;
    const dirs = shuffle([
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ]);
    for (const [dr, dc] of dirs) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr > 0 &&
        nr < size - 1 &&
        nc > 0 &&
        nc < size - 1 &&
        grid[nr][nc] === 1
      ) {
        grid[r + dr / 2][c + dc / 2] = 0;
        carve(nr, nc);
      }
    }
  };

  carve(1, 1);
  grid[1][1] = 0;
  grid[size - 2][size - 2] = 0;
  return { grid, start: { r: 1, c: 1 }, end: { r: size - 2, c: size - 2 } };
}

/* ---------- Huy hiệu ---------- */
export const BADGES = [
  { id: "first", icon: "🌟", name: "Buổi đầu tiên", need: (s) => s.totalSessions >= 1 },
  { id: "three", icon: "🔥", name: "3 ngày liên tiếp", need: (s) => s.streak >= 3 },
  { id: "five", icon: "🏅", name: "5 buổi hoàn thành", need: (s) => s.totalSessions >= 5 },
  { id: "perfect", icon: "💎", name: "Buổi hoàn hảo", need: (s) => s.hadPerfect },
  { id: "star50", icon: "👑", name: "50 ngôi sao", need: (s) => s.totalStars >= 50 },
  { id: "ten", icon: "🚀", name: "10 buổi học", need: (s) => s.totalSessions >= 10 },
];

/* ---------- Tính thống kê từ danh sách buổi học ---------- */
export function computeStats(sessions) {
  const sorted = [...sessions].sort((a, b) =>
    a.created_at < b.created_at ? -1 : 1
  );
  const totalSessions = sorted.length;
  const totalStars = sorted.reduce((s, x) => s + (x.stars || 0), 0);
  const hadPerfect = sorted.some((x) => x.accuracy === 100);

  // chuỗi ngày: số ngày khác nhau liên tiếp tính tới hôm nay
  const days = [...new Set(sorted.map((x) => x.date))].sort();
  let streak = 0;
  if (days.length > 0) {
    const oneDay = 86400000;
    const dParse = (k) => {
      const [y, m, d] = k.split("-").map(Number);
      return new Date(y, m - 1, d).getTime();
    };
    streak = 1;
    for (let i = days.length - 1; i > 0; i--) {
      if (dParse(days[i]) - dParse(days[i - 1]) === oneDay) streak++;
      else break;
    }
  }

  // theo kỹ năng
  const skillTotals = {};
  sorted.forEach((sess) => {
    const ps = sess.per_skill || {};
    Object.entries(ps).forEach(([skill, v]) => {
      if (!skillTotals[skill]) skillTotals[skill] = { sum: 0, n: 0 };
      skillTotals[skill].sum += v.sum;
      skillTotals[skill].n += v.n;
    });
  });

  return { totalSessions, totalStars, hadPerfect, streak, skillTotals };
}

/* ============================================================
   TỰ NÂNG CẤP
   Xét 3 buổi gần nhất: nếu trung bình theo loại bài >= 90% -> nâng 1 cấp.
   Nếu < 50% -> hạ 1 cấp (để bé không nản).
   Trả về object { type: newLevel, ... } chỉ gồm các loại có thay đổi.
   ============================================================ */
export function suggestLevelChanges(sessions, currentLevels, maxLevelOf) {
  const recent = [...sessions]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 3);
  if (recent.length < 2) return {}; // cần ít nhất 2 buổi mới xét

  // gom điểm theo loại bài (per_type)
  const byType = {};
  recent.forEach((sess) => {
    const pt = sess.per_type || {};
    Object.entries(pt).forEach(([type, v]) => {
      if (!byType[type]) byType[type] = { sum: 0, n: 0 };
      byType[type].sum += v.sum;
      byType[type].n += v.n;
    });
  });

  const changes = {};
  Object.entries(byType).forEach(([type, v]) => {
    if (v.n < 2) return;
    const avg = v.sum / v.n;
    const cur = currentLevels[type] || 1;
    const max = maxLevelOf[type] || 1;
    if (avg >= 90 && cur < max) changes[type] = cur + 1;
    else if (avg < 50 && cur > 1) changes[type] = cur - 1;
  });
  return changes;
}
