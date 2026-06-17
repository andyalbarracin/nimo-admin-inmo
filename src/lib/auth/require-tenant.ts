/*
 * Archivo: require-tenant.ts
 * Ruta: src/lib/auth/require-tenant.ts
 * Creado: 2026-06-06
 * Descripción: Helper para Server Actions y Route Handlers que requieren
 *              autenticación + pertenencia a una agencia específica.
 *              Lanza un error si el usuario no cumple con los requisitos.
 *
 * Uso típico en un Server Action:
 *   const { user, member } = await requireTenantMember(agencySlug)
 */

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { AGENCIES } from '@/lib/dummy'
import { esAlMenos } from './permissions'
import type { Rol } from './permissions'

/** Las agencias DEMO (vitrina para prospectos) no son tenants reales: no se les
 *  aplica aislamiento por membresía. El aislamiento importa entre agencias REALES. */
const isDemoAgency = (slug: string) => AGENCIES.some(a => a.slug === slug)

/**
 * Guard de aislamiento multi-tenant para las páginas de /[slug]/admin.
 * Garantiza que un usuario SOLO pueda acceder al panel de la agencia a la que
 * pertenece. El superadmin (auth por cookie o email) puede acceder a todas.
 *
 * Verifica la membresía con el admin client (service_role) para no depender de
 * que el RLS de agency_members esté bien configurado: el chequeo es server-side
 * y fiable. Llamar al inicio de CADA página admin (no en /login).
 */
export async function guardAgencyAccess(agencySlug: string): Promise<void> {
  // Superadmin por cookie (su auth no es sesión de Supabase).
  const cookieStore = await cookies()
  if (cookieStore.get('nimo_demo_role')?.value === 'superadmin') return

  // Agencias demo: vitrina, no tenant real → no se exige membresía.
  if (isDemoAgency(agencySlug)) return

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Superadmin real por email configurado.
  const superEmail = process.env.SUPER_ADMIN_EMAIL
  if (user?.email && superEmail && user.email.toLowerCase() === superEmail.toLowerCase()) return

  if (!user) redirect(`/${agencySlug}/admin/login`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data: ag } = await admin.from('agencies').select('id').eq('slug', agencySlug).maybeSingle()
  if (!ag) redirect('/unauthorized')

  const { data: member } = await admin
    .from('agency_members')
    .select('id')
    .eq('agency_id', ag.id)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (!member) redirect('/unauthorized')
}

/** ¿El llamante es el superadmin de la plataforma? (cookie o email). Para acciones
 *  de superadmin (provisioning, credenciales, suspensión, CRM de plataforma). */
export async function assertSuperAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  if (cookieStore.get('nimo_demo_role')?.value === 'superadmin') return true
  // MISMA lógica que el proxy (src/proxy.ts) para no negar acceso a quien el proxy
  // ya dejó entrar a /superadmin (si no, las agencias reales "desaparecían").
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const superEmail = process.env.SUPER_ADMIN_EMAIL
  return !superEmail || user.email?.toLowerCase() === superEmail.toLowerCase()
}

/** Como assertAgencyAccess pero por agency_id (cuando la acción no tiene el slug). */
export async function assertAgencyAccessById(agencyId: string): Promise<boolean> {
  const cookieStore = await cookies()
  if (cookieStore.get('nimo_demo_role')?.value === 'superadmin') return true
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const superEmail = process.env.SUPER_ADMIN_EMAIL
  if (user?.email && superEmail && user.email.toLowerCase() === superEmail.toLowerCase()) return true
  if (!user) return false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data: member } = await admin
    .from('agency_members').select('id')
    .eq('agency_id', agencyId).eq('user_id', user.id).eq('is_active', true).maybeSingle()
  return !!member
}

/**
 * Igual que guardAgencyAccess pero NO redirige: devuelve true/false. Para usar
 * dentro de Server Actions de escritura (createProperty, updateLead, etc.) y
 * garantizar que el llamante pertenezca a la agencia del slug. Evita que alguien
 * invoque una acción con el slug de OTRA agencia.
 */
export async function assertAgencyAccess(agencySlug: string): Promise<boolean> {
  const cookieStore = await cookies()
  if (cookieStore.get('nimo_demo_role')?.value === 'superadmin') return true

  // Agencias demo: vitrina, no tenant real → no se exige membresía.
  if (isDemoAgency(agencySlug)) return true

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const superEmail = process.env.SUPER_ADMIN_EMAIL
  if (user?.email && superEmail && user.email.toLowerCase() === superEmail.toLowerCase()) return true
  if (!user) return false

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = createAdminClient() as any
  const { data: ag } = await admin.from('agencies').select('id').eq('slug', agencySlug).maybeSingle()
  if (!ag) return false

  const { data: member } = await admin
    .from('agency_members')
    .select('id')
    .eq('agency_id', ag.id)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  return !!member
}

interface TenantSession {
  user: { id: string; email: string }
  agencyId: string
  agencySlug: string
  rol: Rol
}

/**
 * Verifica que el usuario esté autenticado y pertenezca a la agencia indicada
 * con al menos el rol mínimo requerido.
 *
 * @param agencySlug - Slug de la agencia del parámetro de la ruta
 * @param rolMinimo  - Rol mínimo requerido (por defecto 'viewer')
 * @throws redirect() si no está autenticado
 * @throws redirect() si no pertenece a la agencia o no tiene el rol
 */
export async function requireTenantMember(
  agencySlug: string,
  rolMinimo: Rol = 'viewer',
): Promise<TenantSession> {
  const supabase = await createClient()

  // 1. Verificar autenticación
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect(`/${agencySlug}/admin/login`)
  }

  // 2. Obtener agencia + membresía del usuario en una sola query
  const { data: member, error: memberError } = await supabase
    .from('agency_members')
    .select(`
      role,
      agency_id,
      agencies!inner ( id, slug )
    `)
    .eq('user_id', user.id)
    .eq('is_active', true)
    .eq('agencies.slug', agencySlug)
    .single()

  if (memberError || !member) {
    // El usuario no pertenece a esta agencia
    redirect('/unauthorized')
  }

  const agency = member.agencies as unknown as { id: string; slug: string }

  // 3. Verificar jerarquía de rol
  if (!esAlMenos(member.role as Rol, rolMinimo)) {
    redirect('/unauthorized')
  }

  return {
    user: { id: user.id, email: user.email! },
    agencyId: agency.id,
    agencySlug: agency.slug,
    rol: member.role as Rol,
  }
}
