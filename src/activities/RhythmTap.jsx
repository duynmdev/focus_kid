import React, { useState, useEffect, useRef } from "react";
import { getLevelConfig } from "../lib/levels";
import { playTap, playWrong } from "../lib/sound";

/* Bấm theo nhịp: ngôi sao sáng lên đều đặn, bé bấm đúng lúc nó sáng.
   Rèn chú ý duy trì (giữ tập trung đều trong thời gian dài).
   Luồng: intro → practice (tập thử) → countdown (3-2-1) → playing → done.
   Có thể tạm dừng khi đang chơi. */
export default function RhythmTap({ onDone, level = 1 }) {
  const cfg = getLevelConfig("rhythm", level);

  const [phase, setPhase] = useState("intro"); // intro | practice | countdown | playing | done
  const [tapIndex, setTapIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [hits, setHits] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [paused, setPaused] = useState(false);
  const [count, setCount] = useState(3);
  const [practiceIdx, setPracticeIdx] = useState(0);
  const [practiceMsg, setPracticeMsg] = useState(null);

  const windowRef = useRef(false); // đang trong cửa sổ cho phép bấm
  const tappedRef = useRef(false);
  const timersRef = useRef([]);
  const hitsRef = useRef(0);
  const beatRef = useRef(0); // chỉ số nhịp hiện tại (0-based) để tiếp tục sau khi tạm dừng
  const pausedRef = useRef(false);

  useEffect(() => {
    hitsRef.current = hits;
  }, [hits]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const onMs = Math.min(800, cfg.intervalMs * 0.55);

  /* ---------- tập thử (không tính điểm) ---------- */
  const startPractice = () => {
    setPhase("practice");
    runPractice(0);
  };

  const runPractice = (i) => {
    if (i >= 2) {
      startCountdown();
      return;
    }
    setPracticeIdx(i);
    setPracticeMsg(null);
    tappedRef.current = false;
    setActive(true);
    windowRef.current = true;

    const t1 = setTimeout(() => {
      setActive(false);
      windowRef.current = false;
    }, onMs);
    const t2 = setTimeout(() => {
      if (!tappedRef.current) setPracticeMsg("Khi sao sáng ⭐ thì chạm thật nhanh nhé!");
      runPractice(i + 1);
    }, cfg.intervalMs + 700);
    timersRef.current.push(t1, t2);
  };

  const practiceTap = () => {
    if (windowRef.current && !tappedRef.current) {
      tappedRef.current = true;
      playTap();
      setFeedback("good");
      setPracticeMsg("Giỏi quá, đúng nhịp! 🎉");
      setTimeout(() => setFeedback(null), 250);
    } else if (!windowRef.current) {
      setFeedback("early");
      setTimeout(() => setFeedback(null), 250);
    }
  };

  /* ---------- đếm ngược ---------- */
  const startCountdown = () => {
    setActive(false);
    windowRef.current = false;
    setPhase("countdown");
    setCount(3);
    const tick = (n) => {
      if (n <= 0) {
        start();
        return;
      }
      setCount(n);
      const t = setTimeout(() => tick(n - 1), 800);
      timersRef.current.push(t);
    };
    tick(3);
  };

  /* ---------- chơi thật ---------- */
  const start = () => {
    setPhase("playing");
    setTapIndex(0);
    setHits(0);
    hitsRef.current = 0;
    runBeat(0);
  };

  const runBeat = (i) => {
    if (pausedRef.current) return;
    if (i >= cfg.taps) {
      finish();
      return;
    }
    beatRef.current = i;
    setTapIndex(i + 1);
    tappedRef.current = false;

    setActive(true);
    windowRef.current = true;

    const t1 = setTimeout(() => {
      setActive(false);
      windowRef.current = false; // hết cửa sổ -> nếu chưa bấm là bỏ lỡ
    }, onMs);
    const t2 = setTimeout(() => {
      if (pausedRef.current) return;
      runBeat(i + 1);
    }, cfg.intervalMs);
    timersRef.current.push(t1, t2);
  };

  const tap = () => {
    if (phase !== "playing" || paused) return;
    if (windowRef.current && !tappedRef.current) {
      tappedRef.current = true;
      playTap();
      setHits((h) => {
        hitsRef.current = h + 1;
        return h + 1;
      });
      setFeedback("good");
      setTimeout(() => setFeedback(null), 250);
    } else if (!windowRef.current) {
      // bấm sai lúc (chưa sáng) -> nhấp nháy báo
      playWrong();
      setFeedback("early");
      setTimeout(() => setFeedback(null), 250);
    }
  };

  const finish = () => {
    setPhase("done");
    clearTimers();
    const pct = Math.min(100, Math.round((hitsRef.current / cfg.taps) * 100));
    setTimeout(() => onDone(pct), 800);
  };

  /* ---------- tạm dừng ---------- */
  const pause = () => {
    pausedRef.current = true;
    clearTimers();
    setActive(false);
    windowRef.current = false;
    setPaused(true);
  };
  const resume = () => {
    pausedRef.current = false;
    setPaused(false);
    runBeat(beatRef.current); // chạy lại nhịp hiện tại
  };

  useEffect(() => () => clearTimers(), []);

  return (
    <div className="task-body">
      {phase === "intro" && (
        <div className="gng-intro">
          <p className="task-instruction">
            Ngôi sao sẽ sáng lên ⭐ đều đặn.<br />
            Mỗi lần nó <b>sáng</b>, con chạm thật nhanh nhé!<br />
            Cố gắng chú ý suốt {cfg.taps} lần! 🥁
          </p>
          <button className="big-play small" onClick={startPractice}>
            Bắt đầu! ▶
          </button>
        </div>
      )}

      {phase === "practice" && (
        <>
          <p className="gng-progress practice-tag">Tập thử (chưa tính điểm)</p>
          <button
            className={`rhythm-star ${active ? "rs-on" : ""} ${
              feedback === "good" ? "rs-good" : feedback === "early" ? "rs-early" : ""
            }`}
            onClick={practiceTap}
          >
            ⭐
          </button>
          <p className="gng-hint">{practiceMsg || "Chạm khi sao sáng!"}</p>
        </>
      )}

      {phase === "countdown" && (
        <div className="countdown-wrap">
          <p className="task-instruction">Sẵn sàng nhé! ⭐</p>
          <div className="countdown-num" key={count}>{count}</div>
        </div>
      )}

      {phase === "playing" && (
        <>
          <div className="sess-control-row">
            <p className="gng-progress">
              Nhịp {tapIndex}/{cfg.taps} &nbsp;•&nbsp; Trúng: {hits}
            </p>
            <button className="pause-btn" onClick={pause} aria-label="Tạm dừng">⏸</button>
          </div>
          <button
            className={`rhythm-star ${active ? "rs-on" : ""} ${
              feedback === "good" ? "rs-good" : feedback === "early" ? "rs-early" : ""
            }`}
            onClick={tap}
          >
            ⭐
          </button>
          <p className="gng-hint">Chạm khi sao sáng!</p>
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

      {phase === "done" && <div className="task-cheer">Con chú ý rất bền! 🎉</div>}
    </div>
  );
}
