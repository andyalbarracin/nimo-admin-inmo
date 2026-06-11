/*
 * CRM de plataforma (superadmin) — lectura desde Supabase (platform_crm_leads).
 * Si la tabla no existe aún (0007 no corrida) → fallback al seed en memoria.
 */
import { createAdminClient } from '@/lib/supabase/admin'

export interface SalesFile { name: string; url: string }
export interface SalesLead {
  id: string; column: string
  company: string; contact: string; city: string
  email: string; phone1: string; phone2: string; address: string
  plan: string; monthly: number; source: string; budget: string; notes: string
  files: SalesFile[]
}

export const SALES_SEED: SalesLead[] = [
  { id: 'seed-1', column: 'demo', company: 'Inmobiliaria Roca', contact: 'Martín Roca', city: 'Rosario', email: 'martin@roca.com.ar', phone1: '+54 9 341 442-1111', phone2: '', address: '', plan: 'Pro', monthly: 59, source: 'Recomendación', budget: 'USD 700/año', notes: 'Tiene 3 asesores, viene de otro CMS. Interesado en IA.', files: [] },
  { id: 'seed-2', column: 'proposal', company: 'Grupo Sur', contact: 'Laura Herrera', city: 'Buenos Aires', email: 'laura@gruposur.com', phone1: '+54 11 4555-7890', phone2: '', address: '', plan: 'Business', monthly: 119, source: 'Búsqueda web', budget: 'USD 1.400/año', notes: 'Llamar para cerrar.', files: [] },
  { id: 'seed-3', column: 'contacted', company: 'Propiedades del Norte', contact: 'Carlos Vega', city: 'Córdoba', email: 'carlos@delnorte.com', phone1: '+54 351 422-0000', phone2: '', address: '', plan: 'Starter', monthly: 29, source: 'Instagram', budget: '', notes: 'Unipersonal, sensible al precio.', files: [] },
  { id: 'seed-4', column: 'client', company: 'Realty BA', contact: 'Ana Torres', city: 'Buenos Aires', email: 'ana@realtyba.com', phone1: '+54 11 4001-2222', phone2: '', address: '', plan: 'Pro', monthly: 59, source: 'Evento / feria', budget: '', notes: 'Cliente activo.', files: [] },
  { id: 'seed-5', column: 'prospect', company: 'Gestión Integral', contact: 'Roberto Díaz', city: 'Rosario', email: 'roberto@gintegral.com', phone1: '+54 341 488-0000', phone2: '', address: '', plan: 'Pro', monthly: 59, source: 'Llamada en frío', budget: '', notes: 'Primer contacto.', files: [] },
  { id: 'seed-6', column: 'negotiation', company: 'Casas & Campos', contact: 'Sandra Ruiz', city: 'Pilar', email: 'sandra@casasycampos.com', phone1: '+54 11 4900-3333', phone2: '', address: '', plan: 'Business', monthly: 119, source: 'Recomendación', budget: 'USD 1.300/año', notes: 'Enviar contrato.', files: [] },
  { id: 'seed-7', column: 'churn_risk', company: 'InmoRed Patagonia', contact: 'Diego Alvarado', city: 'Bariloche', email: 'diego@inmored.com', phone1: '+54 294 445-0000', phone2: '', address: '', plan: 'Pro', monthly: 59, source: 'Webinar', budget: '', notes: 'URGENTE: sin login en 3 semanas.', files: [] },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(r: any): SalesLead {
  return {
    id: r.id, column: r.stage, company: r.company ?? '', contact: r.contact ?? '', city: r.city ?? '',
    email: r.email ?? '', phone1: r.phone1 ?? '', phone2: r.phone2 ?? '', address: r.address ?? '',
    plan: r.plan ?? 'Pro', monthly: Number(r.monthly) || 0, source: r.source ?? '', budget: r.budget ?? '',
    notes: r.notes ?? '', files: Array.isArray(r.files) ? r.files : [],
  }
}

export function toDbWrite(l: SalesLead) {
  return {
    stage: l.column, company: l.company, contact: l.contact, city: l.city, email: l.email,
    phone1: l.phone1, phone2: l.phone2, address: l.address, plan: l.plan, monthly: l.monthly,
    source: l.source, budget: l.budget, notes: l.notes, files: l.files,
  }
}

/** true si la persistencia está activa (tabla creada). */
export async function salesCrmReady(): Promise<boolean> {
  try {
    const { error } = await sb().from('platform_crm_leads').select('id').limit(1)
    return !error
  } catch { return false }
}

export async function listSalesLeads(): Promise<{ leads: SalesLead[]; persisted: boolean }> {
  try {
    const { data, error } = await sb().from('platform_crm_leads').select('*').order('created_at', { ascending: true })
    if (error) return { leads: SALES_SEED, persisted: false } // tabla no creada → fallback
    return { leads: (data ?? []).map(mapRow), persisted: true }
  } catch {
    return { leads: SALES_SEED, persisted: false }
  }
}
