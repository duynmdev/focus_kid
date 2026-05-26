import React, { useState, useEffect, useRef } from "react";
import { getLevelConfig } from "../lib/levels";
import { playCorrect, playWrong } from "../lib/sound";

/* Đừng bấm nhầm (Go/No-Go): bấm khi thấy con THỎ 🐰, NHỊN khi thấy con MÈO 🐱.
   Rèn khả năng ức chế / kìm bốc đồng.
   Luồng: intro → practice (tập thử, không tính điểm) → countdown (3-2-1) → playing → done.
   Có thể tạm dừng khi đang chơi. */
const GO = "🐰";
const NOGO = "🐱";
const PRACTICE = [
  { emoji: GO, isGo: true },
  { emoji: NOGO, isGo: false },
];

export default function GoNoGo({ onDone, level = 1 }) {
  const cfg = getLevelConfig("gonogo", level);

  const [phase, setPhase] = useState("intro"); // intro | practice | countdown | playing | done
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(null); // {emoji, isGo}
  const [feedback, setFeedback] = useState(null); // "good" | "bad" | null
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [paused, setPaused] = useState(false);
  const [count, setCount] = useState(3);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceMsg, setPracticeMsg] = useState(null);

  const timerRef = useRef(null);
  const answeredRef = useRef(false);
  const pausedRef = useRef(false);
  const roundRef = useRef(0);
  const scoreRef = useRef({ correct: 0, total: 0 }); // tránh đọc score cũ trong closure timeout
  useEffect(() => {
    roundRef.current = round;
  }, [round]);

  const clear = () => clearTimeout(timerRef.current);

  /* ---------- tập thử (không tính điểm) ---------- */
  const startPractice = () => {
    setPhase("practice");
    showPractice(0);
  };

  const showPractice = (i) => {
    if (i >= PRACTICE.length) {
      startCountdown();
      return;
    }
    setPracticeIdx(i);
    setCurrent(PRACTICE[i]);
    setPracticeMsg(null);
    answeredRef.current = false;
    // nếu bé không thao tác, tự nhận xét rồi qua mục sau
    timerRef.current = setTimeout(() => {
      if (answeredRef.current) return;
      answeredRef.current = true;
      setPracticeMsg(
        PRACTICE[i].isGo
          ? "Đây là thỏ 🐰 — lần thật nhớ BẤM nhé!"
          : "Đúng rồi, thấy mèo 🐱 thì ngồi yên!"
      );
      timerRef.current = setTimeout(() => showPractice(i + 1), 1300);
    }, 2600);
  };

  const practiceTap = () => {
    if (answeredRef.current) return;
    answeredRef.current = true;
    clear();
    const item = PRACTICE[practiceIdx];
    if (item.isGo) {
      playCorrect();
      setPracticeMsg("Giỏi quá! Thấy thỏ là bấm 🐰");
    } else {
      playWrong();
      setPracticeMsg("Ơ, đây là mèo 🐱 — lần thật nhớ ĐỪNG bấm nhé!");
    }
    timerRef.current = setTimeout(() => showPractice(practiceIdx + 1), 1400);
  };

  /* ---------- đếm ngược ---------- */
  const startCountdown = () => {
    setCurrent(null);
    setPhase("countdown");
    setCount(3);
    const tick = (n) => {
      if (n <= 0) {
        startGame();
        return;
      }
      setCount(n);
      timerRef.current = setTimeout(() => tick(n - 1), 800);
    };
    tick(3);
  };

  /* ---------- chơi thật ---------- */
  const startGame = () => {
    setPhase("playing");
    setRound(0);
    setScore({ correct: 0, total: 0 });
    scoreRef.current = { correct: 0, total: 0 };
    nextRound(0);
  };

  const nextRound = (r) => {
    if (pausedRef.current) return;
    if (r >= cfg.rounds) {
      finish();
      return;
    }
    const isGo = Math.random() > cfg.noGoRate;
    answeredRef.current = false;
    setCurrent({ emoji: isGo ? GO : NOGO, isGo });
    setRound(r + 1);
    setFeedback(null);

    // hết thời gian: nếu là GO mà chưa bấm -> sai; nếu NO-GO mà chưa bấm -> đúng
    timerRef.current = setTimeout(() => {
      if (pausedRef.current) return;
      if (!answeredRef.current) {
        const correct = !isGo;
        registerResult(correct, isGo ? "miss" : "good-nogo");
      }
      nextRound(r + 1);
    }, cfg.intervalMs);
  };

  const registerResult = (correct, kind) => {
    setScore((s) => {
      const ns = { correct: s.correct + (correct ? 1 : 0), total: s.total + 1 };
      scoreRef.current = ns;
      return ns;
    });
    if (kind === "good-nogo") return; // không hiện/kêu gì khi nhịn đúng (đỡ rối)
    (correct ? playCorrect : playWrong)();
    setFeedback(correct ? "good" : "bad");
  };

  const handleTap = () => {
    if (phase !== "playing" || paused || !current || answeredRef.current) return;
    answeredRef.current = true;
    clear();
    const correct = current.isGo;
    registerResult(correct, correct ? "good" : "wrong-press");
    timerRef.current = setTimeout(() => {
      if (!pausedRef.current) nextRound(roundRef.current);
    }, 350);
  };

  const finish = () => {
    setPhase("done");
    clear();
    const pct = Math.min(100, Math.round((scoreRef.current.correct / cfg.rounds) * 100));
    setTimeout(() => onDone(pct), 800);
  };

  /* ---------- tạm dừng ---------- */
  const pause = () => {
    pausedRef.current = true;
    clear();
    setPaused(true);
  };
  const resume = () => {
    pausedRef.current = false;
    setPaused(false);
    nextRound(roundRef.current - 1); // chạy lại lượt hiện tại từ đầu
  };

  useEffect(() => () => clear(), []);

  return (
    <div className="task-body">
      {phase === "intro" && (
        <div className="gng-intro">
          <p className="task-instruction">
            Thấy <span className="gng-big">{GO}</span> thì <b>BẤM nhanh</b>!<br />
            Thấy <span className="gng-big">{NOGO}</span> thì <b>ĐỪNG bấm</b>, ngồi yên nhé!
          </p>
          <button className="big-play small" onClick={startPractice}>
            Bắt đầu! ▶
          </button>
        </div>
      )}

      {phase === "practice" && (
        <>
          <p className="gng-progress practice-tag">Tập thử (chưa tính điểm)</p>
          <button className="gng-stage" onClick={practiceTap}>
            {current && <span className="gng-emoji">{current.emoji}</span>}
          </button>
          <p className="gng-hint">
            {practiceMsg || `${GO} = bấm  •  ${NOGO} = nhịn`}
          </p>
        </>
      )}

      {phase === "countdown" && (
        <div className="countdown-wrap">
          <p className="task-instruction">Sẵn sàng nhé! 🐰</p>
          <div className="countdown-num" key={count}>{count}</div>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div className="sess-control-row">
            <p className="gng-progress">Lượt {round}/{cfg.rounds}</p>
            <button className="pause-btn" onClick={pause} aria-label="Tạm dừng">⏸</button>
          </div>
          <button
            className={`gng-stage ${
              feedback === "good" ? "gng-good" : feedback === "bad" ? "gng-bad" : ""
            }`}
            onClick={handleTap}
          >
            {current && <span className="gng-emoji">{current.emoji}</span>}
          </button>
          <p className="gng-hint">
            {GO} = bấm &nbsp;•&nbsp; {NOGO} = nhịn
          </p>
          {paused && (
            <div className="pause-overlay">
              <div className="pause-box">
                <p className="pause-title">Đang tạm dừng ⏸</p>
                <button className="big-play small" onClick={resume}>Tiếp tục ▶</button>
              </div>
            </div>
          )}
        </>
      )}

      {phase === "done" && <div className="task-cheer">Con kiểm soát rất giỏi! 🎉</div>}
    </div>
  );
}
