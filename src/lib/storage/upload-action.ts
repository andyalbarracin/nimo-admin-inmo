'use server'

/*
 * Archivo : upload-action.ts
 * Ruta    : src/lib/storage/upload-action.ts
 * Modif.  : 2026-06-15
 * Descripción: Genera una signed upload URL (service_role) para subir un archivo
 *              directo del navegador a Supabase Storage. Verifica que el llamante
 *              pertenezca a la agencia (assertAgencyAccess). El archivo NO pasa por
 *              el server (se evita el tope de payload de Vercel; soporta 50MB).
 */
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAgencyAccess } from '@/lib/auth/require-tenant'

type SignedUpload = { path: string; token: string; publicUrl: string; error?: undefined } | { error: string }

export async function createSignedUpload(slug: string, bucket: string, fileName: string): Promise<SignedUpload> {
  try {
    if (!(await assertAgencyAccess(slug))) return { error: 'No autorizado.' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
    const safe = fileName.replace(/[^\w.\-]+/g, '_')
    const path = `${slug}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`
    const { data, error } = await sb.storage.from(bucket).createSignedUploadUrl(path)
    if (error || !data) return { error: error?.message ?? 'No se pudo iniciar la subida.' }
    const { data: pub } = sb.storage.from(bucket).getPublicUrl(path)
    return { path: data.path, token: data.token, publicUrl: pub.publicUrl as string }
  } catch (e) {
    return { error: (e as Error).message }
  }
}
