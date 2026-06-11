import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

const ACCOUNTS = {
  superadmin: {
    email: 'admin@nimo.app',
    password: 'nimo-demo',
    redirect: '/superadmin',
    demoRole: 'superadmin',
  },
  owner: {
    email: 'owner@lopezasociados.com',
    password: 'Lopez2024!',
    redirect: '/lopez-asociados/admin',
    demoRole: 'owner',
  },
  agent: {
    email: 'agente@lopezasociados.com',
    password: 'Lopez2024!',
    redirect: '/lopez-asociados/admin',
    demoRole: 'agent',
  },
} as const

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('as') as keyof typeof ACCOUNTS | null
  const account = role ? ACCOUNTS[role] : null

  if (!account) {
    return new NextResponse(
      `<html><body style="font-family:monospace;padding:40px;background:#0F0F0F;color:white">
        <h2>Dev Access — NIMO</h2>
        <ul>
          <li><a href="/api/dev/access?as=superadmin" style="color:#FF6B6B">Super Admin</a></li>
          <li><a href="/api/dev/access?as=owner" style="color:#FF6B6B">Owner (López & Asociados)</a></li>
          <li><a href="/api/dev/access?as=agent" style="color:#FF6B6B">Agente</a></li>
        </ul>
      </body></html>`,
      { headers: { 'content-type': 'text/html' } },
    )
  }

  // Try Supabase login first
  try {
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

    if (!error && data.session) {
      return NextResponse.redirect(new URL(account.redirect, request.url))
    }
  } catch {
    // Supabase not configured — fall through to demo mode
  }

  // Demo mode: set a cookie so pages can render without real auth
  const response = NextResponse.redirect(new URL(account.redirect, request.url))
  response.cookies.set('nimo_demo_role', account.demoRole, {
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
    httpOnly: false,
    sameSite: 'lax',
  })
  response.cookies.set('nimo_demo_slug', 'lopez-asociados', {
    path: '/',
    maxAge: 60 * 60 * 8,
    httpOnly: false,
    sameSite: 'lax',
  })
  return response
}
