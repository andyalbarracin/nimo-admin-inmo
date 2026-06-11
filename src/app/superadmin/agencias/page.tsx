import { AGENCIES } from '@/lib/dummy'
import AgenciasClient from '@/components/superadmin/agencias-client'

export default function AgenciasAdmin() {
  return <AgenciasClient initialAgencies={AGENCIES} />
}
