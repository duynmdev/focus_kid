import React, { useState, useMemo, useEffect } from "react";
import { generateMaze } from "../lib/game";
import { getLevelConfig } from "../lib/levels";

export default function Maze({ onDone, level = 2 }) {
  const cfg = getLevelConfig("maze", level);

  const { grid, start, end, size } = useMemo(() => {
    const m = generateMaze(cfg.size);
    return { ...m, size: m.grid.length };
  }, [level]);

  const [pos, setPos] = useState(start);
  const [moves, setMoves] = useState(0);
  const done = pos.r === end.r && pos.c === end.c;

  useEffect(() => {
    setPos(start);
    setMoves(0);
  }, [level]);

  useEffect(() => {
    if (done) {
      // điểm dựa trên số bước thừa so với đường ngắn nhất ước lượng
      const ideal = (size - 2) * 2;
      const score = Math.max(60, 100 - Math.max(0, moves - ideal) * 3);
      const t = setTimeout(() => onDone(score), 700);
      return () => clearTimeout(t);
    }
  }, [done]);

  const move = (dr, dc) => {
    if (done) return;
    setPos((p) => {
      const nr = p.r + dr;
      const nc = p.c + dc;
      if (nr < 0 || nc < 0 || nr >= size || nc >= size) return p;
      if (grid[nr][nc] === 1) return p;
      setMoves((m) => m + 1);
      return { r: nr, c: nc };
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();
      if (e.key === "ArrowUp") move(-1, 0);
      if (e.key === "ArrowDown") move(1, 0);
      if (e.key === "ArrowLeft") move(0, -1);
      if (e.key === "ArrowRight") move(0, 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  return (
    <div className="task-body">
      <p className="task-instruction">
        Giúp chú thỏ 🐰 đi tới củ cà rốt 🥕 nhé! Dùng các mũi tên bên dưới (hoặc
        phím mũi tên trên laptop).
      </p>
      <div className="maze-wrap">
        <div
          className="maze"
          style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isPos = pos.r === r && pos.c === c;
              const isEnd = end.r === r && end.c === c;
              return (
                <div
                  key={`${r}-${c}`}
                  className={`maze-cell ${cell === 1 ? "wall" : "path"} ${
                    size > 9 ? "tiny" : ""
                  }`}
                >
                  {isPos ? "🐰" : isEnd ? "🥕" : ""}
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="dpad">
        <button className="dbtn up" onClick={() => move(-1, 0)}>▲</button>
        <button className="dbtn left" onClick={() => move(0, -1)}>◀</button>
        <button className="dbtn right" onClick={() => move(0, 1)}>▶</button>
        <button className="dbtn down" onClick={() => move(1, 0)}>▼</button>
      </div>
      {done && <div className="task-cheer">Thỏ con tới nơi rồi! 🥕🎉</div>}
    </div>
  );
}
