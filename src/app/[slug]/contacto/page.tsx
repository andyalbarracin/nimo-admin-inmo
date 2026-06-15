import { AGENCIES, TEAM } from '@/lib/dummy'
import ContactPageContent from '@/components/site/contact-page-content'
import { getPublicAgency } from '@/lib/agencies/public'
import { listAgencyMembers } from '@/lib/agencies/members'

export const dynamic = 'force-dynamic'

export default async function ContactoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDemo = AGENCIES.some(a => a.slug === slug)
  const agency = isDemo ? (AGENCIES.find(a => a.slug === slug) ?? null) : await getPublicAgency(slug)
  const agents = isDemo ? TEAM.filter(m => m.role === 'agent' || m.role === 'owner') : await listAgencyMembers(slug)

  return (
    <ContactPageContent
      slug={slug}
      agency={agency ?? null}
      agents={agents}
    />
  )
}
