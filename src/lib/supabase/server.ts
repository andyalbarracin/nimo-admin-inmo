/*
 * Archivo: server.ts
 * Ruta: src/lib/supabase/server.ts
 * Creado: 2026-06-06
 * Descripción: Cliente Supabase para el servidor (Server Components, Server Actions,
 *              Route Handlers). Usa cookies de Next.js para manejar la sesión del usuario.
 *              Actúa con los permisos del usuario autenticado + RLS activo.
 *
 * IMPORTANTE: Solo importar desde Server Components o funciones server-side.
 *             Para el navegador, usar src/lib/supabase/client.ts.
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Crea un cliente Supabase para uso en el servidor.
 * Lee y escribe las cookies de sesión de Next.js automáticamente.
 *
 * Uso en Server Components:
 *   const supabase = await createClient()
 *   const { data } = await supabase.from('properties').select('*')
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // En Server Components el set puede fallar si ya se empezó a enviar el response.
            // El middleware se encarga de refrescar la sesión en ese caso.
          }
        },
      },
    },
  )
}
