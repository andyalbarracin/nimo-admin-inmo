'use server'

/* Acciones de planes — escritura en platform_plans (admin client, superadmin). */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import type { PlanId } from './server'

type Result = { ok: boolean; error?: string }

export interface UpdatePlanFields {
  name?: string
  monthly?: number
  setup?: number
  features?: string[]
  highlighted?: boolean
  is_active?: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export async function updatePlan(code: PlanId | string, fields: UpdatePlanFields): Promise<Result> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {}
    if (fields.name != null) payload.name = fields.name
    if (fields.monthly != null) payload.price_usd_monthly = fields.monthly
    if (fields.setup != null) payload.price_usd_setup = fields.setup
    if (fields.features != null) payload.features = fields.features
    if (fields.highlighted != null) payload.highlighted = fields.highlighted
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
