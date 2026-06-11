'use server'

/*
 * Subida de imágenes de propiedades a Supabase Storage (bucket 'properties').
 * Bucket público creado en 0001 (10MB, jpeg/png/webp/avif). Admin client
 * (service_role) → no requiere auth del usuario en el demo.
 * Producción: gatear con requireTenantMember(slug, 'agent').
 */
import { createAdminClient } from '@/lib/supabase/admin'

type Result = { ok: boolean; url?: string; error?: string }

export async function uploadPropertyImage(slug: string, formData: FormData): Promise<Result> {
  try {
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { ok: false, error: 'Sin archivo' }
    if (!file.type.startsWith('image/')) return { ok: false, error: 'El archivo debe ser una imagen' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
    const safe = file.name.replace(/[^\w.\-]+/g, '_')
    const path = `${slug}/${Date.now()}-${safe}`
    const { error } = await sb.storage.from('properties').upload(path, file, {
      contentType: file.type || 'image/jpeg',
      upsert: false,
    })
    if (error) return { ok: false, error: error.message }
    const { data } = sb.storage.from('properties').getPublicUrl(path)
    return { ok: true, url: data.publicUrl }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}
