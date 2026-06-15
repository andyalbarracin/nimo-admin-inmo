'use server'

/*
 * Subida del logo de la inmobiliaria a Supabase Storage (bucket 'agency-assets',
 * público, creado en 0001) + persiste la URL en agencies.logo_url.
 * Admin client (service_role, solo server). Producción: gatear con requireTenantMember.
 */
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { assertAgencyAccess } from '@/lib/auth/require-tenant'

type Result = { ok: boolean; url?: string; error?: string }

/**
 * Persiste la URL del logo (ya subido client-side a 'agency-assets').
 * Verifica que el llamante pertenezca a la agencia.
 */
export async function saveAgencyLogoUrl(slug: string, url: string): Promise<Result> {
  try {
    if (!(await assertAgencyAccess(slug))) return { ok: false, error: 'No autorizado.' }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
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
    if (!(await assertAgencyAccess(slug))) return { ok: false, error: 'No autorizado.' }
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
