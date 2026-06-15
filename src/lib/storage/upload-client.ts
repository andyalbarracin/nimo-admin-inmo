/*
 * Archivo : upload-client.ts
 * Ruta    : src/lib/storage/upload-client.ts
 * Modif.  : 2026-06-15
 * Descripción: Subida de archivos del navegador a Supabase Storage usando una
 *              signed upload URL generada en el server (service_role). El archivo
 *              va DIRECTO del navegador a Supabase: no pasa por Vercel (soporta
 *              50MB) y funciona tanto para el owner (sesión real) como para el
 *              superadmin (que entra por cookie). Solo usar en componentes cliente.
 */
import { createClient } from '@/lib/supabase/client'
import { createSignedUpload } from './upload-action'

export async function uploadFile(
  slug: string,
  bucket: string,
  file: File,
): Promise<{ url?: string; error?: string }> {
  const signed = await createSignedUpload(slug, bucket, file.name)
  if ('error' in signed) return { error: signed.error }
  const supabase = createClient()
  const { error } = await supabase.storage
    .from(bucket)
    .uploadToSignedUrl(signed.path, signed.token, file, { contentType: file.type || undefined })
  if (error) return { error: error.message }
  return { url: signed.publicUrl }
}
