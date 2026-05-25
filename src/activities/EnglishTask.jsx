import React, { useState, useMemo, useEffect } from "react";
import { rnd, shuffle, ENGLISH_WORDS, ALPHABET } from "../lib/game";
import { getLevelConfig } from "../lib/levels";

export default function EnglishTask({ onDone, level = 1 }) {
  const cfg = getLevelConfig("english", level);

  const data = useMemo(() => {
    const mode = cfg.mode;

    if (mode === "letter") {
      // Cho chữ cái, chọn đúng chữ đó trong 3 lựa chọn (rèn nhận mặt chữ)
      const letters = shuffle(ALPHABET).slice(0, 3);
      const target = letters[0];
      return {
        mode,
        prompt: target,
        promptKind: "bigletter",
        question: "Đây là chữ gì? Chạm vào chữ giống hệt nhé!",
        options: shuffle(letters).map((l) => ({ label: l, val: l })),
        answer: target,
      };
    }

    if (mode === "case") {
      // Cho chữ HOA, chọn chữ thường tương ứng
      const picks = shuffle(ALPHABET).slice(0, 3);
      const target = picks[0];
      return {
        mode,
        prompt: target,
        promptKind: "bigletter",
        question: `Chữ thường của "${target}" là chữ nào?`,
        options: shuffle(picks).map((l) => ({
          label: l.toLowerCase(),
          val: l,
        })),
        answer: target,
      };
    }

    if (mode === "pic2word") {
      // Cho hình, chọn từ đúng
      const picks = shuffle(ENGLISH_WORDS).slice(0, 3);
      const target = picks[0];
      return {
        mode,
        prompt: target.emoji,
        promptKind: "bigemoji",
        question: "Đây là con/vật gì? Chọn từ tiếng Anh đúng nhé!",
        options: shuffle(picks).map((w) => ({ label: w.word, val: w.word })),
        answer: target.word,
      };
    }

    // word2pic: cho từ, chọn hình đúng
    const picks = shuffle(ENGLISH_WORDS).slice(0, 3);
    const target = picks[0];
    return {
      mode,
      prompt: target.word,
      promptKind: "bigword",
      question: "Đọc từ này và chọn hình đúng nhé!",
      options: shuffle(picks).map((w) => ({ label: w.emoji, val: w.word })),
      answer: target.word,
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

  return (
    <div className="task-body">
      <p className="task-instruction">{data.question}</p>

      <div className="en-prompt">
        <span className={`en-${data.promptKind}`}>{data.prompt}</span>
      </div>

      <div className={`en-options ${data.promptKind === "bigword" ? "wide" : ""}`}>
        {data.options.map((o, i) => (
          <button
            key={i}
            className={`en-opt ${
              picked === o.val
                ? correct
                  ? "en-right"
                  : "en-wrong"
                : ""
            } ${o.label.length === 1 || data.mode.includes("pic") || data.mode === "word2pic" ? "" : "en-opt-word"}`}
            onClick={() => setPicked(o.val)}
          >
            {o.label}
          </button>
        ))}
      </div>

      {correct && <div className="task-cheer">Giỏi quá! Great job! 🎉</div>}
      {picked !== null && !correct && (
        <div className="task-hint">Thử lại nha! Try again! 💪</div>
      )}
    </div>
  );
}
