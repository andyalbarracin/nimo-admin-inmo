/*
 * Archivo: lead.ts
 * Ruta: src/types/lead.ts
 * Creado: 2026-06-06
 * Descripción: Tipos de dominio para leads (consultas entrantes al CRM).
 *              Derivados de las tablas `leads` y `lead_events`.
 */

import type { Database } from './database'

/* ---- Tipos base del schema ---- */
export type LeadRow = Database['public']['Tables']['leads']['Row']
export type LeadInsert = Database['public']['Tables']['leads']['Insert']
export type LeadUpdate = Database['public']['Tables']['leads']['Update']
export type LeadEventRow = Database['public']['Tables']['lead_events']['Row']
export type LeadEventInsert = Database['public']['Tables']['lead_events']['Insert']

/* ---- Estado del lead en el pipeline ---- */
export type EstadoLead = LeadRow['status']

/* ---- Tipo de lead (origen de la consulta) ---- */
export type TipoLead = LeadRow['lead_type']

/* ---- Lead con su historial de eventos ---- */
export type LeadConEventos = LeadRow & {
  lead_events: LeadEventRow[]
}

/* ---- Lead con datos de propiedad (para vista de detalle) ---- */
export type LeadConPropiedad = LeadRow & {
  property: {
    id: string
    title: string
    slug: string
    type: string
    operation: string
    price: number | null
    currency: string
  } | null
}

/* ---- Item del Kanban (columna + leads) ---- */
export interface KanbanColumna {
  estado: EstadoLead
  label: string
  leads: LeadRow[]
  count: number
}

/* ---- Estadísticas del pipeline para el dashboard ---- */
export interface EstadisticasPipeline {
  total: number
  nuevos: number
  enCurso: number
  cerradosGanados: number
  cerradosPerdidos: number
  tasaConversion: number
}

/* ---- Formulario de consulta pública (desde el sitio del tenant) ---- */
export interface FormConsulta {
  name: string
  email?: string
  phone?: string
  message?: string
  property_id?: string
  lead_type: TipoLead
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

/* ---- Formulario de tasación ---- */
export interface FormTasacion extends FormConsulta {
  lead_type: 'valuation'
  valuation_property_type: string
  valuation_address: string
  valuation_rooms?: number
  valuation_area?: number
}
