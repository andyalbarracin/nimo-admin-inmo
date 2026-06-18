/*
 * Archivo: require-tenant.ts
 * Ruta: src/lib/auth/require-tenant.ts
 * Modif.: 2026-06-17
 * Descripción: Autorización multi-tenant.
 *   - assertSuperAdmin: superadmin de plataforma (ESTRICTO).
 *   - guardAgencyAccess / assertAgencyAccess(ById): un usuario solo accede a la
 *     agencia de la que es miembro; el superadmin accede a todas.
 *   NO hay bypass para agencias "demo": el aislamiento aplica SIEMPRE. El
 *   superadmin ve las demos por ser superadmin (cookie), no por excepción.
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { esAlMenos } from './permissions'
import type { Rol } from './permissions'

/**
 * Superadmin de plataforma. ESTRICTO: cookie de /superadmin/login, o usuario real
 * cuyo email coincide con SUPER_ADMIN_EMAIL. Si no hay email configurado y no hay
 * cookie → false (nadie es superadmin "por defecto").
 */
export async function assertSuperAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  if (cookieStore.get('nimo_demo_role')?.value === 'superadmin') return true
  const superEmail = process.env.SUPER_ADMIN_EMAIL
  if (!superEmail) return false
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email?.toLowerCase() === superEmail.toLowerCase()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function currentUser(): Promise<any | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ?? null
}

async function isMemberOfSlug(slug: string, userId: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data: ag } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
  if (!ag) return false
  const { data: member } = await admin
    .from('agency_members').select('id')
    .eq('agency_id', ag.id).eq('user_id', userId).eq('is_active', true).maybeSingle()
  return !!member
}

/**
 * Guard para /[slug]/admin (no en /login). Superadmin → pasa. Si no, exige sesión
 * y membresía de ESA agencia; si no, /unauthorized. Verifica con service_role
 * (fiable, no depende del RLS de agency_members).
 */
export async function guardAgencyAccess(agencySlug: string): Promise<void> {
  if (await assertSuperAdmin()) return
  const user = await currentUser()
  if (!user) redirect(`/${agencySlug}/admin/login`)
  if (await isMemberOfSlug(agencySlug, user.id)) return
  redirect('/unauthorized')
}

/** Versión boolean (para Server Actions de escritura) por slug. */
export async function assertAgencyAccess(agencySlug: string): Promise<boolean> {
  if (await assertSuperAdmin()) return true
  const user = await currentUser()
  if (!user) return false
  return isMemberOfSlug(agencySlug, user.id)
}

/** Igual que assertAgencyAccess pero por agency_id (cuando la acción no tiene slug). */
export async function assertAgencyAccessById(agencyId: string): Promise<boolean> {
  if (await assertSuperAdmin()) return true
  const user = await currentUser()
  if (!user) return false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data: member } = await admin
    .from('agency_members').select('id')
    .eq('agency_id', agencyId).eq('user_id', user.id).eq('is_active', true).maybeSingle()
  return !!member
}

interface TenantSession {
  user: { id: string; email: string }
  agencyId: string
  agencySlug: string
  rol: Rol
}

/**
 * Verifica autenticación + membresía con rol mínimo. (Disponible para uso futuro.)
 */
export async function requireTenantMember(
  agencySlug: string,
  rolMinimo: Rol = 'viewer',
): Promise<TenantSession> {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) redirect(`/${agencySlug}/admin/login`)

  const { data: member, error: memberError } = await supabase
    .from('agency_members')
    .select(`role, agency_id, agencies!inner ( id, slug )`)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('agencies.slug', agencySlug)
    .single()

  if (memberError || !member) redirect('/unauthorized')
  const agency = member.agencies as unknown as { id: string; slug: string }
  if (!esAlMenos(member.role as Rol, rolMinimo)) redirect('/unauthorized')

  return {
    user: { id: user.id, email: user.email! },
    agencyId: agency.id,
    agencySlug: agency.slug,
    rol: member.role as Rol,
  }
}
