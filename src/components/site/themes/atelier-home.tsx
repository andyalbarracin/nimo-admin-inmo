import Image from 'next/image'
import Link from 'next/link'
import type { Property, Agency, TeamMember } from '@/lib/dummy'
import SiteMap from '@/components/site/primitives/SiteMap'
import Reveal from '@/components/site/primitives/Reveal'

/* ============================================================
 * T3 · ATELIER — boutique de lujo, Cormorant Garamond, verde
 * salvia muted, mucho whitespace. Réplica del mockup C6.
 * ============================================================ */

const T = {
  bone: '#F5F1EC',
  paper: '#FFFFFF',
  cocoa: '#2E2620',
  cocoaSoft: '#6B5D52',
  mute: '#9A8F82',
  rule: '#DDD5CA',
  sage: '#7A8264',
  sageDark: '#5E6B4E',
  sageSoft: '#E4E7DC',
  gold: '#B89968',
  serif: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  sans: "var(--font-sans), system-ui, sans-serif",
}

interface Props {
  slug: string
  agency: Agency
  featured: Property[]
  properties?: Property[]
  opportunity?: Property | null
  team?: TeamMember[]
  stats: { total_properties: number; conversion_rate: number; visits_this_month: number }
}

const overline: React.CSSProperties = {
  fontFamily: T.sans,
  fontSize: 10.5,
  letterSpacing: '.2em',
  textTransform: 'uppercase',
  color: T.cocoaSoft,
}

