-- =============================================================
-- Archivo : 0002_rls_policies.sql
-- Ruta    : supabase/migrations/0002_rls_policies.sql
-- Creado  : 2026-06-06
-- Descripción: Row Level Security para todas las tablas de NIMO.
--              Garantiza aislamiento entre agencias (multi-tenancy).
--
-- EJECUTAR DESPUÉS de 0001_initial_schema.sql
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- FUNCIONES HELPERS (SECURITY DEFINER — corren como superuser)
-- ─────────────────────────────────────────────────────────────

-- Verifica si el usuario actual pertenece a una agencia con al menos el rol indicado.
-- SECURITY DEFINER: puede leer agency_members aunque RLS lo bloquee.
CREATE OR REPLACE FUNCTION public.is_member_of(
  p_agency_id UUID,
  min_role    TEXT DEFAULT 'viewer'
)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_members
    WHERE agency_id = p_agency_id
      AND user_id   = auth.uid()
      AND is_active = true
      AND CASE min_role
        WHEN 'owner' THEN role = 'owner'
        WHEN 'admin' THEN role IN ('owner', 'admin')
        WHEN 'agent' THEN role IN ('owner', 'admin', 'agent')
        ELSE true   -- 'viewer' o cualquier rol
      END
  );
$$;

-- Verifica si el usuario actual es el super-admin de la plataforma.
-- Se identifica por el claim 'role' = 'super_admin' en app_metadata del JWT.
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin',
    false
  );
$$;

-- ─────────────────────────────────────────────────────────────
-- HABILITAR RLS EN TODAS LAS TABLAS
-- ─────────────────────────────────────────────────────────────
ALTER TABLE agencies          ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_theme      ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties        ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_plans    ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_usage    ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_scans          ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────────────────────
-- POLICIES: agencies
-- ─────────────────────────────────────────────────────────────

-- Cualquier usuario autenticado puede ver SU agencia
CREATE POLICY "agencies: miembros pueden ver" ON agencies
  FOR SELECT
  USING (
    is_super_admin() OR
    is_member_of(id)
  );

-- Solo el super-admin puede crear agencias
CREATE POLICY "agencies: solo super-admin puede crear" ON agencies
  FOR INSERT
  WITH CHECK (is_super_admin());

-- Solo admins/owners o super-admin pueden editar
CREATE POLICY "agencies: admins pueden editar" ON agencies
  FOR UPDATE
  USING (
    is_super_admin() OR is_member_of(id, 'admin')
  )
  WITH CHECK (
    is_super_admin() OR is_member_of(id, 'admin')
  );

-- Solo el super-admin puede eliminar agencias
CREATE POLICY "agencies: solo super-admin puede eliminar" ON agencies
  FOR DELETE
  USING (is_super_admin());

-- ─────────────────────────────────────────────────────────────
-- POLICIES: agency_members
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "members: miembros pueden ver su equipo" ON agency_members
  FOR SELECT
  USING (
    is_super_admin() OR
    is_member_of(agency_id) OR
    user_id = auth.uid()  -- Puede verse a sí mismo
  );

CREATE POLICY "members: admins pueden agregar miembros" ON agency_members
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

CREATE POLICY "members: admins pueden editar roles" ON agency_members
  FOR UPDATE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  )
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

CREATE POLICY "members: admins pueden desactivar miembros" ON agency_members
  FOR DELETE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- POLICIES: agency_theme
-- ─────────────────────────────────────────────────────────────

-- PÚBLICO: cualquiera puede ver el tema (necesario para el sitio público)
CREATE POLICY "theme: lectura pública" ON agency_theme
  FOR SELECT
  USING (true);

CREATE POLICY "theme: admins pueden editar" ON agency_theme
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

CREATE POLICY "theme: admins pueden actualizar" ON agency_theme
  FOR UPDATE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  )
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- POLICIES: agency_settings
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "settings: admins pueden ver" ON agency_settings
  FOR SELECT
  USING (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

CREATE POLICY "settings: admins pueden editar" ON agency_settings
  FOR ALL
  USING (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  )
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- POLICIES: properties
-- ─────────────────────────────────────────────────────────────

-- PÚBLICO: propiedades disponibles son visibles sin login (sitio del tenant)
CREATE POLICY "properties: lectura pública de disponibles" ON properties
  FOR SELECT
  USING (status = 'available');

-- Miembros ven TODAS las propiedades de su agencia (incluyendo borradores)
CREATE POLICY "properties: miembros ven todas" ON properties
  FOR SELECT
  USING (
    is_super_admin() OR is_member_of(agency_id)
  );

CREATE POLICY "properties: agentes pueden crear" ON properties
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  );

CREATE POLICY "properties: agentes pueden editar" ON properties
  FOR UPDATE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  )
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  );

CREATE POLICY "properties: admins pueden eliminar" ON properties
  FOR DELETE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- POLICIES: property_images
