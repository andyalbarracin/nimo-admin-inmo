'use server'

/*
 * Archivo : status.ts
 * Ruta    : src/lib/agencies/status.ts
 * Modif.  : 2026-06-14
 * Descripción: Reglas de negocio del ciclo de vida (Subsistema C):
 *              - getAgencyAccess: estado de la agencia para gatear el sitio/panel.
 *              - canCreateProperty: límite de propiedades según el plan.
 *              - setAgencyStatus: suspender / reactivar / dar de baja (superadmin).
 *              Server-side, service_role. Las agencias demo (sin fila en DB)
 *              devuelven null y no se bloquean.
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export type AgencyStatus = 'active' | 'suspended' | 'past_due' | 'canceled'

/** Estado de acceso de una agencia por slug. null = no es una agencia real (demo). */
export async function getAgencyAccess(slug: string): Promise<{ id: string; status: AgencyStatus; blocked: boolean } | null> {
  try {
    const { data } = await sb().from('agencies').select('id, plan_status').eq('slug', slug).maybeSingle()
    if (!data) return null
    const status = (data.plan_status ?? 'active') as AgencyStatus
    return { id: data.id, status, blocked: status === 'suspended' || status === 'canceled' }
  } catch { return null }
}

/** ¿Puede la agencia cargar otra propiedad según su plan? */
export async function canCreateProperty(agencyId: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const admin = sb()
    const { data: ag } = await admin.from('agencies').select('plan:platform_plans(max_properties)').eq('id', agencyId).maybeSingle()
    const max = ag?.plan?.max_properties ?? null
    if (max == null) return { ok: true } // null = ilimitado
    const { count } = await admin.from('properties').select('id', { count: 'exact', head: true }).eq('agency_id', agencyId)
    if ((count ?? 0) >= max) {
      return { ok: false, error: `Alcanzaste el límite de tu plan (${max} propiedades). Actualizá tu plan para cargar más.` }
    }
    return { ok: true }
  } catch {
    return { ok: true } // ante un error de chequeo, no bloqueamos la operación
  }
}

/** Suspender / reactivar / dar de baja una agencia (superadmin). */
export async function setAgencyStatus(agencyId: string, status: AgencyStatus): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await sb().from('agencies').update({ plan_status: status }).eq('id', agencyId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/superadmin/agencias', 'layout')
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
