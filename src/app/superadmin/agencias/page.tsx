import { AGENCIES } from '@/lib/dummy'
import AgenciasClient from '@/components/superadmin/agencias-client'
import { listLiveAgencies } from '@/lib/agencies/provision'

export const dynamic = 'force-dynamic'

export default async function AgenciasAdmin() {
  const live = await listLiveAgencies()
  return <AgenciasClient initialAgencies={AGENCIES} live={live} />
}
