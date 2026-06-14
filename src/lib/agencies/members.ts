'use server'

/*
 * Archivo : members.ts
 * Ruta    : src/lib/agencies/members.ts
 * Modif.  : 2026-06-14
 * Descripción: Listado real de miembros de una agencia (agency_members) para el
 *              panel de Equipo de agencias provisionadas. Server-side.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { TeamMember } from '@/lib/dummy'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export async function listAgencyMembers(slug: string): Promise<TeamMember[]> {
  try {
    const admin = sb()
    const { data: ag } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
    if (!ag) return []
    const { data } = await admin
      .from('agency_members')
      .select('id, display_name, avatar_url, phone, role')
      .eq('agency_id', ag.id)
      .eq('is_active', true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data ?? []).map((m: any) => ({
      id: m.id,
      name: m.display_name ?? '—',
      email: '',
      role: m.role,
      avatar: (m.display_name ?? '?').trim().slice(0, 2).toUpperCase(),
      phone: m.phone ?? '',
      properties_count: 0,
      leads_count: 0,
    }))
  } catch { return [] }
}
