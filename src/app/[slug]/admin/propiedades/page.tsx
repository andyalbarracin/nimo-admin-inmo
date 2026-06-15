import { TEAM, AGENCIES } from '@/lib/dummy'
import { listPropertiesForAgency } from '@/lib/properties/server'
import { listAgencyMembers } from '@/lib/agencies/members'
import PropiedadesAdmin from '@/components/admin/propiedades-admin'
import { guardAgencyAccess } from '@/lib/auth/require-tenant'

export const dynamic = 'force-dynamic'

export default async function PropiedadesAdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ new?: string }>
}) {
  const { slug } = await params
  await guardAgencyAccess(slug)
  const { new: isNew } = await searchParams
  const isDemo = AGENCIES.some(a => a.slug === slug)
  const [properties, team] = await Promise.all([
    listPropertiesForAgency(slug),
    isDemo ? Promise.resolve(TEAM) : listAgencyMembers(slug),
  ])
  return <PropiedadesAdmin slug={slug} initialProperties={properties} team={team} openNew={!!isNew} />
}
