/*
 * Búsqueda de localidades — híbrido:
 *  1) dataset local embebido (instantáneo, con CP)
 *  2) fallback a georef.ar (API oficial del Estado, cobertura total, sin CP)
 */
import { searchLocal, type ArCity } from '@/lib/constants/ar-cities'

export type Locality = ArCity & { source: 'local' | 'georef' }

/** Consulta a georef.ar (datos.gob.ar). Devuelve localidades sin CP. */
export async function searchGeoref(query: string, max = 6): Promise<Locality[]> {
  const q = query.trim()
  if (q.length < 3) return []
  try {
    const url = `https://apis.datos.gob.ar/georef/api/localidades?nombre=${encodeURIComponent(q)}&campos=nombre,provincia&max=${max}&aplanar=true`
    const res = await fetch(url)
    if (!res.ok) return []
    const json = await res.json()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (json.localidades ?? []).map((l: any): Locality => ({
      city: l.nombre,
      province: l.provincia_nombre ?? '',
      cp: '',
      source: 'georef',
    }))
  } catch {
    return []
  }
}

/** Local primero; si hay pocos resultados, completa con georef (sin duplicar). */
export async function searchLocalities(query: string, max = 6): Promise<Locality[]> {
  const local: Locality[] = searchLocal(query, max).map(c => ({ ...c, source: 'local' as const }))
  if (local.length >= max || query.trim().length < 3) return local
  const remote = await searchGeoref(query, max)
  const seen = new Set(local.map(l => `${l.city}|${l.province}`.toLowerCase()))
  const merged = [...local]
  for (const r of remote) {
    const key = `${r.city}|${r.province}`.toLowerCase()
    if (!seen.has(key)) { merged.push(r); seen.add(key) }
    if (merged.length >= max) break
  }
  return merged
}
