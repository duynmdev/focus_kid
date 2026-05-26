import React, { useState, useEffect, useRef } from "react";
import { getLevelConfig } from "../lib/levels";
import { playCorrect, playWrong } from "../lib/sound";

/* Đừng bấm nhầm (Go/No-Go): bấm khi thấy con THỎ 🐰, NHỊN khi thấy con MÈO 🐱.
   Rèn khả năng ức chế / kìm bốc đồng. */
const GO = "🐰";
const NOGO = "🐱";

export default function GoNoGo({ onDone, level = 1 }) {
  const cfg = getLevelConfig("gonogo", level);

  const [phase, setPhase] = useState("intro"); // intro | playing | done
  const [round, setRound] = useState(0);
  const [current, setCurrent] = useState(null); // {emoji, isGo}
  const [feedback, setFeedback] = useState(null); // "good" | "bad" | null
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const timerRef = useRef(null);
  const answeredRef = useRef(false);

  const startGame = () => {
    setPhase("playing");
    setRound(0);
    setScore({ correct: 0, total: 0 });
    nextRound(0);
  };

  const nextRound = (r) => {
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
      if (!answeredRef.current) {
        const correct = !isGo; // không bấm: đúng nếu là no-go
        registerResult(correct, isGo ? "miss" : "good-nogo");
      }
      nextRound(r + 1);
    }, cfg.intervalMs);
  };

  const registerResult = (correct, kind) => {
    setScore((s) => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
    if (kind === "good-nogo") return; // không hiện/kêu gì khi nhịn đúng (đỡ rối)
    (correct ? playCorrect : playWrong)();
    setFeedback(correct ? "good" : "bad");
  };

  const handleTap = () => {
    if (phase !== "playing" || !current || answeredRef.current) return;
    answeredRef.current = true;
    clearTimeout(timerRef.current);
    const correct = current.isGo; // bấm: đúng nếu là GO
    registerResult(correct, correct ? "good" : "wrong-press");
    setTimeout(() => nextRound(round), 350);
  };

  const finish = () => {
    setPhase("done");
    const pct = score.total > 0 ? Math.round((score.correct / cfg.rounds) * 100) : 0;
    setTimeout(() => onDone(pct), 800);
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="task-body">
      {phase === "intro" && (
        <div className="gng-intro">
          <p className="task-instruction">
            Thấy <span className="gng-big">{GO}</span> thì <b>BẤM nhanh</b>!<br />
            Thấy <span className="gng-big">{NOGO}</span> thì <b>ĐỪNG bấm</b>, ngồi yên nhé!
          </p>
          <button className="big-play small" onClick={startGame}>
            Bắt đầu! ▶
          </button>
        </div>
      )}

      {phase === "playing" && (
        <>
          <p className="gng-progress">Lượt {round}/{cfg.rounds}</p>
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
        </>
      )}

      {phase === "done" && <div className="task-cheer">Con kiểm soát rất giỏi! 🎉</div>}
    </div>
  );
}
