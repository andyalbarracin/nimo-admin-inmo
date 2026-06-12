-- 0010_replan_pricing.sql
-- ───────────────────────────────────────────────────────────────────────────
-- Reestructura de planes: 4 commodity (starter/pro/business/enterprise) → 3
-- (esencial / profesional / a_medida). Setup siempre pago, SIN trial, dominio
-- propio incluido en los 3. El schema usa CHECK (no enum), así que se reemplazan
-- las constraints. Las agencias referencian plan_id (FK ON DELETE SET NULL).
--
-- IDEMPOTENTE: se puede correr de nuevo sin romper. Orden importante:
-- primero se BORRAN las filas viejas, recién después se agrega el CHECK nuevo.
-- Ejecutar en Supabase → SQL Editor.
-- ───────────────────────────────────────────────────────────────────────────

-- 1) Sacar el CHECK viejo y agregar la columna highlighted
ALTER TABLE platform_plans DROP CONSTRAINT IF EXISTS platform_plans_code_check;
ALTER TABLE platform_plans ADD COLUMN IF NOT EXISTS highlighted BOOLEAN NOT NULL DEFAULT false;

-- 2) Borrar las filas viejas ANTES de poner el CHECK nuevo
--    (al borrar, agencies.plan_id queda NULL por la FK ON DELETE SET NULL)
DELETE FROM platform_plans;

-- 3) Ahora sí, el CHECK nuevo (la tabla está vacía → no hay filas que lo violen)
ALTER TABLE platform_plans ADD CONSTRAINT platform_plans_code_check
  CHECK (code IN ('esencial','profesional','a_medida'));

-- 4) Insertar los 3 planes nuevos
INSERT INTO platform_plans
  (code, name, price_usd_monthly, price_usd_setup, max_properties, max_users, max_custom_domain, features, highlighted, is_public, is_active)
VALUES
  ('esencial', 'Esencial', 49, 490, 50, 2, true, ARRAY[
     'Hasta 50 propiedades activas','2 usuarios','1 tema premium a elección','Dominio propio incluido (1er año)',
     'CRM con tabla de leads','Formularios de contacto + WhatsApp','Mapa interactivo, fichas PDF y QR','Soporte por email (< 48 hs)'
   ], false, true, true),
  ('profesional', 'Profesional', 99, 990, NULL, 6, true, ARRAY[
     'Todo lo de Esencial, más:','Propiedades ilimitadas','6 usuarios','Los 3 temas premium','Dominio propio incluido (1er año)',
     'CRM con Kanban + notas por lead','WhatsApp integrado (click-to-chat)','Soporte por WhatsApp + email (< 24 hs)'
   ], true, true, true),
  ('a_medida', 'A medida', 199, 1990, NULL, NULL, true, ARRAY[
     'Todo lo de Profesional, más:','Usuarios ilimitados','Multi-sucursal con roles jerárquicos','Dominio propio incluido',
     'Integraciones a portales (a medida)','Reportes avanzados + dashboard ejecutivo','SLA 99.9% + soporte dedicado 24/7','Manager de cuenta asignado'
   ], false, true, true);

-- 5) agencies.plan_status: eliminar 'trial' (mapear a 'active') + default 'active'
UPDATE agencies SET plan_status = 'active' WHERE plan_status = 'trial';
ALTER TABLE agencies ALTER COLUMN plan_status SET DEFAULT 'active';
ALTER TABLE agencies DROP CONSTRAINT IF EXISTS agencies_plan_status_check;
ALTER TABLE agencies ADD CONSTRAINT agencies_plan_status_check
  CHECK (plan_status IN ('active','suspended','past_due','canceled'));
