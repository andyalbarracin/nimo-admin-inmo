import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import TasacionContent from '@/components/site/tasacion-content'

export default async function TasacionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  if (!agency) notFound()
  return <TasacionContent slug={slug} agency={agency} />
}
