'use server'

/*
 * Archivo : profile-actions.ts
 * Ruta    : src/lib/auth/profile-actions.ts
 * Modif.  : 2026-06-17
 * Descripción: Acciones del perfil del usuario de agencia: editar su nombre y
 *              exportar un informe simple de rendimiento (CSV). Email/contraseña
 *              se harán con verificación por email en el futuro.
 */
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAgencyAccess } from '@/lib/auth/require-tenant'

export async function updateMyDisplayName(slug: string, name: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!name?.trim()) return { ok: false, error: 'El nombre no puede estar vacío.' }
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { ok: false, error: 'No autorizado.' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any
    const { data: ag } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
    if (!ag) return { ok: false, error: 'Agencia no encontrada.' }
    const { error } = await admin.from('agency_members').update({ display_name: name.trim() }).eq('agency_id', ag.id).eq('user_id', user.id)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin`, 'layout')
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function exportAgencyReport(slug: string): Promise<{ ok: boolean; csv?: string; error?: string }> {
  try {
    if (!(await assertAgencyAccess(slug))) return { ok: false, error: 'No autorizado.' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const admin = createAdminClient() as any
    const { data: ag } = await admin.from('agencies').select('id, name').eq('slug', slug).maybeSingle()
    if (!ag) return { ok: false, error: 'Agencia no encontrada.' }
    const { count: props } = await admin.from('properties').select('id', { count: 'exact', head: true }).eq('agency_id', ag.id)
    const { data: leads } = await admin.from('leads').select('name,email,phone,status,source,created_at').eq('agency_id', ag.id).order('created_at', { ascending: false })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const esc = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const header = ['Nombre', 'Email', 'Teléfono', 'Etapa', 'Origen', 'Fecha']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const body = (leads ?? []).map((l: any) => [l.name, l.email, l.phone, l.status, l.source, (l.created_at ?? '').slice(0, 10)].map(esc).join(','))
    const csv = [
      `Informe de ${ag.name}`,
      `Propiedades totales,${props ?? 0}`,
      `Leads totales,${leads?.length ?? 0}`,
      '',
      header.map(esc).join(','),
      ...body,
    ].join('\n')
    return { ok: true, csv }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
