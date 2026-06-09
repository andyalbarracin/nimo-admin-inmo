/*
 * Archivo: property.ts
 * Ruta: src/types/property.ts
 * Creado: 2026-06-06
 * Descripción: Tipos de dominio para propiedades inmobiliarias.
 *              Derivados de la tabla `properties` del schema de Supabase,
 *              pero enriquecidos con relaciones y helpers para uso en la UI.
 */

import type { Database } from './database'

/* ---- Tipos base del schema ---- */
export type PropertyRow = Database['public']['Tables']['properties']['Row']
export type PropertyInsert = Database['public']['Tables']['properties']['Insert']
export type PropertyUpdate = Database['public']['Tables']['properties']['Update']
export type PropertyImageRow = Database['public']['Tables']['property_images']['Row']

/* ---- Operación (tipo de oferta) ---- */
export type Operacion = PropertyRow['operation']

/* ---- Tipo de inmueble ---- */
export type TipoPropiedad = PropertyRow['type']

/* ---- Estado de la propiedad ---- */
export type EstadoPropiedad = PropertyRow['status']

/* ---- Moneda ---- */
export type Moneda = 'USD' | 'ARS'

/* ---- Propiedad con imágenes (join frecuente en UI) ---- */
export type PropiedadConImagenes = PropertyRow & {
  property_images: PropertyImageRow[]
}

/* ---- Propiedad con imagen de portada (para grillas) ---- */
export type PropiedadConPortada = PropertyRow & {
  cover_image: PropertyImageRow | null
}

/* ---- Filtros de búsqueda de propiedades ---- */
export interface FiltrosPropiedades {
  operacion?: Operacion
  tipo?: TipoPropiedad
  precioMin?: number
  precioMax?: number
  moneda?: Moneda
  ambientesMin?: number
  ambientesMax?: number
  m2CubiertosMin?: number
  m2CubiertosMax?: number
  barrio?: string
  ciudad?: string
  soloDestacadas?: boolean
  busqueda?: string
}

/* ---- Parámetros de paginación de propiedades ---- */
export interface PaginacionPropiedades {
  pagina: number
  porPagina: number
  ordenarPor: 'created_at' | 'price' | 'views_count'
  orden: 'asc' | 'desc'
}

/* ---- Resultado paginado de propiedades ---- */
export interface ResultadoPropiedades<T = PropiedadConPortada> {
  items: T[]
  total: number
  pagina: number
  porPagina: number
  totalPaginas: number
}

/* ---- Datos para crear/editar propiedad en formulario ---- */
export interface FormPropiedad {
  title: string
  description?: string
  operation: Operacion
  type: TipoPropiedad
  status: EstadoPropiedad
  price?: number
  currency: Moneda
  expenses?: number
  expenses_currency: Moneda
  rooms?: number
  bedrooms?: number
  bathrooms?: number
  garages?: number
  covered_area?: number
  total_area?: number
  address?: string
  neighborhood?: string
  city?: string
  province?: string
  latitude?: number
  longitude?: number
  show_exact_location: boolean
  is_featured: boolean
  amenities: string[]
  video_url?: string
  virtual_tour_url?: string
  meta_title?: string
  meta_description?: string
  assigned_to?: string
  internal_notes?: string
  exclusive: boolean
}
