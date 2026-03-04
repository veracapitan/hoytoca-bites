-- ============================================================
-- Restaurantes de prueba para HOYTOCA
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Pegar → Run
-- ============================================================

insert into public.reviews (
  name,
  slug,
  review_text,
  city,
  food_types,
  visit_date,
  images,
  videos,
  google_maps_url,
  instagram_url,
  tiktok_url
) values
(
  'La Buena Vida',
  'la-buena-vida',
  'Un brunch espectacular en pleno centro. El tostón de aguacate con huevo poché está increíble, y el ambiente es súper acogedor. Perfecto para ir con amigas un domingo por la mañana. Los zumos naturales son otro nivel. ¡Repetiré seguro!',
  'Madrid',
  array['Brunch', 'Cafetería'],
  '2025-12-15',
  array['https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'],
  array[]::text[],
  'https://maps.google.com',
  'https://instagram.com',
  null
),
(
  'Taberna El Rincón',
  'taberna-el-rincon',
  'Si buscas tapas de toda la vida pero con un toque moderno, este es tu sitio. El ambiente es súper íntimo, con luz tenue y música suave. Las croquetas de jamón ibérico son las mejores que he probado. El vino de la casa también merece mucho la pena.',
  'Barcelona',
  array['Tapas', 'Restaurante'],
  '2025-11-28',
  array['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'],
  array[]::text[],
  'https://maps.google.com',
  null,
  null
),
(
  'Dulce Tentación',
  'dulce-tentacion',
  'La tarta de chocolate con frutos rojos es una obra de arte. Todo está hecho artesanalmente y se nota en cada bocado. El local es pequeñito pero precioso. Ideal para una merienda especial o para llevar algo dulce a casa.',
  'Valencia',
  array['Postres', 'Cafetería'],
  '2025-10-20',
  array['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'],
  array[]::text[],
  null,
  'https://instagram.com',
  null
),
(
  'Cóctel & Co',
  'coctel-and-co',
  'El mejor bar de cócteles que he visitado últimamente. La carta es creativa y el bartender te prepara bebidas personalizadas. El ambiente es vibrante y la decoración es preciosa. Perfecto para una noche especial.',
  'Madrid',
  array['Bar', 'Cócteles'],
  '2025-09-10',
  array['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800'],
  array[]::text[],
  'https://maps.google.com',
  null,
  'https://tiktok.com'
),
(
  'Casa Pepe',
  'casa-pepe',
  'Cocina de mercado con producto local. El pescado del día siempre está en su punto y el trato es cercano. Recomiendo el arroz meloso y el tiramisu de la casa. Precios muy correctos para la calidad que ofrecen.',
  'Sevilla',
  array['Restaurante', 'Pescado', 'Arroces'],
  '2025-08-22',
  array['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
  array[]::text[],
  'https://maps.google.com',
  null,
  null
)
on conflict (slug) do nothing;
