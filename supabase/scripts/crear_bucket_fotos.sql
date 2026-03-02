-- ============================================================
-- Crear bucket para fotos de restaurantes (Storage)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- Crear el bucket (público para que las fotos se vean en la web)
insert into storage.buckets (id, name, public)
values ('restaurant-images', 'restaurant-images', true)
on conflict (id) do update set public = true;

-- Permitir que usuarios autenticados suban fotos
drop policy if exists "Autenticados pueden subir fotos de restaurantes" on storage.objects;
create policy "Autenticados pueden subir fotos de restaurantes"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'restaurant-images');

-- Permitir que todo el mundo vea las fotos (lectura pública)
drop policy if exists "Lectura pública de fotos de restaurantes" on storage.objects;
create policy "Lectura pública de fotos de restaurantes"
  on storage.objects for select
  using (bucket_id = 'restaurant-images');
