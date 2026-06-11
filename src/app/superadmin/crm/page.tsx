import { listSalesLeads } from '@/lib/sales-crm/server'
import SalesCrmClient from '@/components/superadmin/sales-crm-client'

export const dynamic = 'force-dynamic'

export default async function SuperadminCRM() {
  const { leads, persisted } = await listSalesLeads()
  return <SalesCrmClient initialLeads={leads} persisted={persisted} />
}
