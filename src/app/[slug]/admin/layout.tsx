/*
 * Archivo : layout.tsx
 * Ruta    : src/app/[slug]/admin/layout.tsx
 * Modif.  : 2026-06-15
 * Descripción: Layout server del panel de agencia. Resuelve el NOMBRE real y el
 *              acento (agencia demo o real) y los pasa al shell client (sidebar +
 *              tab bar). Antes el sidebar mostraba el slug para agencias reales.
 */
import { AGENCIES } from '@/lib/dummy'
import { THEMES, type ThemeId } from '@/lib/themes'
import { getLiveAgency } from '@/lib/agencies/provision'
import { getAdminUser } from '@/lib/auth/current-user'
import AdminShell from '@/components/admin/admin-shell'

export const dynamic = 'force-dynamic'

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  let agencyName = slug
  let accent = '#FF6B6B'

  const demo = AGENCIES.find(a => a.slug === slug)
  if (demo) {
    agencyName = demo.name
    accent = THEMES[demo.theme]?.accent ?? accent
  } else {
    const live = await getLiveAgency(slug)
    if (live) {
      agencyName = live.name
      const st = ((Array.isArray(live.theme) ? live.theme[0] : live.theme)?.site_theme ?? 'editorial') as ThemeId
      accent = THEMES[st]?.accent ?? accent
    }
  }

  const user = await getAdminUser(slug)

  return <AdminShell agencyName={agencyName} accent={accent} user={user}>{children}</AdminShell>
}
