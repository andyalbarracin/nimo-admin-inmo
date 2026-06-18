'use server'

/*
 * Archivo : session-actions.ts
 * Ruta    : src/lib/auth/session-actions.ts
 * Modif.  : 2026-06-17
 * Descripción: Acciones de sesión para componentes cliente.
 *   - resolveAgencyHome: a qué panel mandar al usuario tras loguearse. Se basa en
 *     SU membresía (agency_members), NO en el slug de la URL → evita que un usuario
 *     caiga en el panel de otra agencia.
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function resolveAgencyHome(): Promise<string | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data } = await admin
    .from('agency_members')
    .select('agencies(slug)')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .limit(1)
    .maybeSingle()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ag: any = data?.agencies
  const slug = Array.isArray(ag) ? ag[0]?.slug : ag?.slug
  return slug ? `/${slug}/admin` : null
}
