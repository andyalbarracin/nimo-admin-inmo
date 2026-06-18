import { TEAM, AGENCIES } from '@/lib/dummy'
import EquipoAdmin from '@/components/admin/equipo-admin'
import { listAgencyMembers } from '@/lib/agencies/members'
import { getLiveAgency } from '@/lib/agencies/provision'
import { guardAgencyAccess, assertAgencyRole } from '@/lib/auth/require-tenant'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

const PLAN_USERS: Record<string, number> = { esencial: 2, profesional: 6, a_medida: 99 }

export default async function EquipoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await guardAgencyAccess(slug)
  if (!(await assertAgencyRole(slug, 'admin'))) redirect(`/${slug}/admin`)

  // Coexistencia: agencia DEMO → equipo de muestra; agencia REAL → sus miembros.
  const isDemo = AGENCIES.some(a => a.slug === slug)
  if (!isDemo) {
    const [members, live] = await Promise.all([listAgencyMembers(slug), getLiveAgency(slug)])
    const planLimit = PLAN_USERS[live?.plan?.code ?? 'profesional'] ?? 6
    return <EquipoAdmin initialTeam={members} planLimit={planLimit} slug={slug} isReal />
  }

  const agency = AGENCIES.find(a => a.slug === slug)
  return <EquipoAdmin initialTeam={TEAM} planLimit={PLAN_USERS[agency?.plan ?? 'profesional'] ?? 6} slug={slug} isReal={false} />
}
