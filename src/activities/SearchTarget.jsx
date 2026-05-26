import React, { useState, useMemo, useEffect } from "react";
import { rnd, shuffle, EMOJI } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playTap, playCorrect, playWrong } from "../lib/sound";

/* Tìm giữa nhiễu: tìm TẤT CẢ các mục tiêu (vd 🍎) lẫn giữa nhiều thứ gây nhiễu.
   Rèn chú ý chọn lọc. */
export default function SearchTarget({ onDone, level = 1 }) {
  const cfg = getLevelConfig("search", level);

  const data = useMemo(() => {
    const pool = shuffle(Object.values(EMOJI).flat());
    const target = pool[0];
    const distractorPool = pool.slice(1);
    const total = cfg.cells;
    const nTargets = cfg.targets;

    // vị trí ngẫu nhiên cho mục tiêu
    const positions = shuffle(Array.from({ length: total }, (_, i) => i));
    const targetPos = new Set(positions.slice(0, nTargets));

    const grid = Array.from({ length: total }, (_, i) =>
      targetPos.has(i) ? target : distractorPool[rnd(0, distractorPool.length - 1)]
    );
    return { target, grid, targetPos, nTargets };
  }, [level]);

  const [found, setFound] = useState(new Set());
  const [wrong, setWrong] = useState(null);

  const done = found.size === data.nTargets;

  useEffect(() => {
    if (done) {
      playCorrect();
      const t = setTimeout(() => onDone(100), 700);
      return () => clearTimeout(t);
    }
  }, [done]);

  const tap = (i) => {
    if (data.targetPos.has(i)) {
      playTap();
      setFound((prev) => new Set(prev).add(i));
    } else {
      playWrong();
      setWrong(i);
      setTimeout(() => setWrong(null), 400);
    }
  };

  const cols = data.grid.length <= 12 ? 4 : data.grid.length <= 20 ? 5 : 5;

  return (
    <div className="task-body">
      <p className="task-instruction">
        Tìm tất cả <span className="srch-target">{data.target}</span>{" "}
        {data.nTargets > 1 ? `(có ${data.nTargets} bạn)` : ""} trong hình nhé! 🎯
      </p>
      <p className="srch-count">
        Đã tìm: {found.size}/{data.nTargets}
      </p>
      <div className="find-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {data.grid.map((e, i) => (
          <button
            key={i}
            className={`find-cell srch-cell ${found.has(i) ? "find-right" : ""} ${
              wrong === i ? "find-wrong" : ""
            }`}
            onClick={() => tap(i)}
            disabled={found.has(i)}
          >
            {e}
          </button>
        ))}
      </div>
      {done && <div className="task-cheer">Con tìm hết rồi! Mắt tinh quá! 🎉</div>}
    </div>
  );
}
