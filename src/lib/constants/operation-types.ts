/*
 * Archivo: operation-types.ts
 * Ruta: src/lib/constants/operation-types.ts
 * Creado: 2026-06-06
 * Descripción: Catálogo de tipos de operación: venta, alquiler, alquiler temporario.
 */

import type { Operacion } from '@/types/property'

export interface OperacionConfig {
  value: Operacion
  label: string
  labelCorto: string
  badge: string  // color de badge en la UI
}

export const OPERACIONES: OperacionConfig[] = [
  {
    value: 'venta',
    label: 'Venta',
    labelCorto: 'Venta',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    value: 'alquiler',
    label: 'Alquiler',
    labelCorto: 'Alquiler',
    badge: 'bg-green-100 text-green-800',
  },
  {
    value: 'alquiler-temporario',
    label: 'Alquiler temporario',
    labelCorto: 'Temporario',
    badge: 'bg-orange-100 text-orange-800',
  },
]

export const OPERACIONES_MAP = Object.fromEntries(
  OPERACIONES.map((o) => [o.value, o]),
) as Record<Operacion, OperacionConfig>

/* Estados de propiedad con label y color para badges */
export const ESTADOS_PROPIEDAD = {
  available: { label: 'Disponible', badge: 'bg-emerald-100 text-emerald-800' },
  reserved: { label: 'Reservada', badge: 'bg-amber-100 text-amber-800' },
  sold: { label: 'Vendida', badge: 'bg-slate-100 text-slate-600' },
  rented: { label: 'Alquilada', badge: 'bg-slate-100 text-slate-600' },
  paused: { label: 'Pausada', badge: 'bg-red-100 text-red-700' },
  draft: { label: 'Borrador', badge: 'bg-gray-100 text-gray-600' },
} as const

/* Monedas */
export const MONEDAS = {
  USD: { label: 'USD', simbolo: 'U$S', locale: 'en-US' },
  ARS: { label: 'Pesos', simbolo: '$', locale: 'es-AR' },
} as const
