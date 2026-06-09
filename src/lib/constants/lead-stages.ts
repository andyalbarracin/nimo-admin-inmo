/*
 * Archivo: lead-stages.ts
 * Ruta: src/lib/constants/lead-stages.ts
 * Creado: 2026-06-06
 * Descripción: Etapas del pipeline CRM con configuración de colores y orden
 *              para el tablero Kanban y los filtros de tabla.
 */

import type { EstadoLead } from '@/types/lead'

export interface EtapaConfig {
  value: EstadoLead
  label: string
  descripcion: string
  color: string         // Tailwind: bg-* text-*
  colorHeader: string   // color del encabezado de columna Kanban
  orden: number
  esFinal: boolean      // true = ganado o perdido (no se mueven más)
}

export const ETAPAS_PIPELINE: EtapaConfig[] = [
  {
    value: 'new',
    label: 'Nuevo',
    descripcion: 'Consulta recién llegada, sin primer contacto',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    colorHeader: 'bg-blue-500',
    orden: 0,
    esFinal: false,
  },
  {
    value: 'contacted',
    label: 'Contactado',
    descripcion: 'Ya hubo primer contacto, esperando respuesta',
    color: 'bg-sky-50 text-sky-700 border-sky-200',
    colorHeader: 'bg-sky-500',
    orden: 1,
    esFinal: false,
  },
  {
    value: 'interested',
    label: 'Interesado',
    descripcion: 'Confirmó interés, negociando o esperando visita',
    color: 'bg-violet-50 text-violet-700 border-violet-200',
    colorHeader: 'bg-violet-500',
    orden: 2,
    esFinal: false,
  },
  {
    value: 'visit-scheduled',
    label: 'Visita pactada',
    descripcion: 'Se agendó una visita a la propiedad',
    color: 'bg-amber-50 text-amber-700 border-amber-200',
    colorHeader: 'bg-amber-500',
    orden: 3,
    esFinal: false,
  },
  {
    value: 'offer-sent',
    label: 'Oferta enviada',
    descripcion: 'Se envió propuesta formal de precio/condiciones',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    colorHeader: 'bg-orange-500',
    orden: 4,
    esFinal: false,
  },
  {
    value: 'won',
    label: 'Cerrado ✓',
    descripcion: 'Operación concretada',
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    colorHeader: 'bg-emerald-500',
    orden: 5,
    esFinal: true,
  },
  {
    value: 'lost',
    label: 'Perdido',
    descripcion: 'La operación no se concretó',
    color: 'bg-red-50 text-red-600 border-red-200',
    colorHeader: 'bg-red-400',
    orden: 6,
    esFinal: true,
  },
]

export const ETAPAS_MAP = Object.fromEntries(
  ETAPAS_PIPELINE.map((e) => [e.value, e]),
) as Record<EstadoLead, EtapaConfig>

/* Solo etapas activas (sin finales) — para el Kanban principal */
export const ETAPAS_ACTIVAS = ETAPAS_PIPELINE.filter((e) => !e.esFinal)

/* Colores para los CRM stage tokens del design system */
export const CRM_COLORS: Record<EstadoLead, string> = {
  'new': 'var(--color-crm-new)',
  'contacted': 'var(--color-crm-contacted)',
  'interested': 'var(--color-crm-interested)',
  'visit-scheduled': 'var(--color-crm-visit)',
  'offer-sent': 'var(--color-crm-offer)',
  'won': 'var(--color-crm-won)',
  'lost': 'var(--color-crm-lost)',
}
