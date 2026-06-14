-- =============================================================
-- Archivo : 0011_security_hardening.sql
-- Ruta    : supabase/migrations/0011_security_hardening.sql
-- Creado  : 2026-06-13
-- Descripción: Endurecimiento de seguridad de la base de datos.
--              Resuelve TODOS los hallazgos SQL del Database Linter
--              de Supabase (1 ERROR + warnings de SECURITY).
--              Es CANÓNICO: se aplica al demo y queda en el repo para
--              que cada réplica de producción lo herede automáticamente.
--
-- EJECUTAR DESPUÉS de 0010_replan_pricing.sql
-- Pegar y ejecutar en: Supabase Dashboard → SQL Editor
--
-- Lo que NO arregla este archivo (son settings del Dashboard, ver
-- .docs/14-production-hardening.md):
--   · auth_leaked_password_protection  → Auth → Password Security
-- =============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. function_search_path_mutable  (WARN ×3)
--    Fijar search_path para evitar que un search_path mutable
--    permita "secuestrar" nombres de objetos no calificados.
--    Las funciones ya califican todo (public.*, auth.*), así que
--    search_path = '' es seguro y no cambia su comportamiento.
-- ─────────────────────────────────────────────────────────────
ALTER FUNCTION public.update_updated_at_column()        SET search_path = '';
ALTER FUNCTION public.is_member_of(uuid, text)          SET search_path = '';
ALTER FUNCTION public.is_super_admin()                  SET search_path = '';

-- ─────────────────────────────────────────────────────────────
-- 2. security_definer_view  (ERROR)
--    La view corría con permisos de su creador (bypass de RLS del
--    usuario que consulta). La pasamos a SECURITY INVOKER: respeta
--    el RLS de quien consulta. La tabla base ya tiene lectura
--    pública (market: lectura pública), así que no cambia el front.
-- ─────────────────────────────────────────────────────────────
ALTER VIEW public.neighborhood_market_latest SET (security_invoker = true);

-- ─────────────────────────────────────────────────────────────
-- 3. public_bucket_allows_listing  (WARN ×3)
--    Estas policies de SELECT permitían LISTAR todo el contenido de
--    los buckets públicos. Los buckets public=true sirven igual las
--    URLs públicas de cada objeto SIN esta policy: solo cortamos el
--    poder enumerar/listar archivos. Por eso se eliminan.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "storage properties: lectura pública"    ON storage.objects;
DROP POLICY IF EXISTS "storage agency-assets: lectura pública"  ON storage.objects;
DROP POLICY IF EXISTS "crm-files lectura pública"               ON storage.objects;
-- Nota: crm-files debería ser un bucket PRIVADO con signed URLs en
-- producción (contiene archivos del CRM). Ver checklist de producción.

-- ─────────────────────────────────────────────────────────────
-- 4. rls_policy_always_true  (WARN ×4)
--    Estas policies dejaban que el rol anónimo INSERTARA filas
--    directo (WITH CHECK (true)). Decisión de arquitectura: TODO
--    submit público (formulario de contacto, pedir visita, scan QR)
--    pasa por una API route del server con service_role + validación
--    + rate-limit. Por eso se elimina la escritura directa de anon:
--    la DB queda cerrada a escrituras públicas no validadas.
--
--    Verificado: la app NO inserta en estas tablas con cliente anon
--    (usa service_role en src/lib/leads/actions.ts). No hay regresión.
--    El webhook público (api/webhooks/lead) se cableará al server.
-- ─────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "leads: formulario público puede crear"       ON public.leads;
DROP POLICY IF EXISTS "lead_events: formulario público puede crear"  ON public.lead_events;
DROP POLICY IF EXISTS "visits: formulario público puede crear"       ON public.property_visits;
DROP POLICY IF EXISTS "qr_scans: público puede registrar"            ON public.qr_scans;

COMMIT;

-- ─────────────────────────────────────────────────────────────
-- 5. extension_in_public (pg_trgm)  (WARN)
--    Mover la extensión fuera de public. Se corre FUERA de la
--    transacción anterior por prolijidad. El índice trigram
--    properties_title_trgm_idx sigue funcionando (referencia el
--    opclass por OID, no por nombre). En Supabase el schema
--    'extensions' ya está en el search_path de los roles, así que
--    el operador % y similarity() siguen resolviéndose.
-- ─────────────────────────────────────────────────────────────
CREATE SCHEMA IF NOT EXISTS extensions;
ALTER EXTENSION pg_trgm SET SCHEMA extensions;

-- =============================================================
-- VERIFICACIÓN (opcional): volvé a correr el linter en
-- Dashboard → Advisors → Security. Deberían quedar solo los
-- avisos NO-SQL (leaked password protection) que se activan en
-- el Dashboard según .docs/14-production-hardening.md
-- =============================================================
