'use server'

/*
 * Server actions de Leads — escritura real en Supabase.
 * Admin client scopeado por agency_id del slug. Producción: requireTenantMember + RLS.
 */
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAgencyIdBySlug, toDbWrite, stageToDb, type LeadInput } from './server'
import type { LeadStage } from '@/lib/dummy'
import { assertAgencyAccess } from '@/lib/auth/require-tenant'

type Result = { ok: boolean; id?: string; error?: string }
const DENY: Result = { ok: false, error: 'No autorizado.' }
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any {
  return createAdminClient()
}

/** Alta de lead INTERNA (CRM, agente autenticado). Requiere membresía. */
export async function createLead(slug: string, input: LeadInput): Promise<Result> {
  try {
    if (!(await assertAgencyAccess(slug))) return DENY
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

/**
 * Alta de lead PÚBLICA (formularios del sitio: contacto, tasación). SIN auth, pero
 * con honeypot + validación + rate-limit por IP (máx 5/min) para frenar spam/bots.
 */
export async function submitPublicLead(slug: string, input: LeadInput, hp?: string): Promise<Result> {
  try {
    // Honeypot: campo oculto que solo completan los bots → fingimos éxito y descartamos.
    if (hp && hp.trim() !== '') return { ok: true }

    const name = (input.name ?? '').trim()
    if (!name || name.length > 120) return { ok: false, error: 'Ingresá un nombre válido.' }
    if (input.email && (input.email.length > 160 || !EMAIL_RE.test(input.email))) return { ok: false, error: 'Email inválido.' }
    if (input.phone && input.phone.length > 40) return { ok: false, error: 'Teléfono inválido.' }
    if ((input.notes ?? '').length > 2000) return { ok: false, error: 'El mensaje es demasiado largo.' }

    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return { ok: false, error: 'Agencia no encontrada' }

    // Rate-limit por IP.
    const h = await headers()
    const ip = (h.get('x-forwarded-for') ?? '').split(',')[0]?.trim() || h.get('x-real-ip') || ''
    if (ip) {
      const since = new Date(Date.now() - 60_000).toISOString()
      const { count } = await sb().from('leads').select('id', { count: 'exact', head: true }).eq('submitted_ip', ip).gte('created_at', since)
      if ((count ?? 0) >= 5) return { ok: false, error: 'Demasiados envíos seguidos. Probá de nuevo en un minuto.' }
    }

    const { data, error } = await sb().from('leads').insert({ ...toDbWrite(input, agencyId), submitted_ip: ip || null }).select('id').single()
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}/admin/leads`)
    return { ok: true, id: data?.id }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function updateLead(slug: string, id: string, input: LeadInput): Promise<Result> {
  try {
    if (!(await assertAgencyAccess(slug))) return DENY
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
    if (!(await assertAgencyAccess(slug))) return DENY
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
    if (!(await assertAgencyAccess(slug))) return DENY
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
