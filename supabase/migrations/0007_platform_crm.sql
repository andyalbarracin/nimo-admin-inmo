-- ════════════════════════════════════════════════════════════════════
-- 0007 · CRM de plataforma (los clientes/leads B2B del superadmin)
-- ════════════════════════════════════════════════════════════════════
-- Persiste el "CRM — MIS CLIENTES" del superadmin. Distinto de `leads`
-- (esos son los leads de cada inmobiliaria/tenant). Solo superadmin.
-- Incluye seed de los 7 leads demo. Ejecutar en el SQL Editor de Supabase.
-- ════════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS platform_crm_leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stage       TEXT NOT NULL DEFAULT 'prospect'
                CHECK (stage IN ('prospect','contacted','demo','proposal','negotiation','client','churn_risk')),
  company     TEXT NOT NULL,
  contact     TEXT,
  city        TEXT,
  email       TEXT,
  phone1      TEXT,
  phone2      TEXT,
  address     TEXT,
  plan        TEXT,                         -- Starter/Pro/Business/Enterprise
  monthly     NUMERIC(10,2) NOT NULL DEFAULT 0,
  source      TEXT,                         -- cómo nos conoció
  budget      TEXT,
  notes       TEXT,
  files       JSONB NOT NULL DEFAULT '[]',  -- [{ name, url }] (Storage crm-files)
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE platform_crm_leads ENABLE ROW LEVEL SECURITY;

-- Solo el superadmin ve y gestiona este CRM.
CREATE POLICY "platform_crm: superadmin gestiona" ON platform_crm_leads
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());

-- Seed demo (solo si la tabla está vacía).
INSERT INTO platform_crm_leads (stage, company, contact, city, email, phone1, plan, monthly, source, budget, notes)
SELECT * FROM (VALUES
  ('demo','Inmobiliaria Roca','Martín Roca','Rosario','martin@roca.com.ar','+54 9 341 442-1111','Pro',59,'Recomendación','USD 700/año','Tiene 3 asesores, viene de otro CMS. Interesado en IA.'),
  ('proposal','Grupo Sur','Laura Herrera','Buenos Aires','laura@gruposur.com','+54 11 4555-7890','Business',119,'Búsqueda web','USD 1.400/año','Llamar para cerrar. Pidieron propuesta formal.'),
  ('contacted','Propiedades del Norte','Carlos Vega','Córdoba','carlos@delnorte.com','+54 351 422-0000','Starter',29,'Instagram',NULL,'Unipersonal, sensible al precio. Ofrecer plan anual.'),
  ('client','Realty BA','Ana Torres','Buenos Aires','ana@realtyba.com','+54 11 4001-2222','Pro',59,'Evento / feria',NULL,'Cliente activo. Check-in mensual.'),
  ('prospect','Gestión Integral','Roberto Díaz','Rosario','roberto@gintegral.com','+54 341 488-0000','Pro',59,'Llamada en frío',NULL,'Primer contacto. Agendar demo.'),
  ('negotiation','Casas & Campos','Sandra Ruiz','Pilar','sandra@casasycampos.com','+54 11 4900-3333','Business',119,'Recomendación','USD 1.300/año','Enviar contrato — piden 10% dto anual.'),
  ('churn_risk','InmoRed Patagonia','Diego Alvarado','Bariloche','diego@inmored.com','+54 294 445-0000','Pro',59,'Webinar',NULL,'URGENTE: sin login en 3 semanas. Posible abandono.')
) AS v(stage, company, contact, city, email, phone1, plan, monthly, source, budget, notes)
WHERE NOT EXISTS (SELECT 1 FROM platform_crm_leads);

COMMIT;
