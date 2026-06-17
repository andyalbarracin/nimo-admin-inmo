import { notFound } from 'next/navigation'
import Link from 'next/link'
import { AGENCIES, TEAM, AGENCY_STATS } from '@/lib/dummy'
import { THEMES, type ThemeId } from '@/lib/themes'
import ThemedNav from '@/components/site/themed-nav'
import SiteFooter from '@/components/site/primitives/SiteFooter'
import { getPublicAgency } from '@/lib/agencies/public'
import { listAgencyMembers } from '@/lib/agencies/members'

export const dynamic = 'force-dynamic'

const TITLE: Record<ThemeId, string> = { editorial: 'Quiénes somos', spatial: 'QUIÉNES SOMOS', atelier: 'Nuestro estudio' }

export default async function NosotrosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const isDemo = AGENCIES.some(a => a.slug === slug)
  let agency = AGENCIES.find(a => a.slug === slug)
  if (!isDemo) {
    const real = await getPublicAgency(slug)
    if (!real) notFound()
    agency = real
  }
  if (!agency) notFound()
  const themeId = agency.theme as ThemeId
  const T = THEMES[themeId]
  const r = T.radius
  const team = isDemo ? TEAM : await listAgencyMembers(slug)
  const upper = themeId === 'spatial'
  const centered = themeId === 'atelier'

  const stats = [
    { v: '15+', l: 'Años en el mercado' },
    { v: AGENCY_STATS.total_properties, l: 'Propiedades gestionadas' },
    { v: `${Math.round(AGENCY_STATS.conversion_rate * 10) / 10}%`, l: 'Tasa de cierre' },
  ]

  return (
    <div style={{ fontFamily: T.fontBody, background: T.bg, color: T.ink, minHeight: '100vh' }}>
      <ThemedNav slug={slug} agencyName={agency.name} themeId={themeId} T={T} active="nosotros" />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: centered ? '72px 48px 60px' : '64px 48px 56px', textAlign: centered ? 'center' : 'left' }}>
        <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent, letterSpacing: '.14em', textTransform: 'uppercase' }}>Nosotros</span>
        <h1 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(44px, 6vw, 88px)', fontWeight: upper ? 800 : centered ? 300 : 400, letterSpacing: '-.02em', lineHeight: .98, textTransform: upper ? 'uppercase' : 'none', margin: '16px 0 24px' }}>
          {TITLE[themeId]}{themeId === 'editorial' && <em style={{ fontStyle: 'italic', color: T.accent }}>.</em>}
        </h1>
        <p style={{ fontFamily: centered ? T.fontDisplay : T.fontBody, fontStyle: centered ? 'italic' : 'normal', fontSize: centered ? 24 : 19, lineHeight: 1.6, color: T.ink2, maxWidth: 680, margin: centered ? '0 auto' : 0 }}>
          {agency.tagline ?? 'Acompañamos a las familias en una de las decisiones más importantes de su vida.'} Conocemos cada cuadra, cada edificio y cada oportunidad de los barrios donde operamos.
        </p>
      </div>

      {/* Stats */}
      <section style={{ borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, background: T.bg2 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {stats.map((s, i) => (
            <div key={i} style={{ textAlign: centered ? 'center' : 'left', borderLeft: !centered && i > 0 ? `1px solid ${T.rule}` : 'none', paddingLeft: !centered && i > 0 ? 32 : 0 }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(40px, 5vw, 64px)', fontWeight: upper ? 800 : 400, color: T.ink, lineHeight: .9, letterSpacing: '-.03em' }}>{s.v}</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 11, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 12 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 48px' }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: upper ? 800 : centered ? 300 : 400, textTransform: upper ? 'uppercase' : 'none', textAlign: centered ? 'center' : 'left', margin: '0 0 40px' }}>
          {upper ? 'EL EQUIPO' : 'El equipo'}{themeId === 'atelier' && <em style={{ fontStyle: 'italic' }}>.</em>}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {team.map(m => (
            <div key={m.id} style={{ textAlign: 'center' }}>
              <div style={{ aspectRatio: '3 / 4', background: T.accent + '18', display: 'grid', placeItems: 'center', borderRadius: r, marginBottom: 16 }}>
                <span style={{ fontFamily: T.fontDisplay, fontSize: 36, color: T.accent }}>{m.avatar}</span>
              </div>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 20, fontWeight: upper ? 700 : 400 }}>{m.name}</div>
              <div style={{ fontFamily: T.fontMono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: T.ink3, marginTop: 6 }}>
                {m.role === 'owner' ? 'Dirección' : m.role === 'admin' ? 'Coordinación' : 'Asesor'}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: T.accent, color: T.accentContrast, padding: '72px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: upper ? 800 : centered ? 300 : 400, fontStyle: centered ? 'italic' : 'normal', textTransform: upper ? 'uppercase' : 'none', margin: '0 0 24px', lineHeight: 1 }}>
          ¿Trabajamos juntos?
        </h2>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/${slug}/contacto`} style={{ fontFamily: T.fontMono, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: T.accent, background: T.accentContrast, padding: '14px 28px', borderRadius: r, textDecoration: 'none', fontWeight: 700 }}>Contactanos →</Link>
          <Link href={`/${slug}/tasacion`} style={{ fontFamily: T.fontMono, fontSize: 13, letterSpacing: '.08em', textTransform: 'uppercase', color: T.accentContrast, border: `1.5px solid ${T.accentContrast}`, padding: '13px 26px', borderRadius: r, textDecoration: 'none' }}>Tasar mi propiedad</Link>
        </div>
      </section>
      <SiteFooter slug={slug} agency={agency} bg={T.bg} rule={T.rule} ink={T.ink} ink2={T.ink2} ink3={T.ink3} accent={T.accent} fontDisplay={T.fontDisplay} />
    </div>
  )
}
