-- ════════════════════════════════════════════════════════════════════
-- 0005 · Campos extendidos del CRM de leads
-- ════════════════════════════════════════════════════════════════════
-- Da soporte al drawer de alta/edición del CRM de la inmobiliaria
-- (components/crm/crm-client.tsx). Aditiva. No cambia RLS: la tabla
-- `leads` ya tiene sus policies en 0002.
--
-- Nota de mapeo: el front usa stages 'new/contacted/interested/visit/
-- proposal/won/lost'. La columna `leads.status` (0001) usa
-- 'new/contacted/interested/visit-scheduled/offer-sent/won/lost'.
-- El mapeo visit→visit-scheduled y proposal→offer-sent lo hace la app.
-- ════════════════════════════════════════════════════════════════════

BEGIN;

ALTER TABLE leads
  ADD COLUMN IF NOT EXISTS client_type        TEXT
    CHECK (client_type IN ('comprador','inquilino','vendedor','propietario','inversor')),
  ADD COLUMN IF NOT EXISTS operation_interest TEXT
    CHECK (operation_interest IN ('venta','alquiler')),
  ADD COLUMN IF NOT EXISTS budget             TEXT,             -- texto libre: "USD 150.000", "ARS 800k/mes"
  ADD COLUMN IF NOT EXISTS property_interest  TEXT,             -- descripción libre del interés (además del property_id FK)
  ADD COLUMN IF NOT EXISTS contact2_name      TEXT,             -- contacto secundario (cónyuge, socio, etc.)
  ADD COLUMN IF NOT EXISTS contact2_phone     TEXT;

-- Índice útil para filtrar el pipeline por tipo de cliente en el CRM.
CREATE INDEX IF NOT EXISTS idx_leads_client_type ON leads(agency_id, client_type);

COMMIT;
