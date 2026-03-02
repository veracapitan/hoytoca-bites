-- ============================================================
-- HOYTOCA – Crear todo en Supabase (tabla + políticas RLS)
-- Ejecutar en: SQL Editor → New query → Pegar → Run
-- ============================================================

-- 1) Tabla de reseñas
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  review_text text not null,
  city text not null,
  food_types text[] not null default '{}',
  visit_date date not null,
  images text[] not null default '{}',
  videos text[] not null default '{}',
  google_maps_url text,
  instagram_url text,
  tiktok_url text,
  created_at timestamptz not null default now()
);

-- 2) Índice para búsqueda por slug
create index if not exists idx_reviews_slug on public.reviews (slug);

-- 3) Activar RLS
alter table public.reviews enable row level security;

-- 4) Lectura pública (todo el mundo puede ver reseñas)
create policy "Permitir lectura pública de reseñas"
  on public.reviews for select
  using (true);

-- 5) Solo usuarios autenticados pueden insertar
create policy "Usuarios autenticados pueden insertar reseñas"
  on public.reviews for insert
  to authenticated
  with check (true);

-- 6) Solo usuarios autenticados pueden actualizar
create policy "Usuarios autenticados pueden actualizar reseñas"
  on public.reviews for update
  to authenticated
  using (true)
  with check (true);

-- 7) Solo usuarios autenticados pueden borrar
create policy "Usuarios autenticados pueden borrar reseñas"
  on public.reviews for delete
  to authenticated
  using (true);

-- ============================================================
-- STORAGE: bucket para fotos de restaurantes
-- ============================================================

insert into storage.buckets (id, name, public)
values ('restaurant-images', 'restaurant-images', true)
on conflict (id) do update set public = true;

-- Subidas: solo usuarios autenticados
create policy "Autenticados pueden subir fotos de restaurantes"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'restaurant-images');

-- Lectura pública (para mostrar las fotos en la web)
create policy "Lectura pública de fotos de restaurantes"
  on storage.objects for select
  using (bucket_id = 'restaurant-images');
