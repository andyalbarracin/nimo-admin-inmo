/*
 * Archivo: property-types.ts
 * Ruta: src/lib/constants/property-types.ts
 * Creado: 2026-06-06
 * Descripción: Catálogo de tipos de inmueble: labels, íconos y orden de visualización.
 */

import type { TipoPropiedad } from '@/types/property'

export interface TipoPropiedadConfig {
  value: TipoPropiedad
  label: string
  labelPlural: string
  emoji: string
}

export const TIPOS_PROPIEDAD: TipoPropiedadConfig[] = [
  {
    value: 'departamento',
    label: 'Departamento',
    labelPlural: 'Departamentos',
    emoji: '🏢',
  },
  {
    value: 'casa',
    label: 'Casa',
    labelPlural: 'Casas',
    emoji: '🏠',
  },
  {
    value: 'ph',
    label: 'PH',
    labelPlural: 'PHs',
    emoji: '🏡',
  },
  {
    value: 'local',
    label: 'Local comercial',
    labelPlural: 'Locales comerciales',
    emoji: '🏪',
  },
  {
    value: 'oficina',
    label: 'Oficina',
    labelPlural: 'Oficinas',
    emoji: '🏗️',
  },
  {
    value: 'terreno',
    label: 'Terreno',
    labelPlural: 'Terrenos',
    emoji: '🌿',
  },
  {
    value: 'cochera',
    label: 'Cochera',
    labelPlural: 'Cocheras',
    emoji: '🚗',
  },
  {
    value: 'galpon',
    label: 'Galpón',
    labelPlural: 'Galpones',
    emoji: '🏭',
  },
]

/* Mapa para lookup O(1) */
export const TIPOS_PROPIEDAD_MAP = Object.fromEntries(
  TIPOS_PROPIEDAD.map((t) => [t.value, t]),
) as Record<TipoPropiedad, TipoPropiedadConfig>

/* Amenities disponibles para propiedades */
export const AMENITIES = [
  'Pileta',
  'Gimnasio',
  'Quincho/Parrilla',
  'Sum',
  'Seguridad 24hs',
  'Portero',
  'Ascensor',
  'Terraza',
  'Jardín',
  'Balcón',
  'Lavadero',
  'Baulera',
  'Cochera cubierta',
  'Cochera descubierta',
  'Aire acondicionado',
  'Calefacción central',
  'Gas natural',
  'Agua caliente central',
  'Acceso discapacitados',
  'Pet-friendly',
  'Loft',
  'Dependencia de servicio',
  'Vista al río',
  'Vista al parque',
] as const

export type Amenity = (typeof AMENITIES)[number]
