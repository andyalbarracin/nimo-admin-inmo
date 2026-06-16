'use server'

/*
 * Archivo : onboarding.ts
 * Ruta    : src/lib/agencies/onboarding.ts
 * Modif.  : 2026-06-14
 * Descripción: Onboarding de la agencia (Subsistema B). Lectura/guardado del
 *              wizard de 3 pasos + toggle de activación (superadmin) + volcado de
 *              la paleta elegida a agency_theme al completar. Server-side.
 *              NOTA: usa service_role (mismo patrón que el resto del app); la
 *              verificación por-usuario es deuda compartida (ver Subsistema C).
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { PALETTES } from '@/lib/constants/palettes'
import { assertSuperAdmin, assertAgencyAccessById } from '@/lib/auth/require-tenant'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export interface OnboardingData {
  description: string; tagline: string; palette: string
  employees: string; properties_approx: string; ops_monthly: string; ops_annual: string; avg_ticket_usd: string
  zones: string[]; avoid: string; notes: string
}

export async function getOnboardingStatus(slug: string): Promise<{ id: string; enabled: boolean; completed: boolean } | null> {
  try {
    const { data } = await sb().from('agencies').select('id, onboarding_enabled, onboarding_completed').eq('slug', slug).maybeSingle()
    if (!data) return null
    return { id: data.id, enabled: !!data.onboarding_enabled, completed: !!data.onboarding_completed }
  } catch { return null }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getOnboarding(agencyId: string): Promise<any | null> {
  try {
    const { data } = await sb().from('agency_onboarding').select('*').eq('agency_id', agencyId).maybeSingle()
    return data ?? null
  } catch { return null }
}

function toRow(agencyId: string, d: Partial<OnboardingData>) {
  const num = (v?: string) => (v && v !== '' ? Number(v) : null)
  return {
    agency_id: agencyId,
    description: d.description ?? null, tagline: d.tagline ?? null, palette: d.palette ?? null,
    employees: num(d.employees), properties_approx: num(d.properties_approx),
    ops_monthly: num(d.ops_monthly), ops_annual: num(d.ops_annual), avg_ticket_usd: num(d.avg_ticket_usd),
    zones: d.zones ?? [], avoid: d.avoid ?? null, notes: d.notes ?? null,
  }
}

/** Guarda el progreso parcial del wizard. */
export async function saveOnboarding(agencyId: string, data: Partial<OnboardingData>, step: number): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertAgencyAccessById(agencyId))) return { ok: false, error: 'No autorizado.' }
    const admin = sb()
    const { error } = await admin.from('agency_onboarding').upsert(toRow(agencyId, data), { onConflict: 'agency_id' })
    if (error) return { ok: false, error: error.message }
    await admin.from('agencies').update({ onboarding_step: step }).eq('id', agencyId)
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

/** Completa el onboarding: persiste, vuelca la paleta al theme y marca completado. */
export async function completeOnboarding(agencyId: string, data: OnboardingData): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertAgencyAccessById(agencyId))) return { ok: false, error: 'No autorizado.' }
    const admin = sb()
    const { error } = await admin.from('agency_onboarding').upsert(toRow(agencyId, data), { onConflict: 'agency_id' })
    if (error) return { ok: false, error: error.message }

    const pal = PALETTES.find(p => p.id === data.palette)
    if (pal) {
      await admin.from('agency_theme').update({
        primary_color: pal.primary, secondary_color: pal.secondary, accent_color: pal.accent,
      }).eq('agency_id', agencyId)
    }
    await admin.from('agencies').update({ onboarding_completed: true, onboarding_step: 3 }).eq('id', agencyId)
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

/** Activa/desactiva el onboarding (superadmin). */
export async function setOnboardingEnabled(agencyId: string, enabled: boolean): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertSuperAdmin())) return { ok: false, error: 'No autorizado.' }
    const { error } = await sb().from('agencies').update({ onboarding_enabled: enabled }).eq('id', agencyId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/superadmin/agencias', 'layout')
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
