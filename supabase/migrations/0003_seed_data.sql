-- =============================================================
-- Archivo : 0003_seed_data.sql
-- Ruta    : supabase/migrations/0003_seed_data.sql
-- Creado  : 2026-06-06
-- Descripción: Datos de demostración para NIMO.
--              Crea:
--                • 3 usuarios auth (super-admin + owner + agente)
--                • 4 planes de plataforma
--                • 1 agencia demo "López & Asociados"
--                • 10 propiedades con imágenes (Picsum Photos)
--                • 5 leads en distintas etapas del pipeline
--                • Timeline de eventos por lead
--
-- CREDENCIALES DEMO:
--   Super Admin   : admin@nimo.app  / nimo-demo
--   Owner agencia : owner@lopezasociados.com      / Lopez2024!
--   Agente        : agente@lopezasociados.com     / Lopez2024!
--
-- EJECUTAR DESPUÉS de 0001_initial_schema.sql y 0002_rls_policies.sql
-- =============================================================

-- ─────────────────────────────────────────────────────────────
-- UUIDs fijos para referenciarlos a lo largo del seed
-- ─────────────────────────────────────────────────────────────
-- Super admin   : f7c3d4a5-0001-0000-0000-000000000001
-- Demo owner    : f7c3d4a5-0001-0000-0000-000000000002
-- Demo agente   : f7c3d4a5-0001-0000-0000-000000000003
-- Demo agency   : a0000001-0001-0000-0000-000000000001
-- Properties    : b0000001-0001-0000-0000-00000000000X (X=1..10)
-- Leads         : c0000001-0001-0000-0000-00000000000X (X=1..5)
-- Plans         : d0000001-0001-0000-0000-00000000000X (X=1..4)

-- ─────────────────────────────────────────────────────────────
-- 1. USUARIOS AUTH
-- ─────────────────────────────────────────────────────────────

