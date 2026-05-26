import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  shuffle,
  todayKey,
  niceDate,
  AVATARS,
  BADGES,
  computeStats,
  suggestLevelChanges,
} from "./lib/game";
import { LEVELS, DEFAULT_LEVELS, getLevelConfig } from "./lib/levels";
import {
  listChildren,
  addChild,
  renameChild,
  updateChildLevels,
  listSessions,
  addSession,
  isSupabaseConfigured,
} from "./lib/storage";
import {
  isSoundOn,
  toggleSound,
  subscribe as subscribeSound,
  playTap,
  playComplete,
  playStar,
  playLevelUp,
} from "./lib/sound";

import Confetti from "./components/Confetti";
import ConnectDots from "./activities/ConnectDots";
import Maze from "./activities/Maze";
import CountSort from "./activities/CountSort";
import FindDifferent from "./activities/FindDifferent";
import MathTask from "./activities/MathTask";
import EnglishTask from "./activities/EnglishTask";
import MemoryFind from "./activities/MemoryFind";
import GoNoGo from "./activities/GoNoGo";
import SearchTarget from "./activities/SearchTarget";
import RhythmTap from "./activities/RhythmTap";
import SequenceMemory from "./activities/SequenceMemory";
import RuleSwitch from "./activities/RuleSwitch";
import MemoryPairs from "./activities/MemoryPairs";
import ShapeFind from "./activities/ShapeFind";

/* Định nghĩa các loại hoạt động */
const ACTIVITY_TYPES = {
  // --- Nhóm RÈN TẬP TRUNG (trọng tâm) ---
  memory: { label: "Nhớ rồi tìm", icon: "🧠", Comp: MemoryFind, skill: "Tập trung" },
  gonogo: { label: "Đừng bấm nhầm", icon: "✋", Comp: GoNoGo, skill: "Tập trung" },
  search: { label: "Tìm giữa nhiễu", icon: "🎯", Comp: SearchTarget, skill: "Tập trung" },
  rhythm: { label: "Bấm theo nhịp", icon: "🥁", Comp: RhythmTap, skill: "Tập trung" },
  maze: { label: "Mê cung", icon: "🌀", Comp: Maze, skill: "Tập trung" },
  find: { label: "Tìm khác biệt", icon: "🔍", Comp: FindDifferent, skill: "Quan sát" },
  dots: { label: "Nối số", icon: "🔢", Comp: ConnectDots, skill: "Tập trung" },
  sequence: { label: "Nhớ chuỗi", icon: "🎵", Comp: SequenceMemory, skill: "Tập trung" },
  shift: { label: "Đổi luật", icon: "🔀", Comp: RuleSwitch, skill: "Tập trung" },
  pairs: { label: "Ghép đôi", icon: "🧩", Comp: MemoryPairs, skill: "Tập trung" },
  // --- Nhóm KIẾN THỨC (phụ, đổi gió) ---
  count: { label: "Đếm & so sánh", icon: "🍓", Comp: CountSort, skill: "Quan sát" },
  math: { label: "Phép tính", icon: "🧮", Comp: MathTask, skill: "Tư duy toán" },
  english: { label: "Tiếng Anh", icon: "🔤", Comp: EnglishTask, skill: "Tiếng Anh" },
  shapes: { label: "Hình học", icon: "🔷", Comp: ShapeFind, skill: "Quan sát" },
};

/* Một buổi học: ƯU TIÊN TẬP TRUNG.
   8 hoạt động: 6 trò rèn tập trung + 2 trò kiến thức (đổi gió).
   Chọn ngẫu nhiên để mỗi buổi khác nhau, nhưng giữ đúng tỷ lệ. */
const KNOWLEDGE_POOL = ["math", "count", "english", "shapes"];

