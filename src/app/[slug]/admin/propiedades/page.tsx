import { TEAM } from '@/lib/dummy'
import { listPropertiesForAgency } from '@/lib/properties/server'
import PropiedadesAdmin from '@/components/admin/propiedades-admin'

export const dynamic = 'force-dynamic'

export default async function PropiedadesAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ new?: string }>
}) {
  const { slug } = await params
  const { new: isNew } = await searchParams
  const properties = await listPropertiesForAgency(slug)
  return <PropiedadesAdmin slug={slug} initialProperties={properties} team={TEAM} openNew={!!isNew} />
}
