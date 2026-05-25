import React, { useState, useEffect, useRef } from "react";
import { getLevelConfig } from "../lib/levels";

/* Bấm theo nhịp: ngôi sao sáng lên đều đặn, bé bấm đúng lúc nó sáng.
   Rèn chú ý duy trì (giữ tập trung đều trong thời gian dài). */
export default function RhythmTap({ onDone, level = 1 }) {
  const cfg = getLevelConfig("rhythm", level);

  const [phase, setPhase] = useState("intro"); // intro | playing | done
  const [tapIndex, setTapIndex] = useState(0);
  const [active, setActive] = useState(false);
  const [hits, setHits] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const windowRef = useRef(false); // đang trong cửa sổ cho phép bấm
  const tappedRef = useRef(false);
  const timersRef = useRef([]);

  const clearTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const start = () => {
    setPhase("playing");
    setTapIndex(0);
    setHits(0);
    runBeat(0, 0);
  };

  const runBeat = (i, currentHits) => {
    if (i >= cfg.taps) {
      finish(currentHits);
      return;
    }
    setTapIndex(i + 1);
    tappedRef.current = false;

    // sao sáng lên
    const onMs = Math.min(700, cfg.intervalMs * 0.55);
    setActive(true);
    windowRef.current = true;

    const t1 = setTimeout(() => {
      setActive(false);
      windowRef.current = false;
      // nếu chưa bấm trong cửa sổ -> bỏ lỡ
    }, onMs);

    const t2 = setTimeout(() => {
      runBeat(i + 1, hitsRef.current);
    }, cfg.intervalMs);

    timersRef.current.push(t1, t2);
  };

  // dùng ref để giữ hits mới nhất trong closure
  const hitsRef = useRef(0);
  useEffect(() => {
    hitsRef.current = hits;
  }, [hits]);

  const tap = () => {
    if (phase !== "playing") return;
    if (windowRef.current && !tappedRef.current) {
      tappedRef.current = true;
      setHits((h) => h + 1);
      setFeedback("good");
      setTimeout(() => setFeedback(null), 250);
    } else if (!windowRef.current) {
      // bấm sai lúc (chưa sáng) -> nhấp nháy báo
      setFeedback("early");
      setTimeout(() => setFeedback(null), 250);
    }
  };

  const finish = (finalHits) => {
    setPhase("done");
    const pct = Math.round((finalHits / cfg.taps) * 100);
    clearTimers();
    setTimeout(() => onDone(pct), 800);
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
          <button className="big-play small" onClick={start}>
            Bắt đầu! ▶
          </button>
        </div>
      )}

      {phase === "playing" && (
        <>
          <p className="gng-progress">
            Nhịp {tapIndex}/{cfg.taps} &nbsp;•&nbsp; Trúng: {hits}
          </p>
          <button
            className={`rhythm-star ${active ? "rs-on" : ""} ${
              feedback === "good" ? "rs-good" : feedback === "early" ? "rs-early" : ""
            }`}
            onClick={tap}
          >
            ⭐
          </button>
          <p className="gng-hint">Chạm khi sao sáng!</p>
        </>
      )}

      {phase === "done" && <div className="task-cheer">Con chú ý rất bền! 🎉</div>}
    </div>
  );
}
