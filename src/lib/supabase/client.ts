/*
 * Archivo: client.ts
 * Ruta: src/lib/supabase/client.ts
 * Creado: 2026-06-06
 * Descripción: Cliente Supabase para el navegador (componentes client-side).
 *              Usa la clave ANON pública — está protegido por RLS en Postgres.
 *              NO usar en Server Components ni Server Actions (usar server.ts).
 *
 * IMPORTANTE: Este cliente sólo se puede importar desde archivos con 'use client'.
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Crea un cliente Supabase para usar en el navegador.
 * Maneja automáticamente las cookies de sesión.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
