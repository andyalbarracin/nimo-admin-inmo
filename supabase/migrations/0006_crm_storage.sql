-- ════════════════════════════════════════════════════════════════════
-- 0006 · Storage para archivos del CRM superadmin (propuestas, handoff, invoices)
-- ════════════════════════════════════════════════════════════════════
-- Crea el bucket 'crm-files' usado por components/superadmin/sales-lead-drawer
-- a través de la server action uploadCrmFile (admin client / service_role).
-- Ejecutar en el SQL Editor de Supabase.
-- ════════════════════════════════════════════════════════════════════

-- Bucket público para el demo (descarga directa por URL).
-- En producción conviene private + URLs firmadas (createSignedUrl).
INSERT INTO storage.buckets (id, name, public)
VALUES ('crm-files', 'crm-files', true)
ON CONFLICT (id) DO NOTHING;

-- Lectura pública de los archivos del bucket (para los links de descarga del demo).
-- (Con bucket public = true alcanza; esta policy lo deja explícito.)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND policyname = 'crm-files lectura pública'
  ) THEN
    CREATE POLICY "crm-files lectura pública" ON storage.objects
      FOR SELECT USING (bucket_id = 'crm-files');
  END IF;
END $$;

-- La escritura se hace con service_role (admin client) desde el server, que
-- bypassea RLS, por lo que no hace falta policy de INSERT para el demo.