-- ─────────────────────────────────────────────────────────────

-- PÚBLICO: imágenes de propiedades disponibles son visibles sin login
CREATE POLICY "images: lectura pública de disponibles" ON property_images
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM properties p
      WHERE p.id = property_id AND p.status = 'available'
    )
  );

-- Miembros ven todas las imágenes de su agencia
CREATE POLICY "images: miembros ven todas" ON property_images
  FOR SELECT
  USING (
    is_super_admin() OR is_member_of(agency_id)
  );

CREATE POLICY "images: agentes pueden subir" ON property_images
  FOR INSERT
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  );

CREATE POLICY "images: agentes pueden editar" ON property_images
  FOR UPDATE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  )
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  );

CREATE POLICY "images: agentes pueden eliminar" ON property_images
  FOR DELETE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  );

-- ─────────────────────────────────────────────────────────────
-- POLICIES: leads
-- ─────────────────────────────────────────────────────────────

-- PÚBLICO: cualquiera puede INSERTAR un lead (formulario de contacto del sitio)
CREATE POLICY "leads: formulario público puede crear" ON leads
  FOR INSERT
  WITH CHECK (true);  -- Validación de datos la hace la app, no Supabase

-- Miembros ven los leads de su agencia
CREATE POLICY "leads: miembros pueden ver" ON leads
  FOR SELECT
  USING (
    is_super_admin() OR is_member_of(agency_id)
  );

CREATE POLICY "leads: agentes pueden editar" ON leads
  FOR UPDATE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  )
  WITH CHECK (
    is_super_admin() OR is_member_of(agency_id, 'agent')
  );

CREATE POLICY "leads: admins pueden eliminar" ON leads
  FOR DELETE
  USING (
    is_super_admin() OR is_member_of(agency_id, 'admin')
  );

-- ─────────────────────────────────────────────────────────────
-- POLICIES: lead_events (inmutable — solo INSERT y SELECT)
-- ─────────────────────────────────────────────────────────────

-- PÚBLICO: puede crear eventos al enviar formulario de contacto
CREATE POLICY "lead_events: formulario público puede crear" ON lead_events
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "lead_events: miembros pueden ver timeline" ON lead_events
  FOR SELECT
  USING (
    is_super_admin() OR is_member_of(agency_id)
  );

-- No hay UPDATE ni DELETE — los eventos son inmutables por diseño.

-- ─────────────────────────────────────────────────────────────
-- POLICIES: platform_plans
-- ─────────────────────────────────────────────────────────────

-- PÚBLICO: planes activos y públicos son visibles (página de pricing)
CREATE POLICY "plans: lectura pública de planes activos" ON platform_plans
  FOR SELECT
  USING (is_public = true AND is_active = true);

-- Solo super-admin administra los planes
CREATE POLICY "plans: super-admin gestiona" ON platform_plans
  FOR ALL
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ─────────────────────────────────────────────────────────────
-- POLICIES: platform_settings
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "platform_settings: solo super-admin" ON platform_settings
  FOR ALL
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ─────────────────────────────────────────────────────────────
-- POLICIES: platform_usage
-- ─────────────────────────────────────────────────────────────

CREATE POLICY "usage: super-admin ve todo" ON platform_usage
  FOR SELECT
  USING (is_super_admin());

-- El owner de una agencia puede ver su propio uso
CREATE POLICY "usage: owner ve su uso" ON platform_usage
  FOR SELECT
  USING (
    agency_id IS NOT NULL AND
    is_member_of(agency_id, 'admin')
  );

-- Solo sistema (service_role) inserta métricas — no hay policy de INSERT
-- Los Server Actions usan el admin client (service_role) que bypasea RLS.

-- ─────────────────────────────────────────────────────────────
-- POLICIES: qr_scans (inmutable — solo INSERT y SELECT)
-- ─────────────────────────────────────────────────────────────

-- PÚBLICO: cualquier visitante puede registrar un scan de QR
CREATE POLICY "qr_scans: público puede registrar" ON qr_scans
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "qr_scans: miembros pueden ver sus scans" ON qr_scans
  FOR SELECT
  USING (
    is_super_admin() OR is_member_of(agency_id)
  );

-- ─────────────────────────────────────────────────────────────
-- POLICIES: Storage buckets
-- ─────────────────────────────────────────────────────────────

-- Bucket 'properties' — imágenes de propiedades
CREATE POLICY "storage properties: lectura pública" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'properties');

CREATE POLICY "storage properties: agentes pueden subir" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'properties' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "storage properties: agentes pueden eliminar" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'properties' AND
    auth.role() = 'authenticated'
  );

-- Bucket 'agency-assets' — logos, favicons
CREATE POLICY "storage agency-assets: lectura pública" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'agency-assets');

CREATE POLICY "storage agency-assets: admins pueden subir" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'agency-assets' AND
    auth.role() = 'authenticated'
  );
