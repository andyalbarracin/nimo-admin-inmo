/*
 * Planes de plataforma — FUENTE ÚNICA DE VERDAD.
 * Catálogo estático (PLANS) + override de precios/features desde Supabase
 * (platform_plans). La landing y el superadmin consumen de acá.
 * 3 planes: esencial · profesional · a_medida. Setup siempre pago, sin trial.
 */
import { createAdminClient } from '@/lib/supabase/admin'

export type PlanId = 'esencial' | 'profesional' | 'a_medida'

export interface PlanRow {
  code: PlanId
  name: string
  tagline: string
  monthly: number              // mínimo (a_medida = "desde")
  setup: number                // mínimo (a_medida = "desde")
  max_properties: number | null
  max_users: number | null
  highlighted: boolean
  cta_label: string
  cta_href: string
  features: string[]           // bullets de la card (máx ~8)
  includes_setup: string[]     // qué cubre la implementación
  is_public: boolean
  is_active: boolean
}

const CONTACTO = 'https://www.zairetech.com/contacto'

/** Catálogo / defaults. Los precios y features pueden sobreescribirse desde la DB. */
export const PLANS: PlanRow[] = [
  {
    code: 'esencial',
    name: 'Esencial',
    tagline: 'Para inmobiliarias que arrancan o de 1-2 personas. Sitio premium, CRM básico y todo listo en 7 días.',
    monthly: 49,
    setup: 490,
    max_properties: 50,
    max_users: 2,
    highlighted: false,
    cta_label: 'Contactar',
    cta_href: CONTACTO,
    features: [
      'Hasta 50 propiedades activas',
      '2 usuarios',
      '1 tema premium a elección',
      'Dominio propio incluido (1er año)',
      'CRM con tabla de leads',
      'Formularios de contacto + WhatsApp',
      'Mapa interactivo, fichas PDF y QR',
      'Soporte por email (< 48 hs)',
    ],
    includes_setup: [
      'Carga inicial de hasta 30 propiedades',
      'Configuración del tema con tu marca',
      'Alta del dominio y de hasta 2 usuarios',
      'Capacitación (1 sesión de 60 min)',
      '15 días de ajustes post-entrega',
    ],
    is_public: true,
    is_active: true,
  },
  {
    code: 'profesional',
    name: 'Profesional',
    tagline: 'El estándar NIMO. Para inmobiliarias de 3-6 agentes que quieren un sitio que les genere consultas y un CRM que las cierre.',
    monthly: 99,
    setup: 990,
    max_properties: null,
    max_users: 6,
    highlighted: true,
    cta_label: 'Contactar',
    cta_href: CONTACTO,
    features: [
      'Todo lo de Esencial, más:',
      'Propiedades ilimitadas',
      '6 usuarios',
      'Los 3 temas premium',
      'Dominio propio incluido (1er año)',
      'CRM con Kanban + notas por lead',
      'WhatsApp integrado (click-to-chat)',
      'Soporte por WhatsApp + email (< 24 hs)',
    ],
    includes_setup: [
      'Carga inicial de hasta 100 propiedades',
      'Configuración del tema con brandkit completo',
      'Alta del dominio y de hasta 6 usuarios',
      'Capacitación (2 sesiones de 60 min)',
      '30 días de ajustes post-entrega',
    ],
    is_public: true,
    is_active: true,
  },
  {
    code: 'a_medida',
    name: 'A medida',
    tagline: 'Cadenas, franquicias y operaciones multi-sucursal. Hablemos de tu operación.',
    monthly: 199,
    setup: 1990,
    max_properties: null,
    max_users: null,
    highlighted: false,
    cta_label: 'Hablemos →',
    cta_href: CONTACTO,
    features: [
      'Todo lo de Profesional, más:',
      'Usuarios ilimitados',
      'Multi-sucursal con roles jerárquicos',
      'Dominio propio incluido',
      'Integraciones a portales (a medida)',
      'Reportes avanzados + dashboard ejecutivo',
      'SLA 99.9% + soporte dedicado 24/7',
      'Manager de cuenta asignado',
    ],
    includes_setup: [
      'Scoping y migración desde tu sistema actual',
      'Integraciones a medida',
      'Capacitación al equipo completo',
      'Ciclo de refinamiento de 60 días',
    ],
    is_public: true,
    is_active: true,
  },
]

export function getPlanById(id: PlanId): PlanRow | undefined {
  return PLANS.find(p => p.code === id)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

/** Lee de la DB y mezcla con el catálogo (DB pisa precios/features; el resto del catálogo). */
export async function listPlans(): Promise<PlanRow[]> {
  try {
    const { data, error } = await sb().from('platform_plans').select('*').order('price_usd_monthly', { ascending: true })
    if (error || !data || !data.length) return PLANS
    const byCode = Object.fromEntries(PLANS.map(p => [p.code, p])) as Record<string, PlanRow>
    const merged = data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((r: any): PlanRow | null => {
        const cat = byCode[r.code]
        if (!cat) return null // ignora codes que no estén en el catálogo nuevo
        return {
          ...cat,
          name: r.name ?? cat.name,
          monthly: Number(r.price_usd_monthly) || cat.monthly,
          setup: Number(r.price_usd_setup) || cat.setup,
          max_properties: r.max_properties ?? cat.max_properties,
          max_users: r.max_users ?? cat.max_users,
          features: Array.isArray(r.features) && r.features.length ? r.features : cat.features,
          highlighted: r.highlighted ?? cat.highlighted,
          is_public: r.is_public ?? cat.is_public,
          is_active: r.is_active ?? cat.is_active,
        }
      })
      .filter(Boolean) as PlanRow[]
    return merged.length ? merged : PLANS
  } catch (e) {
    console.error('[plans] listPlans error:', e)
    return PLANS
  }
}

export async function planMap(): Promise<Record<string, PlanRow>> {
  const list = await listPlans()
  return Object.fromEntries(list.map(p => [p.code, p]))
}
