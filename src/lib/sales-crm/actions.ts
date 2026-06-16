'use server'

/* Acciones del CRM de plataforma (superadmin) — platform_crm_leads. */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { assertSuperAdmin } from '@/lib/auth/require-tenant'
import { toDbWrite, type SalesLead } from './server'

type Result = { ok: boolean; id?: string; error?: string }
const DENY: Result = { ok: false, error: 'No autorizado.' }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }
const rev = () => revalidatePath('/superadmin/crm')

export async function createSalesLead(lead: SalesLead): Promise<Result> {
  try {
    if (!(await assertSuperAdmin())) return DENY
    const { data, error } = await sb().from('platform_crm_leads').insert(toDbWrite(lead)).select('id').single()
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true, id: data?.id }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function updateSalesLead(id: string, lead: SalesLead): Promise<Result> {
  try {
    if (!(await assertSuperAdmin())) return DENY
    const { error } = await sb().from('platform_crm_leads').update(toDbWrite(lead)).eq('id', id)
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true, id }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function moveSalesLead(id: string, stage: string): Promise<Result> {
  try {
    if (!(await assertSuperAdmin())) return DENY
    const { error } = await sb().from('platform_crm_leads').update({ stage }).eq('id', id)
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true, id }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function deleteSalesLead(id: string): Promise<Result> {
  try {
    if (!(await assertSuperAdmin())) return DENY
    const { error } = await sb().from('platform_crm_leads').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
