/*
 * Archivo: route.ts
 * Ruta: src/app/api/auth/signout/route.ts
 * Creado: 2026-06-06
 * Descripción: Route Handler que cierra la sesión del usuario.
 *              POST /api/auth/signout → borra cookies de Supabase → redirect a inicio.
 */

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'))
}
