import { PROPERTIES, AGENCIES } from '@/lib/dummy'
import PropiedadesClient from '@/components/site/PropiedadesClient'
import SpatialListado from '@/components/site/themes/spatial-listado'

export default async function PropiedadesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ op?: string; tipo?: string; barrio?: string }>
}) {
  const { slug } = await params
  const { op, tipo, barrio } = await searchParams

  const agency = AGENCIES.find(a => a.slug === slug)
  if (!agency) return <div>Agencia no encontrada</div>

  let props = PROPERTIES
  if (op) props = props.filter(p => p.operation === op)
  if (tipo) props = props.filter(p => p.type === tipo)
  if (barrio) props = props.filter(p => p.neighborhood.toLowerCase().includes(barrio.toLowerCase()))

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
