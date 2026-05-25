-- ============================================================
-- BÉ VÀO LỚP 1 — Script tạo database trên Supabase
-- Cách dùng: mở Supabase Dashboard > SQL Editor > New query
--           > dán toàn bộ file này vào > bấm "Run"
-- ============================================================

-- Bảng các bé
create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  avatar text not null default '🦁',
  levels jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Bảng các buổi học
create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children(id) on delete cascade,
  date text not null,            -- dạng "YYYY-MM-DD"
  stars int not null default 0,
  accuracy int not null default 0,
  per_skill jsonb not null default '{}'::jsonb,
  per_type jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Tăng tốc truy vấn theo bé
create index if not exists sessions_child_idx on public.sessions(child_id);

-- ============================================================
-- Bảo mật: bật Row Level Security nhưng cho phép truy cập công khai
-- (vì app dùng riêng trong gia đình, không có đăng nhập).
-- Nếu sau này thêm đăng nhập, hãy thay các policy này bằng policy
-- dựa trên auth.uid().
-- ============================================================
alter table public.children enable row level security;
alter table public.sessions enable row level security;

-- Xoá policy cũ nếu chạy lại script
drop policy if exists "public children access" on public.children;
drop policy if exists "public sessions access" on public.sessions;

create policy "public children access"
  on public.children for all
  using (true) with check (true);

create policy "public sessions access"
  on public.sessions for all
  using (true) with check (true);
