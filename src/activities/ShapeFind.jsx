import React, { useState, useMemo, useEffect } from "react";
import { rnd, shuffle, SHAPES, SHAPE_COLORS } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playCorrect, playWrong } from "../lib/sound";
import Shape from "../components/Shape";

/* Hình học: nhận biết hình theo tên, hoặc đếm số cạnh (cấp cao). Chuẩn K.G. */
export default function ShapeFind({ onDone, level = 1 }) {
  const cfg = getLevelConfig("shapes", level);

  const data = useMemo(() => {
    const colors = shuffle(SHAPE_COLORS);

    if (cfg.sides) {
      // đếm số cạnh — chỉ dùng hình có số cạnh rõ ràng (tam giác/vuông/chữ nhật)
      const withSides = SHAPES.filter((s) => s.sides != null);
      const target = withSides[rnd(0, withSides.length - 1)];
      const opts = new Set([target.sides]);
      let guard = 0;
      while (opts.size < cfg.options && guard < 30) {
        guard++;
        const cand = target.sides + rnd(-2, 2);
        if (cand >= 3 && cand <= 6) opts.add(cand);
      }
      return {
        sides: true,
        target,
        color: colors[0],
        question: `Hình ${target.name} này có mấy cạnh? 🔢`,
        options: shuffle([...opts]).map((n) => ({ val: n, num: n })),
        answer: target.sides,
      };
    }

    // nhận biết theo tên
    const pool = shuffle(SHAPES.slice(0, cfg.shapesN));
    const chosen = pool.slice(0, cfg.options);
    const target = chosen[0];
    return {
      sides: false,
      question: `Đâu là hình ${target.name}? 🔷`,
      options: shuffle(
        chosen.map((s, i) => ({ val: s.key, shape: s.key, color: colors[i % colors.length] }))
      ),
      answer: target.key,
    };
  }, [level]);

  const [picked, setPicked] = useState(null);
  const correct = picked === data.answer;

  useEffect(() => {
    if (correct) {
      const t = setTimeout(() => onDone(100), 700);
      return () => clearTimeout(t);
    }
  }, [correct]);

  const choose = (val) => {
    if (correct) return;
    setPicked(val);
    (val === data.answer ? playCorrect : playWrong)();
  };

  return (
    <div className="task-body">
      <p className="task-instruction">{data.question}</p>

      {data.sides ? (
        <>
          <div className="shape-single">
            <Shape shape={data.target.key} color={data.color} size={120} />
          </div>
          <div className="opt-row">
            {data.options.map((o) => (
              <button
                key={o.val}
                className={`opt-btn ${
                  picked === o.val ? (correct ? "opt-right" : "opt-wrong") : ""
                }`}
                onClick={() => choose(o.val)}
              >
                {o.num}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="shape-options">
          {data.options.map((o) => (
            <button
              key={o.val}
              className={`shape-opt ${
                picked === o.val ? (correct ? "opt-right" : "opt-wrong") : ""
              }`}
              onClick={() => choose(o.val)}
            >
              <Shape shape={o.shape} color={o.color} size={76} />
            </button>
          ))}
        </div>
      )}

      {correct && <div className="task-cheer">Đúng rồi! Con giỏi hình học quá! 🎉</div>}
      {picked !== null && !correct && (
        <div className="task-hint">Chưa đúng, thử lại nha! 👀</div>
      )}
    </div>
  );
}
