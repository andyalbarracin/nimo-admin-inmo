import { AGENCIES } from '@/lib/dummy'
import { AR_CITIES } from '@/lib/constants/ar-cities'
import { getPublicProperties } from '@/lib/properties/public'
import { getPublicAgency } from '@/lib/agencies/public'
import PropiedadesClient from '@/components/site/PropiedadesClient'
import SpatialListado from '@/components/site/themes/spatial-listado'

export const dynamic = 'force-dynamic'

export default async function PropiedadesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ op?: string; tipo?: string; barrio?: string; prov?: string; cp?: string }>
}) {
  const { slug } = await params
  const { op, tipo, barrio, prov, cp } = await searchParams

  const isDemo = AGENCIES.some(a => a.slug === slug)
  const agency = isDemo ? AGENCIES.find(a => a.slug === slug)! : await getPublicAgency(slug)
  if (!agency) return <div>Agencia no encontrada</div>

  let props = await getPublicProperties(slug)
  if (op) props = props.filter(p => p.operation === op)
  if (tipo) props = props.filter(p => p.type === tipo)
  if (barrio) props = props.filter(p => p.neighborhood.toLowerCase().includes(barrio.toLowerCase()))
  // CP → ciudad → filtra por esa ciudad/barrio (dataset AR_CITIES)
  if (cp) {
    const city = AR_CITIES.find(c => c.cp === cp)?.city
    if (city) props = props.filter(p => `${p.neighborhood} ${p.city}`.toLowerCase().includes(city.toLowerCase()))
  }
  // Provincia → ciudades de esa provincia → filtra
  if (prov) {
    const cities = AR_CITIES.filter(c => c.province === prov).map(c => c.city.toLowerCase())
    props = props.filter(p => {
      const hay = `${p.neighborhood} ${p.city}`.toLowerCase()
      return hay.includes(prov.toLowerCase()) || cities.some(c => hay.includes(c))
    })
  }

  if (agency.theme === 'spatial') {
    return <SpatialListado slug={slug} agency={agency} properties={props} op={op ?? ''} tipo={tipo ?? ''} />
  }

  return (
    <PropiedadesClient
      slug={slug}
      agency={agency}
      properties={props}
      op={op ?? ''}
      tipo={tipo ?? ''}
    />
  )
}
