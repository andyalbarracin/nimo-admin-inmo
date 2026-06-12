import { TEAM, AGENCIES } from '@/lib/dummy'
import EquipoAdmin from '@/components/admin/equipo-admin'

const PLAN_USERS: Record<string, number> = { esencial: 2, profesional: 6, a_medida: 99 }

export default async function EquipoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  return <EquipoAdmin initialTeam={TEAM} planLimit={PLAN_USERS[agency?.plan ?? 'profesional'] ?? 6} />
}
