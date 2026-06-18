'use server'

/*
 * Archivo : members-actions.ts
 * Ruta    : src/lib/agencies/members-actions.ts
 * Modif.  : 2026-06-15
 * Descripción: Alta/baja/cambio de rol de miembros de una agencia REAL. Crea el
 *              usuario (Supabase Admin API, email_confirm) + agency_members.
 *              Aplica el límite de usuarios del plan. Verifica membresía
 *              (assertAgencyAccess) y protege al owner. Solo server.
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAgencyRole } from '@/lib/auth/require-tenant'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const one = (x: any) => (Array.isArray(x) ? x[0] : x)
type Result = { ok: boolean; error?: string }
const DENY: Result = { ok: false, error: 'No autorizado.' }

export async function inviteAgencyMember(
  slug: string,
  input: { name: string; email: string; role: string; password: string },
): Promise<Result> {
  try {
    if (!(await assertAgencyRole(slug, 'admin'))) return DENY
    const email = input.email?.trim().toLowerCase()
    if (!input.name?.trim() || !email) return { ok: false, error: 'Faltan nombre y email.' }
    if (!input.password || input.password.length < 8) return { ok: false, error: 'La contraseña debe tener al menos 8 caracteres.' }
    const role = ['admin', 'agent', 'viewer'].includes(input.role) ? input.role : 'agent'

    const admin = sb()
    const { data: ag } = await admin.from('agencies').select('id, plan:platform_plans(max_users)').eq('slug', slug).maybeSingle()
    if (!ag) return { ok: false, error: 'Agencia no encontrada.' }

    // Límite de usuarios del plan.
    const max = one(ag.plan)?.max_users ?? null
    if (max != null) {
      const { count } = await admin.from('agency_members').select('id', { count: 'exact', head: true }).eq('agency_id', ag.id).eq('is_active', true)
      if ((count ?? 0) >= max) return { ok: false, error: `Llegaste al límite de usuarios de tu plan (${max}). Actualizá el plan para sumar más.` }
    }

    const { data: created, error: userErr } = await admin.auth.admin.createUser({ email, password: input.password, email_confirm: true })
    if (userErr || !created?.user) return { ok: false, error: `No se pudo crear el usuario (¿ya existe ese email?): ${userErr?.message ?? ''}` }

    const { error } = await admin.from('agency_members').insert({ agency_id: ag.id, user_id: created.user.id, role, display_name: input.name.trim() })
    if (error) {
      await admin.auth.admin.deleteUser(created.user.id).catch(() => {})
      return { ok: false, error: error.message }
    }
    revalidatePath(`/${slug}/admin/equipo`)
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function removeAgencyMember(slug: string, memberId: string): Promise<Result> {
  try {
    if (!(await assertAgencyRole(slug, 'admin'))) return DENY
    const admin = sb()
    const { data: ag } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
    if (!ag) return { ok: false, error: 'Agencia no encontrada.' }
    const { data: m } = await admin.from('agency_members').select('role').eq('id', memberId).eq('agency_id', ag.id).maybeSingle()
    if (m?.role === 'owner') return { ok: false, error: 'No se puede quitar al propietario.' }
    const { error } = await admin.from('agency_members').delete().eq('id', memberId).eq('agency_id', ag.id)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin/equipo`)
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function updateMemberRole(slug: string, memberId: string, role: string): Promise<Result> {
  try {
    if (!(await assertAgencyRole(slug, 'admin'))) return DENY
    if (!['admin', 'agent', 'viewer'].includes(role)) return { ok: false, error: 'Rol inválido.' }
    const admin = sb()
    const { data: ag } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
    if (!ag) return { ok: false, error: 'Agencia no encontrada.' }
    const { data: m } = await admin.from('agency_members').select('role').eq('id', memberId).eq('agency_id', ag.id).maybeSingle()
    if (m?.role === 'owner') return { ok: false, error: 'No se puede cambiar el rol del propietario.' }
    const { error } = await admin.from('agency_members').update({ role }).eq('id', memberId).eq('agency_id', ag.id)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin/equipo`)
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
