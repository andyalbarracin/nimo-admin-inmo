'use server'

/*
 * Subida de archivos del CRM superadmin a Supabase Storage (bucket 'crm-files').
 * Usa admin client (service_role) → no requiere auth del usuario en el demo.
 * Requiere el bucket creado (ver 0006_crm_storage.sql).
 */
import { createAdminClient } from '@/lib/supabase/admin'

type Result = { ok: boolean; url?: string; name?: string; error?: string }

export async function uploadCrmFile(formData: FormData): Promise<Result> {
  try {
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { ok: false, error: 'Sin archivo' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
    const safe = file.name.replace(/[^\w.\-]+/g, '_')
    const path = `${Date.now()}-${safe}`
    const { error } = await sb.storage.from('crm-files').upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false })
    if (error) return { ok: false, error: error.message }
    const { data } = sb.storage.from('crm-files').getPublicUrl(path)
    return { ok: true, url: data.publicUrl, name: file.name }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}
