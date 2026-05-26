import React, { useState, useMemo, useEffect } from "react";
import { shuffle, EMOJI } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playTap, playCorrect, playWrong } from "../lib/sound";

/* Nhớ rồi tìm: xem N hình trong vài giây, rồi chọn lại đúng các hình đó
   giữa nhiều lựa chọn. Rèn trí nhớ làm việc. */
export default function MemoryFind({ onDone, level = 1 }) {
  const cfg = getLevelConfig("memory", level);

  const data = useMemo(() => {
    const pool = shuffle(Object.values(EMOJI).flat());
    const remember = pool.slice(0, cfg.remember);
    const distractors = pool.slice(cfg.remember, cfg.choices);
    const choices = shuffle([...remember, ...distractors]);
    return { remember, choices };
  }, [level]);

  const [phase, setPhase] = useState("show"); // show | recall | done
  const [picked, setPicked] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(cfg.showMs / 1000));

  // đếm ngược lúc xem
  useEffect(() => {
    if (phase !== "show") return;
    if (secondsLeft <= 0) {
      setPhase("recall");
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secondsLeft]);

  const toggle = (emoji) => {
    if (phase !== "recall") return;
    playTap();
    setPicked((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const submit = () => {
    const target = new Set(data.remember);
    const chosen = new Set(picked);
    // điểm: tỉ lệ đúng - phạt chọn sai
    let correct = 0;
    target.forEach((e) => {
      if (chosen.has(e)) correct++;
    });
    let wrong = 0;
    chosen.forEach((e) => {
      if (!target.has(e)) wrong++;
    });
    const score = Math.max(
      0,
      Math.round((correct / target.size) * 100 - wrong * 20)
    );
    (score >= 50 ? playCorrect : playWrong)();
    setPhase("done");
    setTimeout(() => onDone(score), 800);
  };

  return (
    <div className="task-body">
      {phase === "show" && (
        <>
          <p className="task-instruction">
            Nhìn và ghi nhớ {cfg.remember === 1 ? "hình" : `${cfg.remember} hình`} này nhé!
            Còn <b>{secondsLeft}</b> giây… 🧠
          </p>
          <div className="mem-show">
            {data.remember.map((e, i) => (
              <span key={i} className="mem-target">{e}</span>
            ))}
          </div>
          <div className="mem-timer">
            <div
              className="mem-timer-bar"
              style={{ animationDuration: `${cfg.showMs}ms` }}
            />
          </div>
        </>
      )}

      {phase === "recall" && (
        <>
          <p className="task-instruction">
            Hình con vừa thấy đâu rồi? Chạm chọn{" "}
            {cfg.remember === 1 ? "hình đó" : `cả ${cfg.remember} hình`} nhé! 👆
          </p>
          <div className="find-grid" style={{ gridTemplateColumns: `repeat(${data.choices.length <= 6 ? 3 : 4}, 1fr)` }}>
            {data.choices.map((e, i) => (
              <button
                key={i}
                className={`find-cell ${picked.includes(e) ? "mem-picked" : ""}`}
                onClick={() => toggle(e)}
              >
                {e}
              </button>
            ))}
          </div>
          <button
            className="big-play small"
            disabled={picked.length === 0}
            onClick={submit}
            style={{ marginTop: 20 }}
          >
            Xong! ✓
          </button>
        </>
      )}

      {phase === "done" && <div className="task-cheer">Trí nhớ con tốt lắm! 🎉</div>}
    </div>
  );
}
