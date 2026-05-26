import React, { useState, useRef, useEffect } from "react";
import { rnd } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playPad, playCorrect, playWrong } from "../lib/sound";

/* Nhớ chuỗi (Simon): các ô sáng theo chuỗi + nốt nhạc, bé lặp lại đúng thứ tự.
   Chuỗi dài dần mỗi lần đúng; sai 1 bước là dừng. Rèn trí nhớ làm việc + chú ý duy trì. */
const PAD_COLORS = ["#4ea8de", "#52c97a", "#ffb13c", "#ff85a1"];

export default function SequenceMemory({ onDone, level = 1 }) {
  const cfg = getLevelConfig("sequence", level);

  const [phase, setPhase] = useState("intro"); // intro | show | input | done
  const [seq, setSeq] = useState([]);
  const [activePad, setActivePad] = useState(null);
  const [inputIdx, setInputIdx] = useState(0);

  const timers = useRef([]);
  const completedRef = useRef(0); // độ dài chuỗi dài nhất bé lặp đúng

  const clearTimers = () => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => () => clearTimers(), []);

  const start = () => {
    completedRef.current = 0;
    const first = Array.from({ length: cfg.start }, () => rnd(0, 3));
    setSeq(first);
    showSeq(first);
  };

  const showSeq = (s) => {
    setPhase("show");
    setActivePad(null);
    clearTimers();
    s.forEach((pad, i) => {
      const onT = setTimeout(() => {
        setActivePad(pad);
        playPad(pad);
      }, i * cfg.flashMs + 450);
      const offT = setTimeout(
        () => setActivePad(null),
        i * cfg.flashMs + 450 + cfg.flashMs * 0.6
      );
      timers.current.push(onT, offT);
    });
    const endT = setTimeout(() => {
      setPhase("input");
      setInputIdx(0);
    }, s.length * cfg.flashMs + 550);
    timers.current.push(endT);
  };

  const flash = (pad) => {
    setActivePad(pad);
    const t = setTimeout(() => setActivePad(null), 200);
    timers.current.push(t);
  };

  const handlePad = (pad) => {
    if (phase !== "input") return;
    playPad(pad);
    flash(pad);

    if (pad !== seq[inputIdx]) {
      playWrong();
      finish();
      return;
    }

    if (inputIdx + 1 >= seq.length) {
      // lặp đúng cả chuỗi
      completedRef.current = seq.length;
      playCorrect();
      if (seq.length >= cfg.target) {
        finish(true);
        return;
      }
      const next = [...seq, rnd(0, 3)];
      const t = setTimeout(() => {
        setSeq(next);
        showSeq(next);
      }, 800);
      timers.current.push(t);
    } else {
      setInputIdx(inputIdx + 1);
    }
  };

  const finish = () => {
    setPhase("done");
    clearTimers();
    const total = cfg.target - cfg.start + 1;
    const passed = Math.max(0, completedRef.current - cfg.start + 1);
    const score = Math.max(0, Math.min(100, Math.round((passed / total) * 100)));
    setTimeout(() => onDone(score), 800);
  };

  return (
    <div className="task-body">
      {phase === "intro" && (
        <div className="gng-intro">
          <p className="task-instruction">
            Các ô sẽ sáng lên theo thứ tự 🎵<br />
            Con nhìn kỹ rồi <b>chạm lại đúng thứ tự</b> nhé!
          </p>
          <button className="big-play small" onClick={start}>
            Bắt đầu! ▶
          </button>
        </div>
      )}

      {phase !== "intro" && phase !== "done" && (
        <>
          <p className="gng-progress">
            {phase === "show" ? "Nhìn kỹ nhé… 👀" : "Tới lượt con! 👆"} &nbsp;•&nbsp;
            Chuỗi: {seq.length}
          </p>
          <div className="seq-grid">
            {PAD_COLORS.map((c, i) => (
              <button
                key={i}
                className={`seq-pad ${activePad === i ? "on" : ""}`}
                style={{ background: c }}
                disabled={phase !== "input"}
                onClick={() => handlePad(i)}
                aria-label={`Ô ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {phase === "done" && <div className="task-cheer">Trí nhớ con tuyệt vời! 🎉</div>}
    </div>
  );
}
