/*
 * Archivo : current-user.ts
 * Ruta    : src/lib/auth/current-user.ts
 * Modif.  : 2026-06-17
 * Descripción: Datos del usuario logueado en el panel (para el header de usuario).
 *              Superadmin (cookie) o miembro de la agencia (agency_members). Server.
 */
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface AdminUser {
  name: string
  email: string
  role: string
  isSuperadmin: boolean
}

export async function getAdminUser(slug: string): Promise<AdminUser | null> {
  const store = await cookies()
  if (store.get('nimo_demo_role')?.value === 'superadmin') {
    return { name: 'Super Admin', email: process.env.SUPER_ADMIN_EMAIL ?? 'admin@nimo.app', role: 'superadmin', isSuperadmin: true }
  }
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let name = user.email?.split('@')[0] ?? 'Usuario'
  let role = 'viewer'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data: ag } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
  if (ag) {
    const { data: m } = await admin.from('agency_members').select('display_name, role').eq('agency_id', ag.id).eq('user_id', user.id).maybeSingle()
    if (m) { role = m.role; name = m.display_name || name }
  }
  return { name, email: user.email ?? '', role, isSuperadmin: false }
}