function buildSession() {
  // 6 trò tập trung (ngẫu nhiên, ưu tiên 4 trò chuyên biệt mới)
  const core = ["memory", "gonogo", "search", "rhythm"]; // 4 trò chuyên biệt luôn có
  const extraFocus = shuffle(["maze", "find", "dots", "sequence", "shift", "pairs"]).slice(0, 2); // thêm 2 trò
  const knowledge = shuffle(KNOWLEDGE_POOL).slice(0, 2); // 2 trò kiến thức đổi gió

  // xen kẽ: tập trung nhiều, thỉnh thoảng chèn kiến thức
  const focus = shuffle([...core, ...extraFocus]); // 6 trò
  const result = [];
  let ki = 0;
  focus.forEach((f, idx) => {
    result.push(f);
    // chèn 1 trò kiến thức sau vị trí thứ 2 và thứ 4
    if ((idx === 1 || idx === 3) && ki < knowledge.length) {
      result.push(knowledge[ki++]);
    }
  });
  while (ki < knowledge.length) result.push(knowledge[ki++]);

  return result.map((k, i) => ({ id: i, typeKey: k, type: ACTIVITY_TYPES[k] }));
}

const maxLevelOf = Object.fromEntries(
  Object.entries(LEVELS).map(([k, v]) => [k, v.maxLevel])
);

