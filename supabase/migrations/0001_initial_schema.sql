-- =============================================================
-- Archivo : 0001_initial_schema.sql
-- Ruta    : supabase/migrations/0001_initial_schema.sql
-- Creado  : 2026-06-06
-- Descripción: Schema inicial completo de NIMO.
--              Crea todas las tablas, índices y triggers.
--
-- CÓMO EJECUTAR:
--   1. Abrí el Supabase Dashboard → SQL Editor
--   2. Pegá y ejecutá este archivo
--   3. Luego ejecutá 0002_rls_policies.sql
--   4. Luego ejecutá 0003_seed_data.sql
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- Extensiones necesarias (Supabase las habilita por defecto)
-- ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- Para búsqueda full-text

-- ─────────────────────────────────────────────────────────────
-- Función universal para actualizar updated_at automáticamente
-- ─────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────
-- TABLA: agencies (tenant principal)
-- Una fila = una inmobiliaria cliente de NIMO
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agencies (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug              TEXT NOT NULL UNIQUE,            -- URL: nimo.app/slug/
  name              TEXT NOT NULL,
  legal_id          TEXT,                            -- CUIT/CUIL
  cucicba_id        TEXT,                            -- Matrícula CUCICBA / colegio provincial
  email_contact     TEXT,
  phone             TEXT,
  whatsapp_number   TEXT,
  address           TEXT,
  city              TEXT,
  province          TEXT,
  plan_id           UUID,                            -- FK a platform_plans
  plan_status       TEXT NOT NULL DEFAULT 'trial'
                      CHECK (plan_status IN ('trial','active','past_due','canceled')),
  trial_ends_at     TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days'),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS agencies_slug_idx ON agencies(slug);
CREATE INDEX IF NOT EXISTS agencies_plan_status_idx ON agencies(plan_status);

CREATE TRIGGER agencies_updated_at
  BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- TABLA: agency_members (usuarios de cada agencia)
-- Vincula auth.users con agencies + define el rol
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agency_members (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id     UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'agent'
                  CHECK (role IN ('owner','admin','agent','viewer')),
  display_name  TEXT,
  avatar_url    TEXT,
  phone         TEXT,
  whatsapp      TEXT,
  invited_at    TIMESTAMPTZ,
  joined_at     TIMESTAMPTZ DEFAULT NOW(),
  is_active     BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(agency_id, user_id)
);

CREATE INDEX IF NOT EXISTS agency_members_user_id_idx   ON agency_members(user_id);
CREATE INDEX IF NOT EXISTS agency_members_agency_id_idx ON agency_members(agency_id);

-- ─────────────────────────────────────────────────────────────
-- TABLA: agency_theme (configuración visual del sitio)
-- One-to-one con agencies. Controla colores, fuentes y layout.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agency_theme (
  agency_id                  UUID PRIMARY KEY REFERENCES agencies(id) ON DELETE CASCADE,
  logo_url                   TEXT,
  favicon_url                TEXT,
  hero_image_url             TEXT,
  primary_color              TEXT NOT NULL DEFAULT '#FF6B6B',
  secondary_color            TEXT NOT NULL DEFAULT '#2D7D5F',
  accent_color               TEXT NOT NULL DEFAULT '#FFD93D',
  font_family                TEXT NOT NULL DEFAULT 'Inter',
  home_layout                TEXT NOT NULL DEFAULT 'classic-cta'
                               CHECK (home_layout IN ('classic-cta','visual-showcase','minimal-search','magazine')),
  property_card_style        TEXT NOT NULL DEFAULT 'bento'
                               CHECK (property_card_style IN ('bento','grid','list')),
  show_featured_section      BOOLEAN NOT NULL DEFAULT true,
  show_recent_section        BOOLEAN NOT NULL DEFAULT true,
  show_neighborhoods_section BOOLEAN NOT NULL DEFAULT false,
  custom_css                 TEXT,
  brandkit_md                TEXT,   -- Instrucciones de marca para el LLM (fase 3)
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER agency_theme_updated_at
  BEFORE UPDATE ON agency_theme
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- TABLA: agency_settings (configuración funcional)
-- One-to-one con agencies. Controla notificaciones, CRM, IA.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agency_settings (
  agency_id                 UUID PRIMARY KEY REFERENCES agencies(id) ON DELETE CASCADE,
  notify_on_new_lead        BOOLEAN NOT NULL DEFAULT true,
  notify_email              TEXT,
  notify_whatsapp           TEXT,
  whatsapp_phone_number_id  TEXT,          -- Meta Cloud API (fase 2)
  whatsapp_token_encrypted  TEXT,          -- Token cifrado con pgcrypto (fase 2)
  pipeline_stages           TEXT[] NOT NULL DEFAULT
                              ARRAY['new','contacted','interested','visit-scheduled','offer-sent','won','lost'],
  round_robin_enabled       BOOLEAN NOT NULL DEFAULT false,
  ai_features_enabled       BOOLEAN NOT NULL DEFAULT false,
  ai_monthly_token_limit    INTEGER,
  ai_tokens_used_this_month INTEGER NOT NULL DEFAULT 0,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER agency_settings_updated_at
  BEFORE UPDATE ON agency_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- TABLA: properties (propiedades inmobiliarias)
-- Tabla central de contenido de cada agencia.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id                 UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  slug                      TEXT NOT NULL,    -- único dentro de la agencia
  title                     TEXT NOT NULL,
  description               TEXT,
  operation                 TEXT NOT NULL
                              CHECK (operation IN ('venta','alquiler','alquiler-temporario')),
  type                      TEXT NOT NULL
                              CHECK (type IN ('casa','departamento','ph','terreno','local','oficina','cochera','galpon')),
  status                    TEXT NOT NULL DEFAULT 'available'
                              CHECK (status IN ('available','reserved','sold','rented','paused','draft')),
  price                     NUMERIC(15,2),
  currency                  TEXT NOT NULL DEFAULT 'USD'
                              CHECK (currency IN ('USD','ARS')),
  expenses                  NUMERIC(12,2),
  expenses_currency         TEXT NOT NULL DEFAULT 'ARS'
                              CHECK (expenses_currency IN ('USD','ARS')),
  rooms                     SMALLINT,
  bedrooms                  SMALLINT,
  bathrooms                 SMALLINT,
  garages                   SMALLINT,
  covered_area              NUMERIC(8,2),    -- m²
  total_area                NUMERIC(8,2),    -- m²
  address                   TEXT,
  neighborhood              TEXT,
  city                      TEXT,
  province                  TEXT,
  country                   TEXT NOT NULL DEFAULT 'Argentina',
  latitude                  DOUBLE PRECISION,
  longitude                 DOUBLE PRECISION,
  show_exact_location       BOOLEAN NOT NULL DEFAULT true,
  is_featured               BOOLEAN NOT NULL DEFAULT false,
  amenities                 TEXT[] NOT NULL DEFAULT '{}',
  video_url                 TEXT,
  virtual_tour_url          TEXT,
  meta_title                TEXT,
  meta_description          TEXT,
  assigned_to               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  internal_notes            TEXT,
  exclusive                 BOOLEAN NOT NULL DEFAULT false,
  views_count               INTEGER NOT NULL DEFAULT 0,
  qr_scans_count            INTEGER NOT NULL DEFAULT 0,
  ai_description_generated  BOOLEAN NOT NULL DEFAULT false,
  ai_last_generated_at      TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(agency_id, slug)
);

-- Índices para queries frecuentes (listados, filtros, búsqueda)
CREATE INDEX IF NOT EXISTS properties_agency_id_idx   ON properties(agency_id);
CREATE INDEX IF NOT EXISTS properties_status_idx      ON properties(status);
CREATE INDEX IF NOT EXISTS properties_operation_idx   ON properties(operation);
CREATE INDEX IF NOT EXISTS properties_type_idx        ON properties(type);
CREATE INDEX IF NOT EXISTS properties_is_featured_idx ON properties(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS properties_neighborhood_idx ON properties(neighborhood);
CREATE INDEX IF NOT EXISTS properties_created_at_idx  ON properties(created_at DESC);
-- Búsqueda full-text en título y descripción
CREATE INDEX IF NOT EXISTS properties_title_trgm_idx  ON properties USING gin(title gin_trgm_ops);

CREATE TRIGGER properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- TABLA: property_images (galería de fotos)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agency_id     UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  url           TEXT NOT NULL,               -- URL pública (Supabase Storage o externa)
  storage_path  TEXT,                        -- Path en Supabase Storage (null si es URL externa)
  alt_text      TEXT,
  position      SMALLINT NOT NULL DEFAULT 0, -- Orden de visualización
  is_cover      BOOLEAN NOT NULL DEFAULT false,
  width         INTEGER,
  height        INTEGER,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS property_images_property_id_idx ON property_images(property_id);
CREATE INDEX IF NOT EXISTS property_images_agency_id_idx   ON property_images(agency_id);
-- Solo puede haber UNA imagen de portada por propiedad
CREATE UNIQUE INDEX IF NOT EXISTS property_images_cover_unique
  ON property_images(property_id)
  WHERE is_cover = true;

-- ─────────────────────────────────────────────────────────────
-- TABLA: leads (consultas entrantes)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id                 UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  property_id               UUID REFERENCES properties(id) ON DELETE SET NULL,
  name                      TEXT NOT NULL,
  email                     TEXT,
  phone                     TEXT,
  whatsapp                  TEXT,
  message                   TEXT,
  lead_type                 TEXT NOT NULL DEFAULT 'inquiry'
                              CHECK (lead_type IN ('inquiry','valuation','general','qr-scan')),
  source                    TEXT,             -- 'web', 'qr', 'whatsapp', 'manual', etc.
  utm_source                TEXT,
  utm_medium                TEXT,
  utm_campaign              TEXT,
  status                    TEXT NOT NULL DEFAULT 'new'
                              CHECK (status IN ('new','contacted','interested','visit-scheduled','offer-sent','won','lost')),
  assigned_to               UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Campos extra para leads de tasación
  valuation_property_type   TEXT,
  valuation_address         TEXT,
  valuation_rooms           SMALLINT,
  valuation_area            NUMERIC(8,2),
  internal_notes            TEXT,
  next_action_at            TIMESTAMPTZ,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_agency_id_idx    ON leads(agency_id);
CREATE INDEX IF NOT EXISTS leads_status_idx       ON leads(status);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx  ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS leads_created_at_idx   ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS leads_property_id_idx  ON leads(property_id);

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─────────────────────────────────────────────────────────────
-- TABLA: lead_events (timeline inmutable del lead)
-- Registro de auditoría: cada acción queda grabada para siempre.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lead_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id     UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agency_id   UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event_type  TEXT NOT NULL
                CHECK (event_type IN ('created','status-change','note','email-sent','whatsapp-sent','visit','assigned')),
  payload     JSONB,          -- Datos extra según el tipo de evento
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lead_events_lead_id_idx   ON lead_events(lead_id);
CREATE INDEX IF NOT EXISTS lead_events_agency_id_idx ON lead_events(agency_id);
CREATE INDEX IF NOT EXISTS lead_events_created_at_idx ON lead_events(created_at DESC);

-- ─────────────────────────────────────────────────────────────
-- TABLA: platform_plans (planes de suscripción)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_plans (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code                 TEXT NOT NULL UNIQUE
                         CHECK (code IN ('starter','pro','business','enterprise')),
  name                 TEXT NOT NULL,
  price_usd_monthly    NUMERIC(8,2) NOT NULL DEFAULT 0,
  price_usd_setup      NUMERIC(8,2) NOT NULL DEFAULT 0,
  max_properties       INTEGER,       -- NULL = ilimitado
  max_users            INTEGER,       -- NULL = ilimitado
  max_custom_domain    BOOLEAN NOT NULL DEFAULT false,
  features             TEXT[] NOT NULL DEFAULT '{}',
  is_public            BOOLEAN NOT NULL DEFAULT true,
  is_active            BOOLEAN NOT NULL DEFAULT true
);

-- FK desde agencies a platform_plans
ALTER TABLE agencies
  ADD CONSTRAINT agencies_plan_id_fk
  FOREIGN KEY (plan_id) REFERENCES platform_plans(id) ON DELETE SET NULL;

-- ─────────────────────────────────────────────────────────────
-- TABLA: platform_settings (configuración global — singleton)
-- Solo puede existir UNA fila con id=1.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_settings (
  id                          SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  current_llm_provider        TEXT NOT NULL DEFAULT 'anthropic'
                                CHECK (current_llm_provider IN ('anthropic','openai','openrouter','google')),
  current_llm_model           TEXT NOT NULL DEFAULT 'claude-sonnet-4-6',
  fallback_llm_model          TEXT,
  ai_globally_enabled         BOOLEAN NOT NULL DEFAULT false,
  whatsapp_globally_enabled   BOOLEAN NOT NULL DEFAULT false,
  resend_status               TEXT NOT NULL DEFAULT 'ok'
                                CHECK (resend_status IN ('ok','degraded','down')),
  supabase_status             TEXT NOT NULL DEFAULT 'ok'
                                CHECK (supabase_status IN ('ok','degraded','down')),
  llm_status                  TEXT NOT NULL DEFAULT 'ok'
                                CHECK (llm_status IN ('ok','degraded','down')),
  whatsapp_status             TEXT NOT NULL DEFAULT 'ok'
                                CHECK (whatsapp_status IN ('ok','degraded','down')),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER platform_settings_updated_at
  BEFORE UPDATE ON platform_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar la fila única ahora (no en seed, porque es infraestructura)
INSERT INTO platform_settings DEFAULT VALUES
  ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- TABLA: platform_usage (métricas de consumo por tenant/mes)
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS platform_usage (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id               UUID REFERENCES agencies(id) ON DELETE SET NULL,
  period_month            DATE NOT NULL,           -- Primer día del mes: '2026-06-01'
  llm_provider            TEXT,
  llm_model               TEXT,
  llm_input_tokens        INTEGER NOT NULL DEFAULT 0,
  llm_output_tokens       INTEGER NOT NULL DEFAULT 0,
  llm_cost_usd            NUMERIC(10,6) NOT NULL DEFAULT 0,
  whatsapp_messages_sent  INTEGER NOT NULL DEFAULT 0,
  whatsapp_cost_usd       NUMERIC(10,4) NOT NULL DEFAULT 0,
  emails_sent             INTEGER NOT NULL DEFAULT 0,
  storage_mb              NUMERIC(10,2) NOT NULL DEFAULT 0,
  properties_count        INTEGER NOT NULL DEFAULT 0,
  leads_count             INTEGER NOT NULL DEFAULT 0,
  UNIQUE(agency_id, period_month)
);

CREATE INDEX IF NOT EXISTS platform_usage_agency_id_idx    ON platform_usage(agency_id);
CREATE INDEX IF NOT EXISTS platform_usage_period_month_idx ON platform_usage(period_month DESC);

-- ─────────────────────────────────────────────────────────────
-- TABLA: qr_scans (scans de QR de carteles físicos)
-- Inmutable — no tiene UPDATE ni DELETE por diseño.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS qr_scans (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id   UUID REFERENCES properties(id) ON DELETE SET NULL,
  agency_id     UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  utm_campaign  TEXT,
  scanned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  user_agent    TEXT,
  ip_hash       TEXT  -- Hash del IP del visitante (nunca el IP real — privacidad)
);

CREATE INDEX IF NOT EXISTS qr_scans_property_id_idx ON qr_scans(property_id);
CREATE INDEX IF NOT EXISTS qr_scans_agency_id_idx   ON qr_scans(agency_id);
CREATE INDEX IF NOT EXISTS qr_scans_scanned_at_idx  ON qr_scans(scanned_at DESC);

-- ─────────────────────────────────────────────────────────────
-- Storage buckets (ejecutar separado en Supabase Studio si falla)
-- ─────────────────────────────────────────────────────────────
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('properties',      'properties',       true,  10485760, ARRAY['image/jpeg','image/png','image/webp','image/avif']),
  ('agency-assets',   'agency-assets',    true,  5242880,  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml','image/x-icon']),
  ('pdfs',            'pdfs',             false, 20971520, ARRAY['application/pdf']),
  ('internal-docs',   'internal-docs',    false, 20971520, NULL)
ON CONFLICT (id) DO NOTHING;
