import { listPlans } from '@/lib/plans/server'
import PlanesClient from '@/components/superadmin/planes-client'

export const dynamic = 'force-dynamic'

export default async function PlanesAdmin() {
  const plans = await listPlans()
  return <PlanesClient initialPlans={plans} />
}
