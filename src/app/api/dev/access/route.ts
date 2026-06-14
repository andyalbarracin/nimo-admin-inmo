/*
 * Archivo : route.ts
 * Ruta    : src/app/api/dev/access/route.ts
 * Modif.  : 2026-06-13
 * Descripción: Atajo de desarrollo para previsualizar la app como un rol de la
 *              AGENCIA demo (owner/agent), vía login REAL de Supabase.
 *              El superadmin NO tiene atajo: se entra siempre por
 *              /superadmin/login con credencial real. Antes este endpoint
 *              entregaba una cookie de superadmin sin contraseña (puerta
 *              trasera) — eso se eliminó.
 */
import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Solo roles de la AGENCIA demo. El superadmin se excluye a propósito:
// es acceso a la plataforma y debe pasar por /superadmin/login.
const DEMO_ACCOUNTS = {
  owner: { email: 'owner@lopezasociados.com', password: 'Lopez2024!', redirect: '/lopez-asociados/admin' },
  agent: { email: 'agente@lopezasociados.com', password: 'Lopez2024!', redirect: '/lopez-asociados/admin' },
} as const

export async function GET(request: NextRequest) {
  const role = new URL(request.url).searchParams.get('as')

  // El superadmin nunca se autologuea: al login real (sin bypass de cookie).
  if (role === 'superadmin') {
    return NextResponse.redirect(new URL('/superadmin/login', request.url))
  }

  const account = role ? DEMO_ACCOUNTS[role as keyof typeof DEMO_ACCOUNTS] : null
  if (!account) {
    return NextResponse.redirect(new URL('/dev', request.url))
  }

  // Login REAL contra Supabase (cuenta de seed de la agencia demo).
  // Sin fallback de cookie: si no hay sesión válida, va al login de la agencia.
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cs) => cs.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
      },
    },
  )

  const { data, error } = await supabase.auth.signInWithPassword({
    email: account.email,
    password: account.password,
  })

  if (error || !data.session) {
    return NextResponse.redirect(new URL('/lopez-asociados/admin/login', request.url))
  }
  return NextResponse.redirect(new URL(account.redirect, request.url))
}
