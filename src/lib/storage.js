import { supabase, isSupabaseConfigured } from "./supabase";

/*
  Lớp trừu tượng hoá việc lưu trữ.
  Toàn bộ app chỉ gọi các hàm trong file này, KHÔNG gọi trực tiếp Supabase.
  Nhờ đó, nếu sau này muốn đổi database / thêm đăng nhập,
  chỉ cần sửa file này.

  Cấu trúc dữ liệu:
  - Bảng "children": { id, name, avatar, created_at }
  - Bảng "sessions":  { id, child_id, date, stars, accuracy, per_skill (jsonb), created_at }

  Khi chưa cấu hình Supabase -> lưu vào localStorage với cùng hình dạng dữ liệu.
*/

const LS_CHILDREN = "bvl1_children";
const LS_SESSIONS = "bvl1_sessions";

/* ---------- Helpers localStorage ---------- */
const lsGet = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const lsSet = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* bỏ qua nếu trình duyệt chặn */
  }
};
const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/* ================= CHILDREN ================= */

export async function listChildren() {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("children")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  }
  return lsGet(LS_CHILDREN, []);
}

export async function addChild(name, avatar, levels) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("children")
      .insert({ name, avatar, levels })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const children = lsGet(LS_CHILDREN, []);
  const child = {
    id: uid(),
    name,
    avatar,
    levels,
    created_at: new Date().toISOString(),
  };
  children.push(child);
  lsSet(LS_CHILDREN, children);
  return child;
}

export async function renameChild(id, name) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("children")
      .update({ name })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const children = lsGet(LS_CHILDREN, []).map((c) =>
    c.id === id ? { ...c, name } : c
  );
  lsSet(LS_CHILDREN, children);
}

/* Cập nhật cấp độ (levels là object jsonb: {math:2, dots:1, ...}) */
export async function updateChildLevels(id, levels) {
  if (isSupabaseConfigured) {
    const { error } = await supabase
      .from("children")
      .update({ levels })
      .eq("id", id);
    if (error) throw error;
    return;
  }
  const children = lsGet(LS_CHILDREN, []).map((c) =>
    c.id === id ? { ...c, levels } : c
  );
  lsSet(LS_CHILDREN, children);
}

/* ================= SESSIONS ================= */

export async function listSessions(childId) {
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("child_id", childId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data || [];
  }
  return lsGet(LS_SESSIONS, []).filter((s) => s.child_id === childId);
}

export async function addSession(childId, payload) {
  // payload: { date, stars, accuracy, per_skill }
  if (isSupabaseConfigured) {
    const { data, error } = await supabase
      .from("sessions")
      .insert({ child_id: childId, ...payload })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  const sessions = lsGet(LS_SESSIONS, []);
  const row = {
    id: uid(),
    child_id: childId,
    ...payload,
    created_at: new Date().toISOString(),
  };
  sessions.push(row);
  lsSet(LS_SESSIONS, sessions);
  return row;
}

export { isSupabaseConfigured };