export default function AtelierHome({ slug, agency, featured, properties = [], stats, team }: Props) {
  const catalog = properties.length ? properties : featured
  const hero = featured[0] ?? catalog[0]
  const slow = (featured.length ? featured : catalog).slice(0, 3)
  // El portfolio siempre llena las 2 filas (6) tomando del catálogo completo.
  const portfolio = catalog.slice(0, 6)
  const markers = catalog.map(p => ({ lat: p.lat, lng: p.lng, title: p.title, price: `${p.currency} ${p.price.toLocaleString('es-AR')}`, id: p.id }))
  const word = agency.name.split(' ')
  const teamList = (team ?? []).slice(0, 4)

  return (
    <div style={{ fontFamily: T.serif, background: T.bone, color: T.cocoa, minHeight: '100vh' }}>
      {/* ═══ NAV centrado ═══ */}
      <nav style={{ padding: '40px 0 32px', textAlign: 'center' }}>
        <Link href={`/${slug}`} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: T.cocoa, textDecoration: 'none' }}>
          {word[0]} <span style={{ color: T.sageDark }}>{word.slice(1).join(' ')}</span>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 44, marginTop: 22 }}>
          {([['Propiedades', `/${slug}/propiedades`], ['Concierge', '#concierge'], ['Equipo', '#equipo'], ['Contacto', `/${slug}/contacto`]] as [string, string][]).map(([l, h]) => (
            <Link key={l} href={h} style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: T.cocoaSoft, textDecoration: 'none', fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
      </nav>

      {/* ═══ HERO cinematográfico ═══ */}
      <header style={{ position: 'relative', height: 760, margin: '0 24px', overflow: 'hidden' }}>
        {hero && <Image src={hero.images[0] ?? ''} alt={hero.title} fill priority style={{ objectFit: 'cover' }} sizes="100vw" />}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(46,38,32,.1) 0%, transparent 40%, rgba(46,38,32,.55) 100%)' }} />
        <div style={{ position: 'absolute', left: 64, right: 64, bottom: 56, color: T.bone }}>
          <span style={{ ...overline, color: 'rgba(245,241,236,.92)' }}>Propiedades de excepción</span>
          <h1 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(64px, 9vw, 124px)', lineHeight: 0.94, letterSpacing: '-.02em', margin: '20px 0 0', maxWidth: 980 }}>
            Espacios que se eligen <em style={{ fontStyle: 'italic' }}>lento.</em>
          </h1>
        </div>
      </header>

      {/* ═══ SLOW REVEAL ═══ */}
      <section style={{ padding: '120px 0 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
          {slow.map((p, i) => {
            const flip = i % 2 === 1
            return (
              <Reveal key={p.id} variant="fadeUp">
                <article style={{ display: 'grid', gridTemplateColumns: flip ? '1fr 1.1fr' : '1.1fr 1fr', gap: 88, alignItems: 'center', paddingBottom: 140 }}>
                  <div style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', order: flip ? 2 : 1 }}>
                    <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover', transition: 'transform 1.4s ease' }} sizes="50vw" className="atelier-slow-img" />
                  </div>
                  <div style={{ order: flip ? 1 : 2 }}>
                    <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: T.mute }}>
                      {String(i + 1).padStart(2, '0')} / {p.neighborhood}
                    </span>
                    <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(48px, 5.5vw, 84px)', lineHeight: 0.98, letterSpacing: '-.015em', margin: '20px 0 22px' }}>{p.title}</h2>
                    <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 21, lineHeight: 1.6, color: T.cocoaSoft, margin: '0 0 30px', maxWidth: 420 }}>
                      {p.description.split('.').slice(0, 2).join('.')}.
                    </p>
                    <div style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.16em', textTransform: 'uppercase', color: T.cocoaSoft, marginBottom: 28, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                      {[p.total_area && `${p.total_area} m²`, p.rooms && `${p.rooms} ambientes`, p.bathrooms && `${p.bathrooms} baños`].filter(Boolean).map((s, j) => <span key={j}>{s}</span>)}
                    </div>
                    <div style={{ fontFamily: T.serif, fontSize: 30, marginBottom: 26 }}>
                      <span style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: '.16em', color: T.mute, marginRight: 10 }}>{p.currency}</span>
                      {p.price.toLocaleString('es-AR')}
                    </div>
                    <Link href={`/${slug}/propiedades/${p.id}`} style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.sageDark, textDecoration: 'none', borderBottom: `1px solid ${T.sage}`, paddingBottom: 3 }}>
                      Ver propiedad →
                    </Link>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* ═══ PORTFOLIO asimétrico ═══ */}
      <section id="portfolio" style={{ padding: '110px 0', background: T.paper }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <span style={overline}>Colección · {stats.total_properties} propiedades activas</span>
            <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(52px, 6vw, 88px)', lineHeight: 1, letterSpacing: '-.015em', margin: '16px 0 0' }}>
              Nuestro <em style={{ fontStyle: 'italic' }}>portfolio.</em>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 28, alignItems: 'start' }}>
            {portfolio.map((p, i) => {
              const spans = [5, 4, 3, 3, 4, 5]
              const ratios = ['4 / 5', '4 / 3', '1 / 1', '4 / 5', '1 / 1', '4 / 3']
              return (
                <Reveal key={p.id} variant="fadeUp" delay={(i % 3) * 0.08}>
                  <Link href={`/${slug}/propiedades/${p.id}`} style={{ gridColumn: `span ${spans[i] ?? 4}`, textDecoration: 'none', color: T.cocoa, display: 'block' }}>
                    <div style={{ position: 'relative', aspectRatio: ratios[i] ?? '4 / 3', overflow: 'hidden' }}>
                      <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="40vw" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16 }}>
                      <span style={{ fontFamily: T.serif, fontSize: 22 }}>{p.title}</span>
                      <span style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: '.14em', color: T.cocoaSoft, textTransform: 'uppercase' }}>{p.neighborhood}</span>
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══ MAPA discreto ═══ */}
      <section style={{ padding: '110px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ ...overline, color: T.sageDark }}>Zona</span>
            <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(44px, 5vw, 72px)', letterSpacing: '-.015em', margin: '14px 0 0' }}>Donde <em style={{ fontStyle: 'italic' }}>estamos.</em></h2>
          </div>
          <div style={{ height: 460, overflow: 'hidden' }}>
            <SiteMap markers={markers} zoom={12} height="100%" accentColor={T.sage} tiles="positron" />
          </div>
          <p style={{ textAlign: 'center', ...overline, marginTop: 26 }}>
            {Array.from(new Set(featured.map(p => p.neighborhood))).join(' · ')}
          </p>
        </div>
      </section>

      {/* ═══ FILOSOFÍA ═══ */}
      <section style={{ padding: '130px 0', background: T.paper, textAlign: 'center' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 48px' }}>
          <span style={{ ...overline, color: T.sageDark }}>Manifiesto</span>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(34px, 4vw, 50px)', lineHeight: 1.25, letterSpacing: '-.01em', maxWidth: 880, margin: '28px auto 0' }}>
            No vendemos propiedades. <span style={{ color: T.sageDark }}>Acompañamos decisiones</span> que se toman pocas veces en la vida.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, maxWidth: 1000, margin: '90px auto 0' }}>
            {[
              ['Curaduría', 'Pocas propiedades activas, no cientos. Cada una elegida por razones que podemos defender.'],
              ['Discreción', 'Parte del portfolio nunca se publica. Las búsquedas sensibles se trabajan en silencio.'],
              ['Conocimiento', 'Años en los mismos barrios. Sabemos qué casa estuvo en venta y por qué.'],
            ].map(([h, p], i) => (
              <div key={h} style={{ padding: '0 24px', borderLeft: i === 0 ? 'none' : `1px solid ${T.rule}` }}>
                <h4 style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 30, margin: '0 0 14px' }}>{h}</h4>
                <p style={{ fontFamily: T.serif, fontSize: 17, lineHeight: 1.7, color: T.cocoaSoft, margin: 0, fontStyle: 'italic' }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EQUIPO ═══ */}
      {teamList.length > 0 && (
        <section id="equipo" style={{ padding: '110px 0' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 64 }}>
              <div>
                <span style={{ ...overline, color: T.sageDark }}>Estudio</span>
                <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(44px, 5vw, 72px)', letterSpacing: '-.015em', margin: '12px 0 0' }}>El <em style={{ fontStyle: 'italic' }}>equipo.</em></h2>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
              {teamList.map(m => (
                <div key={m.id} style={{ textAlign: 'center' }}>
                  <div style={{ aspectRatio: '3 / 4', background: T.sageSoft, marginBottom: 20, display: 'grid', placeItems: 'center', filter: 'grayscale(.2)' }}>
                    <span style={{ fontFamily: T.serif, fontSize: 40, color: T.sageDark }}>{m.avatar}</span>
                  </div>
                  <b style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 25, display: 'block' }}>{m.name}</b>
                  <span style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: T.mute, display: 'block', marginTop: 8 }}>
                    {m.role === 'owner' ? 'Dirección' : m.role === 'admin' ? 'Curaduría' : 'Asesor'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONCIERGE CTA ═══ */}
      <section id="concierge" style={{ padding: '90px 0 130px' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
          <div style={{ background: T.paper, padding: '100px 80px', textAlign: 'center', boxShadow: '0 30px 80px -40px rgba(46,38,32,.18)' }}>
            <span style={{ ...overline, color: T.sageDark }}>Concierge inmobiliario</span>
            <h2 style={{ fontFamily: T.serif, fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(44px, 5.5vw, 80px)', lineHeight: 1, letterSpacing: '-.015em', margin: '20px 0 22px' }}>
              ¿Buscás algo específico?
            </h2>
            <p style={{ fontFamily: T.serif, fontSize: 21, fontStyle: 'italic', lineHeight: 1.6, color: T.cocoaSoft, margin: '0 auto 44px', maxWidth: 540 }}>
              Acompañamos búsquedas a pedido. Contanos qué estás buscando y armamos una selección privada.
            </p>
            <Link href={`/${slug}/contacto`} style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: T.bone, background: T.sage, padding: '16px 34px', borderRadius: 999, textDecoration: 'none', display: 'inline-block' }}>
              Iniciar búsqueda →
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER centrado ═══ */}
      <footer id="contacto" style={{ borderTop: `1px solid ${T.rule}`, padding: '80px 0 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
          <Link href={`/${slug}`} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: T.cocoa, textDecoration: 'none' }}>
            {word[0]} <span style={{ color: T.sageDark }}>{word.slice(1).join(' ')}</span>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 44, margin: '32px 0 48px' }}>
            {([['Propiedades', `/${slug}/propiedades`], ['Concierge', '#concierge'], ['Equipo', '#equipo'], ['Contacto', `/${slug}/contacto`]] as [string, string][]).map(([l, h]) => (
              <Link key={l} href={h} style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: T.cocoaSoft, textDecoration: 'none' }}>{l}</Link>
            ))}
          </div>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 18, lineHeight: 1.9, color: T.cocoaSoft }}>
            {agency.address}<br />
            {agency.phone} · {agency.email}
          </div>
          <div style={{ marginTop: 56, paddingTop: 28, borderTop: `1px solid ${T.rule}`, display: 'flex', justifyContent: 'space-between', fontFamily: T.sans, fontSize: 9.5, letterSpacing: '.14em', textTransform: 'uppercase', color: T.mute }}>
            <span>© {new Date().getFullYear()} {agency.name}</span>
            <span>Sitio en NIMO · Tema Atelier</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
