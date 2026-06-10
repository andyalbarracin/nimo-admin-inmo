import { notFound } from 'next/navigation'
import { PROPERTIES, AGENCIES } from '@/lib/dummy'
import EditorialDetail from '@/components/site/themes/editorial-detail'
import SpatialDetail from '@/components/site/themes/spatial-detail'
import AtelierDetail from '@/components/site/themes/atelier-detail'

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  const prop = PROPERTIES.find(p => p.id === id)
  if (!prop || !agency) notFound()

  const related = PROPERTIES
    .filter(p => p.id !== id && (p.neighborhood === prop.neighborhood || p.type === prop.type) && p.status !== 'sold')
    .slice(0, 3)

  if (agency.theme === 'spatial') {
    return <SpatialDetail slug={slug} agency={agency} prop={prop} related={related} />
  }
  if (agency.theme === 'atelier') {
    return <AtelierDetail slug={slug} agency={agency} prop={prop} related={related} />
  }
  return <EditorialDetail slug={slug} agency={agency} prop={prop} related={related} />
}
