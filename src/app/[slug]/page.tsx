import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PROPERTIES, AGENCIES, AGENCY_STATS, TEAM } from '@/lib/dummy'
import type { ThemeId } from '@/lib/themes'
import EditorialHome from '@/components/site/themes/editorial-home'
import SpatialHome from '@/components/site/themes/spatial-home'
import AtelierHome from '@/components/site/themes/atelier-home'

const VALID_THEMES: ThemeId[] = ['editorial', 'spatial', 'atelier']
const THEME_LABEL: Record<ThemeId, string> = { editorial: 'Editorial', spatial: 'Spatial', atelier: 'Atelier' }

export default async function AgencyHome({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { slug } = await params
  const { preview } = await searchParams

  const agency = AGENCIES.find(a => a.slug === slug)
  if (!agency) notFound()

  // Modo vista previa: render de otro theme sin alterar datos (solo presentación).
  const previewTheme = preview && VALID_THEMES.includes(preview as ThemeId) ? (preview as ThemeId) : null
  const activeTheme: ThemeId = previewTheme ?? agency.theme

  const available = PROPERTIES.filter(p => p.status === 'available')
  const featured = available.filter(p => p.is_featured).slice(0, 6)
  const opportunity = available.find(p => p.is_opportunity) ?? null
  const stats = AGENCY_STATS
  const team = TEAM

  // `properties` = catálogo disponible completo, para que cada theme llene sus grillas
  // y nunca queden filas a medias (objetivo comercial: siempre proponer propiedades).
  const props = { slug, agency, featured, properties: available, opportunity, stats, team }

  return (
    <>
      {activeTheme === 'spatial' ? <SpatialHome {...props} />
        : activeTheme === 'atelier' ? <AtelierHome {...props} />
        : <EditorialHome {...props} />}

      {previewTheme && (
        <div style={{ position: 'fixed', bottom: 18, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 16, background: '#111111', color: '#F5F5F0', padding: '12px 18px', borderRadius: 12, boxShadow: '0 12px 40px rgba(0,0,0,.3)', fontFamily: 'var(--font-sans), system-ui, sans-serif', fontSize: 13 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: 99, background: '#FF6A00' }} />
            Vista previa · tema <b style={{ color: '#FF6A00' }}>{THEME_LABEL[previewTheme]}</b>
            {previewTheme !== agency.theme && <span style={{ opacity: .6 }}>(no aplicado)</span>}
          </span>
          <Link href={`/${slug}`} style={{ color: '#F5F5F0', background: 'rgba(255,255,255,.12)', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Salir de la vista previa
          </Link>
        </div>
      )}
    </>
  )
}
