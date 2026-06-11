'use server'

/* Acciones de planes — escritura en platform_plans (admin client, superadmin). */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'

type Result = { ok: boolean; error?: string }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export async function updatePlan(code: string, fields: { monthly?: number; setup?: number; is_active?: boolean }): Promise<Result> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {}
    if (fields.monthly != null) payload.price_usd_monthly = fields.monthly
    if (fields.setup != null) payload.price_usd_setup = fields.setup
    if (fields.is_active != null) payload.is_active = fields.is_active
    const { error } = await sb().from('platform_plans').update(payload).eq('code', code)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/')                    // landing
    revalidatePath('/superadmin/planes')
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}
