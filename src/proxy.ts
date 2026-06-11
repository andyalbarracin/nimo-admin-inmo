import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Demo mode: if the nimo_demo_role cookie is set, allow through without Supabase auth
  const demoRole = request.cookies.get('nimo_demo_role')?.value
  const isAuthenticated = !!user || !!demoRole

  // Superadmin es MÁS estricto: solo el usuario real (email === SUPER_ADMIN_EMAIL)
  // o la cookie demo específica 'superadmin'. Así una sesión demo de agencia
  // (nimo_demo_role=owner/agent) NO abre el panel de plataforma.
  const superEmail = process.env.SUPER_ADMIN_EMAIL
  const isSuperAuthed = (!!user && (!superEmail || user.email === superEmail)) || demoRole === 'superadmin'

  const isAdminRoute = /^\/[^/]+\/admin(\/|$)/.test(pathname)
  // La propia página de login NO debe redirigirse (si no: loop infinito → ERR_TOO_MANY_REDIRECTS).
  const isAdminLogin = /^\/[^/]+\/admin\/login\/?$/.test(pathname)
  if (isAdminRoute && !isAdminLogin) {
    const slugMatch = pathname.match(/^\/([^/]+)\/admin/)
    const slug = slugMatch?.[1]

    if (!isAuthenticated && slug) {
      const loginUrl = new URL(`/${slug}/admin/login`, request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  const isSuperAdminRoute = pathname.startsWith('/superadmin')
  const isSuperAdminLogin = pathname === '/superadmin/login'

  if (isSuperAdminRoute && !isSuperAdminLogin && !isSuperAuthed) {
    const loginUrl = new URL('/superadmin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf|css|js)$).*)',
  ],
}
