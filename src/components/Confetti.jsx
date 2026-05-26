import React, { useMemo } from "react";

/* Confetti ăn mừng — tự viết bằng DOM + CSS, không dùng thư viện ngoài.
   Mỗi mảnh rơi từ trên xuống với vị trí/màu/độ trễ ngẫu nhiên. Parent tự gỡ
   khỏi DOM sau ~2.5s (xem cách dùng ở Result trong App.jsx). */
const COLORS = ["#ff7a59", "#ffb13c", "#4ea8de", "#52c97a", "#ff85a1", "#9b6dff"];
const EMOJIS = ["🎉", "⭐", "🎊", "✨", "🌟"];

export default function Confetti({ count = 40, emoji = false }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const useEmoji = emoji && Math.random() > 0.45;
        return {
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 0.7,
          dur: 1.8 + Math.random() * 1.2,
          rot: (Math.random() > 0.5 ? 1 : -1) * (180 + Math.random() * 540),
          color: COLORS[i % COLORS.length],
          shape: EMOJIS[i % EMOJIS.length],
          size: 8 + Math.random() * 8,
          useEmoji,
        };
      }),
    [count, emoji]
  );

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className={`confetti-piece ${p.useEmoji ? "ce-emoji" : ""}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            "--rot": `${p.rot}deg`,
            background: p.useEmoji ? "transparent" : p.color,
            width: p.useEmoji ? "auto" : `${p.size}px`,
            height: p.useEmoji ? "auto" : `${p.size}px`,
          }}
        >
          {p.useEmoji ? p.shape : ""}
        </span>
      ))}
    </div>
  );
}
