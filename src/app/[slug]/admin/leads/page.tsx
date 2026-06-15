import { TEAM, AGENCIES } from '@/lib/dummy'
import { listLeadsForAgency } from '@/lib/leads/server'
import { listAgencyMembers } from '@/lib/agencies/members'
import CrmClient from '@/components/crm/crm-client'
import { guardAgencyAccess } from '@/lib/auth/require-tenant'

export const dynamic = 'force-dynamic'

export default async function LeadsAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await guardAgencyAccess(slug)
  const isDemo = AGENCIES.some(a => a.slug === slug)
  const [leads, team] = await Promise.all([
    listLeadsForAgency(slug),
    isDemo ? Promise.resolve(TEAM) : listAgencyMembers(slug),
  ])
  return <CrmClient slug={slug} initialLeads={leads} team={team} />
}
