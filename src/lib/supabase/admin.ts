/*
 * Archivo: admin.ts
 * Ruta: src/lib/supabase/admin.ts
 * Creado: 2026-06-06
 * Descripción: Cliente Supabase con clave service_role (privilegios de administrador).
 *              Bypassea RLS — usar SOLO para operaciones del super-admin o tareas
 *              de sistema que requieren acceso global (ej: provisionar tenant nuevo,
 *              generar reportes globales, ejecutar migraciones de datos).
 *
 * ⚠️ ADVERTENCIA: Este cliente NO aplica RLS. Puede leer/escribir CUALQUIER fila
 *    de CUALQUIER tabla. Usar con extrema precaución y SOLO en el servidor.
 *    NUNCA importar desde código cliente.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Singleton del cliente admin — se crea una sola vez durante la vida del proceso.
 * No se usa async/await porque no maneja cookies de sesión.
 */
let adminClient: ReturnType<typeof createClient<Database>> | null = null

/**
 * Retorna el cliente admin (service_role).
 * Solo debe llamarse desde server-side code (Server Actions, Route Handlers, etc.).
 */
export function createAdminClient() {
  if (!adminClient) {
    adminClient = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          // Sin persistencia de sesión — este cliente actúa como "dios"
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    )
  }
  return adminClient
}
