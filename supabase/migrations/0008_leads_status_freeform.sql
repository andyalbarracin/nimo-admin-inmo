-- 0008_leads_status_freeform.sql
-- ───────────────────────────────────────────────────────────────────────────
-- El CRM de la inmobiliaria ahora permite renombrar/agregar etapas del kanban
-- (editor de etapas en la UI). Las etapas custom se guardan como `leads.status`
-- con un id arbitrario (ej. 'st-1736...'), por lo que el CHECK fijo de 0001
-- (new/contacted/interested/visit-scheduled/offer-sent/won/lost) las rechaza.
--
-- Relajamos la columna a texto libre. Mantenemos NOT NULL y el DEFAULT 'new'.
-- El índice leads_status_idx y la app siguen funcionando igual.
-- ───────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  cname text;
BEGIN
  -- El CHECK inline de 0001 recibe un nombre autogenerado (típicamente
  -- leads_status_check). Lo buscamos por su definición para borrarlo sin
  -- depender del nombre exacto.
  SELECT conname INTO cname
  FROM pg_constraint
  WHERE conrelid = 'public.leads'::regclass
    AND contype = 'c'
    AND pg_get_constraintdef(oid) ILIKE '%status%';

  IF cname IS NOT NULL THEN
    EXECUTE format('ALTER TABLE public.leads DROP CONSTRAINT %I', cname);
  END IF;
END $$;
