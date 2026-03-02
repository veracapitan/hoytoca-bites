-- Tabla de reseñas para Hoy Toca Bites
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

-- Índice para búsqueda por slug
create index if not exists idx_reviews_slug on public.reviews (slug);

-- Habilitar RLS (Row Level Security) y permitir lectura pública
alter table public.reviews enable row level security;

create policy "Permitir lectura pública de reseñas"
  on public.reviews for select
  using (true);

-- Opcional: solo el servicio autenticado puede insertar/actualizar/borrar
-- create policy "Solo usuarios autenticados pueden modificar"
--   on public.reviews for all
--   using (auth.role() = 'authenticated');
