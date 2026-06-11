import { TEAM } from '@/lib/dummy'
import { listLeadsForAgency } from '@/lib/leads/server'
import CrmClient from '@/components/crm/crm-client'

export const dynamic = 'force-dynamic'

export default async function LeadsAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const leads = await listLeadsForAgency(slug)
  return <CrmClient slug={slug} initialLeads={leads} team={TEAM} />
}
