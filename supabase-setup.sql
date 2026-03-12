-- ═══════════════════════════════════════
-- RD Harmony Med Spa — Supabase Setup
-- Run this in: Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════

-- BOOKINGS table
create table if not exists bookings (
  id         uuid primary key default gen_random_uuid(),
  fname      text not null,
  lname      text not null,
  email      text not null,
  phone      text not null,
  service    text not null,
  date       text not null,
  time       text not null,
  address    text not null,
  notes      text default '',
  status     text default 'pending',
  created_at timestamptz default now()
);

-- MESSAGES table
create table if not exists messages (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  subject    text not null,
  message    text not null,
  created_at timestamptz default now()
);

-- Allow anonymous inserts (public booking / contact form)
-- Run these ONLY if you want unauthenticated users to submit forms.
-- For production, consider using RLS policies instead.
alter table bookings enable row level security;
alter table messages enable row level security;

create policy "Allow public insert on bookings"
  on bookings for insert to anon with check (true);

create policy "Allow public insert on messages"
  on messages for insert to anon with check (true);

-- Allow authenticated admin reads
create policy "Allow authenticated read on bookings"
  on bookings for select to authenticated using (true);

create policy "Allow authenticated update on bookings"
  on bookings for update to authenticated using (true);

create policy "Allow authenticated read on messages"
  on messages for select to authenticated using (true);
