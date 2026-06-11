import { TEAM, AGENCIES } from '@/lib/dummy'
import EquipoAdmin from '@/components/admin/equipo-admin'

const PLAN_USERS: Record<string, number> = { starter: 1, pro: 3, business: 10, enterprise: 50 }

export default async function EquipoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  return <EquipoAdmin initialTeam={TEAM} planLimit={PLAN_USERS[agency?.plan ?? 'pro'] ?? 10} />
}
