-- Permitir a usuarios autenticados insertar, actualizar y borrar reseñas
create policy "Usuarios autenticados pueden insertar reseñas"
  on public.reviews for insert
  to authenticated
  with check (true);

create policy "Usuarios autenticados pueden actualizar reseñas"
  on public.reviews for update
  to authenticated
  using (true)
  with check (true);

create policy "Usuarios autenticados pueden borrar reseñas"
  on public.reviews for delete
  to authenticated
  using (true);