export default function App() {
  const [screen, setScreen] = useState("loading");
  const [children, setChildren] = useState([]);
  const [currentChild, setCurrentChild] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);

  const [session, setSession] = useState([]);
  const [step, setStep] = useState(0);
  const [sessionResults, setSessionResults] = useState([]);
  const [lastSaved, setLastSaved] = useState(null);
  const [levelUps, setLevelUps] = useState([]); // thông báo nâng cấp

  // cấp độ hiện tại của bé (object)
  const levels = currentChild?.levels || DEFAULT_LEVELS;

  useEffect(() => {
    (async () => {
      try {
        const list = await listChildren();
        setChildren(list);
        setScreen("picker");
      } catch (e) {
        setError("Không tải được dữ liệu. Kiểm tra cấu hình Supabase.");
        setScreen("picker");
      }
    })();
  }, []);

  const loadSessions = useCallback(async (childId) => {
    try {
      const list = await listSessions(childId);
      setSessions(list);
    } catch {
      setSessions([]);
    }
  }, []);

  const chooseChild = async (child) => {
    // đảm bảo có levels
    const c = { ...child, levels: child.levels || DEFAULT_LEVELS };
    setCurrentChild(c);
    await loadSessions(c.id);
    setScreen("home");
  };

  const stats = useMemo(() => computeStats(sessions), [sessions]);
  const earnedBadges = BADGES.filter((b) => b.need(stats));

  const startSession = () => {
    setSession(buildSession());
    setStep(0);
    setSessionResults([]);
    setLevelUps([]);
    setScreen("session");
  };

  const handleActivityDone = (score) => {
    const act = session[step];
    const entry = { skill: act.type.skill, typeKey: act.typeKey, score };
    const updated = [...sessionResults, entry];
    setSessionResults(updated);
    if (step + 1 < session.length) {
      setStep((s) => s + 1);
    } else {
      finishSession(updated);
    }
  };

  const finishSession = async (results) => {
    const avg = Math.round(
      results.reduce((s, r) => s + r.score, 0) / results.length
    );
    const stars = avg >= 90 ? 3 : avg >= 75 ? 2 : 1;

    const per_skill = {};
    const per_type = {};
    results.forEach((r) => {
      if (!per_skill[r.skill]) per_skill[r.skill] = { sum: 0, n: 0 };
      per_skill[r.skill].sum += r.score;
      per_skill[r.skill].n += 1;
      if (!per_type[r.typeKey]) per_type[r.typeKey] = { sum: 0, n: 0 };
      per_type[r.typeKey].sum += r.score;
      per_type[r.typeKey].n += 1;
    });

    const payload = { date: todayKey(), stars, accuracy: avg, per_skill, per_type };
    setLastSaved({ avg, stars });

    let newSessions = sessions;
    try {
      const saved = await addSession(currentChild.id, payload);
      newSessions = [...sessions, saved];
      setSessions(newSessions);
    } catch {
      // vẫn tiếp tục
    }

    // xét tự nâng cấp dựa trên các buổi gần nhất
    const changes = suggestLevelChanges(newSessions, levels, maxLevelOf);
    if (Object.keys(changes).length > 0) {
      const newLevels = { ...levels, ...changes };
      const ups = [];
      Object.entries(changes).forEach(([type, lv]) => {
        const dir = lv > (levels[type] || 1) ? "up" : "down";
        ups.push({
          type,
          label: ACTIVITY_TYPES[type].label,
          icon: ACTIVITY_TYPES[type].icon,
          dir,
          newLabel: getLevelConfig(type, lv).label,
        });
      });
      setLevelUps(ups);
      try {
        await updateChildLevels(currentChild.id, newLevels);
      } catch {}
      setCurrentChild((c) => ({ ...c, levels: newLevels }));
      setChildren((prev) =>
        prev.map((c) =>
          c.id === currentChild.id ? { ...c, levels: newLevels } : c
        )
      );
    }

    setScreen("result");
  };

  const setLevelManual = async (type, lv) => {
    const newLevels = { ...levels, [type]: lv };
    setCurrentChild((c) => ({ ...c, levels: newLevels }));
    setChildren((prev) =>
      prev.map((c) => (c.id === currentChild.id ? { ...c, levels: newLevels } : c))
    );
    try {
      await updateChildLevels(currentChild.id, newLevels);
    } catch {}
  };

  return (
    <div className="app-root">
      <BgDeco />

      {!isSupabaseConfigured && screen !== "loading" && (
        <div className="ls-banner">
          💾 Đang lưu trên trình duyệt này. Cấu hình Supabase để lưu đám mây &
          dùng nhiều máy.
        </div>
      )}

      {screen === "loading" && (
        <div className="screen center-screen">
          <div className="logo-badge">🎒</div>
          <p className="loading-text">Đang tải…</p>
        </div>
      )}

      {screen === "picker" && (
        <ChildPicker
          children={children}
          error={error}
          onChoose={chooseChild}
          onAdded={(c) => {
            setChildren((prev) => [...prev, c]);
            chooseChild(c);
          }}
        />
      )}

      {screen === "home" && currentChild && (
        <Home
          child={currentChild}
          stats={stats}
          onPlay={startSession}
          onProgress={() => setScreen("progress")}
          onParent={() => setScreen("parent")}
          onSwitch={() => setScreen("picker")}
          onRename={async (name) => {
            await renameChild(currentChild.id, name);
            const updated = { ...currentChild, name };
            setCurrentChild(updated);
            setChildren((prev) =>
              prev.map((c) => (c.id === updated.id ? updated : c))
            );
          }}
        />
      )}

      {screen === "session" && session[step] && (
        <Session
          session={session}
          step={step}
          levels={levels}
          onExit={() => setScreen("home")}
          onDone={handleActivityDone}
        />
      )}

      {screen === "result" && lastSaved && (
        <Result
          result={lastSaved}
          childName={currentChild?.name}
          earnedBadges={earnedBadges}
          levelUps={levelUps}
          onAgain={startSession}
          onHome={() => setScreen("home")}
        />
      )}

      {screen === "progress" && (
        <Progress
          sessions={sessions}
          earnedBadges={earnedBadges}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "parent" && (
        <Parent
          stats={stats}
          sessions={sessions}
          childName={currentChild?.name}
          levels={levels}
          onSetLevel={setLevelManual}
          onBack={() => setScreen("home")}
        />
      )}
    </div>
  );
}

