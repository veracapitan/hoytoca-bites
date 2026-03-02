# Todo lo que tienes que crear en Supabase

Proyecto: **https://supabase.com/dashboard/project/xjsrjvjsrllfdtsnufhp**

---

## 1. Ejecutar el SQL completo

En el dashboard: **SQL Editor** → **New query**. Pega todo el contenido del archivo `supabase/scripts/crear_todo.sql` (o el SQL de abajo) y pulsa **Run**.

---

## 2. Crear usuario para el panel de admin

1. En el dashboard ve a **Authentication** → **Users**.
2. Pulsa **Add user** → **Create new user**.
3. Elige **Email** e introduce:
   - **Email:** el que quieras usar para entrar al admin (ej. `tu@email.com`).
   - **Password:** una contraseña segura (o usa "Auto generate" y cópiala).
4. Pulsa **Create user**.

Con ese email y contraseña entrarás en **https://tu-sitio.com/admin** (o `/admin` en local).

---

## 3. Crear el bucket para fotos de restaurantes

Si al añadir un restaurante te sale **"bucket not found"**, crea el bucket de Storage:

### Opción A – Desde el dashboard (recomendado)

1. Ve a **Storage** en el menú lateral.
2. Pulsa **New bucket**.
3. **Name:** `restaurant-images` (tiene que ser exactamente ese nombre).
4. Activa **Public bucket** (para que las fotos se vean en la web).
5. Pulsa **Create bucket**.
6. Entra en el bucket → **Policies** (o **Configuration**) y añade:
   - **Insert:** permitir a `authenticated`.
   - **Select:** permitir a `anon` (o público) para que se puedan ver las fotos.

### Opción B – Con SQL

En **SQL Editor** → **New query**, pega y ejecuta el contenido de `supabase/scripts/crear_bucket_fotos.sql`.

---

## Resumen

| Qué | Dónde |
|-----|--------|
| Tabla `reviews` + políticas RLS | SQL Editor → ejecutar `crear_todo.sql` |
| Usuario admin | Authentication → Users → Add user |
| Bucket de fotos | Storage → New bucket `restaurant-images` (público) o ejecutar `crear_bucket_fotos.sql` |

Después de esto la web podrá leer las reseñas (público) y tú podrás añadir fotos y restaurantes desde el panel de admin.
