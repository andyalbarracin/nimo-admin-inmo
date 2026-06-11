/*
 * Persistencia de Leads (lectura + mapeo) — SOLO server.
 * Admin client (service_role) scopeado por agency_id del slug.
 * Producción: requireTenantMember() + cliente RLS.
 *
 * NOTA: el enum de etapa difiere entre app y DB:
 *   app   'visit'    <-> DB 'visit-scheduled'
 *   app   'proposal' <-> DB 'offer-sent'
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { Lead, LeadStage, ClientType } from '@/lib/dummy'

const APP_TO_DB: Record<LeadStage, string> = {
  new: 'new', contacted: 'contacted', interested: 'interested',
  visit: 'visit-scheduled', proposal: 'offer-sent', won: 'won', lost: 'lost',
}
const DB_TO_APP: Record<string, LeadStage> = {
  new: 'new', contacted: 'contacted', interested: 'interested',
  'visit-scheduled': 'visit', 'offer-sent': 'proposal', won: 'won', lost: 'lost',
}
// Pass-through para etapas custom (creadas en el editor de etapas): si no hay
// mapeo conocido, se guarda/lee el id tal cual. Requiere relajar el CHECK de
// leads.status (migración 0008).
export const stageToDb = (s: LeadStage) => APP_TO_DB[s] ?? s
export const stageToApp = (s: string): LeadStage => DB_TO_APP[s] ?? (s as LeadStage)

/** Campos que el CRM envía a las server actions. */
export interface LeadInput {
  name: string
  email: string
  phone: string
  stage: LeadStage
  source: string
  property_interest: string
  budget: string
  notes: string
  client_type?: ClientType
  operation_interest?: 'venta' | 'alquiler'
  contact2_name?: string
  contact2_phone?: string
}

export function toDbWrite(input: LeadInput, agencyId: string) {
  return {
    agency_id: agencyId,
    name: input.name,
    email: input.email || null,
    phone: input.phone || null,
    source: input.source || null,
    status: stageToDb(input.stage),
    client_type: input.client_type ?? null,
    operation_interest: input.operation_interest ?? null,
    budget: input.budget || null,
    property_interest: input.property_interest || null,
    contact2_name: input.contact2_name || null,
    contact2_phone: input.contact2_phone || null,
    internal_notes: input.notes || null,
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function sb(): any {
  return createAdminClient()
}

async function getAgencyId(slug: string): Promise<string | null> {
  const { data } = await sb().from('agencies').select('id').eq('slug', slug).maybeSingle()
  return data?.id ?? null
}
export { getAgencyId as getAgencyIdBySlug }

function mapRow(row: any): Lead {
  return {
    id: row.id,
    name: row.name ?? '',
    email: row.email ?? '',
    phone: row.phone ?? '',
    stage: stageToApp(row.status),
    source: row.source ?? 'Formulario web',
    property_interest: row.property_interest ?? '',
    budget: row.budget ?? '',
    notes: row.internal_notes ?? '',
    agent: '', // assigned_to es uuid; nombre no persistido aún
    created_at: (row.created_at ?? new Date().toISOString()).slice(0, 10),
    last_contact: (row.updated_at ?? row.created_at ?? new Date().toISOString()).slice(0, 10),
    client_type: row.client_type ?? undefined,
    operation_interest: row.operation_interest ?? undefined,
    contact2_name: row.contact2_name ?? undefined,
    contact2_phone: row.contact2_phone ?? undefined,
  }
}

export async function listLeadsForAgency(slug: string): Promise<Lead[]> {
  try {
    const agencyId = await getAgencyId(slug)
    if (!agencyId) return []
    const { data, error } = await sb()
      .from('leads')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false })
    if (error || !data) return []
    return data.map(mapRow)
  } catch (e) {
    console.error('[leads] listLeadsForAgency error:', e)
    return []
  }
}
