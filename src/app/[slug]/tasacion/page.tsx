import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import TasacionContent from '@/components/site/tasacion-content'
import { getPublicAgency } from '@/lib/agencies/public'

export const dynamic = 'force-dynamic'

export default async function TasacionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDemo = AGENCIES.some(a => a.slug === slug)
  const agency = isDemo ? AGENCIES.find(a => a.slug === slug) : await getPublicAgency(slug)
  if (!agency) notFound()
  return <TasacionContent slug={slug} agency={agency} />
}