-- Super Admin (admin@nimo.app)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change, is_super_admin
) VALUES (
  'f7c3d4a5-0001-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'admin@nimo.app',
  crypt('nimo-demo', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"],"role":"super_admin"}',
  '{"name":"Administrador","avatar_url":null}',
  NOW(), NOW(), '', '', '', '', false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'f7c3d4a5-0001-0000-0000-000000000001',
  'admin@nimo.app',
  '{"sub":"f7c3d4a5-0001-0000-0000-000000000001","email":"admin@nimo.app"}',
  'email', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- Demo Owner (owner@lopezasociados.com)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change, is_super_admin
) VALUES (
  'f7c3d4a5-0001-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'owner@lopezasociados.com',
  crypt('Lopez2024!', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Roberto López","avatar_url":null}',
  NOW(), NOW(), '', '', '', '', false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'f7c3d4a5-0001-0000-0000-000000000002',
  'owner@lopezasociados.com',
  '{"sub":"f7c3d4a5-0001-0000-0000-000000000002","email":"owner@lopezasociados.com"}',
  'email', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- Demo Agente (agente@lopezasociados.com)
INSERT INTO auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token,
  email_change_token_new, email_change, is_super_admin
) VALUES (
  'f7c3d4a5-0001-0000-0000-000000000003',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'agente@lopezasociados.com',
  crypt('Lopez2024!', gen_salt('bf', 10)),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Valentina García","avatar_url":null}',
  NOW(), NOW(), '', '', '', '', false
) ON CONFLICT (id) DO NOTHING;

INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'f7c3d4a5-0001-0000-0000-000000000003',
  'agente@lopezasociados.com',
  '{"sub":"f7c3d4a5-0001-0000-0000-000000000003","email":"agente@lopezasociados.com"}',
  'email', NOW(), NOW(), NOW()
) ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 2. PLANES DE PLATAFORMA
-- ─────────────────────────────────────────────────────────────
INSERT INTO platform_plans (id, code, name, price_usd_monthly, price_usd_setup, max_properties, max_users, max_custom_domain, features, is_public, is_active)
VALUES
  (
    'd0000001-0001-0000-0000-000000000001',
    'starter', 'Starter',
    29, 0, 15, 2, false,
    ARRAY['Sitio web propio','Galería de fotos','Formulario de contacto','WhatsApp integrado','Hasta 15 propiedades'],
    true, true
  ),
  (
    'd0000001-0001-0000-0000-000000000002',
    'pro', 'Pro',
    59, 0, 50, 5, false,
    ARRAY['Todo Starter','CRM con Kanban','Hasta 50 propiedades','Hasta 5 usuarios','Notificaciones por email','QR de carteles','PDF de ficha técnica'],
    true, true
  ),
  (
    'd0000001-0001-0000-0000-000000000003',
    'business', 'Business',
    99, 150, NULL, 20, true,
    ARRAY['Todo Pro','Propiedades ilimitadas','Hasta 20 usuarios','Dominio personalizado','Notificaciones WhatsApp','Estadísticas avanzadas','Soporte prioritario'],
    true, true
  ),
  (
    'd0000001-0001-0000-0000-000000000004',
    'enterprise', 'Enterprise',
    199, 500, NULL, NULL, true,
    ARRAY['Todo Business','Usuarios ilimitados','IA generativa de descripciones','API access','SLA garantizado','Onboarding personalizado','Cuenta manager dedicado'],
    true, true
  )
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 3. AGENCIA DEMO: López & Asociados Propiedades
-- ─────────────────────────────────────────────────────────────
INSERT INTO agencies (
  id, slug, name, legal_id, cucicba_id,
  email_contact, phone, whatsapp_number,
  address, city, province,
  plan_id, plan_status, trial_ends_at
) VALUES (
  'a0000001-0001-0000-0000-000000000001',
  'lopez-asociados',
  'López & Asociados Propiedades',
  '30-71234567-9',
  'CUCICBA-12345',
  'info@lopezasociados.com',
  '11 4567-8901',
  '5491145678901',
  'Av. Santa Fe 2345, Piso 3',
  'Buenos Aires',
  'CABA',
  'd0000001-0001-0000-0000-000000000002',  -- Plan Pro
  'active',
  NOW() + INTERVAL '365 days'
) ON CONFLICT (id) DO NOTHING;

-- Miembros de la agencia
INSERT INTO agency_members (agency_id, user_id, role, display_name, phone, is_active, joined_at)
VALUES
  ('a0000001-0001-0000-0000-000000000001', 'f7c3d4a5-0001-0000-0000-000000000002', 'owner',  'Roberto López',      '11 4567-8901', true, NOW()),
  ('a0000001-0001-0000-0000-000000000001', 'f7c3d4a5-0001-0000-0000-000000000003', 'agent',  'Valentina García',   '11 5432-1098', true, NOW())
ON CONFLICT DO NOTHING;

-- Tema visual de la agencia (azul profesional para contrastar con el coral de NIMO)
INSERT INTO agency_theme (
  agency_id, primary_color, secondary_color, accent_color, font_family,
  logo_url, hero_image_url,
  home_layout, property_card_style,
  show_featured_section, show_recent_section, show_neighborhoods_section
) VALUES (
  'a0000001-0001-0000-0000-000000000001',
  '#1A56DB',      -- Azul corporativo
  '#0EA5E9',      -- Celeste cielo
  '#F59E0B',      -- Ámbar acento
  'Playfair Display',
  NULL,
  'https://picsum.photos/seed/hero-ba/1600/900',
  'classic-cta',
  'bento',
  true, true, true
) ON CONFLICT (agency_id) DO NOTHING;

-- Configuración funcional de la agencia
INSERT INTO agency_settings (
  agency_id, notify_on_new_lead, notify_email, notify_whatsapp,
  pipeline_stages, round_robin_enabled, ai_features_enabled
) VALUES (
  'a0000001-0001-0000-0000-000000000001',
  true,
  'info@lopezasociados.com',
  '5491145678901',
  ARRAY['new','contacted','interested','visit-scheduled','offer-sent','won','lost'],
  false,
  false
) ON CONFLICT (agency_id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 4. PROPIEDADES (10 propiedades en distintos barrios de CABA)
-- Imágenes: Picsum Photos (libres, sin API key)
-- ─────────────────────────────────────────────────────────────

INSERT INTO properties (
  id, agency_id, slug, title, description, operation, type, status,
  price, currency, expenses, expenses_currency,
  rooms, bedrooms, bathrooms, garages, covered_area, total_area,
  address, neighborhood, city, province,
  latitude, longitude, show_exact_location, is_featured,
  amenities, exclusive, assigned_to, created_at
) VALUES

-- Propiedad 1: Depto 2 amb Palermo Soho (DESTACADA)
(
  'b0000001-0001-0000-0000-000000000001',
  'a0000001-0001-0000-0000-000000000001',
  'departamento-2-ambientes-palermo-soho',
  'Departamento 2 ambientes con balcón — Palermo Soho',
  'Luminoso departamento en el corazón de Palermo Soho. Amplio living-comedor integrado a cocina americana, dormitorio en suite, balcón corrido con vista al verde. Edificio moderno con portero, ascensor y baulera. A pasos de los mejores restaurantes y bares del barrio. Impecable estado, listo para entrar.',
  'venta', 'departamento', 'available',
  89000, 'USD', 28000, 'ARS',
  2, 1, 1, NULL, 52, 58,
  'Thames 1876, Piso 4',
  'Palermo Soho', 'Buenos Aires', 'CABA',
  -34.5878, -58.4335, true, true,
  ARRAY['Balcón','Ascensor','Portero','Baulera'],
  true,
  'f7c3d4a5-0001-0000-0000-000000000002',
  NOW() - INTERVAL '15 days'
),

-- Propiedad 2: PH Villa Crespo (ALQUILER)
(
  'b0000001-0001-0000-0000-000000000002',
  'a0000001-0001-0000-0000-000000000001',
  'ph-3-ambientes-terraza-villa-crespo',
  'PH triplex con terraza privada — Villa Crespo',
  'Espectacular PH de tres plantas en uno de los barrios más buscados. Planta baja con cocina y estar, primera planta con dos dormitorios y baño completo, segunda planta con terraza exclusiva de 45m². Lavadero, depósito y cochera opcional. Calefacción por piso radiante. Ideal para familia.',
  'alquiler', 'ph', 'available',
  320000, 'ARS', 18000, 'ARS',
  4, 2, 2, NULL, 95, 140,
  'Serrano 2190',
  'Villa Crespo', 'Buenos Aires', 'CABA',
  -34.5956, -58.4405, true, false,
  ARRAY['Terraza','Lavadero','Calefacción central'],
  false,
  'f7c3d4a5-0001-0000-0000-000000000003',
  NOW() - INTERVAL '20 days'
),

-- Propiedad 3: Casa Belgrano (DESTACADA, EXCLUSIVA)
(
  'b0000001-0001-0000-0000-000000000003',
  'a0000001-0001-0000-0000-000000000001',
  'casa-5-ambientes-pileta-belgrano',
  'Casa familiar 5 ambientes con pileta — Belgrano R',
  'Imponente casa de estilo clásico en el mejor corredor de Belgrano R. Cuatro dormitorios en suite, gran living con doble altura, comedor formal, oficina independiente y dependencia de servicio. Jardín con pileta climatizada, parrilla y solarium. Doble cochera cubierta. Alarma, cámaras y acceso vehicular doble. Una joya única en el barrio.',
  'venta', 'casa', 'available',
  420000, 'USD', NULL, 'ARS',
  5, 4, 3, 2, 220, 380,
  'La Pampa 3560',
  'Belgrano', 'Buenos Aires', 'CABA',
  -34.5558, -58.4558, true, true,
  ARRAY['Pileta','Jardín','Quincho/Parrilla','Seguridad 24hs','Cochera cubierta','Dependencia de servicio'],
  true,
  'f7c3d4a5-0001-0000-0000-000000000002',
  NOW() - INTERVAL '8 days'
),

-- Propiedad 4: Monoambiente Recoleta
(
  'b0000001-0001-0000-0000-000000000004',
  'a0000001-0001-0000-0000-000000000001',
  'monoambiente-luminoso-recoleta',
  'Monoambiente luminoso en edificio icónico — Recoleta',
  'Monoambiente de diseño en pleno corazón de Recoleta. Planta eficiente con kit de cocina completo, baño en mármol y amplias ventanas con luz natural todo el día. Edificio de categoría con portería 24hs y ascensor. Calefacción central incluida en las expensas. Ideal inversión o vivienda propia.',
  'venta', 'departamento', 'available',
  62000, 'USD', 45000, 'ARS',
  1, 0, 1, NULL, 33, 38,
  'Posadas 1425, Piso 7',
  'Recoleta', 'Buenos Aires', 'CABA',
  -34.5870, -58.3920, true, false,
  ARRAY['Ascensor','Portero','Calefacción central'],
  false,
  'f7c3d4a5-0001-0000-0000-000000000002',
  NOW() - INTERVAL '30 days'
),

-- Propiedad 5: Depto Puerto Madero (DESTACADA)
(
  'b0000001-0001-0000-0000-000000000005',
  'a0000001-0001-0000-0000-000000000001',
  'departamento-3-ambientes-piso-alto-puerto-madero',
  'Departamento 3 ambientes piso alto con vista al río — Puerto Madero',
  'Exclusivo departamento en torre premium de Puerto Madero. Piso 18, vistas panorámicas al Río de la Plata y la Reserva Ecológica. Living-comedor con ventanal doble altura, cocina de diseño con isla, dos dormitorios en suite, lavadero incorporado y cochera cubierta. Amenities de primer nivel: pileta de temporada, gimnasio equipado, SUM y rooftop con parrillas. Construcción 2022. Impecable.',
  'venta', 'departamento', 'available',
  195000, 'USD', 120000, 'ARS',
  3, 2, 2, 1, 98, 115,
  'Pierina Dealessi 750, Piso 18',
  'Puerto Madero', 'Buenos Aires', 'CABA',
  -34.6118, -58.3645, true, true,
  ARRAY['Vista al río','Pileta','Gimnasio','Sum','Seguridad 24hs','Ascensor','Cochera cubierta'],
  true,
  'f7c3d4a5-0001-0000-0000-000000000002',
  NOW() - INTERVAL '5 days'
),

-- Propiedad 6: Depto Caballito (ALQUILER)
(
  'b0000001-0001-0000-0000-000000000006',
  'a0000001-0001-0000-0000-000000000001',
  'departamento-2-ambientes-caballito',
  'Departamento 2 ambientes luminoso — Caballito',
  'Amoblado o sin amueblar según preferencia del inquilino. Segundo piso al frente, mucha luz natural. Living-comedor, cocina separada, dormitorio con placard, baño completo. Calefacción a gas. Edificio seguro con portería. A 3 cuadras del Parque Rivadavia y del subte B. Ideal para profesional o pareja.',
  'alquiler', 'departamento', 'available',
  185000, 'ARS', 22000, 'ARS',
  2, 1, 1, NULL, 55, 60,
  'Rojas 367, Piso 2',
  'Caballito', 'Buenos Aires', 'CABA',
  -34.6180, -58.4320, true, false,
  ARRAY['Ascensor','Portero','Gas natural'],
  false,
  'f7c3d4a5-0001-0000-0000-000000000003',
  NOW() - INTERVAL '45 days'
),

-- Propiedad 7: Local comercial San Nicolás
(
  'b0000001-0001-0000-0000-000000000007',
  'a0000001-0001-0000-0000-000000000001',
  'local-comercial-esquina-san-nicolas',
  'Local comercial en esquina — San Nicolás (Microcentro)',
  'Excelente local esquinero sobre avenida de alto tránsito peatonal en el Microcentro. Planta libre de 85m², baño y depósito. Vidriera doble sobre dos calles. Ideal para franquicia, comercio de ropa, gastronomía o finanzas. Entrega inmediata. No admite rubro farmacéutico ni alcohol.',
  'venta', 'local', 'available',
  115000, 'USD', NULL, 'ARS',
  NULL, NULL, 1, NULL, 85, 85,
  'Corrientes y Maipú, PB',
  'San Nicolás', 'Buenos Aires', 'CABA',
  -34.6040, -58.3790, true, false,
  ARRAY['Acceso discapacitados'],
  false,
  'f7c3d4a5-0001-0000-0000-000000000002',
  NOW() - INTERVAL '60 days'
),

-- Propiedad 8: PH Almagro (ALQUILER)
(
  'b0000001-0001-0000-0000-000000000008',
  'a0000001-0001-0000-0000-000000000001',
  'ph-dos-plantas-terraza-almagro',
  'PH 2 plantas con terraza — Almagro',
  'Relajado y luminoso PH de dos plantas en Almagro. Primera planta con cocina-comedor y baño social. Segunda planta con dos dormitorios, baño completo y acceso a terraza propia de 25m². Lavadero separado. Calefacción a gas central. Sin expensas. A metros de Av. Corrientes y el Abasto. Buen estado general.',
  'alquiler', 'ph', 'available',
  145000, 'ARS', 0, 'ARS',
  3, 2, 2, NULL, 72, 97,
  'Humahuaca 3750',
  'Almagro', 'Buenos Aires', 'CABA',
  -34.6085, -58.4215, true, false,
  ARRAY['Terraza','Lavadero','Gas natural'],
  false,
  'f7c3d4a5-0001-0000-0000-000000000003',
  NOW() - INTERVAL '25 days'
),

-- Propiedad 9: Depto Núñez (RESERVADA)
(
  'b0000001-0001-0000-0000-000000000009',
  'a0000001-0001-0000-0000-000000000001',
  'departamento-2-ambientes-amenities-nunez',
  'Departamento 2 ambientes con amenities — Núñez',
  'Moderno departamento en edificio de amenities en Núñez. Living integrado a cocina, dormitorio en suite, balcón. Edificio con pileta en terraza, gimnasio y SUM. A 4 cuadras de Av. Cabildo y del río. Cochera incluida. En proceso de seña, reserva tomada.',
  'venta', 'departamento', 'reserved',
  97000, 'USD', 55000, 'ARS',
  2, 1, 1, 1, 61, 68,
  'Av. Lugones 2010, Piso 8',
  'Núñez', 'Buenos Aires', 'CABA',
  -34.5520, -58.4670, true, false,
  ARRAY['Pileta','Gimnasio','Sum','Cochera cubierta','Balcón'],
  false,
  'f7c3d4a5-0001-0000-0000-000000000002',
  NOW() - INTERVAL '40 days'
),

-- Propiedad 10: Casa Saavedra
(
  'b0000001-0001-0000-0000-000000000010',
  'a0000001-0001-0000-0000-000000000001',
  'casa-4-ambientes-jardin-saavedra',
  'Casa 4 ambientes con jardín y parrilla — Saavedra',
  'Cómoda casa de cuatro ambientes en tranquilo pasaje de Saavedra. Planta baja con living, comedor, cocina y baño social. Primer piso con tres dormitorios y baño completo. Jardín con parrilla y lavadero independiente. Cochera cubierta. A metros del Parque Saavedra y con excelente acceso a Av. Balbín. Barrio residencial y seguro.',
  'venta', 'casa', 'available',
  285000, 'USD', NULL, 'ARS',
  4, 3, 2, 1, 165, 265,
  'Av. García del Río 4320',
  'Saavedra', 'Buenos Aires', 'CABA',
  -34.5460, -58.4780, true, false,
  ARRAY['Jardín','Quincho/Parrilla','Cochera cubierta','Lavadero'],
  false,
  'f7c3d4a5-0001-0000-0000-000000000002',
  NOW() - INTERVAL '12 days'
)

ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 5. IMÁGENES DE PROPIEDADES (Picsum Photos — siempre disponibles)
-- Formato: https://picsum.photos/seed/{SEED}/1200/800
-- ─────────────────────────────────────────────────────────────
INSERT INTO property_images (property_id, agency_id, url, alt_text, position, is_cover, width, height)
VALUES

-- Prop 1: Palermo Soho
('b0000001-0001-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/palermo-dp-1/1200/800','Living comedor luminoso - Palermo Soho',0,true,1200,800),
('b0000001-0001-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/palermo-dp-2/1200/800','Dormitorio en suite con placard',1,false,1200,800),
('b0000001-0001-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/palermo-dp-3/1200/800','Balcón corrido con vista al verde',2,false,1200,800),
('b0000001-0001-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/palermo-dp-4/1200/800','Cocina americana integrada',3,false,1200,800),

-- Prop 2: Villa Crespo PH
('b0000001-0001-0000-0000-000000000002','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/vcrespo-ph-1/1200/800','Terraza privada con parrilla',0,true,1200,800),
('b0000001-0001-0000-0000-000000000002','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/vcrespo-ph-2/1200/800','Estar principal planta baja',1,false,1200,800),
('b0000001-0001-0000-0000-000000000002','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/vcrespo-ph-3/1200/800','Dormitorio principal',2,false,1200,800),

-- Prop 3: Belgrano casa
('b0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/belgrano-casa-1/1200/800','Frente de la propiedad - Belgrano R',0,true,1200,800),
('b0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/belgrano-casa-2/1200/800','Pileta y jardín con solarium',1,false,1200,800),
('b0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/belgrano-casa-3/1200/800','Living con doble altura',2,false,1200,800),
('b0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/belgrano-casa-4/1200/800','Comedor formal',3,false,1200,800),
('b0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/belgrano-casa-5/1200/800','Quincho y parrilla',4,false,1200,800),

-- Prop 4: Recoleta mono
('b0000001-0001-0000-0000-000000000004','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/recoleta-mono-1/1200/800','Vista exterior edificio - Recoleta',0,true,1200,800),
('b0000001-0001-0000-0000-000000000004','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/recoleta-mono-2/1200/800','Interior del monoambiente',1,false,1200,800),

-- Prop 5: Puerto Madero
('b0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/pm-depto-1/1200/800','Vista panorámica al Río de la Plata',0,true,1200,800),
('b0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/pm-depto-2/1200/800','Living comedor con ventanal doble altura',1,false,1200,800),
('b0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/pm-depto-3/1200/800','Cocina de diseño con isla',2,false,1200,800),
('b0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/pm-depto-4/1200/800','Dormitorio principal en suite',3,false,1200,800),
('b0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/pm-depto-5/1200/800','Pileta y rooftop del edificio',4,false,1200,800),

-- Prop 6: Caballito
('b0000001-0001-0000-0000-000000000006','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/caballito-dp-1/1200/800','Fachada del edificio - Caballito',0,true,1200,800),
('b0000001-0001-0000-0000-000000000006','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/caballito-dp-2/1200/800','Living comedor al frente',1,false,1200,800),

-- Prop 7: Local San Nicolás
('b0000001-0001-0000-0000-000000000007','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/local-micro-1/1200/800','Vidriera principal sobre Corrientes',0,true,1200,800),
('b0000001-0001-0000-0000-000000000007','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/local-micro-2/1200/800','Interior planta libre',1,false,1200,800),

-- Prop 8: Almagro PH
('b0000001-0001-0000-0000-000000000008','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/almagro-ph-1/1200/800','Terraza exclusiva - Almagro',0,true,1200,800),
('b0000001-0001-0000-0000-000000000008','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/almagro-ph-2/1200/800','Estar primera planta',1,false,1200,800),
('b0000001-0001-0000-0000-000000000008','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/almagro-ph-3/1200/800','Dormitorio principal',2,false,1200,800),

-- Prop 9: Núñez (reservada)
('b0000001-0001-0000-0000-000000000009','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/nunez-dp-1/1200/800','Edificio con amenities - Núñez',0,true,1200,800),
('b0000001-0001-0000-0000-000000000009','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/nunez-dp-2/1200/800','Living con balcón',1,false,1200,800),

-- Prop 10: Saavedra casa
('b0000001-0001-0000-0000-000000000010','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/saavedra-casa-1/1200/800','Frente de la casa - Saavedra',0,true,1200,800),
('b0000001-0001-0000-0000-000000000010','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/saavedra-casa-2/1200/800','Jardín con parrilla y quincho',1,false,1200,800),
('b0000001-0001-0000-0000-000000000010','a0000001-0001-0000-0000-000000000001','https://picsum.photos/seed/saavedra-casa-3/1200/800','Living comedor amplio',2,false,1200,800)

ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 6. LEADS (5 consultas en distintas etapas del CRM)
-- ─────────────────────────────────────────────────────────────
INSERT INTO leads (
  id, agency_id, property_id, name, email, phone, whatsapp,
  message, lead_type, source, status, assigned_to,
  internal_notes, next_action_at, created_at
) VALUES

-- Lead 1: Nuevo — interesado en Palermo
(
  'c0000001-0001-0000-0000-000000000001',
  'a0000001-0001-0000-0000-000000000001',
  'b0000001-0001-0000-0000-000000000001',
  'Juan García',
  'juan.garcia@gmail.com',
  '11 5555-1234',
  '5491155551234',
  'Hola! Me interesa el departamento de Palermo Soho. ¿Podría darme más información sobre las expensas y si acepta mascotas?',
  'inquiry', 'web', 'new',
  'f7c3d4a5-0001-0000-0000-000000000003',
  'Primer contacto pendiente. Busca 2 amb con mascota.',
  NOW() + INTERVAL '1 day',
  NOW() - INTERVAL '2 hours'
),

-- Lead 2: Visita pactada — casa Belgrano
(
  'c0000001-0001-0000-0000-000000000002',
  'a0000001-0001-0000-0000-000000000001',
  'b0000001-0001-0000-0000-000000000003',
  'María Rodríguez',
  'maria.rodriguez@hotmail.com',
  '11 6666-5678',
  '5491166665678',
  'Nos interesa la casa de Belgrano. Somos una familia con dos nenas. ¿Cuándo podemos verla?',
  'inquiry', 'web', 'visit-scheduled',
  'f7c3d4a5-0001-0000-0000-000000000002',
  'Visita pactada para el sábado a las 11hs. Llegar 15min antes. Familia buscando comprar en 2-3 meses.',
  NOW() + INTERVAL '3 days',
  NOW() - INTERVAL '5 days'
),

-- Lead 3: Interesado — Puerto Madero
(
  'c0000001-0001-0000-0000-000000000003',
  'a0000001-0001-0000-0000-000000000001',
  'b0000001-0001-0000-0000-000000000005',
  'Carlos Fernández',
  'carlos.fernandez@empresa.com',
  '11 4444-9012',
  '5491144449012',
  'Soy inversor y me interesa el depto de Puerto Madero. ¿Cuál es el rendimiento si lo pongo en alquiler?',
  'inquiry', 'web', 'interested',
  'f7c3d4a5-0001-0000-0000-000000000002',
  'Inversor con capital. Preguntó por rendimiento. Le envié análisis de mercado por email. Muy interesado.',
  NOW() + INTERVAL '2 days',
  NOW() - INTERVAL '10 days'
),

-- Lead 4: Tasación — sin propiedad puntual
(
  'c0000001-0001-0000-0000-000000000004',
  'a0000001-0001-0000-0000-000000000001',
  NULL,
  'Ana Martínez',
  'ana.martinez@outlook.com',
  '11 3333-7890',
  '5491133337890',
  NULL,
  'valuation', 'web', 'contacted',
  'f7c3d4a5-0001-0000-0000-000000000003',
  'Tasación de su casa en Palermo. Ya contactada. Espera presupuesto formal.',
  NOW() + INTERVAL '5 days',
  NOW() - INTERVAL '7 days'
),

-- Lead 5: Oferta enviada — Recoleta monoambiente
(
  'c0000001-0001-0000-0000-000000000005',
  'a0000001-0001-0000-0000-000000000001',
  'b0000001-0001-0000-0000-000000000004',
  'Pablo Jiménez',
  'pablo.jimenez@gmail.com',
  '11 2222-3456',
  '5491122223456',
  'Me interesa el monoambiente de Recoleta. ¿Hay margen para negociar el precio?',
  'inquiry', 'web', 'offer-sent',
  'f7c3d4a5-0001-0000-0000-000000000002',
  'Ofreció USD 59.000. Esperamos contrapropuesta del dueño. Cierre inminente.',
  NOW() + INTERVAL '1 day',
  NOW() - INTERVAL '18 days'
)

ON CONFLICT (id) DO NOTHING;

-- Campos extra para el lead de tasación
UPDATE leads SET
  valuation_property_type = 'casa',
  valuation_address = 'Armenia 2340, Palermo',
  valuation_rooms = 4,
  valuation_area = 180
WHERE id = 'c0000001-0001-0000-0000-000000000004';

-- ─────────────────────────────────────────────────────────────
-- 7. TIMELINE DE EVENTOS POR LEAD
-- ─────────────────────────────────────────────────────────────
INSERT INTO lead_events (lead_id, agency_id, user_id, event_type, payload, created_at)
VALUES

-- Lead 1 (Juan García — nuevo)
('c0000001-0001-0000-0000-000000000001','a0000001-0001-0000-0000-000000000001', NULL,
 'created', '{"via":"web_form","property":"Palermo Soho"}', NOW() - INTERVAL '2 hours'),

-- Lead 2 (María Rodríguez — visita pactada)
('c0000001-0001-0000-0000-000000000002','a0000001-0001-0000-0000-000000000001', NULL,
 'created', '{"via":"web_form","property":"Belgrano Casa"}', NOW() - INTERVAL '5 days'),
('c0000001-0001-0000-0000-000000000002','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'status-change', '{"from":"new","to":"contacted","note":"Llamada de 15min. Familia con hijos. Muy motivados."}', NOW() - INTERVAL '4 days'),
('c0000001-0001-0000-0000-000000000002','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'status-change', '{"from":"contacted","to":"visit-scheduled","note":"Visita sábado 11hs confirmada por WhatsApp."}', NOW() - INTERVAL '2 days'),
('c0000001-0001-0000-0000-000000000002','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'whatsapp-sent', '{"message":"Hola María! Te confirmo la visita para el sábado a las 11hs. La dirección es La Pampa 3560. Cualquier consulta, escribime!"}', NOW() - INTERVAL '2 days'),

-- Lead 3 (Carlos Fernández — interesado)
('c0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001', NULL,
 'created', '{"via":"web_form","property":"Puerto Madero"}', NOW() - INTERVAL '10 days'),
('c0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'status-change', '{"from":"new","to":"contacted"}', NOW() - INTERVAL '9 days'),
('c0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'email-sent', '{"subject":"Análisis de mercado - Puerto Madero","to":"carlos.fernandez@empresa.com"}', NOW() - INTERVAL '8 days'),
('c0000001-0001-0000-0000-000000000003','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'status-change', '{"from":"contacted","to":"interested","note":"Muy interesado. Preguntó si puede verlo esta semana."}', NOW() - INTERVAL '7 days'),

-- Lead 4 (Ana Martínez — tasación)
('c0000001-0001-0000-0000-000000000004','a0000001-0001-0000-0000-000000000001', NULL,
 'created', '{"via":"valuation_form","type":"casa","address":"Armenia 2340, Palermo"}', NOW() - INTERVAL '7 days'),
('c0000001-0001-0000-0000-000000000004','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000003',
 'status-change', '{"from":"new","to":"contacted","note":"Llamada realizada. Quiere vender en 60 días."}', NOW() - INTERVAL '6 days'),

-- Lead 5 (Pablo Jiménez — oferta enviada)
('c0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001', NULL,
 'created', '{"via":"web_form","property":"Recoleta Monoambiente"}', NOW() - INTERVAL '18 days'),
('c0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'status-change', '{"from":"new","to":"contacted"}', NOW() - INTERVAL '17 days'),
('c0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'visit', '{"date":"2026-05-28","notes":"Le gustó mucho. Preguntó por el estado de la calefacción."}', NOW() - INTERVAL '9 days'),
('c0000001-0001-0000-0000-000000000005','a0000001-0001-0000-0000-000000000001','f7c3d4a5-0001-0000-0000-000000000002',
 'status-change', '{"from":"interested","to":"offer-sent","note":"Ofreció USD 59.000. Presentada al propietario."}', NOW() - INTERVAL '3 days')

ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- 8. MÉTRICAS DE USO (mes actual, para el super-admin dashboard)
-- ─────────────────────────────────────────────────────────────
INSERT INTO platform_usage (
  agency_id, period_month,
  emails_sent, storage_mb, properties_count, leads_count
) VALUES (
  'a0000001-0001-0000-0000-000000000001',
  DATE_TRUNC('month', NOW())::DATE,
  12, 48.5, 10, 5
) ON CONFLICT (agency_id, period_month) DO NOTHING;

-- ─────────────────────────────────────────────────────────────
-- FIN DEL SEED — verificación rápida
-- ─────────────────────────────────────────────────────────────
DO $$
DECLARE
  user_count     INTEGER;
  prop_count     INTEGER;
  lead_count     INTEGER;
  img_count      INTEGER;
BEGIN
  SELECT COUNT(*) INTO user_count FROM auth.users WHERE email IN (
    'admin@nimo.app','owner@lopezasociados.com','agente@lopezasociados.com'
  );
  SELECT COUNT(*) INTO prop_count FROM properties WHERE agency_id = 'a0000001-0001-0000-0000-000000000001';
  SELECT COUNT(*) INTO lead_count FROM leads WHERE agency_id = 'a0000001-0001-0000-0000-000000000001';
  SELECT COUNT(*) INTO img_count  FROM property_images WHERE agency_id = 'a0000001-0001-0000-0000-000000000001';

  RAISE NOTICE '✅ Seed completado:';
  RAISE NOTICE '   Usuarios auth  : %', user_count;
  RAISE NOTICE '   Propiedades    : %', prop_count;
  RAISE NOTICE '   Leads          : %', lead_count;
  RAISE NOTICE '   Imágenes       : %', img_count;

  IF user_count < 3 THEN
    RAISE WARNING '⚠️  Algunos usuarios ya existían o no se insertaron. Verificar manualmente.';
  END IF;
END $$;
