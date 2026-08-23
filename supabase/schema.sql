-- Run this complete file once in Supabase → SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), slug text unique not null, name text not null,
  category text not null, subcategory text default '', short_description text default '', description text default '',
  features jsonb not null default '[]', specifications jsonb not null default '[]', packing_size jsonb not null default '[]',
  parts_list jsonb not null default '[]', faqs jsonb not null default '[]', media jsonb not null default '[]',
  youtube_url text default '', moq text default '', featured boolean default false,
  status text not null default 'draft' check (status in ('draft','published')), sort_order integer default 0,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.product_categories (
  id uuid primary key default gen_random_uuid(), name text unique not null, slug text unique not null,
  description text default '', sort_order integer default 0, published boolean default true,
  created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.pages (
  slug text primary key, title text not null, eyebrow text default '', heading text default '', body text default '',
  content jsonb not null default '{}', media jsonb not null default '[]', published boolean default true,
  updated_at timestamptz default now()
);
create table if not exists public.site_media (
  id uuid primary key default gen_random_uuid(), collection text not null check(collection in ('hero','customer','logo','scene','factory')),
  title text not null, caption text default '', media_type text not null check(media_type in ('image','video')),
  media_url text not null, link_url text default '', sort_order integer default 0, published boolean default true,
  created_at timestamptz default now()
);
create table if not exists public.news (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null, excerpt text default '', content text default '',
  category text default 'Company', cover_url text default '', published_at date default current_date,
  status text default 'draft' check(status in ('draft','published')), created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(), full_name text not null, company_name text default '', email text not null,
  phone text default '', inquiry_type text default '', annual_volume text default '', message text not null,
  status text default 'new', created_at timestamptz default now()
);
create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(), quote_no text unique not null, customer text not null, product text not null,
  currency text default 'USD', unit_price numeric default 0, moq integer default 0, lead_time text default '',
  packing_size jsonb not null default '{}', notes text default '', created_at timestamptz default now(), updated_at timestamptz default now()
);

insert into public.pages(slug,title,eyebrow,heading,body) values
('home','Home','Smart Lighting Solutions Since 2011','Illuminate the Future with Intelligent Light','Shenzhen Xinshern Technology designs and manufactures dependable lighting products for global B2B markets.'),
('about','About Xinshern','Lighting expertise, built over time','A dependable product partner from Shenzhen','Founded in 2011, Xinshern integrates product development, manufacturing, quality control and export service for festival, gift, ambient and home lighting.'),
('factory','Factory','From prototype to mass production','Manufacturing with accountability','Our production, R&D, inspection and warehousing teams work together to deliver consistent products and reliable lead times.')
on conflict(slug) do nothing;

insert into public.product_categories(name,slug,sort_order) values
('Gift Lights','gift-lights',1),('Festival Lights','festival-lights',2),('Stage Lights','stage-lights',3),
('Table & Floor Lamps','table-floor-lamps',4),('Outdoor Lights','outdoor-lights',5),
('Tape & String Lights','tape-string-lights',6),('Commercial Lighting','commercial-lighting',7),
('Track Lighting','track-lighting',8)
on conflict(name) do nothing;

alter table public.products enable row level security; alter table public.pages enable row level security;
alter table public.product_categories enable row level security;
alter table public.site_media enable row level security; alter table public.news enable row level security;
alter table public.inquiries enable row level security; alter table public.quotes enable row level security;

drop policy if exists "public read published products" on public.products;
create policy "public read published products" on public.products for select using(status='published' or auth.role()='authenticated');
drop policy if exists "admin products" on public.products;
create policy "admin products" on public.products for all to authenticated using(true) with check(true);
drop policy if exists "public read product categories" on public.product_categories;
create policy "public read product categories" on public.product_categories for select using(published=true or auth.role()='authenticated');
drop policy if exists "admin product categories" on public.product_categories;
create policy "admin product categories" on public.product_categories for all to authenticated using(true) with check(true);
drop policy if exists "public read pages" on public.pages;
create policy "public read pages" on public.pages for select using(published=true or auth.role()='authenticated');
drop policy if exists "admin pages" on public.pages;
create policy "admin pages" on public.pages for all to authenticated using(true) with check(true);
drop policy if exists "public read site media" on public.site_media;
create policy "public read site media" on public.site_media for select using(published=true or auth.role()='authenticated');
drop policy if exists "admin site media" on public.site_media;
create policy "admin site media" on public.site_media for all to authenticated using(true) with check(true);
drop policy if exists "public read published news" on public.news;
create policy "public read published news" on public.news for select using(status='published' or auth.role()='authenticated');
drop policy if exists "admin news" on public.news;
create policy "admin news" on public.news for all to authenticated using(true) with check(true);
drop policy if exists "public create inquiry" on public.inquiries;
create policy "public create inquiry" on public.inquiries for insert to anon, authenticated with check(true);
drop policy if exists "admin inquiries" on public.inquiries;
create policy "admin inquiries" on public.inquiries for all to authenticated using(true) with check(true);
drop policy if exists "admin quotes" on public.quotes;
create policy "admin quotes" on public.quotes for all to authenticated using(true) with check(true);

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('media','media',true,104857600,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime'])
on conflict(id) do update set public=true,file_size_limit=104857600;
drop policy if exists "public media read" on storage.objects;
create policy "public media read" on storage.objects for select using(bucket_id='media');
drop policy if exists "admin media upload" on storage.objects;
create policy "admin media upload" on storage.objects for insert to authenticated with check(bucket_id='media');
drop policy if exists "admin media update" on storage.objects;
create policy "admin media update" on storage.objects for update to authenticated using(bucket_id='media');
drop policy if exists "admin media delete" on storage.objects;
create policy "admin media delete" on storage.objects for delete to authenticated using(bucket_id='media');

create index if not exists products_category_idx on public.products(category);
create index if not exists product_categories_sort_idx on public.product_categories(sort_order,name);
create index if not exists products_status_idx on public.products(status,featured,sort_order);
create index if not exists site_media_collection_idx on public.site_media(collection,sort_order);
create index if not exists news_status_date_idx on public.news(status,published_at desc);