/* ============================================================ ChildPicker */
function ChildPicker({ children, error, onChoose, onAdded }) {
  const [adding, setAdding] = useState(children.length === 0);
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const c = await addChild(name.trim(), avatar, DEFAULT_LEVELS);
      onAdded(c);
    } catch {
      setBusy(false);
    }
  };

  return (
    <div className="screen picker">
      <header className="home-head">
        <SoundToggle />
        <div className="logo-badge">🎒</div>
        <h1 className="title">Bé Vào Lớp 1</h1>
        <p className="subtitle">Ai sẽ học hôm nay?</p>
      </header>

      {error && <div className="error-box">{error}</div>}

      {!adding && (
        <>
          <div className="child-list">
            {children.map((c) => (
              <button key={c.id} className="child-card" onClick={() => { playTap(); onChoose(c); }}>
                <span className="cc-avatar">{c.avatar}</span>
                <span className="cc-name">{c.name}</span>
              </button>
            ))}
          </div>
          <button className="ghost-btn wide" onClick={() => setAdding(true)}>
            ➕ Thêm bé mới
          </button>
        </>
      )}

      {adding && (
        <div className="add-child">
          <p className="ac-label">Tên của bé:</p>
          <input
            className="name-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ví dụ: Bi"
            maxLength={16}
            autoFocus
          />
          <p className="ac-label">Chọn con vật yêu thích:</p>
          <div className="avatar-grid">
            {AVATARS.map((a) => (
              <button
                key={a}
                className={`avatar-opt ${avatar === a ? "sel" : ""}`}
                onClick={() => setAvatar(a)}
              >
                {a}
              </button>
            ))}
          </div>
          <button className="big-play small" disabled={busy} onClick={submit}>
            {busy ? "Đang lưu…" : "Bắt đầu! 🚀"}
          </button>
          {children.length > 0 && (
            <button className="text-link" onClick={() => setAdding(false)}>
              ← Quay lại danh sách
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ============================================================ Home */
function Home({ child, stats, onPlay, onProgress, onParent, onSwitch, onRename }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(child.name);
  const levels = child.levels || DEFAULT_LEVELS;

  return (
    <div className="screen home">
      <header className="home-head">
        <SoundToggle />
        <button className="switch-btn" onClick={onSwitch}>🔄 Đổi bé</button>
        <div className="big-avatar">{child.avatar}</div>
        {editing ? (
          <div className="name-edit">
            <input
              className="name-input small"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              autoFocus
            />
            <button
              className="mini-btn"
              onClick={() => {
                onRename(name.trim() || child.name);
                setEditing(false);
              }}
            >
              Lưu ✓
            </button>
          </div>
        ) : (
          <h1 className="title small" onClick={() => setEditing(true)}>
            {child.name} 👋
          </h1>
        )}
        <p className="subtitle">Cùng rèn luyện sự tập trung nào!</p>
      </header>

      <div className="quick-stats">
        <div className="qstat">
          <span className="qs-num">{stats.totalStars}</span>
          <span className="qs-lbl">⭐ Ngôi sao</span>
        </div>
        <div className="qstat">
          <span className="qs-num">{stats.totalSessions}</span>
          <span className="qs-lbl">📚 Buổi học</span>
        </div>
        <div className="qstat">
          <span className="qs-num">{stats.streak}</span>
          <span className="qs-lbl">🔥 Chuỗi ngày</span>
        </div>
      </div>

      <button className="big-play" onClick={() => { playTap(); onPlay(); }}>
        <span className="bp-icon">▶</span>
        Bắt đầu buổi học hôm nay
      </button>

      <div className="home-nav">
        <button className="nav-card" onClick={() => { playTap(); onProgress(); }}>
          <span className="nc-icon">📈</span>
          <span>Tiến bộ của bé</span>
        </button>
        <button className="nav-card" onClick={() => { playTap(); onParent(); }}>
          <span className="nc-icon">👨‍👩‍👧</span>
          <span>Góc phụ huynh</span>
        </button>
      </div>

      <div className="activity-preview">
        <p className="ap-title">🎯 Trọng tâm: rèn tập trung</p>
        <div className="ap-row">
          {["memory", "gonogo", "search", "rhythm", "sequence", "shift", "pairs", "maze", "find", "dots"].map((k) => (
            <div key={k} className="ap-chip">
              <span className="ap-emo">{ACTIVITY_TYPES[k].icon}</span>
              <span>{ACTIVITY_TYPES[k].label}</span>
            </div>
          ))}
        </div>
        <p className="ap-title" style={{ marginTop: 14 }}>📚 Đổi gió: kiến thức</p>
        <div className="ap-row">
          {["math", "count", "english", "shapes"].map((k) => (
            <div key={k} className="ap-chip ap-chip-alt">
              <span className="ap-emo">{ACTIVITY_TYPES[k].icon}</span>
              <span>{ACTIVITY_TYPES[k].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ Session */
function Session({ session, step, levels, onExit, onDone }) {
  const cur = session[step];
  const ActivityComp = cur.type.Comp;
  const level = levels[cur.typeKey] || 1;
  const [confirmExit, setConfirmExit] = useState(false);
  return (
    <div className="screen session">
      {confirmExit && (
        <div className="confirm-overlay" onClick={() => setConfirmExit(false)}>
          <div className="confirm-box" onClick={(e) => e.stopPropagation()}>
            <p className="confirm-msg">
              Thoát buổi học? 🤔<br />
              Tiến trình buổi này sẽ không được lưu.
            </p>
            <div className="confirm-actions">
              <button className="big-play small" onClick={() => setConfirmExit(false)}>
                Tiếp tục học
              </button>
              <button className="ghost-btn" onClick={() => { playTap(); onExit(); }}>
                Thoát
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="sess-top">
        <button className="back-btn" onClick={() => { playTap(); setConfirmExit(true); }}>✕</button>
        <div className="progress-track">
          {session.map((_, i) => (
            <span
              key={i}
              className={`pt-dot ${i < step ? "pt-done" : ""} ${
                i === step ? "pt-now" : ""
              }`}
            />
          ))}
        </div>
        <span className="sess-count">{step + 1}/{session.length}</span>
      </div>

      <div className="task-card">
        <div className="task-head">
          <span className="task-icon">{cur.type.icon}</span>
          <h2 className="task-title">{cur.type.label}</h2>
          <span className="task-level">Cấp {level}</span>
        </div>
        <ActivityComp key={`${step}-${cur.typeKey}`} level={level} onDone={onDone} />
      </div>
    </div>
  );
}

/* ============================================================ Result */
function Result({ result, childName, earnedBadges, levelUps, onAgain, onHome }) {
  const [showConfetti, setShowConfetti] = useState(true);

  // âm thanh khi vào màn kết quả: giai điệu hoàn thành + tiếng sao + fanfare lên cấp
  useEffect(() => {
    playComplete();
    playStar(result.stars);
    const cf = setTimeout(() => setShowConfetti(false), 2800); // tự gỡ confetti
    const lv =
      levelUps.length > 0 ? setTimeout(() => playLevelUp(), 1000) : null;
    return () => {
      clearTimeout(cf);
      if (lv) clearTimeout(lv);
    };
  }, []);

  return (
    <div className="screen result">
      {showConfetti && (
        <Confetti count={result.stars === 3 ? 64 : 40} emoji={result.stars === 3} />
      )}
      <div className="result-card">
        <h2 className="result-title">Hoàn thành buổi học! 🎉</h2>
        <div className="stars-row">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`big-star ${i <= result.stars ? "on" : ""}`}
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              ⭐
            </span>
          ))}
        </div>
        <p className="result-acc">
          Độ chính xác: <b>{result.avg}%</b>
        </p>
        <p className="result-msg">
          {result.stars === 3
            ? `Xuất sắc lắm ${childName}! Con tập trung rất tốt! 💯`
            : result.stars === 2
            ? `Giỏi lắm ${childName}! Cố thêm chút nữa nhé! 👍`
            : `Tốt lắm ${childName}! Mỗi ngày con sẽ giỏi hơn! 🌱`}
        </p>

        {levelUps.length > 0 && (
          <div className="levelup-box">
            {levelUps.map((u) => (
              <p key={u.type} className="levelup-line">
                {u.dir === "up" ? "🆙" : "🔽"} {u.icon} <b>{u.label}</b>{" "}
                {u.dir === "up" ? "lên" : "về"} cấp mới: {u.newLabel}
              </p>
            ))}
          </div>
        )}

        {earnedBadges.length > 0 && (
          <div className="result-badges">
            <p className="rb-title">Huy hiệu của con:</p>
            <div className="rb-row">
              {earnedBadges.map((b) => (
                <span key={b.id} className="rb-badge" title={b.name}>{b.icon}</span>
              ))}
            </div>
          </div>
        )}

        <div className="result-actions">
          <button className="big-play small" onClick={() => { playTap(); onAgain(); }}>Học thêm buổi nữa</button>
          <button className="ghost-btn" onClick={() => { playTap(); onHome(); }}>Về trang chính</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ Progress */
function Progress({ sessions, earnedBadges, onBack }) {
  const recent = sessions.slice(-8);
  return (
    <div className="screen progress-screen">
      <ScreenHead title="Tiến bộ của bé" onBack={onBack} />

      <div className="panel">
        <h3 className="panel-title">📊 Độ chính xác gần đây</h3>
        {recent.length === 0 ? (
          <p className="empty">Chưa có dữ liệu. Hãy hoàn thành buổi học đầu tiên nhé!</p>
        ) : (
          <div className="bar-chart">
            {recent.map((h, i) => (
              <div key={i} className="bar-col">
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: `${h.accuracy}%` }}>
                    <span className="bar-val">{h.accuracy}</span>
                  </div>
                </div>
                <span className="bar-lbl">{niceDate(h.date)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="panel">
        <h3 className="panel-title">🏆 Bộ sưu tập huy hiệu</h3>
        <div className="badge-grid">
          {BADGES.map((b) => {
            const got = earnedBadges.some((e) => e.id === b.id);
            return (
              <div key={b.id} className={`badge-cell ${got ? "got" : "locked"}`}>
                <span className="bc-icon">{got ? b.icon : "🔒"}</span>
                <span className="bc-name">{b.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============================================================ Parent */
function Parent({ stats, sessions, childName, levels, onSetLevel, onBack }) {
  const skills = Object.entries(stats.skillTotals).map(([skill, v]) => ({
    skill,
    rate: Math.round(v.sum / v.n),
    total: v.n,
  }));
  skills.sort((a, b) => b.rate - a.rate);
  const strong = skills[0];
  const weak = skills[skills.length - 1];
  const avgAcc =
    sessions.length > 0
      ? Math.round(sessions.reduce((s, h) => s + h.accuracy, 0) / sessions.length)
      : 0;

  return (
    <div className="screen parent-screen">
      <ScreenHead title="Góc phụ huynh" onBack={onBack} />

      {stats.totalSessions === 0 ? (
        <div className="panel">
          <p className="empty">
            Chưa có dữ liệu để báo cáo. Khi bé hoàn thành buổi học, mục này sẽ
            tổng hợp điểm mạnh và điểm cần luyện thêm.
          </p>
        </div>
      ) : (
        <>
          <div className="panel">
            <h3 className="panel-title">📋 Tổng quan</h3>
            <div className="report-grid">
              <ReportStat label="Tổng số buổi" value={stats.totalSessions} />
              <ReportStat label="Chuỗi ngày học" value={`${stats.streak} ngày`} />
              <ReportStat label="Độ chính xác TB" value={`${avgAcc}%`} />
              <ReportStat label="Ngôi sao đạt" value={stats.totalStars} />
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">🎯 Phân tích kỹ năng</h3>
            <div className="skill-bars">
              {skills.map((s) => (
                <div key={s.skill} className="skill-row">
                  <span className="skill-name">{s.skill}</span>
                  <div className="skill-track">
                    <div className="skill-fill" style={{ width: `${s.rate}%` }} />
                  </div>
                  <span className="skill-pct">{s.rate}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel highlight-panel">
            <h3 className="panel-title">💡 Nhận xét & gợi ý</h3>
            {strong && (
              <p className="note">
                <b>Điểm mạnh:</b> {childName} làm tốt nhất ở nhóm{" "}
                <b>{strong.skill}</b> ({strong.rate}%). Hãy khen ngợi để con giữ
                hứng thú nhé!
              </p>
            )}
            {weak && weak.skill !== strong?.skill && (
              <p className="note">
                <b>Cần luyện thêm:</b> Nhóm <b>{weak.skill}</b> ({weak.rate}%) còn
                hơi khó với con. Bố mẹ có thể ngồi cùng và hướng dẫn từng bước.
              </p>
            )}
            <p className="note soft">
              Lưu ý: bé 5-6 tuổi tập trung tốt nhất trong 15-20 phút. Sự đều đặn
              quan trọng hơn thời lượng.
            </p>
          </div>
        </>
      )}

      {/* Điều chỉnh cấp độ — luôn hiện */}
      <div className="panel">
        <h3 className="panel-title">⚙️ Điều chỉnh cấp độ</h3>
        <p className="lv-help">
          App tự nâng cấp khi bé làm tốt. Bố mẹ cũng có thể chỉnh tay tại đây.
        </p>
        <div className="lv-list">
          {Object.entries(ACTIVITY_TYPES_META).map(([type, meta]) => {
            const cur = levels[type] || 1;
            const cfg = getLevelConfig(type, cur);
            return (
              <div key={type} className="lv-row">
                <span className="lv-icon">{meta.icon}</span>
                <div className="lv-info">
                  <span className="lv-name">{meta.label}</span>
                  <span className="lv-desc">
                    Cấp {cur}/{cfg.maxLevel} — {cfg.label}
                  </span>
                  <span className="lv-std">Chuẩn: {cfg.std}</span>
                </div>
                <div className="lv-btns">
                  <button
                    className="lv-btn"
                    disabled={cur <= 1}
                    onClick={() => onSetLevel(type, cur - 1)}
                  >
                    −
                  </button>
                  <button
                    className="lv-btn"
                    disabled={cur >= cfg.maxLevel}
                    onClick={() => onSetLevel(type, cur + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* meta dùng cho phần cấp độ (tránh import vòng) */
const ACTIVITY_TYPES_META = {
  // Nhóm rèn tập trung
  memory: { label: "Nhớ rồi tìm", icon: "🧠" },
  gonogo: { label: "Đừng bấm nhầm", icon: "✋" },
  search: { label: "Tìm giữa nhiễu", icon: "🎯" },
  rhythm: { label: "Bấm theo nhịp", icon: "🥁" },
  maze: { label: "Mê cung", icon: "🌀" },
  find: { label: "Tìm khác biệt", icon: "🔍" },
  dots: { label: "Nối số", icon: "🔢" },
  sequence: { label: "Nhớ chuỗi", icon: "🎵" },
  shift: { label: "Đổi luật", icon: "🔀" },
  pairs: { label: "Ghép đôi", icon: "🧩" },
  // Nhóm kiến thức
  count: { label: "Đếm & so sánh", icon: "🍓" },
  math: { label: "Phép tính", icon: "🧮" },
  english: { label: "Tiếng Anh", icon: "🔤" },
  shapes: { label: "Hình học", icon: "🔷" },
};

/* ---------- phụ ---------- */
// Icon loa bật/tắt âm thanh. Dùng chung trạng thái từ lib/sound qua subscribe.
function SoundToggle() {
  const [on, setOn] = useState(isSoundOn());
  useEffect(() => subscribeSound(setOn), []);
  return (
    <button
      className="sound-toggle"
      onClick={() => toggleSound()}
      aria-label={on ? "Tắt âm thanh" : "Bật âm thanh"}
      title={on ? "Tắt âm thanh" : "Bật âm thanh"}
    >
      {on ? "🔊" : "🔇"}
    </button>
  );
}
function ScreenHead({ title, onBack }) {
  return (
    <div className="screen-head">
      <button className="back-btn round" onClick={onBack}>←</button>
      <h2 className="screen-title">{title}</h2>
      <span style={{ width: 44 }} />
    </div>
  );
}
function ReportStat({ label, value }) {
  return (
    <div className="report-stat">
      <span className="rs-val">{value}</span>
      <span className="rs-lbl">{label}</span>
    </div>
  );
}
function BgDeco() {
  return (
    <div className="bg-deco">
      <span className="bd b1">☁️</span>
      <span className="bd b2">⭐</span>
      <span className="bd b3">🌈</span>
      <span className="bd b4">🎈</span>
      <span className="bd b5">✨</span>
    </div>
  );
}
