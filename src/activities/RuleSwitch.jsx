import React, { useState, useMemo, useRef } from "react";
import { shuffle, SHAPES, SHAPE_COLORS } from "../lib/game";
import { getLevelConfig } from "../lib/levels";
import { playCorrect, playWrong } from "../lib/sound";
import Shape from "../components/Shape";

/* Đổi luật (set-shifting): hiện 1 hình mẫu có MÀU + DẠNG. Luật đổi qua lại
   "theo MÀU" / "theo HÌNH". Bé chọn ô khớp mẫu theo luật đang hiệu lực.
   Rèn linh hoạt nhận thức (cognitive flexibility). */
export default function RuleSwitch({ onDone, level = 1 }) {
  const cfg = getLevelConfig("shift", level);

  const [phase, setPhase] = useState("intro"); // intro | playing | done
  const [trial, setTrial] = useState(0);
  const [picked, setPicked] = useState(null);
  const correctRef = useRef(0);

  // luật của lượt t: đổi sau mỗi switchEvery lượt, bắt đầu bằng "color"
  const ruleOf = (t) =>
    Math.floor(t / cfg.switchEvery) % 2 === 0 ? "color" : "shape";

  const data = useMemo(() => {
    const colors = shuffle(SHAPE_COLORS);
    const shapes = shuffle(SHAPES);
    const target = { color: colors[0], shape: shapes[0].key };
    const colorMatch = { color: colors[0], shape: shapes[1].key }; // cùng màu, khác dạng
    const shapeMatch = { color: colors[1], shape: shapes[0].key }; // khác màu, cùng dạng
    const both = { color: colors[2], shape: shapes[2].key }; // khác cả hai
    const opts = cfg.options >= 3 ? [colorMatch, shapeMatch, both] : [colorMatch, shapeMatch];
    const rule = ruleOf(trial);
    return {
      target,
      rule,
      options: shuffle(opts),
      correct: rule === "color" ? colorMatch : shapeMatch,
    };
  }, [trial]);

  const choose = (opt) => {
    if (picked) return;
    setPicked(opt);
    const ok = opt === data.correct;
    if (ok) {
      correctRef.current += 1;
      playCorrect();
    } else {
      playWrong();
    }
    setTimeout(() => {
      if (trial + 1 >= cfg.trials) {
        setPhase("done");
        const score = Math.round((correctRef.current / cfg.trials) * 100);
        setTimeout(() => onDone(score), 800);
      } else {
        setPicked(null);
        setTrial(trial + 1);
      }
    }, 750);
  };

  if (phase === "intro") {
    return (
      <div className="task-body">
        <div className="gng-intro">
          <p className="task-instruction">
            Nhìn hình mẫu ở trên. Khi luật nói <b>"theo MÀU"</b> thì chọn ô <b>cùng màu</b>;
            khi nói <b>"theo HÌNH"</b> thì chọn ô <b>cùng dạng</b>. Luật sẽ đổi nên chú ý nhé! 🔀
          </p>
          <button className="big-play small" onClick={() => setPhase("playing")}>
            Bắt đầu! ▶
          </button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="task-body">
        <div className="task-cheer">Con đổi luật rất nhanh! 🎉</div>
      </div>
    );
  }

  return (
    <div className="task-body">
      <p className="gng-progress">Lượt {trial + 1}/{cfg.trials}</p>

      <div className={`rule-banner ${data.rule === "color" ? "rb-color" : "rb-shape"}`}>
        {data.rule === "color" ? "Phân loại theo MÀU 🎨" : "Phân loại theo HÌNH 🔷"}
      </div>

      <div className="shift-target">
        <span className="shift-label">Mẫu</span>
        <Shape shape={data.target.shape} color={data.target.color} size={84} />
      </div>

      <div className="shift-options">
        {data.options.map((o, i) => {
          const isPicked = picked === o;
          const state = isPicked ? (o === data.correct ? "opt-right" : "opt-wrong") : "";
          return (
            <button key={i} className={`shift-opt ${state}`} onClick={() => choose(o)}>
              <Shape shape={o.shape} color={o.color} size={72} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
