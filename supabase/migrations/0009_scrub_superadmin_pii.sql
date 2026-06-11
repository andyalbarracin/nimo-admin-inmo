-- 0009_scrub_superadmin_pii.sql
-- ───────────────────────────────────────────────────────────────────────────
-- Reemplaza el email/nombre del super admin semilla (0003) por valores dummy en
-- la base de datos. Se targetea por el id fijo del usuario semilla (no por email)
-- para no dejar el dato a limpiar dentro de este archivo.
-- El login de superadmin ya NO usa Supabase Auth (valida una credencial
-- configurable por env), así que este usuario queda solo como registro histórico.
-- Ejecutar en Supabase → SQL Editor.
-- ───────────────────────────────────────────────────────────────────────────

UPDATE auth.users
SET email = 'admin@nimo.app',
    encrypted_password = crypt('nimo-demo', gen_salt('bf', 10)),
    raw_user_meta_data = jsonb_build_object('name', 'Administrador', 'avatar_url', NULL)
WHERE id = 'f7c3d4a5-0001-0000-0000-000000000001';

UPDATE auth.identities
SET provider_id = 'admin@nimo.app',
    identity_data = jsonb_build_object('sub', 'f7c3d4a5-0001-0000-0000-000000000001', 'email', 'admin@nimo.app')
WHERE user_id = 'f7c3d4a5-0001-0000-0000-000000000001';
