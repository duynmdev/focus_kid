import React, { useState, useMemo, useEffect } from "react";
import { rnd, shuffle } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playTap, playCorrect, playWrong } from "../lib/sound";

export default function ConnectDots({ onDone, level = 1 }) {
  const cfg = getLevelConfig("dots", level);
  const count = cfg.count;

  const points = useMemo(() => {
    // bố trí lưới đủ rộng cho số lượng điểm
    const cols = count <= 8 ? 4 : count <= 12 ? 4 : 5;
    const rows = Math.ceil(count / cols);
    const cells = shuffle(
      Array.from({ length: cols * rows }, (_, i) => i)
    ).slice(0, count);
    const colW = 90 / cols;
    const rowH = 78 / rows;
    const pts = cells.map((cell, idx) => {
      const cx = cell % cols;
      const cy = Math.floor(cell / cols);
      return {
        n: idx + 1,
        x: 8 + cx * colW + rnd(-3, 3) + colW / 2 - 6,
        y: 14 + cy * rowH + rnd(-3, 3),
      };
    });
    return pts.sort((a, b) => a.n - b.n);
  }, [level]);

  const [next, setNext] = useState(1);
  const [wrong, setWrong] = useState(null);
  const done = next > count;

  useEffect(() => {
    if (done) {
      playCorrect();
      const t = setTimeout(() => onDone(100), 700);
      return () => clearTimeout(t);
    }
  }, [done]);

  const handle = (n) => {
    if (n === next) {
      playTap();
      setNext((p) => p + 1);
      setWrong(null);
    } else if (n > next) {
      playWrong();
      setWrong(n);
      setTimeout(() => setWrong(null), 500);
    }
  };

  const linePath = points
    .filter((p) => p.n < next)
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <div className="task-body">
      <p className="task-instruction">
        Chạm vào các số theo thứ tự từ <b>1</b> đến <b>{count}</b> nhé! 🖐️
      </p>
      <div className="dots-stage">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="dots-svg">
          {linePath && (
            <polyline
              points={linePath}
              fill="none"
              stroke="var(--c-accent)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2 1.5"
            />
          )}
        </svg>
        {points.map((p) => {
          const reached = p.n < next;
          const isNext = p.n === next;
          return (
            <button
              key={p.n}
              className={`dot ${count > 12 ? "dot-sm" : ""} ${
                reached ? "dot-on" : ""
              } ${isNext ? "dot-next" : ""} ${wrong === p.n ? "dot-wrong" : ""}`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              onClick={() => handle(p.n)}
            >
              {p.n}
            </button>
          );
        })}
      </div>
      {done && <div className="task-cheer">Tuyệt vời! Con nối đúng hết rồi! 🎉</div>}
    </div>
  );
}
