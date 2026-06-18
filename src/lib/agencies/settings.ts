'use server'

/*
 * Archivo : settings.ts
 * Ruta    : src/lib/agencies/settings.ts
 * Modif.  : 2026-06-15
 * Descripción: Persiste la Configuración de la agencia (form del panel). Verifica
 *              membresía (el owner/admin edita su propia agencia). Solo server.
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertAgencyRole } from '@/lib/auth/require-tenant'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export async function saveAgencySettings(
  slug: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertAgencyRole(slug, 'admin'))) return { ok: false, error: 'Solo el owner o un admin pueden editar la configuración.' }
    const allowed = ['name', 'tagline', 'phone', 'whatsapp_number', 'address', 'email_contact', 'instagram', 'business_hours', 'seo_title', 'seo_description', 'whatsapp_auto']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clean: Record<string, any> = {}
    for (const k of allowed) if (k in fields) clean[k] = fields[k] === '' ? null : fields[k]
    if (Object.keys(clean).length === 0) return { ok: true }
    const { error } = await sb().from('agencies').update(clean).eq('slug', slug)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}`)
    revalidatePath(`/${slug}/admin/configuracion`)
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
