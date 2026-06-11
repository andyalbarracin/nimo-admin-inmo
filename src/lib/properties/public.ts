/*
 * Resolver de propiedades para el SITIO PÚBLICO.
 * Si la agencia existe en la DB → lee sus propiedades disponibles de Supabase.
 * Si no (agencias que solo viven en el dummy del demo) → cae a dummy,
 * para no romper la demo de los 3 themes.
 */
import { getAgencyIdBySlug, listPropertiesForAgency } from './server'
import { PROPERTIES } from '@/lib/dummy'
import type { Property } from '@/lib/dummy'

const dummyAvailable = () => PROPERTIES.filter(p => p.status === 'available')

/** Propiedades disponibles de la agencia (DB con fallback a dummy). */
export async function getPublicProperties(slug: string): Promise<Property[]> {
  try {
    const agencyId = await getAgencyIdBySlug(slug)
    if (!agencyId) return dummyAvailable() // agencia solo en dummy
    const all = await listPropertiesForAgency(slug)
    return all.filter(p => p.status === 'available')
  } catch {
    return dummyAvailable()
  }
}
