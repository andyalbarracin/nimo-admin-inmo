/*
 * Archivo : public.ts
 * Ruta    : src/lib/agencies/public.ts
 * Modif.  : 2026-06-15
 * Descripción: Arma el objeto "agency" (forma de @/lib/dummy Agency) para el SITIO
 *              PÚBLICO de una agencia REAL, leyendo agencies + agency_theme +
 *              agency_onboarding. Devuelve null si no existe. Server-only.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { Agency } from '@/lib/dummy'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const one = (x: any) => (Array.isArray(x) ? x[0] : x)

export async function getPublicAgency(slug: string): Promise<Agency | null> {
  try {
    const { data } = await sb()
      .from('agencies')
      .select('id,name,slug,plan_status,email_contact,phone,address,plan:platform_plans(code), onboarding:agency_onboarding(tagline,description), theme:agency_theme(site_theme)')
      .eq('slug', slug)
      .maybeSingle()
    if (!data) return null
    const planCode = one(data.plan)?.code
    const plan = (['esencial', 'profesional', 'a_medida'].includes(planCode) ? planCode : 'esencial') as Agency['plan']
    const siteTheme = one(data.theme)?.site_theme
    const themeId = (['editorial', 'spatial', 'atelier'].includes(siteTheme) ? siteTheme : 'editorial') as Agency['theme']
    const ob = one(data.onboarding)
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      plan,
      plan_status: data.plan_status === 'suspended' || data.plan_status === 'canceled' ? 'suspended' : 'active',
      properties_count: 0,
      leads_count: 0,
      members_count: 1,
      mrr: 0,
      owner_email: data.email_contact ?? '',
      created_at: '',
      theme: themeId,
      tagline: ob?.tagline ?? '',
      address: data.address ?? '',
      phone: data.phone ?? '',
    } as Agency
  } catch {
    return null
  }
}
