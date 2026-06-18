'use server'

/*
 * Archivo : provision.ts
 * Ruta    : src/lib/agencies/provision.ts
 * Modif.  : 2026-06-13
 * Descripción: Alta (provisioning) de inmobiliarias desde el superadmin.
 *              Crea el owner (Supabase Admin API) + agencies + agency_members +
 *              agency_theme + agency_settings. Opcionalmente linkea un lead del
 *              CRM de ventas. Todo con service_role (bypassa RLS). Solo server.
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { slugify, esSlugValido } from '@/lib/utils/slug'
import { assertSuperAdmin, assertAgencyRole } from '@/lib/auth/require-tenant'
import type { PlanId } from '@/lib/plans/server'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

export interface NewAgencyInput {
  name: string
  slug: string
  planCode: PlanId
  ownerEmail: string
  ownerPassword: string
  crmLeadId?: string
}

export interface LiveAgency {
  id: string
  slug: string
  name: string
  plan_code: string
  plan_status: string
  owner_email: string
  created_at: string
}

type Result = { ok: boolean; slug?: string; error?: string }

export async function createAgency(input: NewAgencyInput): Promise<Result> {
  try {
    if (!(await assertSuperAdmin())) return { ok: false, error: 'No autorizado.' }
    const name = input.name?.trim()
    const slug = slugify(input.slug || input.name || '')
    const email = input.ownerEmail?.trim().toLowerCase()
    if (!name) return { ok: false, error: 'Falta el nombre de la agencia.' }
    if (!esSlugValido(slug)) return { ok: false, error: 'El slug es inválido.' }
    if (!email) return { ok: false, error: 'Falta el email del owner.' }
    if (!input.ownerPassword || input.ownerPassword.length < 8)
      return { ok: false, error: 'La contraseña del owner debe tener al menos 8 caracteres.' }

    const admin = sb()

    // Slug único
    const { data: exists } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
    if (exists) return { ok: false, error: `Ya existe una agencia con el slug "${slug}".` }

    // Plan (FK a platform_plans por code)
    const { data: plan } = await admin.from('platform_plans').select('id').eq('code', input.planCode).maybeSingle()
    if (!plan) return { ok: false, error: `Plan "${input.planCode}" no existe en la DB (¿corriste 0010?).` }

    // Owner — Supabase Admin API
    const { data: created, error: userErr } = await admin.auth.admin.createUser({
      email,
      password: input.ownerPassword,
      email_confirm: true,
    })
    if (userErr || !created?.user) {
      return { ok: false, error: `No se pudo crear el owner: ${userErr?.message ?? 'desconocido'}` }
    }
    const userId = created.user.id

    // Agencia
    const { data: agency, error: agErr } = await admin.from('agencies').insert({
      slug, name, plan_id: plan.id, plan_status: 'active', email_contact: email,
    }).select('id').single()
    if (agErr || !agency) {
      await admin.auth.admin.deleteUser(userId).catch(() => {})
      return { ok: false, error: `No se pudo crear la agencia: ${agErr?.message ?? 'desconocido'}` }
    }
    const agencyId = agency.id

    // Owner member + theme + settings por defecto (best-effort)
    await admin.from('agency_members').insert({ agency_id: agencyId, user_id: userId, role: 'owner', display_name: name })
    await admin.from('agency_theme').insert({ agency_id: agencyId })
    await admin.from('agency_settings').insert({ agency_id: agencyId, notify_email: email })

    // Link con el CRM de ventas
    if (input.crmLeadId) {
      await admin.from('platform_crm_leads').update({ agency_id: agencyId, stage: 'client' }).eq('id', input.crmLeadId)
      revalidatePath('/superadmin/crm')
    }

    revalidatePath('/superadmin/agencias')
    return { ok: true, slug }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

/** Agencias REALES (de la DB), para mergear con las dummy en la lista. */
export async function listLiveAgencies(): Promise<LiveAgency[]> {
  try {
    if (!(await assertSuperAdmin())) return []
    const { data, error } = await sb()
      .from('agencies')
      .select('id, slug, name, plan_status, email_contact, created_at, plan:platform_plans(code)')
      .order('created_at', { ascending: false })
    if (error || !data) return []
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((a: any) => ({
      id: a.id, slug: a.slug, name: a.name,
      plan_code: a.plan?.code ?? '—', plan_status: a.plan_status,
      owner_email: a.email_contact ?? '', created_at: (a.created_at ?? '').slice(0, 10),
    }))
  } catch { return [] }
}

/** Ficha completa de una agencia real por slug (o null si no existe en DB). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getLiveAgency(slug: string): Promise<any | null> {
  try {
    const { data } = await sb()
      .from('agencies')
      .select('*, plan:platform_plans(code,name), theme:agency_theme(site_theme)')
      .eq('slug', slug)
      .maybeSingle()
    return data ?? null
  } catch { return null }
}

/** Cambia el tema del sitio público de la agencia (editorial/spatial/atelier). */
export async function setAgencyTheme(slug: string, theme: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertAgencyRole(slug, 'admin'))) return { ok: false, error: 'Solo el owner o un admin pueden cambiar el tema.' }
    if (!['editorial', 'spatial', 'atelier'].includes(theme)) return { ok: false, error: 'Tema inválido.' }
    const admin = sb()
    const { data: ag } = await admin.from('agencies').select('id').eq('slug', slug).maybeSingle()
    if (!ag) return { ok: false, error: 'Agencia no encontrada.' }
    const { error } = await admin.from('agency_theme').update({ site_theme: theme }).eq('agency_id', ag.id)
    if (error) return { ok: false, error: error.message }
    revalidatePath(`/${slug}`)
    revalidatePath('/superadmin/agencias', 'layout')
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

/** Actualiza datos comerciales/fiscales de una agencia real. */
export async function updateAgencyFiscal(
  agencyId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any>,
): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertSuperAdmin())) return { ok: false, error: 'No autorizado.' }
    const allowed = ['business_name', 'legal_id', 'cucicba_id', 'tax_condition', 'billing_email', 'billing_address', 'phone', 'whatsapp_number', 'address', 'city', 'province', 'notes_internal']
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const clean: Record<string, any> = {}
    for (const k of allowed) if (k in fields) clean[k] = fields[k] === '' ? null : fields[k]
    const { error } = await sb().from('agencies').update(clean).eq('id', agencyId)
    if (error) return { ok: false, error: error.message }
    revalidatePath('/superadmin/agencias', 'layout')
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
