// Cửa ngõ DUY NHẤT tới mọi âm thanh trong app: hiệu ứng tổng hợp bằng Web Audio
// và phát âm tiếng Anh bằng Web Speech. Component KHÔNG gọi các API này trực tiếp —
// chỉ gọi hàm trong file này (giống vai trò của storage.js với dữ liệu).
//
// Mọi hàm đều tôn trọng trạng thái mute và an toàn khi trình duyệt thiếu API
// (không ném lỗi, chỉ im lặng) để không làm app crash.

const STORAGE_KEY = "fk_sound_on";

let ctx = null; // AudioContext, khởi tạo lazy ở lần phát âm đầu tiên
let soundOn = readInitial();
const listeners = new Set();

function readInitial() {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === null ? true : v === "1"; // mặc định BẬT
  } catch {
    return true;
  }
}

/* ---------- Trạng thái bật/tắt ---------- */
export function isSoundOn() {
  return soundOn;
}

export function setSoundOn(on) {
  soundOn = !!on;
  try {
    localStorage.setItem(STORAGE_KEY, soundOn ? "1" : "0");
  } catch {}
  if (!soundOn) stopSpeech();
  listeners.forEach((fn) => fn(soundOn));
}

export function toggleSound() {
  setSoundOn(!soundOn);
  return soundOn;
}

// Đăng ký lắng nghe thay đổi (để icon loa ở các header tự cập nhật).
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/* ---------- AudioContext ---------- */
function getCtx() {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) {
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

// Unlock AudioContext ngay lần tương tác đầu tiên (trình duyệt chặn audio
// trước khi người dùng chạm/bấm lần đầu).
if (typeof window !== "undefined") {
  const unlock = () => {
    getCtx();
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

/* ---------- Tổng hợp âm ---------- */
// Một nốt: tần số (Hz), thời điểm bắt đầu (giây kể từ bây giờ), độ dài, loại sóng, đỉnh âm lượng.
function tone(freq, start, dur, type = "sine", peak = 0.18) {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  // envelope mượt để tránh tiếng "pop"
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.03);
}

// Chuỗi nốt nối tiếp: mảng [freq, dur].
function melody(notes, type = "triangle", peak = 0.16) {
  if (!soundOn) return;
  let t = 0;
  notes.forEach(([f, d]) => {
    tone(f, t, d, type, peak);
    t += d;
  });
}

export function playTap() {
  if (!soundOn) return;
  tone(440, 0, 0.07, "sine", 0.07); // rất khẽ
}

export function playCorrect() {
  if (!soundOn) return;
  melody([[523, 0.1], [659, 0.1], [784, 0.16]], "triangle", 0.16); // C5–E5–G5 đi lên
}

export function playWrong() {
  if (!soundOn) return;
  // nhẹ nhàng, không gắt — giữ tông khích lệ
  melody([[330, 0.12], [262, 0.16]], "sine", 0.12); // E4 → C4
}

export function playComplete() {
  if (!soundOn) return;
  melody([[523, 0.12], [659, 0.12], [784, 0.12], [1047, 0.3]], "triangle", 0.18);
}

export function playStar(n = 1) {
  if (!soundOn) return;
  const notes = [988, 1175, 1397]; // B5, D6, F6 — lấp lánh
  const count = Math.max(1, Math.min(3, n));
  for (let i = 0; i < count; i++) {
    tone(notes[i], 0.3 + i * 0.14, 0.2, "sine", 0.12);
  }
}

export function playLevelUp() {
  if (!soundOn) return;
  melody([[392, 0.1], [523, 0.1], [659, 0.1], [784, 0.24]], "square", 0.11);
}

// Nốt cho từng ô trong trò Nhớ chuỗi (Simon): 4 ô = 4 cao độ.
const PAD_NOTES = [392, 523, 659, 784]; // G4, C5, E5, G5
export function playPad(i) {
  if (!soundOn) return;
  tone(PAD_NOTES[i % PAD_NOTES.length], 0, 0.32, "sine", 0.16);
}

/* ---------- Phát âm (Web Speech) ---------- */
export function stopSpeech() {
  try {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  } catch {}
}

function pickVoice(lang) {
  try {
    const voices = window.speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    const exact = voices.find((v) => v.lang === lang);
    if (exact) return exact;
    const prefix = lang.split("-")[0];
    return voices.find((v) => v.lang && v.lang.startsWith(prefix)) || null;
  } catch {
    return null;
  }
}

// Đọc text. Nếu máy không có giọng phù hợp → im lặng (không lỗi).
export function speak(text, lang = "en-US") {
  if (!soundOn) return;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel(); // hủy câu đang đọc trước khi đọc câu mới
    const u = new SpeechSynthesisUtterance(String(text));
    u.lang = lang;
    u.rate = 0.85; // chậm hơn cho bé nghe rõ
    u.pitch = 1.05;
    const v = pickVoice(lang);
    if (v) u.voice = v;
    synth.speak(u);
  } catch {}
}

// Một số trình duyệt nạp danh sách giọng bất đồng bộ — kích cho nạp sớm.
if (typeof window !== "undefined" && window.speechSynthesis) {
  try {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      try {
        window.speechSynthesis.getVoices();
      } catch {}
    };
  } catch {}
}
