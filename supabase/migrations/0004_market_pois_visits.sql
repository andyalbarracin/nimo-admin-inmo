-- ════════════════════════════════════════════════════════════════════
-- 0004 · Datos dinámicos de los themes públicos (Universo C)
-- ════════════════════════════════════════════════════════════════════
-- Reemplaza la data hoy ficticia/estática en los componentes de tema:
--   · property_pois             → "El entorno" (puntos cercanos en C2/C5/C7)
--   · property_visits           → "Agendar visita" (slots/calendario C2/C5/C7)
--   · neighborhood_market_stats → "USD/m² del barrio" + ticker (C3/C5)
--   · properties.is_opportunity → sección "Oportunidad" (C3) + badge
--   · properties.orientation / age_years / floor / total_floors / floor_plan_url
--                               → ficha técnica + plano (C2/C5/C7)
--
-- Es ADITIVA (ALTER ... ADD COLUMN IF NOT EXISTS + CREATE TABLE IF NOT EXISTS).
-- Calca las convenciones de 0002: is_super_admin(), is_member_of(agency_id[, rol]),
-- lectura pública de disponibles, INSERT público para formularios.
-- Ejecutar en el SQL Editor de Supabase. No corre solo.
-- ════════════════════════════════════════════════════════════════════

BEGIN;

-- ─────────────────────────────────────────────────────────────
-- 1. properties · columnas nuevas
-- ─────────────────────────────────────────────────────────────
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS is_opportunity  BOOLEAN  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS orientation     TEXT,                  -- 'N','NE','E','SE','S','SO','O','NO'
  ADD COLUMN IF NOT EXISTS age_years       SMALLINT,              -- antigüedad en años (0 = a estrenar)
  ADD COLUMN IF NOT EXISTS floor           SMALLINT,              -- piso de la unidad
  ADD COLUMN IF NOT EXISTS total_floors    SMALLINT,              -- pisos del edificio
  ADD COLUMN IF NOT EXISTS floor_plan_url  TEXT;                  -- imagen del plano (Storage)

-- Una sola "oportunidad" destacada por agencia a la vez (índice parcial).
CREATE UNIQUE INDEX IF NOT EXISTS uniq_opportunity_per_agency
  ON properties (agency_id)
  WHERE is_opportunity;

-- ─────────────────────────────────────────────────────────────
-- 2. property_pois · puntos de interés cercanos ("El entorno")
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_pois (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id  UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agency_id    UUID NOT NULL REFERENCES agencies(id)   ON DELETE CASCADE,  -- denormalizado para RLS (igual que property_images)
  name         TEXT NOT NULL,                       -- "Parque de los Niños"
  category     TEXT NOT NULL DEFAULT 'servicios'
                 CHECK (category IN ('verde','transporte','gastro','educacion','salud','servicios','comercial')),
  distance_m   INTEGER,                             -- metros a pie
  latitude     DOUBLE PRECISION,
  longitude    DOUBLE PRECISION,
  sort         SMALLINT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_property_pois_property ON property_pois(property_id);

ALTER TABLE property_pois ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pois: lectura pública de disponibles" ON property_pois
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM properties p WHERE p.id = property_id AND p.status = 'available')
  );
CREATE POLICY "pois: miembros ven todos" ON property_pois
  FOR SELECT USING (is_super_admin() OR is_member_of(agency_id));
CREATE POLICY "pois: agentes pueden crear" ON property_pois
  FOR INSERT WITH CHECK (is_super_admin() OR is_member_of(agency_id, 'agent'));
CREATE POLICY "pois: agentes pueden editar" ON property_pois
  FOR UPDATE USING (is_super_admin() OR is_member_of(agency_id, 'agent'))
             WITH CHECK (is_super_admin() OR is_member_of(agency_id, 'agent'));
CREATE POLICY "pois: agentes pueden eliminar" ON property_pois
  FOR DELETE USING (is_super_admin() OR is_member_of(agency_id, 'agent'));

