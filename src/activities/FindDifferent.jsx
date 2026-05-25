import React, { useState, useMemo, useEffect } from "react";
import { rnd, shuffle, EMOJI } from "../lib/game";
import { getLevelConfig } from "../lib/levels";

export default function FindDifferent({ onDone, level = 2 }) {
  const cfg = getLevelConfig("find", level);

  const data = useMemo(() => {
    const pool = shuffle(Object.values(EMOJI).flat());
    const main = pool[0];
    // cấp cao: chọn vật "gần giống" để tăng nhiễu
    const odd = pool[1];
    const total = cfg.cells;
    const oddIndex = rnd(0, total - 1);
    const grid = Array.from({ length: total }, (_, i) =>
      i === oddIndex ? odd : main
    );
    return { grid, oddIndex, total };
  }, [level]);

  const [picked, setPicked] = useState(null);
  const correct = picked === data.oddIndex;

  useEffect(() => {
    if (correct) {
      const t = setTimeout(() => onDone(100), 700);
      return () => clearTimeout(t);
    }
  }, [correct]);

  const cols = data.total <= 9 ? 3 : 4;

  return (
    <div className="task-body">
      <p className="task-instruction">
        Có một bạn khác với những bạn còn lại. Con tìm ra bạn đó nhé! 🔍
      </p>
      <div
        className="find-grid"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {data.grid.map((e, i) => (
          <button
            key={i}
            className={`find-cell ${
              picked === i ? (correct ? "find-right" : "find-wrong") : ""
            }`}
            onClick={() => setPicked(i)}
          >
            {e}
          </button>
        ))}
      </div>
      {correct && <div className="task-cheer">Mắt con tinh thật! 🎉</div>}
      {picked !== null && !correct && (
        <div className="task-hint">Chưa đúng, nhìn kỹ lại nha! 👀</div>
      )}
    </div>
  );
}
