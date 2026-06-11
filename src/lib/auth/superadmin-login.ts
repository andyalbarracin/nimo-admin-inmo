'use server'

/*
 * Login de superadmin con credencial configurable por entorno.
 * Definí SUPER_ADMIN_EMAIL y SUPER_ADMIN_PASSWORD en Vercel para usar las tuyas.
 * Si no están seteadas, caen a un placeholder dummy (cambialo antes de producción).
 * En éxito setea la cookie httpOnly que el proxy valida para /superadmin.
 */
import { cookies } from 'next/headers'

const DUMMY_EMAIL = 'admin@nimo.app'
const DUMMY_PASSWORD = 'nimo-demo'

export async function superadminLogin(email: string, password: string): Promise<{ ok: boolean; error?: string }> {
  const validEmail = (process.env.SUPER_ADMIN_EMAIL || DUMMY_EMAIL).trim().toLowerCase()
  const validPassword = process.env.SUPER_ADMIN_PASSWORD || DUMMY_PASSWORD

  if (email.trim().toLowerCase() !== validEmail || password !== validPassword) {
    return { ok: false, error: 'Email o contraseña incorrectos.' }
  }

  const store = await cookies()
  store.set('nimo_demo_role', 'superadmin', {
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
    httpOnly: true,
    sameSite: 'lax',
  })
  return { ok: true }
}
