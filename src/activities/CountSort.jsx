import React, { useState, useMemo, useEffect } from "react";
import { rnd, shuffle, EMOJI } from "../lib/game";
import { getLevelConfig } from "../lib/levels";

export default function CountSort({ onDone, level = 2 }) {
  const cfg = getLevelConfig("count", level);

  const data = useMemo(() => {
    const set = shuffle(EMOJI.fruits).slice(0, 2);

    if (cfg.compare) {
      // dạng so sánh: nhóm nào nhiều hơn?
      let n1 = rnd(2, cfg.max);
      let n2 = rnd(2, cfg.max);
      while (n1 === n2) n2 = rnd(2, cfg.max);
      return {
        compare: true,
        groups: [
          { emoji: set[0], n: n1 },
          { emoji: set[1], n: n2 },
        ],
        answer: n1 > n2 ? 0 : 1,
      };
    }

    // dạng đếm
    const target = set[0];
    const targetCount = rnd(2, cfg.max);
    const otherCount = rnd(2, cfg.max);
    const items = shuffle([
      ...Array(targetCount).fill(target),
      ...Array(otherCount).fill(set[1]),
    ]);
    const opts = new Set([targetCount]);
    let guard = 0;
    while (opts.size < 3 && guard < 50) {
      guard++;
      const cand = targetCount + rnd(-2, 2);
      if (cand >= 1 && cand <= cfg.max) opts.add(cand);
    }
    return {
      compare: false,
      target,
      targetCount,
      items,
      options: shuffle([...opts]),
    };
  }, [level]);

  const [picked, setPicked] = useState(null);
  const correct = data.compare
    ? picked === data.answer
    : picked === data.targetCount;

  useEffect(() => {
    if (correct) {
      const t = setTimeout(() => onDone(100), 700);
      return () => clearTimeout(t);
    }
  }, [correct]);

  if (data.compare) {
    return (
      <div className="task-body">
        <p className="task-instruction">Nhóm nào có NHIỀU hơn? Chạm vào nhóm đó nhé! 👀</p>
        <div className="compare-row">
          {data.groups.map((g, i) => (
            <button
              key={i}
              className={`compare-group ${
                picked === i ? (correct ? "cg-right" : "cg-wrong") : ""
              }`}
              onClick={() => setPicked(i)}
            >
              <div className="cg-items">
                {Array(g.n)
                  .fill(g.emoji)
                  .map((e, j) => (
                    <span key={j}>{e}</span>
                  ))}
              </div>
            </button>
          ))}
        </div>
        {correct && <div className="task-cheer">Đúng rồi! Con so sánh giỏi quá! 🎉</div>}
        {picked !== null && !correct && (
          <div className="task-hint">Đếm từng nhóm rồi so sánh nha! 👀</div>
        )}
      </div>
    );
  }

  return (
    <div className="task-body">
      <p className="task-instruction">
        Đếm xem có bao nhiêu quả {data.target} trong hình nhé!
      </p>
      <div className="count-stage">
        {data.items.map((e, i) => (
          <span key={i} className="count-item">{e}</span>
        ))}
      </div>
      <div className="opt-row">
        {data.options.map((o) => (
          <button
            key={o}
            className={`opt-btn ${
              picked === o ? (correct ? "opt-right" : "opt-wrong") : ""
            }`}
            onClick={() => setPicked(o)}
          >
            {o}
          </button>
        ))}
      </div>
      {correct && <div className="task-cheer">Đếm giỏi quá! 🎉</div>}
      {picked !== null && !correct && (
        <div className="task-hint">Thử đếm lại lần nữa nha! 👀</div>
      )}
    </div>
  );
}
