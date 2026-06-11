import Image from 'next/image'
import Link from 'next/link'
import type { Property, Agency, TeamMember } from '@/lib/dummy'
import SiteFooter from '@/components/site/primitives/SiteFooter'
import SpatialSearch from '@/components/site/themes/spatial-search'
import SiteMap from '@/components/site/primitives/SiteMap'
import Reveal from '@/components/site/primitives/Reveal'
import CountUp from '@/components/site/primitives/CountUp'

/* ============================================================
 * T2 · SPATIAL — swiss design map-forward, Inter Tight,
 * azul electric. Réplica funcional del mockup C3.
 * ============================================================ */

const T = {
  white: '#FFFFFF',
  pale: '#F2F2F0',
  pale2: '#E8E8E5',
  graphite: '#0A0A0A',
  graphiteSoft: '#3D3D3D',
  mute: '#7A7A78',
  rule: '#D8D8D6',
  electric: '#1F4DD6',
  electricDark: '#163BA8',
  electricSoft: '#E7ECFB',
  display: "var(--font-inter-tight), 'Inter', system-ui, sans-serif",
  mono: "var(--font-mono), ui-monospace, monospace",
}

const NAV = [
  { label: 'MAPA', href: '#mapa' },
  { label: 'PROPIEDADES', href: 'propiedades' },
  { label: 'DESTACADAS', href: '#destacadas' },
  { label: 'BARRIOS', href: '#barrios' },
]

interface Props {
  slug: string
  agency: Agency
  featured: Property[]
  properties?: Property[]
  opportunity?: Property | null
  team?: TeamMember[]
  stats: { total_properties: number; conversion_rate: number; visits_this_month: number }
}

