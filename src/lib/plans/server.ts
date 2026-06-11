/*
 * Planes de plataforma — lectura desde Supabase (platform_plans).
 * Fuente única para superadmin (edición) y landing (vitrina de precios).
 * Fallback a defaults si la DB no responde.
 */
import { createAdminClient } from '@/lib/supabase/admin'

export interface PlanRow {
  code: 'starter' | 'pro' | 'business' | 'enterprise'
  name: string
  monthly: number
  setup: number
  max_properties: number | null
  max_users: number | null
  features: string[]
  is_public: boolean
  is_active: boolean
}

const DEFAULTS: PlanRow[] = [
  { code: 'starter', name: 'Starter', monthly: 29, setup: 300, max_properties: 30, max_users: 2, features: [], is_public: true, is_active: true },
  { code: 'pro', name: 'Pro', monthly: 59, setup: 500, max_properties: null, max_users: 4, features: [], is_public: true, is_active: true },
  { code: 'business', name: 'Business', monthly: 119, setup: 900, max_properties: null, max_users: 10, features: [], is_public: true, is_active: true },
  { code: 'enterprise', name: 'Enterprise', monthly: 0, setup: 0, max_properties: null, max_users: null, features: [], is_public: true, is_active: true },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export async function listPlans(): Promise<PlanRow[]> {
  try {
    const { data, error } = await sb().from('platform_plans').select('*').order('price_usd_monthly', { ascending: true })
    if (error || !data || !data.length) return DEFAULTS
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((r: any): PlanRow => ({
      code: r.code, name: r.name,
      monthly: Number(r.price_usd_monthly) || 0,
      setup: Number(r.price_usd_setup) || 0,
      max_properties: r.max_properties, max_users: r.max_users,
      features: Array.isArray(r.features) ? r.features : [],
      is_public: r.is_public, is_active: r.is_active,
    }))
  } catch (e) {
    console.error('[plans] listPlans error:', e)
    return DEFAULTS
  }
}

export async function planMap(): Promise<Record<string, PlanRow>> {
  const list = await listPlans()
  return Object.fromEntries(list.map(p => [p.code, p]))
}
