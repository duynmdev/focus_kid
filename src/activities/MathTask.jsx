import React, { useState, useMemo, useEffect } from "react";
import { rnd, shuffle } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playCorrect, playWrong } from "../lib/sound";

export default function MathTask({ onDone, level = 2 }) {
  const cfg = getLevelConfig("math", level);

  const data = useMemo(() => {
    const max = cfg.max;
    const isAdd = Math.random() > 0.5;
    let a, b, res, sign;
    if (isAdd) {
      a = rnd(1, max - 1);
      b = rnd(1, max - a);
      res = a + b;
      sign = "+";
    } else {
      a = rnd(2, max);
      b = rnd(1, a - 1);
      res = a - b;
      sign = "−";
    }

    // Cấp "tìm số còn thiếu": hỏi số bị giấu (a + ? = res)
    const missing = cfg.missing;
    let questionParts;
    let answer;
    if (missing) {
      // giấu b: a + ? = res  (hoặc a − ? = res)
      answer = b;
      questionParts = { a, sign, b: "?", res };
    } else {
      answer = res;
      questionParts = { a, sign, b, res: "?" };
    }

    // tạo 3 đáp án
    const opts = new Set([answer]);
    let guard = 0;
    while (opts.size < 3 && guard < 50) {
      guard++;
      const cand = answer + rnd(-3, 3);
      if (cand >= 0 && cand <= max) opts.add(cand);
    }
    return { ...questionParts, answer, options: shuffle([...opts]), missing };
  }, [level]);

  const [picked, setPicked] = useState(null);
  const correct = picked === data.answer;

  useEffect(() => {
    if (correct) {
      const t = setTimeout(() => onDone(100), 700);
      return () => clearTimeout(t);
    }
  }, [correct]);

  // chỉ hiện chấm tròn minh hoạ ở các cấp số nhỏ (<=10) cho dễ đếm
  const showDots = !data.missing && cfg.max <= 10;
  const dots = (n) => "●".repeat(n);

  return (
    <div className="task-body">
      <p className="task-instruction">
        {data.missing
          ? "Số nào còn thiếu để phép tính đúng? 🤔"
          : "Con tính giúp cô phép tính này nhé! 🧮"}
      </p>
      <div className="math-eq">
        <span className="math-num">{data.a}</span>
        <span className="math-sign">{data.sign}</span>
        <span className={data.b === "?" ? "math-q" : "math-num"}>{data.b}</span>
        <span className="math-sign">=</span>
        <span className={data.res === "?" ? "math-q" : "math-num"}>{data.res}</span>
      </div>
      {showDots && (
        <div className="math-visual">
          <span className="mv-group">{dots(data.a)}</span>
          <span className="mv-op">{data.sign}</span>
          <span className="mv-group">{dots(data.b)}</span>
        </div>
      )}
      <div className="opt-row">
        {data.options.map((o) => (
          <button
            key={o}
            className={`opt-btn ${
              picked === o ? (correct ? "opt-right" : "opt-wrong") : ""
            }`}
            onClick={() => {
              if (correct) return;
              (o === data.answer ? playCorrect : playWrong)();
              setPicked(o);
            }}
          >
            {o}
          </button>
        ))}
      </div>
      {correct && (
        <div className="task-cheer">Chính xác! Con tính giỏi lắm! 🎉</div>
      )}
      {picked !== null && !correct && (
        <div className="task-hint">
          {showDots ? "Đếm các chấm tròn để kiểm tra nha! 👇" : "Thử lại lần nữa nha! 💪"}
        </div>
      )}
    </div>
  );
}
