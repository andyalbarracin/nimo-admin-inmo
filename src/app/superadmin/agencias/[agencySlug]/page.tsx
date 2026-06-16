/*
 * Archivo : page.tsx
 * Ruta    : src/app/superadmin/agencias/[agencySlug]/page.tsx
 * Modif.  : 2026-06-15
 * Descripción: Ficha de agencia del superadmin. UNIFICADA: todas las agencias
 *              (reales y demo) usan la misma vista en tabs (AgencyDetailLive).
 *              - Agencia real (o lopez seedeada) → datos reales de la DB.
 *              - Agencia demo (solo dummy) → se mapea y se marca isDemo (las
 *                tabs que dependen de la DB muestran un aviso).
 */
import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import AgencyDetailLive from '@/components/superadmin/agency-detail-live'
import { getLiveAgency } from '@/lib/agencies/provision'
import { listDocuments } from '@/lib/agencies/documents'
import { listCredentials } from '@/lib/agencies/credentials'

export const dynamic = 'force-dynamic'

const cap = (s: string) => s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())

export default async function AgencyDetail({ params }: { params: Promise<{ agencySlug: string }> }) {
  const { agencySlug } = await params

  // 1) Agencia REAL (provisionada o lopez seedeada): ficha completa con datos reales.
  const live = await getLiveAgency(agencySlug)
  if (live) {
    const [documents, credentials] = await Promise.all([listDocuments(live.id), listCredentials(live.id)])
    return <AgencyDetailLive agency={live} documents={documents} credentials={credentials} />
  }

  // 2) Agencia DEMO (solo dummy): misma vista en tabs, marcada como demo.
  const demo = AGENCIES.find(a => a.slug === agencySlug)
  if (!demo) notFound()
  const mapped = {
    id: demo.id,
    name: demo.name,
    slug: demo.slug,
    plan: { code: demo.plan, name: cap(demo.plan) },
    plan_status: demo.plan_status,
    email_contact: demo.owner_email,
    created_at: demo.created_at,
    phone: demo.phone ?? '',
    address: demo.address ?? '',
    onboarding_enabled: false,
    onboarding_completed: false,
  }
  return <AgencyDetailLive agency={mapped} documents={[]} credentials={[]} isDemo />
}