-- ─────────────────────────────────────────────────────────────
-- 3. property_visits · turnos de visita ("Agendar visita")
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS property_visits (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id    UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  agency_id      UUID NOT NULL REFERENCES agencies(id)   ON DELETE CASCADE,
  lead_id        UUID REFERENCES leads(id) ON DELETE SET NULL,
  visitor_name   TEXT NOT NULL,
  visitor_phone  TEXT,
  visitor_email  TEXT,
  slot_at        TIMESTAMPTZ NOT NULL,                -- fecha+hora elegida
  status         TEXT NOT NULL DEFAULT 'requested'
                   CHECK (status IN ('requested','confirmed','done','cancelled','no_show')),
  channel        TEXT NOT NULL DEFAULT 'web'
                   CHECK (channel IN ('web','whatsapp','phone','manual')),
  notes          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_property_visits_property ON property_visits(property_id);
CREATE INDEX IF NOT EXISTS idx_property_visits_agenda   ON property_visits(agency_id, slot_at);

ALTER TABLE property_visits ENABLE ROW LEVEL SECURITY;

-- PÚBLICO: el visitante puede solicitar un turno desde el sitio (igual que leads).
CREATE POLICY "visits: formulario público puede crear" ON property_visits
  FOR INSERT WITH CHECK (true);  -- la app valida; opcional: forzar status = 'requested'
CREATE POLICY "visits: miembros pueden ver" ON property_visits
  FOR SELECT USING (is_super_admin() OR is_member_of(agency_id));
CREATE POLICY "visits: agentes pueden gestionar" ON property_visits
  FOR UPDATE USING (is_super_admin() OR is_member_of(agency_id, 'agent'))
             WITH CHECK (is_super_admin() OR is_member_of(agency_id, 'agent'));
CREATE POLICY "visits: admins pueden eliminar" ON property_visits
  FOR DELETE USING (is_super_admin() OR is_member_of(agency_id, 'admin'));

-- ─────────────────────────────────────────────────────────────
-- 4. neighborhood_market_stats · USD/m² por barrio (serie mensual)
--    Alimenta el chart de C5, el ticker de C3 y la comparación
--    "esta propiedad vs promedio del barrio".
--    Es data de PLATAFORMA (compartida), gestionada por el superadmin.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS neighborhood_market_stats (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city          TEXT NOT NULL,
  neighborhood  TEXT NOT NULL,
  operation     TEXT NOT NULL DEFAULT 'venta' CHECK (operation IN ('venta','alquiler')),
  month         DATE NOT NULL,                       -- primer día del mes (2026-06-01)
  usd_per_m2    NUMERIC(10,2) NOT NULL,
  sample_size   INTEGER,                             -- nº de avisos que promedian el dato
  source        TEXT,                                -- 'manual','feed-XYZ',...
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (city, neighborhood, operation, month)
);
CREATE INDEX IF NOT EXISTS idx_market_lookup ON neighborhood_market_stats(city, neighborhood, operation, month DESC);

ALTER TABLE neighborhood_market_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "market: lectura pública" ON neighborhood_market_stats
  FOR SELECT USING (true);
CREATE POLICY "market: superadmin gestiona" ON neighborhood_market_stats
  FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());

-- Vista: último valor por barrio + variación mensual (MoM), lista para el front.
CREATE OR REPLACE VIEW neighborhood_market_latest AS
SELECT DISTINCT ON (city, neighborhood, operation)
  city, neighborhood, operation, month, usd_per_m2,
  usd_per_m2 - LAG(usd_per_m2) OVER (
    PARTITION BY city, neighborhood, operation ORDER BY month
  ) AS mom_abs
FROM neighborhood_market_stats
ORDER BY city, neighborhood, operation, month DESC;

COMMIT;

-- ════════════════════════════════════════════════════════════════════
-- SEED opcional (descomentar). Valores de referencia Argentina 2026.
-- La serie completa de 12 meses conviene cargarla desde una fuente real.
-- ════════════════════════════════════════════════════════════════════
-- INSERT INTO neighborhood_market_stats (city, neighborhood, operation, month, usd_per_m2, source) VALUES
--   ('Buenos Aires','Palermo','venta','2026-06-01', 2480, 'manual'),
--   ('Buenos Aires','Belgrano','venta','2026-06-01', 2310, 'manual'),
--   ('Buenos Aires','Núñez','venta','2026-06-01', 2420, 'manual'),
--   ('Buenos Aires','Recoleta','venta','2026-06-01', 2690, 'manual'),
--   ('Buenos Aires','Caballito','venta','2026-06-01', 1980, 'manual'),
--   ('Buenos Aires','Colegiales','venta','2026-06-01', 2250, 'manual'),
--   ('Buenos Aires','Villa Crespo','venta','2026-06-01', 1870, 'manual')
-- ON CONFLICT (city, neighborhood, operation, month) DO UPDATE SET usd_per_m2 = EXCLUDED.usd_per_m2;

-- ════════════════════════════════════════════════════════════════════
-- POBLAR POIs REALES (no requiere schema, es ingesta de datos):
-- Para cada propiedad, consultar OpenStreetMap Overpass API alrededor de
-- (latitude, longitude) por amenities (parque, estación, escuela, etc.) e
-- insertar filas en property_pois. La distancia se calcula con la fórmula
-- haversine entre el POI y la propiedad. Alternativa: Google Places Nearby.
-- ════════════════════════════════════════════════════════════════════
