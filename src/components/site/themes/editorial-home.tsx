import Image from 'next/image'
import Link from 'next/link'
import type { Property, Agency, TeamMember } from '@/lib/dummy'
import SiteNav from '@/components/site/primitives/SiteNav'
import SiteFooter from '@/components/site/primitives/SiteFooter'
import SearchBar from '@/components/site/primitives/SearchBar'
import SiteMap from '@/components/site/primitives/SiteMap'
import Reveal from '@/components/site/primitives/Reveal'
import CountUp from '@/components/site/primitives/CountUp'

/* ============================================================
 * T1 · EDITORIAL  —  arquitectura de revista, serif Fraunces,
 * terracota óxido. Réplica funcional del mockup C1.
 * ============================================================ */

const T = {
  bg: '#FAF7F0',
  bg2: '#F1ECE2',
  paper: '#FFFFFF',
  rule: '#DBD2C2',
  ruleSoft: '#ECE5D5',
  ink: '#1A1614',
  ink2: '#5C5247',
  ink3: '#8A8071',
  rust: '#B25431',
  rustDark: '#8C3F22',
  rustSoft: '#E8D2C2',
  serif: "var(--font-fraunces), 'Playfair Display', Georgia, serif",
  body: "var(--font-sans), system-ui, sans-serif",
  mono: "var(--font-mono), ui-monospace, monospace",
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

/* Imagen HD para el hero (arquitectura cálida, luz natural). */
const HERO_IMG = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=2200&q=80&auto=format&fit=crop'

const DIARIO = [
  {
    cat: 'Mercado',
    title: 'Qué pasó con el valor del m² en los barrios del norte',
    excerpt: 'Un repaso por la evolución de precios en los últimos doce meses y dónde quedaron las oportunidades.',
    author: 'Sofía M.',
    read: '6 min',
  },
  {
    cat: 'Guía',
    title: 'Comprar la primera propiedad: el orden que sí funciona',
    excerpt: 'De la pre aprobación a la escritura, los pasos que conviene tener resueltos antes de enamorarse de una casa.',
    author: 'Mateo S.',
    read: '8 min',
  },
  {
    cat: 'Barrios',
    title: 'Núñez, de zona residencial a polo gastronómico',
    excerpt: 'Cómo cambió la trama del barrio y por qué hoy concentra la demanda de familias jóvenes.',
    author: 'Valentina P.',
    read: '5 min',
  },
]

export default function EditorialHome({ slug, agency, featured, properties = [], stats }: Props) {
  const catalog = properties.length ? properties : featured
  const mapMarkers = catalog.slice(0, 8).map(p => ({
    lat: p.lat,
    lng: p.lng,
    title: p.title,
    price: `${p.currency} ${p.price.toLocaleString('es-AR')}`,
    id: p.id,
  }))

  const lead = featured[0]
  const stack = featured.slice(1, 3)
  const usedIds = new Set([lead?.id, ...stack.map(s => s.id)].filter(Boolean) as string[])
  // Portfolio: siempre llena 2 filas de 3 (6) tomando del catálogo, sin repetir los de arriba.
  const portfolio = catalog.filter(p => !usedIds.has(p.id)).slice(0, 6)
  const heroImg = HERO_IMG
  const agencyDesc =
    agency.tagline ??
    'Una selección de propiedades elegidas con criterio editorial en los barrios más buscados de Buenos Aires.'

  return (
    <div style={{ fontFamily: T.body, background: T.bg, color: T.ink, minHeight: '100vh' }}>
      <SiteNav
        slug={slug}
        agencyName={agency.name}
        links={[
          { label: 'Propiedades', href: `/${slug}/propiedades` },
          { label: 'Mapa', href: '#mapa' },
          { label: 'Diario', href: '#diario' },
          { label: 'Contacto', href: `/${slug}/contacto` },
        ]}
        ctaLabel="Tasar mi propiedad"
        accent={T.rust}
        accentContrast={T.bg}
        bg={T.bg}
        ink={T.ink}
        ink2={T.ink2}
        rule={T.rule}
        fontDisplay={T.serif}
      />

      {/* ═══════════ HERO editorial · foto HD full-bleed ═══════════ */}
      <section className="ed-hero" style={{ position: 'relative', minHeight: '86vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', overflow: 'hidden' }}>
        <Image src={heroImg} alt="" fill priority style={{ objectFit: 'cover' }} sizes="100vw" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(26,22,20,.5) 0%, rgba(26,22,20,.12) 32%, rgba(26,22,20,.2) 56%, rgba(26,22,20,.82) 100%)' }} />

        {/* Barra de edición (arriba, sobre la foto) */}
        <div className="ed-hero-edition" style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '28px 64px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: '#E8A880', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            Edición {new Date().getFullYear()}
          </span>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: '#E8A880' }} />
          <span style={{ fontFamily: T.mono, fontSize: 11, color: 'rgba(250,247,240,.7)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            {stats.total_properties} propiedades en cartera
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(250,247,240,.28)' }} />
          <span style={{ fontFamily: T.mono, fontSize: 11, color: 'rgba(250,247,240,.7)', letterSpacing: '.08em', textTransform: 'uppercase' }}>
            {agency.address?.split('—').pop()?.trim() ?? 'Buenos Aires'}
          </span>
        </div>

        {/* Contenido (abajo) */}
        <div className="ed-hero-body" style={{ position: 'relative', padding: '0 64px 60px', maxWidth: 1360 }}>
          <h1
            className="ed-hero-title"
            style={{
              fontFamily: T.serif,
              fontSize: 'clamp(48px, 6.4vw, 100px)',
              fontWeight: 400,
              lineHeight: 0.98,
              letterSpacing: '-.025em',
              color: T.bg,
              margin: '0 0 28px',
              maxWidth: 1040,
            }}
          >
            El espacio correcto{' '}
            <em style={{ fontStyle: 'italic', color: '#E8A880' }}>cambia</em> la forma
            en que se vive.
          </h1>

          <div className="ed-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end' }}>
            <p style={{ fontFamily: T.serif, fontSize: 21, color: 'rgba(250,247,240,.86)', lineHeight: 1.5, margin: 0, maxWidth: 460 }}>
              {agencyDesc}
            </p>
            <div className="ed-hero-search" style={{ justifySelf: 'end', width: 'min(560px, 100%)' }}>
              <SearchBar
                slug={slug}
                accent={T.rust}
                accentContrast={T.bg}
                surface={T.paper}
                border={T.rule}
                ink={T.ink}
                ink2={T.ink2}
                ink3={T.ink3}
                radius="14px"
                variant="hairline"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED · grid asimétrico ═══════════ */}
      <Reveal variant="fadeUp">
        <section style={{ padding: '40px 64px 88px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36, paddingBottom: 20, borderBottom: `1px solid ${T.ink}` }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 3vw, 46px)', color: T.ink, margin: 0, fontWeight: 400, letterSpacing: '-.02em' }}>
              Selección <em style={{ fontStyle: 'italic', color: T.rust }}>destacada</em>
            </h2>
            <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 18, color: T.ink, textDecoration: 'none' }}>
              Ver toda la cartera →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }}>
            {/* Lead card grande */}
            {lead && (
              <Link href={`/${slug}/propiedades/${lead.id}`} style={{ textDecoration: 'none' }}>
                <article style={{ position: 'relative', height: '100%', minHeight: 560, overflow: 'hidden', borderRadius: 4 }}>
                  <Image src={lead.images[0] ?? ''} alt={lead.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 58vw" priority />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(26,22,20,.86) 0%, transparent 58%)' }} />
                  <span style={{ position: 'absolute', top: 20, left: 20, fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', background: T.bg, color: T.rust, padding: '6px 12px', borderRadius: 99 }}>
                    {lead.operation} · {lead.neighborhood}
                  </span>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 32px' }}>
                    <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 32, color: T.bg, fontWeight: 400, lineHeight: 1.12, marginBottom: 12, maxWidth: 460 }}>
                      {lead.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                      <span style={{ fontFamily: T.serif, fontSize: 30, color: '#E8A880', fontWeight: 500 }}>
                        {lead.currency} {lead.price.toLocaleString('es-AR')}
                      </span>
                      <span style={{ fontSize: 13, color: 'rgba(250,247,240,.7)' }}>
                        {[lead.rooms && `${lead.rooms} amb`, lead.covered_area && `${lead.covered_area} m²`].filter(Boolean).join(' · ')}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Stack de 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {stack.map(prop => (
                <Link key={prop.id} href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                  <article style={{ display: 'grid', gridTemplateColumns: '160px 1fr', background: T.paper, border: `1px solid ${T.rule}`, overflow: 'hidden', height: '100%', minHeight: 200, borderRadius: 4 }}>
                    <div style={{ position: 'relative' }}>
                      <Image src={prop.images[0] ?? ''} alt={prop.title} fill style={{ objectFit: 'cover' }} sizes="160px" />
                    </div>
                    <div style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>
                          {prop.operation} · {prop.neighborhood}
                        </div>
                        <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink, fontWeight: 400, lineHeight: 1.25 }}>
                          {prop.title}
                        </div>
                      </div>
                      <div style={{ fontFamily: T.serif, fontSize: 22, color: T.rust, fontWeight: 500, marginTop: 12 }}>
                        {prop.currency} {prop.price.toLocaleString('es-AR')}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══════════ POR QUÉ · drop cap + stats 72px ═══════════ */}
      <Reveal variant="fadeUp">
        <section style={{ background: T.bg2, borderTop: `1px solid ${T.rule}`, borderBottom: `1px solid ${T.rule}`, padding: '96px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 88, alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: T.rust, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                Por qué {agency.name}
              </span>
              <p style={{ fontFamily: T.serif, fontSize: 25, color: T.ink, lineHeight: 1.5, margin: '28px 0 0', fontWeight: 400 }}>
                <span style={{ float: 'left', fontFamily: T.serif, fontSize: 88, lineHeight: 0.78, paddingRight: 16, paddingTop: 6, color: T.rust, fontWeight: 400 }}>
                  N
                </span>
                o trabajamos con catálogos infinitos. Cada propiedad que publicamos pasó por una visita, una conversación con sus dueños y una decisión editorial. Preferimos mostrar menos y conocer cada metro cuadrado que ofrecemos.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
              {[
                { v: stats.total_properties, suffix: '', l: 'En cartera' },
                { v: 15, suffix: '+', l: 'Años en CABA' },
                { v: Math.round(stats.conversion_rate * 10) / 10, suffix: '%', l: 'Cierre' },
              ].map((s, i) => (
                <div key={i} style={{ borderLeft: i === 0 ? 'none' : `1px solid ${T.rule}`, paddingLeft: i === 0 ? 0 : 24 }}>
                  <div style={{ fontFamily: T.serif, fontSize: 'clamp(48px, 5vw, 72px)', color: T.ink, lineHeight: 0.9, fontWeight: 400, letterSpacing: '-.03em' }}>
                    <CountUp value={s.v} suffix={s.suffix} />
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, marginTop: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══════════ MAPA ═══════════ */}
      <Reveal variant="fadeUp">
        <section id="mapa" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 520, borderBottom: `1px solid ${T.rule}` }}>
          <div style={{ padding: '72px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRight: `1px solid ${T.rule}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.rust, letterSpacing: '.14em', textTransform: 'uppercase' }}>
              Dónde estamos
            </span>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 3vw, 48px)', color: T.ink, margin: '20px 0 24px', fontWeight: 400, lineHeight: 1.05, letterSpacing: '-.02em' }}>
              Cada propiedad, <em style={{ fontStyle: 'italic', color: T.rust }}>en su contexto.</em>
            </h2>
            <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.7, marginBottom: 28, maxWidth: 300 }}>
              La cuadra, los servicios cercanos, el ritmo del barrio. El mapa también forma parte de la decisión.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Array.from(new Set(featured.map(p => p.neighborhood))).slice(0, 6).map(n => (
                <span key={n} style={{ fontFamily: T.mono, fontSize: 10.5, color: T.ink2, border: `1px solid ${T.rule}`, padding: '6px 12px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <SiteMap markers={mapMarkers} zoom={12} height="100%" accentColor={T.rust} tiles="positron" />
          </div>
        </section>
      </Reveal>

      {/* ═══════════ PORTFOLIO 3-col ═══════════ */}
      {portfolio.length > 0 && (
        <Reveal variant="fadeUp">
          <section style={{ padding: '88px 64px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 36 }}>
              <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(28px, 2.6vw, 40px)', color: T.ink, margin: 0, fontWeight: 400 }}>
                Más del <em style={{ fontStyle: 'italic', color: T.rust }}>portfolio</em>
              </h2>
              <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink, textDecoration: 'none' }}>
                Ver todas →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {portfolio.map((prop, i) => (
                <Reveal key={prop.id} variant="fadeUp" delay={i * 0.07}>
                  <Link href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                    <article>
                      <div style={{ position: 'relative', height: 280, overflow: 'hidden', borderRadius: 4, marginBottom: 16 }}>
                        <Image src={prop.images[0] ?? ''} alt={prop.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                      </div>
                      <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 8 }}>
                        {prop.operation} · {prop.neighborhood}
                      </div>
                      <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 21, color: T.ink, fontWeight: 400, lineHeight: 1.25, marginBottom: 10 }}>
                        {prop.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${T.rule}` }}>
                        <span style={{ fontFamily: T.serif, fontSize: 20, color: T.rust, fontWeight: 500 }}>
                          {prop.currency} {prop.price.toLocaleString('es-AR')}
                        </span>
                        <span style={{ fontSize: 12, color: T.ink3 }}>
                          {[prop.rooms && `${prop.rooms} amb`, prop.covered_area && `${prop.covered_area} m²`].filter(Boolean).join(' · ')}
                        </span>
                      </div>
                    </article>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* ═══════════ TASACIÓN · CTA full-rust + stat card ═══════════ */}
      <Reveal variant="fadeUp">
        <section style={{ background: T.rust, color: T.bg, padding: '96px 64px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 72, alignItems: 'center' }}>
            <div>
              <span style={{ fontFamily: T.mono, fontSize: 11, color: 'rgba(250,247,240,.7)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
                Tasación sin cargo
              </span>
              <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 4.4vw, 76px)', color: T.bg, margin: '20px 0 24px', fontWeight: 400, lineHeight: 0.98, letterSpacing: '-.02em' }}>
                ¿Cuánto vale <em style={{ fontStyle: 'italic' }}>tu</em> propiedad hoy?
              </h2>
              <p style={{ fontSize: 17, color: 'rgba(250,247,240,.82)', lineHeight: 1.6, marginBottom: 36, maxWidth: 440 }}>
                Una tasación honesta, hecha por alguien que conoce el barrio. Sin compromiso y con un informe que podés usar como quieras.
              </p>
              <Link href={`/${slug}/contacto`} style={{ display: 'inline-flex', fontFamily: T.mono, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: T.rust, background: T.bg, padding: '16px 32px', borderRadius: 99, textDecoration: 'none', fontWeight: 600 }}>
                Pedir tasación →
              </Link>
            </div>
            {/* Frosted stat card */}
            <div style={{ background: 'rgba(250,247,240,.12)', border: '1px solid rgba(250,247,240,.28)', borderRadius: 8, padding: '40px 40px 36px', backdropFilter: 'blur(6px)' }}>
              <div style={{ fontFamily: T.mono, fontSize: 10.5, color: 'rgba(250,247,240,.7)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 28 }}>
                Promedio de gestión
              </div>
              {[
                { v: '21', u: 'días', l: 'hasta la primera oferta' },
                { v: '94', u: '%', l: 'de respuesta a consultas' },
                { v: stats.visits_this_month.toLocaleString('es-AR'), u: '', l: 'visitas al sitio este mes' },
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '16px 0', borderTop: i === 0 ? 'none' : '1px solid rgba(250,247,240,.18)' }}>
                  <span style={{ fontFamily: T.serif, fontSize: 38, color: T.bg, fontWeight: 500, lineHeight: 1 }}>
                    {s.v}<span style={{ fontSize: 16, marginLeft: 4 }}>{s.u}</span>
                  </span>
                  <span style={{ fontSize: 12.5, color: 'rgba(250,247,240,.72)', textAlign: 'right', maxWidth: 150 }}>{s.l}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* ═══════════ DIARIO ═══════════ */}
      <Reveal variant="fadeUp">
        <section id="diario" style={{ padding: '88px 64px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 40, paddingBottom: 20, borderBottom: `1px solid ${T.ink}` }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(30px, 3vw, 46px)', color: T.ink, margin: 0, fontWeight: 400 }}>
              El <em style={{ fontStyle: 'italic', color: T.rust }}>diario</em>
            </h2>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, letterSpacing: '.1em', textTransform: 'uppercase' }}>
              Notas y mercado
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48 }}>
            {DIARIO.map((post, i) => (
              <Reveal key={i} variant="fadeUp" delay={i * 0.07}>
                <article style={{ paddingRight: i < 2 ? 24 : 0, borderRight: i < 2 ? `1px solid ${T.rule}` : 'none' }}>
                  <span style={{ fontFamily: T.mono, fontSize: 10, color: T.rust, letterSpacing: '.12em', textTransform: 'uppercase' }}>
                    {post.cat}
                  </span>
                  <h3 style={{ fontFamily: T.serif, fontSize: 24, color: T.ink, fontWeight: 400, lineHeight: 1.2, margin: '14px 0 14px' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: 14.5, color: T.ink2, lineHeight: 1.65, margin: '0 0 20px' }}>
                    {post.excerpt}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: T.mono, fontSize: 10.5, color: T.ink3, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                    <span style={{ color: T.ink2 }}>{post.author}</span>
                    <span>·</span>
                    <span>{post.read} de lectura</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      </Reveal>

      <SiteFooter
        slug={slug}
        agency={agency}
        accent={T.rust}
        bg={T.ink}
        ink="#FAF7F0"
        ink2="rgba(250,247,240,.6)"
        ink3="rgba(250,247,240,.35)"
        rule="rgba(250,247,240,.1)"
        fontDisplay={T.serif}
      />
    </div>
  )
}
