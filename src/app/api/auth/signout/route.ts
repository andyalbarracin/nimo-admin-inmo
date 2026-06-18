/*
 * Archivo: route.ts
 * Ruta: src/app/api/auth/signout/route.ts
 * Modif.: 2026-06-17
 * Descripción: Cierra sesión: signOut de Supabase + borra la cookie de superadmin,
 *              y redirige al inicio usando el ORIGEN del request (funciona en
 *              localhost, Vercel y tu dominio propio futuro, sin hardcodear nada).
 */

import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()

  // Limpiar también la sesión de superadmin (cookie).
  const store = await cookies()
  store.delete('nimo_demo_role')
  store.delete('nimo_demo_slug')

  return NextResponse.redirect(new URL('/', request.url))
}
