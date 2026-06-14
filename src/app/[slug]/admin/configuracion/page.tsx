import { notFound } from 'next/navigation'
import { AGENCIES, type Agency } from '@/lib/dummy'
import { createAdminClient } from '@/lib/supabase/admin'
import ConfiguracionAdmin from '@/components/admin/configuracion-admin'
import { getLiveAgency } from '@/lib/agencies/provision'
import type { PlanId } from '@/lib/plans/server'

export const dynamic = 'force-dynamic'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function liveToAgency(live: any): Agency {
  const plan = (['esencial', 'profesional', 'a_medida'].includes(live.plan?.code) ? live.plan.code : 'esencial') as PlanId
  return {
    id: live.id, name: live.name, slug: live.slug, plan,
    plan_status: live.plan_status === 'suspended' || live.plan_status === 'canceled' ? 'suspended' : 'active',
    properties_count: 0, leads_count: 0, members_count: 1, mrr: 0,
    owner_email: live.email_contact ?? '', created_at: (live.created_at ?? '').slice(0, 10),
    theme: 'editorial', phone: live.phone ?? '', address: live.address ?? '',
  }
}

export default async function ConfiguracionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Coexistencia: agencia DEMO → datos de muestra; agencia REAL → su registro de DB.
  const isDemo = AGENCIES.some(a => a.slug === slug)
  let agency = AGENCIES.find(a => a.slug === slug)
  if (!isDemo) {
    const live = await getLiveAgency(slug)
    if (!live) notFound()
    agency = liveToAgency(live)
  }
  if (!agency) notFound()

  // Logo persistido en la DB (si la agencia existe ahí)
  let initialLogo = ''
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
    const { data } = await sb.from('agencies').select('logo_url').eq('slug', slug).maybeSingle()
    initialLogo = data?.logo_url ?? ''
  } catch {
    // sin DB → sin logo persistido
  }

  return <ConfiguracionAdmin agency={agency} initialLogo={initialLogo} />
}
