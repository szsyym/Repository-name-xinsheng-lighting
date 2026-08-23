-- XINSHERN website V2 update: run once in Supabase -> SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique not null,
  description text default '',
  sort_order integer default 0,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

insert into public.product_categories(name,slug,sort_order) values
('Gift Lights','gift-lights',1),
('Festival Lights','festival-lights',2),
('Stage Lights','stage-lights',3),
('Table & Floor Lamps','table-floor-lamps',4),
('Outdoor Lights','outdoor-lights',5),
('Tape & String Lights','tape-string-lights',6),
('Commercial Lighting','commercial-lighting',7),
('Track Lighting','track-lighting',8)
on conflict(name) do nothing;

alter table public.product_categories enable row level security;
drop policy if exists "public read product categories" on public.product_categories;
create policy "public read product categories" on public.product_categories
for select using(published=true or auth.role()='authenticated');
drop policy if exists "admin product categories" on public.product_categories;
create policy "admin product categories" on public.product_categories
for all to authenticated using(true) with check(true);

create index if not exists product_categories_sort_idx
on public.product_categories(sort_order,name);
