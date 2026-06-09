import { AGENCIES, TEAM } from '@/lib/dummy'
import ContactPageContent from '@/components/site/contact-page-content'

export default async function ContactoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  const agents = TEAM.filter(m => m.role === 'agent' || m.role === 'owner')

  return (
    <ContactPageContent
      slug={slug}
      agency={agency ?? null}
      agents={agents}
    />
  )
}
