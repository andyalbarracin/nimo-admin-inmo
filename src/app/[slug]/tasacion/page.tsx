import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import TasacionContent from '@/components/site/tasacion-content'
import { getPublicAgency } from '@/lib/agencies/public'
import SiteFooter from '@/components/site/primitives/SiteFooter'
import { THEMES, type ThemeId } from '@/lib/themes'

export const dynamic = 'force-dynamic'

export default async function TasacionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDemo = AGENCIES.some(a => a.slug === slug)
  const agency = isDemo ? AGENCIES.find(a => a.slug === slug) : await getPublicAgency(slug)
  if (!agency) notFound()
  const T = THEMES[(agency.theme ?? 'editorial') as ThemeId]
  return (
    <>
      <TasacionContent slug={slug} agency={agency} />
      <SiteFooter slug={slug} agency={agency} bg={T.bg} rule={T.rule} ink={T.ink} ink2={T.ink2} ink3={T.ink3} accent={T.accent} fontDisplay={T.fontDisplay} />
    </>
  )
}
