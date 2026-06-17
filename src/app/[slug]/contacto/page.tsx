import { AGENCIES, TEAM } from '@/lib/dummy'
import ContactPageContent from '@/components/site/contact-page-content'
import { getPublicAgency } from '@/lib/agencies/public'
import { listAgencyMembers } from '@/lib/agencies/members'
import SiteFooter from '@/components/site/primitives/SiteFooter'
import { THEMES, type ThemeId } from '@/lib/themes'

export const dynamic = 'force-dynamic'

export default async function ContactoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDemo = AGENCIES.some(a => a.slug === slug)
  const agency = isDemo ? (AGENCIES.find(a => a.slug === slug) ?? null) : await getPublicAgency(slug)
  const agents = isDemo ? TEAM.filter(m => m.role === 'agent' || m.role === 'owner') : await listAgencyMembers(slug)
  const T = THEMES[(agency?.theme ?? 'editorial') as ThemeId]

  return (
    <>
      <ContactPageContent slug={slug} agency={agency ?? null} agents={agents} />
      {agency && <SiteFooter slug={slug} agency={agency} bg={T.bg} rule={T.rule} ink={T.ink} ink2={T.ink2} ink3={T.ink3} accent={T.accent} fontDisplay={T.fontDisplay} />}
    </>
  )
}
