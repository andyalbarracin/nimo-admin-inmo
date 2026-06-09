/*
 * Archivo: require-superadmin.ts
 * Ruta: src/lib/auth/require-superadmin.ts
 * Creado: 2026-06-06
 * Descripción: Helper para Server Actions y Route Handlers del dashboard
 *              de super-admin. Lanza redirect si el usuario no es super-admin.
 *
 * La verificación se hace contra el email configurado en la variable de entorno
 * SUPER_ADMIN_EMAIL (no existe tabla de roles globales).
 */

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

interface SuperAdminSession {
  user: { id: string; email: string }
}

/**
 * Verifica que el usuario autenticado sea el super-admin de la plataforma.
 * Redirige a /superadmin/login si no lo es.
 */
export async function requireSuperAdmin(): Promise<SuperAdminSession> {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user?.email) {
    redirect('/superadmin/login')
  }

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL

  if (!superAdminEmail || user.email !== superAdminEmail) {
    redirect('/superadmin/login')
  }

  return {
    user: { id: user.id, email: user.email },
  }
}
