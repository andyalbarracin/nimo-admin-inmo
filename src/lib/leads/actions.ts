'use server'

/*
 * Server actions de Leads — escritura real en Supabase.
 * Admin client scopeado por agency_id del slug. Producción: requireTenantMember + RLS.
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAgencyIdBySlug, toDbWrite, stageToDb, type LeadInput } from './server'
import type { LeadStage } from '@/lib/dummy'

type Result = { ok: boolean; id?: string; error?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any {
  return createAdminClient()
}

export async function createLead(slug: string, input: LeadInput): Promise<Result> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }
    const { data, error } = await sb().from('leads').insert(toDbWrite(input, agencyId)).select('id').single()
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin/leads`)
    return { ok: true, id: data?.id }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function updateLead(slug: string, id: string, input: LeadInput): Promise<Result> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }
    const { error } = await sb().from('leads').update(toDbWrite(input, agencyId)).eq('id', id).eq('agency_id', agencyId)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin/leads`)
    return { ok: true, id }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function moveLeadStage(slug: string, id: string, stage: LeadStage): Promise<Result> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }
    const { error } = await sb().from('leads').update({ status: stageToDb(stage) }).eq('id', id).eq('agency_id', agencyId)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin/leads`)
    return { ok: true, id }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function deleteLead(slug: string, id: string): Promise<Result> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }
    const { error } = await sb().from('leads').delete().eq('id', id).eq('agency_id', agencyId)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin/leads`)
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}
