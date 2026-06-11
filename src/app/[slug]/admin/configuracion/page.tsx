import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import ConfiguracionAdmin from '@/components/admin/configuracion-admin'

export default async function ConfiguracionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  if (!agency) notFound()
  return <ConfiguracionAdmin agency={agency} />
}
