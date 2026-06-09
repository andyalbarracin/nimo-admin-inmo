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
import { createClient } from '@/lib/supabase/server'
import { esAlMenos } from './permissions'
import type { Rol } from './permissions'

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
