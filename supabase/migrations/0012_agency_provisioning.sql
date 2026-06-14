-- =============================================================
-- Archivo : 0012_agency_provisioning.sql
-- Ruta    : supabase/migrations/0012_agency_provisioning.sql
-- Creado  : 2026-06-13
-- Descripción: Provisioning de inmobiliarias (Subsistema A). Agrega datos
--              fiscales/comerciales a agencies, link con el CRM de ventas,
--              y tablas de documentos y credenciales (secretos cifrados).
--              Crea el bucket privado 'agency-docs'.
--
-- EJECUTAR DESPUÉS de 0011_security_hardening.sql, en Supabase SQL Editor.
-- Es ADITIVA e idempotente.
-- =============================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. Datos fiscales/comerciales en agencies (1:1, junto a legal_id/cucicba_id)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS business_name   TEXT;  -- razón social
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS tax_condition   TEXT
  CHECK (tax_condition IN ('responsable_inscripto','monotributo','exento','consumidor_final'));
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS billing_email   TEXT;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS billing_address TEXT;
ALTER TABLE public.agencies ADD COLUMN IF NOT EXISTS notes_internal  TEXT;  -- notas del superadmin

-- ─────────────────────────────────────────────────────────────
-- 2. Link ventas (platform_crm_leads) <-> tenant provisionado (agencies)
-- ─────────────────────────────────────────────────────────────
ALTER TABLE public.platform_crm_leads
  ADD COLUMN IF NOT EXISTS agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────
-- 3. Documentos de la agencia (PDF de pagos, propuestas, presupuestos, contratos)
--    El archivo vive en el bucket privado 'agency-docs'; acá solo el metadato.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.agency_documents (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id  UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL DEFAULT 'other'
               CHECK (kind IN ('payment','proposal','budget','contract','other')),
  title      TEXT NOT NULL,
  file_path  TEXT NOT NULL,                 -- ruta dentro del bucket agency-docs
  amount     NUMERIC(12,2),
  currency   TEXT CHECK (currency IN ('USD','ARS')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS agency_documents_agency_idx ON public.agency_documents(agency_id);
ALTER TABLE public.agency_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agency_documents: superadmin gestiona" ON public.agency_documents;
CREATE POLICY "agency_documents: superadmin gestiona" ON public.agency_documents
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

-- ─────────────────────────────────────────────────────────────
-- 4. Credenciales/keys/URLs de la agencia.
--    El secreto se cifra en el server (AES-256-GCM); la DB solo guarda el
--    ciphertext. url/username NO son sensibles. Solo superadmin (RLS).
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.agency_credentials (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id         UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  label             TEXT NOT NULL,
  kind              TEXT NOT NULL DEFAULT 'other'
                      CHECK (kind IN ('api_key','password','token','url','other')),
  url               TEXT,
  username          TEXT,
  secret_ciphertext TEXT,                   -- "iv:tag:data" en base64 (server-side)
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS agency_credentials_agency_idx ON public.agency_credentials(agency_id);
DROP TRIGGER IF EXISTS agency_credentials_updated_at ON public.agency_credentials;
CREATE TRIGGER agency_credentials_updated_at
  BEFORE UPDATE ON public.agency_credentials
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
ALTER TABLE public.agency_credentials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "agency_credentials: superadmin gestiona" ON public.agency_credentials;
CREATE POLICY "agency_credentials: superadmin gestiona" ON public.agency_credentials
  FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());

COMMIT;

-- ─────────────────────────────────────────────────────────────
-- 5. Bucket privado para documentos (fuera de la transacción).
--    Descargas vía signed URLs generadas server-side con service_role.
-- ─────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-docs', 'agency-docs', false)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "agency-docs: superadmin gestiona" ON storage.objects;
CREATE POLICY "agency-docs: superadmin gestiona" ON storage.objects
  FOR ALL
  USING (bucket_id = 'agency-docs' AND public.is_super_admin())
  WITH CHECK (bucket_id = 'agency-docs' AND public.is_super_admin());
