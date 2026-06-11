import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import { getPublicProperties } from '@/lib/properties/public'
import EditorialDetail from '@/components/site/themes/editorial-detail'
import SpatialDetail from '@/components/site/themes/spatial-detail'
import AtelierDetail from '@/components/site/themes/atelier-detail'

export const dynamic = 'force-dynamic'

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  const all = await getPublicProperties(slug)
  const prop = all.find(p => p.id === id)
  if (!prop || !agency) notFound()

  const related = all
    .filter(p => p.id !== id && (p.neighborhood === prop.neighborhood || p.type === prop.type))
    .slice(0, 3)

  if (agency.theme === 'spatial') {
    return <SpatialDetail slug={slug} agency={agency} prop={prop} related={related} />
  }
  if (agency.theme === 'atelier') {
    return <AtelierDetail slug={slug} agency={agency} prop={prop} related={related} />
  }
  return <EditorialDetail slug={slug} agency={agency} prop={prop} related={related} />
}
