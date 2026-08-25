-- XINSHERN V3 CMS + SEO/GEO + quotation upgrade. Safe to run more than once.
alter table public.products add column if not exists model text default '';
alter table public.products add column if not exists datasheet_url text default '';
alter table public.products add column if not exists applications jsonb not null default '[]';
alter table public.products add column if not exists customization jsonb not null default '[]';
alter table public.products add column if not exists seo jsonb not null default '{}';
alter table public.products add column if not exists ai_summary text default '';
alter table public.inquiries add column if not exists country text default '';
alter table public.inquiries add column if not exists product text default '';
alter table public.inquiries add column if not exists quantity text default '';
alter table public.inquiries add column if not exists application text default '';
alter table public.inquiries add column if not exists attachment_url text default '';
alter table public.quotes add column if not exists items jsonb not null default '[]';
alter table public.quotes add column if not exists exchange_rate numeric default 7.20;
alter table public.quotes add column if not exists status text default 'draft';

alter table public.site_media drop constraint if exists site_media_collection_check;
alter table public.site_media add constraint site_media_collection_check check(collection in ('hero','customer','logo','scene','factory','catalog'));
alter table public.site_media drop constraint if exists site_media_media_type_check;
alter table public.site_media add constraint site_media_media_type_check check(media_type in ('image','video','document'));

create table if not exists public.content_entries(
 id uuid primary key default gen_random_uuid(), type text not null check(type in('solution','article','knowledge','faq','case')),
 slug text unique not null, title text not null, excerpt text default '', content text default '', category text default '',
 cover_url text default '', faqs jsonb not null default '[]', related_products jsonb not null default '[]',
 seo jsonb not null default '{}', ai_summary text default '', status text default 'draft' check(status in('draft','published')),
 published_at date default current_date, created_at timestamptz default now(), updated_at timestamptz default now());
create table if not exists public.site_settings(key text primary key,value jsonb not null default '{}',updated_at timestamptz default now());
alter table public.content_entries enable row level security;alter table public.site_settings enable row level security;
drop policy if exists "public read content entries" on public.content_entries;
create policy "public read content entries" on public.content_entries for select using(status='published' or auth.role()='authenticated');
drop policy if exists "admin content entries" on public.content_entries;
create policy "admin content entries" on public.content_entries for all to authenticated using(true) with check(true);
drop policy if exists "public read settings" on public.site_settings;
create policy "public read settings" on public.site_settings for select using(true);
drop policy if exists "admin settings" on public.site_settings;
create policy "admin settings" on public.site_settings for all to authenticated using(true) with check(true);
insert into public.pages(slug,title,eyebrow,heading,body) values
('scenes','Scenes','Application Gallery','Lighting Scenes','Lighting solutions for homes, retail, hospitality, workplaces and professional environments.'),
('faq','FAQ','Help Center','Frequently Asked Questions','Answers for product development, ordering, quality and shipping.'),
('contact','Contact','We reply within 24 hours','Start Your Project','Request a sample, quote or OEM consultation.'),
('news','News','Insights & Updates','Latest News','Product knowledge, company updates and lighting industry insights.')
on conflict(slug) do nothing;
insert into public.site_settings(key,value) values
('company_entity','{"name":"Shenzhen Xinshern Technology Co., Ltd.","brand":"XINSHERN","industry":"LED lighting manufacturing","location":"Shenzhen, China","oem":true,"odm":true}'),
('global_seo','{"title":"Xinshern Lighting | LED Lighting Manufacturer","description":"Custom LED lighting, OEM and ODM manufacturing for global B2B buyers."}')
on conflict(key) do nothing;
create index if not exists products_model_idx on public.products(model);
create index if not exists content_entries_type_idx on public.content_entries(type,status,published_at desc);
update storage.buckets set allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime','application/pdf'] where id='media';
