import React, { useState, useMemo, useRef, useEffect } from "react";
import { shuffle, EMOJI } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playTap, playCorrect, playWrong } from "../lib/sound";

/* Ghép đôi: lật 2 ô tìm cặp giống nhau cho tới khi hết. Rèn trí nhớ vị trí. */
export default function MemoryPairs({ onDone, level = 2 }) {
  const cfg = getLevelConfig("pairs", level);

  const cards = useMemo(() => {
    const pool = shuffle(Object.values(EMOJI).flat()).slice(0, cfg.pairs);
    return shuffle([...pool, ...pool]).map((emoji, i) => ({ id: i, emoji }));
  }, [level]);

  const [flipped, setFlipped] = useState([]); // chỉ số đang lật (chưa khớp)
  const [matched, setMatched] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const wrongRef = useRef(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  const done = matched.size === cards.length && cards.length > 0;
  useEffect(() => {
    if (done) {
      playCorrect();
      const score = Math.max(40, Math.round(100 - (wrongRef.current / cfg.pairs) * 60));
      const t = setTimeout(() => onDone(score), 800);
      timers.current.push(t);
    }
  }, [done]);

  const handle = (i) => {
    if (busy || flipped.includes(i) || matched.has(i)) return;
    playTap();
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length < 2) return;

    setBusy(true);
    const [a, b] = nf;
    if (cards[a].emoji === cards[b].emoji) {
      const t = setTimeout(() => {
        setMatched((prev) => new Set(prev).add(a).add(b));
        setFlipped([]);
        setBusy(false);
      }, 550);
      timers.current.push(t);
    } else {
      wrongRef.current += 1;
      playWrong();
      const t = setTimeout(() => {
        setFlipped([]);
        setBusy(false);
      }, 950);
      timers.current.push(t);
    }
  };

  const cols = cards.length <= 6 ? 3 : cards.length <= 12 ? 4 : 4;

  return (
    <div className="task-body">
      <p className="task-instruction">
        Lật hai ô tìm cặp giống nhau nhé! Nhớ vị trí cho giỏi 🧠
      </p>
      <div className="pairs-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cards.map((c, i) => {
          const open = flipped.includes(i) || matched.has(i);
          return (
            <button
              key={c.id}
              className={`pair-card ${open ? "open" : ""} ${matched.has(i) ? "done" : ""}`}
              onClick={() => handle(i)}
              disabled={open || busy}
            >
              <span className="pair-face">{open ? c.emoji : "❓"}</span>
            </button>
          );
        })}
      </div>
      {done && <div className="task-cheer">Con tìm hết các cặp rồi! 🎉</div>}
    </div>
  );
}