export default function SpatialHome({ slug, agency, featured, properties = [], opportunity, stats }: Props) {
  const catalog = properties.length ? properties : featured
  const markers = catalog.map(p => ({
    lat: p.lat,
    lng: p.lng,
    title: p.title,
    price: `${p.currency} ${p.price.toLocaleString('es-AR')}`,
    id: p.id,
  }))

  // Últimos ingresos = más recientes del catálogo; destacadas = marcadas por la inmobiliaria.
  const ingresos = [...catalog].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 3)
  const destacadas = (featured.length ? featured : catalog).filter(p => p.id !== opportunity?.id).slice(0, 6)
  const oportunidad = opportunity ?? null
  const barrios = Array.from(new Set(catalog.map(p => p.neighborhood))).slice(0, 4)

  // datos de mercado ficticios por barrio (USD/m²)
  const ticker = [
    { n: 'Palermo', v: '2.480', d: 2.1 },
    { n: 'Belgrano', v: '2.310', d: 1.4 },
    { n: 'Núñez', v: '2.420', d: 2.8 },
    { n: 'Recoleta', v: '2.690', d: -0.6 },
    { n: 'Caballito', v: '1.980', d: 1.1 },
    { n: 'Colegiales', v: '2.250', d: 0.9 },
    { n: 'Villa Crespo', v: '1.870', d: 1.7 },
  ]

  return (
    <div className="site-theme" style={{ fontFamily: T.display, background: T.white, color: T.graphite, minHeight: '100vh' }}>
      {/* ═══ NAV bracket ═══ */}
      <header className="rwd-pad" style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(10px)', borderBottom: `1.5px solid ${T.graphite}`, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 40, alignItems: 'center', height: 64, padding: '0 40px' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.03em', textTransform: 'uppercase', color: T.graphite }}>{agency.name.split(' ')[0]}</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric, letterSpacing: '.04em' }}>/ {agency.name.split(' ').slice(1).join(' ') || 'PROPIEDADES'}</span>
        </Link>
        <nav className="rwd-hide-mobile" style={{ display: 'flex', gap: 2, justifySelf: 'center' }}>
          {NAV.map(n => (
            <Link key={n.label} href={n.href.startsWith('#') ? n.href : `/${slug}/${n.href}`} style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', fontWeight: 600, color: T.graphite, textDecoration: 'none', padding: '8px 14px', borderRadius: 4 }}>
              [ {n.label} ]
            </Link>
          ))}
        </nav>
        <Link href={`/${slug}/tasacion`} style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: T.white, background: T.electric, padding: '11px 18px', borderRadius: 6, textDecoration: 'none' }}>
          TASAR MI PROPIEDAD →
        </Link>
      </header>

      {/* ═══ HERO split text + map ═══ */}
      <section id="mapa" className="rwd-stack" style={{ display: 'grid', gridTemplateColumns: '480px 1fr', borderBottom: `1.5px solid ${T.graphite}`, minHeight: 560 }}>
        <div style={{ padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: `1.5px solid ${T.graphite}` }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>
            // {stats.total_properties} propiedades en el mapa
          </span>
          <h1 style={{ fontSize: 'clamp(44px, 4.6vw, 64px)', fontWeight: 800, lineHeight: 0.96, letterSpacing: '-.04em', textTransform: 'uppercase', margin: '18px 0 24px' }}>
            Buscá por<br />ubicación,<br />no por lista.
          </h1>
          <p style={{ fontSize: 16, color: T.graphiteSoft, lineHeight: 1.55, marginBottom: 36, maxWidth: 360 }}>
            {agency.tagline ?? 'Cada propiedad georreferenciada. Filtrá sobre el mapa y compará barrios con datos reales de mercado.'}
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, border: `1.5px solid ${T.graphite}` }}>
            {[
              { k: 'EN VENTA', v: featured.filter(p => p.operation === 'venta').length },
              { k: 'EN ALQUILER', v: featured.filter(p => p.operation === 'alquiler').length },
              { k: 'BARRIOS', v: barrios.length },
              { k: 'VISITAS/MES', v: stats.visits_this_month },
            ].map((s, i) => (
              <div key={s.k} style={{ padding: '16px 18px', borderRight: i % 2 === 0 ? `1.5px solid ${T.graphite}` : 'none', borderBottom: i < 2 ? `1.5px solid ${T.graphite}` : 'none' }}>
                <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.mute, letterSpacing: '.1em', textTransform: 'uppercase' }}>{s.k}</div>
                <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', marginTop: 4 }}><CountUp value={s.v} /></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <SiteMap markers={markers} zoom={12} height="100%" accentColor={T.electric} tiles="positron" />
          <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 1000, background: T.white, border: `1.5px solid ${T.graphite}`, padding: '8px 14px', fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>
            {markers.length} resultados
          </div>
        </div>
      </section>

      {/* ═══ SEARCH (bajo el mapa del hero) ═══ */}
      <SpatialSearch slug={slug} />

      {/* ═══ TICKER ═══ */}
      <div style={{ background: T.graphite, color: T.white, overflow: 'hidden', borderBottom: `1.5px solid ${T.graphite}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '0 40px', height: 44, whiteSpace: 'nowrap', overflowX: 'auto' }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.electric, fontWeight: 700, letterSpacing: '.12em', marginRight: 24, flexShrink: 0 }}>// USD/M² PROMEDIO</span>
          {ticker.map(t => (
            <span key={t.n} style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.04em', marginRight: 28, flexShrink: 0 }}>
              {t.n.toUpperCase()} <b style={{ color: T.white }}>{t.v}</b>{' '}
              <span style={{ color: t.d >= 0 ? '#4ADE80' : '#F87171' }}>{t.d >= 0 ? '↑' : '↓'} {Math.abs(t.d)}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ ÚLTIMOS INGRESOS ═══ */}
      <Reveal variant="fadeUp">
        <section style={{ padding: '56px 40px', borderBottom: `1.5px solid ${T.graphite}` }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
            <h2 style={{ fontSize: 'clamp(26px, 2.6vw, 38px)', fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: 0 }}>Últimos ingresos</h2>
            <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.electric, textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase' }}>[ VER TODAS → ]</Link>
          </div>
          <div className="rwd-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1.5px solid ${T.graphite}` }}>
            {ingresos.map((p, i) => (
              <Link key={p.id} href={`/${slug}/propiedades/${p.id}`} style={{ textDecoration: 'none', color: T.graphite, borderRight: i < 2 ? `1.5px solid ${T.graphite}` : 'none' }}>
                <article>
                  <div style={{ position: 'relative', height: 200, borderBottom: `1.5px solid ${T.graphite}` }}>
                    <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                    <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: T.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: T.white, padding: '4px 8px', border: `1px solid ${T.graphite}` }}>
                      #{p.id.replace(/\D/g, '')} · {p.operation}
                    </span>
                  </div>
                  <div style={{ padding: '18px 20px' }}>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.mute, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>{p.neighborhood} · {p.city}</div>
                    <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.2, marginBottom: 14, textTransform: 'uppercase' }}>{p.title}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${T.rule}` }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: T.electric, letterSpacing: '-.03em' }}>{p.currency} {p.price.toLocaleString('es-AR')}</span>
                      <span style={{ fontFamily: T.mono, fontSize: 10, color: T.mute }}>{[p.rooms && `${p.rooms} AMB`, p.covered_area && `${p.covered_area}M²`].filter(Boolean).join(' · ')}</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ═══ OPORTUNIDAD (1 propiedad marcada por la inmobiliaria) ═══ */}
      {oportunidad && (
        <Reveal variant="fadeUp">
          <Link href={`/${slug}/propiedades/${oportunidad.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
            <section className="rwd-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', borderBottom: `1.5px solid ${T.graphite}`, background: T.graphite, color: T.white }}>
              <div style={{ position: 'relative', minHeight: 360, borderRight: `1.5px solid ${T.graphite}` }}>
                <Image src={oportunidad.images[0] ?? ''} alt={oportunidad.title} fill style={{ objectFit: 'cover' }} sizes="50vw" />
                <span style={{ position: 'absolute', top: 16, left: 16, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', background: T.electric, color: T.white, padding: '6px 12px' }}>★ Oportunidad</span>
              </div>
              <div style={{ padding: '48px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>// Oportunidad de la semana</span>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 44px)', fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', lineHeight: 0.98, margin: '16px 0 14px' }}>{oportunidad.title}</h2>
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,.7)', lineHeight: 1.55, margin: '0 0 24px', maxWidth: 460 }}>{oportunidad.description.split('.').slice(0, 2).join('.')}.</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
                  <span style={{ fontSize: 'clamp(32px, 3.4vw, 50px)', fontWeight: 800, color: T.electric, letterSpacing: '-.04em', lineHeight: 1 }}>{oportunidad.currency} {oportunidad.price.toLocaleString('es-AR')}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: 'rgba(255,255,255,.6)', letterSpacing: '.06em' }}>{[oportunidad.rooms && `${oportunidad.rooms} AMB`, oportunidad.covered_area && `${oportunidad.covered_area}M²`, oportunidad.neighborhood.toUpperCase()].filter(Boolean).join(' · ')}</span>
                </div>
                <span style={{ marginTop: 28, fontFamily: T.mono, fontSize: 12, fontWeight: 700, color: T.white, letterSpacing: '.06em', textTransform: 'uppercase' }}>Ver propiedad →</span>
              </div>
            </section>
          </Link>
        </Reveal>
      )}

      {/* ═══ PROPIEDADES DESTACADAS ═══ */}
      {destacadas.length > 0 && (
        <Reveal variant="fadeUp">
          <section id="destacadas" style={{ padding: '56px 40px', borderBottom: `1.5px solid ${T.graphite}` }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 28 }}>
              <h2 style={{ fontSize: 'clamp(26px, 2.6vw, 38px)', fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: 0 }}>Propiedades destacadas</h2>
              <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, color: T.electric, textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase' }}>[ VER TODAS → ]</Link>
            </div>
            <div className="rwd-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: `1.5px solid ${T.graphite}`, borderLeft: `1.5px solid ${T.graphite}` }}>
              {destacadas.map(p => (
                <Link key={p.id} href={`/${slug}/propiedades/${p.id}`} style={{ textDecoration: 'none', color: T.graphite, borderRight: `1.5px solid ${T.graphite}`, borderBottom: `1.5px solid ${T.graphite}` }}>
                  <article>
                    <div style={{ position: 'relative', height: 190, borderBottom: `1.5px solid ${T.graphite}` }}>
                      <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                      <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: T.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: T.white, padding: '4px 8px', border: `1px solid ${T.graphite}` }}>{p.operation}</span>
                    </div>
                    <div style={{ padding: '16px 18px' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.mute, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>{p.neighborhood} · {p.city}</div>
                      <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 12 }}>{p.title}</div>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 20, fontWeight: 800, color: T.electric, letterSpacing: '-.03em' }}>{p.currency} {p.price.toLocaleString('es-AR')}</span>
                        <span style={{ fontFamily: T.mono, fontSize: 9.5, color: T.mute }}>{[p.rooms && `${p.rooms} AMB`, p.covered_area && `${p.covered_area}M²`].filter(Boolean).join(' · ')}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══ BARRIOS ═══ */}
      <Reveal variant="fadeUp">
        <section id="barrios" style={{ padding: '56px 40px', borderBottom: `1.5px solid ${T.graphite}` }}>
          <h2 style={{ fontSize: 'clamp(26px, 2.6vw, 38px)', fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: '0 0 28px' }}>Barrios</h2>
          <div className="rwd-4col" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, border: `1.5px solid ${T.graphite}` }}>
            {barrios.map((b, i) => {
              const count = featured.filter(p => p.neighborhood === b).length
              return (
                <Link key={b} href={`/${slug}/propiedades?barrio=${encodeURIComponent(b)}`} style={{ textDecoration: 'none', color: T.graphite, borderRight: i < barrios.length - 1 ? `1.5px solid ${T.graphite}` : 'none' }}>
                  <div style={{ height: 120, position: 'relative', borderBottom: `1.5px solid ${T.graphite}`, background: T.pale, backgroundImage: `linear-gradient(90deg, ${T.rule} 1px, transparent 1px), linear-gradient(180deg, ${T.rule} 1px, transparent 1px)`, backgroundSize: '24px 24px' }}>
                    <span style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 12, height: 12, borderRadius: 99, background: T.electric, boxShadow: `0 0 0 6px ${T.electricSoft}` }} />
                  </div>
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-.02em', textTransform: 'uppercase' }}>{b}</div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.electric, marginTop: 6, letterSpacing: '.06em' }}>{count} {count === 1 ? 'PROPIEDAD' : 'PROPIEDADES'} →</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </Reveal>

      {/* ═══ CTA electric ═══ */}
      <Reveal variant="fadeUp">
        <section style={{ background: T.electric, color: T.white, padding: '72px 40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(32px, 3.6vw, 56px)', fontWeight: 800, letterSpacing: '-.04em', textTransform: 'uppercase', margin: '0 0 16px', lineHeight: 1 }}>
            ¿Vendés o alquilás?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.82)', marginBottom: 32, maxWidth: 460, margin: '0 auto 32px', lineHeight: 1.55 }}>
            Publicá con datos de mercado de tu cuadra y llegá a compradores que buscan exactamente tu zona.
          </p>
          <Link href={`/${slug}/tasacion`} style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: T.electric, background: T.white, padding: '15px 30px', borderRadius: 6, textDecoration: 'none', display: 'inline-block' }}>
            [ TASAR MI PROPIEDAD → ]
          </Link>
        </section>
      </Reveal>

      <SiteFooter slug={slug} agency={agency} accent={T.electric} bg={T.graphite} ink="#FFFFFF" ink2="rgba(255,255,255,.6)" ink3="rgba(255,255,255,.4)" rule="rgba(255,255,255,.12)" fontDisplay={T.display} />
    </div>
  )
}
