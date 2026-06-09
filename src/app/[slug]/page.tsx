import { notFound } from 'next/navigation'
import { PROPERTIES, AGENCIES, AGENCY_STATS } from '@/lib/dummy'
import EditorialHome from '@/components/site/themes/editorial-home'
import SpatialHome from '@/components/site/themes/spatial-home'
import LoftHome from '@/components/site/themes/loft-home'

export default async function AgencyHome({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const agency = AGENCIES.find(a => a.slug === slug)
  if (!agency) notFound()

  const featured = PROPERTIES.filter(p => p.is_featured && p.status === 'available').slice(0, 6)
  const stats = AGENCY_STATS

  const props = { slug, agency, featured, stats }

  if (agency.theme === 'spatial') return <SpatialHome {...props} />
  if (agency.theme === 'loft') return <LoftHome {...props} />
  return <EditorialHome {...props} />
}
