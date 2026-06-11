/*
 * Persistencia de Propiedades (lectura + mapeo) — SOLO server.
 * Usa el admin client (service_role) scopeado por agency_id del slug.
 * Producción: reemplazar por requireTenantMember() + cliente con RLS.
 *
 * NOTA: types/database.ts está desactualizado (faltan slug, is_opportunity,
 * columnas de 0004). Por eso casteamos el client. Regenerar con
 * `supabase gen types typescript` cuando se pueda.
 * Importar SOLO desde Server Components / server actions (usa service_role).
 */
import { createAdminClient } from '@/lib/supabase/admin'
import type { Property } from '@/lib/dummy'

// Tipos válidos en el CHECK de la DB (0001). 'loft' NO está permitido.
export const DB_PROPERTY_TYPES = ['casa', 'departamento', 'ph', 'terreno', 'local', 'oficina'] as const

/** Campos escribibles que el panel envía a las server actions. */
export interface PropertyInput {
  title: string
  type: string
  operation: 'venta' | 'alquiler'
  status: 'available' | 'reserved' | 'sold'
  price: number
  currency: 'USD' | 'ARS'
  address: string
  neighborhood: string
  city: string
  rooms: number | null
  bathrooms: number | null
  covered_area: number | null
  total_area: number | null
  description: string
  features: string[]
  lat: number
  lng: number
  is_featured: boolean
  is_opportunity: boolean
  /** URLs de imágenes (Storage bucket 'properties'). Se persisten en property_images.
   *  Si es undefined, las actions NO tocan las imágenes existentes. */
  images?: string[]
}

/** Mapea el input del panel a las columnas reales de la tabla `properties`. */
export function toDbWrite(input: PropertyInput, agencyId: string) {
  return {
    agency_id: agencyId,
    title: input.title,
    description: input.description,
    operation: input.operation,
    type: (DB_PROPERTY_TYPES as readonly string[]).includes(input.type) ? input.type : 'departamento',
    status: input.status,
    price: input.price,
    currency: input.currency,
    rooms: input.rooms,
    bathrooms: input.bathrooms,
    covered_area: input.covered_area,
    total_area: input.total_area,
    address: input.address,
    neighborhood: input.neighborhood,
    city: input.city,
    latitude: input.lat,
    longitude: input.lng,
    amenities: input.features,
    is_featured: input.is_featured,
    is_opportunity: input.is_opportunity,
  }
}

function sb() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createAdminClient() as any
}

export async function getAgencyIdBySlug(slug: string): Promise<string | null> {
  const { data } = await sb().from('agencies').select('id').eq('slug', slug).maybeSingle()
  return data?.id ?? null
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any, images: string[]): Property {
  return {
    id: row.id,
    title: row.title ?? '',
    type: (DB_PROPERTY_TYPES as readonly string[]).includes(row.type) ? row.type : 'departamento',
    operation: row.operation === 'alquiler' ? 'alquiler' : 'venta',
    price: Number(row.price) || 0,
    currency: row.currency === 'ARS' ? 'ARS' : 'USD',
    address: row.address ?? '',
    neighborhood: row.neighborhood ?? '',
    city: row.city ?? '',
    rooms: row.rooms ?? null,
    bathrooms: row.bathrooms ?? null,
    covered_area: row.covered_area != null ? Number(row.covered_area) : null,
    total_area: row.total_area != null ? Number(row.total_area) : null,
    description: row.description ?? '',
    features: Array.isArray(row.amenities) ? row.amenities : [],
    images,
    lat: row.latitude != null ? Number(row.latitude) : -34.6037,
    lng: row.longitude != null ? Number(row.longitude) : -58.3816,
    is_featured: !!row.is_featured,
    is_opportunity: !!row.is_opportunity,
    status: ['available', 'reserved', 'sold'].includes(row.status) ? row.status : 'available',
    agent: '', // assigned_to es uuid; el nombre del agente no se persiste en esta fase
    created_at: (row.created_at ?? new Date().toISOString()).slice(0, 10),
  }
}

/** Lista todas las propiedades de una agencia (incluye no disponibles, para el panel). */
export async function listPropertiesForAgency(slug: string): Promise<Property[]> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return []

    const { data: rows, error } = await sb()
      .from('properties')
      .select('*')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false })
    if (error || !rows) return []

    const ids = rows.map((r: any) => r.id)
    const imagesByProp = new Map<string, string[]>()
    if (ids.length) {
      const { data: imgs } = await sb()
        .from('property_images')
        .select('property_id, url, position')
        .in('property_id', ids)
        .order('position', { ascending: true })
      for (const im of imgs ?? []) {
        const arr = imagesByProp.get(im.property_id) ?? []
        arr.push(im.url)
        imagesByProp.set(im.property_id, arr)
      }
    }

    return rows.map((r: any) => mapRow(r, imagesByProp.get(r.id) ?? []))
  } catch (e) {
    console.error('[properties] listPropertiesForAgency error:', e)
    return []
  }
}
