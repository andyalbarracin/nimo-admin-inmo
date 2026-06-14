'use server'

/*
 * Server actions de Propiedades — escritura real en Supabase.
 * Admin client (service_role, solo server) scopeado por agency_id del slug.
 * Producción: cambiar por requireTenantMember(slug, 'agent') + cliente RLS.
 */
import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import { nanoid } from 'nanoid'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAgencyIdBySlug, toDbWrite, type PropertyInput } from './server'
import { canCreateProperty } from '@/lib/agencies/status'

type Result = { ok: boolean; id?: string; error?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any {
  return createAdminClient()
}

function revalidate(slug: string) {
  revalidatePath(`/${slug}/admin/propiedades`)
  revalidatePath(`/${slug}`)
  revalidatePath(`/${slug}/propiedades`)
}

/** Si la propiedad queda como "oportunidad", desmarca las demás de la agencia (índice único). */
async function clearOtherOpportunities(agencyId: string, exceptId?: string) {
  let q = sb().from('properties').update({ is_opportunity: false }).eq('agency_id', agencyId).eq('is_opportunity', true)
  if (exceptId) q = q.neq('id', exceptId)
  await q
}

/**
 * Sincroniza la galería de la propiedad en `property_images`: borra las filas
 * actuales y reinserta las URLs en orden (position). La primera es la portada.
 * Si `images` es undefined, no toca nada (otras llamadas que no gestionan fotos).
 */
async function syncImages(propertyId: string, agencyId: string, images?: string[]) {
  if (images === undefined) return
  await sb().from('property_images').delete().eq('property_id', propertyId)
  const rows = images
    .filter(u => typeof u === 'string' && u.trim())
    .map((url, i) => ({ property_id: propertyId, agency_id: agencyId, url, position: i, is_cover: i === 0 }))
  if (rows.length) await sb().from('property_images').insert(rows)
}

export async function createProperty(slug: string, input: PropertyInput): Promise<Result> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }

    // Límite de propiedades según el plan (Subsistema C).
    const limit = await canCreateProperty(agencyId)
    if (!limit.ok) return { ok: false, error: limit.error }

    if (input.is_opportunity) await clearOtherOpportunities(agencyId)

    const propSlug = `${slugify(input.title || 'propiedad', { lower: true, strict: true }).slice(0, 60)}-${nanoid(5)}`
    const payload = { ...toDbWrite(input, agencyId), slug: propSlug }

    const { data, error } = await sb().from('properties').insert(payload).select('id').single()
    if (error) return { ok: false, error: error.message }

    if (data?.id) await syncImages(data.id, agencyId, input.images)

    revalidate(slug)
    return { ok: true, id: data?.id }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function updateProperty(slug: string, id: string, input: PropertyInput): Promise<Result> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }

    if (input.is_opportunity) await clearOtherOpportunities(agencyId, id)

    const { error } = await sb()
      .from('properties')
      .update(toDbWrite(input, agencyId))
      .eq('id', id)
      .eq('agency_id', agencyId)
    if (error) return { ok: false, error: error.message }

    await syncImages(id, agencyId, input.images)

    revalidate(slug)
    return { ok: true, id }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function deleteProperty(slug: string, id: string): Promise<Result> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }

    const { error } = await sb().from('properties').delete().eq('id', id).eq('agency_id', agencyId)
    if (error) return { ok: false, error: error.message }

    revalidate(slug)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}
