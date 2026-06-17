import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import { getPublicProperties } from '@/lib/properties/public'
import { getPublicAgency } from '@/lib/agencies/public'
import EditorialDetail from '@/components/site/themes/editorial-detail'
import SpatialDetail from '@/components/site/themes/spatial-detail'
import AtelierDetail from '@/components/site/themes/atelier-detail'
import SiteFooter from '@/components/site/primitives/SiteFooter'
import { THEMES } from '@/lib/themes'

export const dynamic = 'force-dynamic'

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const isDemo = AGENCIES.some(a => a.slug === slug)
  const agency = isDemo ? AGENCIES.find(a => a.slug === slug) : await getPublicAgency(slug)
  const all = await getPublicProperties(slug)
  const prop = all.find(p => p.id === id)
  if (!prop || !agency) notFound()

  const related = all
    .filter(p => p.id !== id && (p.neighborhood === prop.neighborhood || p.type === prop.type))
    .slice(0, 3)

  if (agency.theme === 'spatial') {
    // SpatialDetail no trae footer propio (editorial/atelier sí) → lo agregamos acá.
    const T = THEMES.spatial
    return <>
      <SpatialDetail slug={slug} agency={agency} prop={prop} related={related} />
      <SiteFooter slug={slug} agency={agency} bg={T.bg} rule={T.rule} ink={T.ink} ink2={T.ink2} ink3={T.ink3} accent={T.accent} fontDisplay={T.fontDisplay} />
    </>
  }
  if (agency.theme === 'atelier') {
    return <AtelierDetail slug={slug} agency={agency} prop={prop} related={related} />
  }
  return <EditorialDetail slug={slug} agency={agency} prop={prop} related={related} />
}
