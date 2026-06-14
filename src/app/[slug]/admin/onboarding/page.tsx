/*
 * Archivo : page.tsx
 * Ruta    : src/app/[slug]/admin/onboarding/page.tsx
 * Modif.  : 2026-06-14
 * Descripción: Página del wizard de onboarding de la agencia. Solo accesible si el
 *              onboarding está activado y no completado; si no, redirige al panel.
 */
import { redirect } from 'next/navigation'
import { getOnboardingStatus, getOnboarding } from '@/lib/agencies/onboarding'
import OnboardingWizard from '@/components/agency/onboarding-wizard'

export const dynamic = 'force-dynamic'

export default async function OnboardingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const status = await getOnboardingStatus(slug)
  if (!status || !status.enabled || status.completed) redirect(`/${slug}/admin`)
  const data = await getOnboarding(status.id)
  return <OnboardingWizard slug={slug} agencyId={status.id} initial={data} />
}
