'use server'

/*
 * Subida del logo de la inmobiliaria a Supabase Storage (bucket 'agency-assets',
 * público, creado en 0001) + persiste la URL en agencies.logo_url.
 * Admin client (service_role, solo server). Producción: gatear con requireTenantMember.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

type Result = { ok: boolean; url?: string; error?: string }

export async function uploadAgencyLogo(slug: string, formData: FormData): Promise<Result> {
  try {
    const file = formData.get('file') as File | null
    if (!file || file.size === 0) return { ok: false, error: 'Sin archivo' }
    if (!file.type.startsWith('image/')) return { ok: false, error: 'El archivo debe ser una imagen' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
    const safe = file.name.replace(/[^\w.\-]+/g, '_')
    const path = `${slug}/logo-${Date.now()}-${safe}`
    const { error } = await sb.storage.from('agency-assets').upload(path, file, { contentType: file.type || 'image/png', upsert: false })
    if (error) return { ok: false, error: error.message }
    const { data } = sb.storage.from('agency-assets').getPublicUrl(path)
    const url = data.publicUrl as string
    await sb.from('agencies').update({ logo_url: url }).eq('slug', slug)
    revalidatePath(`/${slug}/admin/configuracion`)
    revalidatePath(`/${slug}`)
    return { ok: true, url }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function removeAgencyLogo(slug: string): Promise<Result> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
    await sb.from('agencies').update({ logo_url: null }).eq('slug', slug)
    revalidatePath(`/${slug}/admin/configuracion`)
    revalidatePath(`/${slug}`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}
