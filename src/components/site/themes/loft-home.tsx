import Link from 'next/link'
import type { Property, Agency } from '@/lib/dummy'

const T = {
  bg: '#141412', bg2: '#1C1C1A', surface: '#222220',
  border: '#363633', ink: '#EDE9E0', ink2: '#B0A898', ink3: '#6E6860',
  gold: '#C8A05E', goldLight: 'rgba(200,160,94,.15)',
  serif: "var(--font-serif), Georgia, serif",
  sans: "var(--font-sans), system-ui, sans-serif",
}

interface Props {
  slug: string
  agency: Agency
  featured: Property[]
  stats: { total_properties: number; conversion_rate: number; visits_this_month: number }
}

export default function LoftHome({ slug, agency, featured, stats }: Props) {
  return (
    <div style={{ fontFamily: T.sans, background: T.bg, color: T.ink }}>

      {/* NAV */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, background: 'rgba(20,20,18,.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '0 56px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: 9999, background: T.gold }} />
          <span style={{ fontFamily: T.serif, fontSize: 18, color: T.ink, letterSpacing: '.04em', fontStyle: 'italic' }}>{agency.name}</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          {[{ label: 'Propiedades', href: `/${slug}/propiedades` }, { label: 'Contacto', href: `/${slug}/contacto` }].map(n => (
            <Link key={n.label} href={n.href} style={{ fontSize: 13, color: T.ink2, textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 400 }}>{n.label}</Link>
          ))}
          <Link href={`/${slug}/contacto`} style={{ fontSize: 12, color: T.bg, background: T.gold, padding: '9px 22px', borderRadius: 2, textDecoration: 'none', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>
            Consultar
          </Link>
        </nav>
      </header>

      {/* HERO — full-bleed cinematic */}
      <section style={{ position: 'relative', height: '100vh', display: 'flex', alignItems: 'flex-end', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600"
          alt="Propiedad de lujo"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(20,20,18,.9) 0%, rgba(20,20,18,.45) 60%, rgba(20,20,18,.15) 100%)' }} />

        {/* Vertical gold stripe */}
        <div style={{ position: 'absolute', top: 0, left: 56, width: 1, height: '40vh', background: 'linear-gradient(to bottom, transparent, rgba(200,160,94,.6), transparent)' }} />

        <div style={{ position: 'relative', padding: '0 56px 72px', width: '100%' }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{ fontSize: 10, color: T.gold, textTransform: 'uppercase', letterSpacing: '.22em', marginBottom: 28 }}>
              {agency.name} — Propiedades exclusivas
            </div>
            <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(56px, 6.5vw, 96px)', color: T.ink, lineHeight: 1.02, margin: '0 0 24px', letterSpacing: '-.02em', fontWeight: 700, fontStyle: 'italic' }}>
              Lo excepcional<br />no se anuncia.<br /><span style={{ color: T.gold }}>Se descubre.</span>
            </h1>
            <p style={{ fontSize: 17, color: T.ink2, lineHeight: 1.7, maxWidth: 460, marginBottom: 44, fontWeight: 300 }}>
              {agency.tagline ?? 'Una selección de propiedades de lujo para quienes aprecian lo extraordinario.'}
            </p>
            <div style={{ display: 'flex', gap: 14 }}>
              <Link href={`/${slug}/propiedades`} style={{ fontSize: 14, color: T.bg, background: T.gold, padding: '14px 32px', borderRadius: 2, textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                Ver propiedades
              </Link>
              <Link href={`/${slug}/contacto`} style={{ fontSize: 14, color: T.ink, border: '1px solid rgba(237,233,224,.2)', padding: '13px 28px', borderRadius: 2, textDecoration: 'none', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                Contactar
              </Link>
            </div>
          </div>
        </div>

        {/* Stats — bottom right */}
        <div style={{ position: 'absolute', bottom: 72, right: 56, display: 'flex', gap: 36 }}>
          {[
            { v: stats.total_properties, l: 'Propiedades' },
            { v: `${stats.conversion_rate}%`, l: 'Tasa de cierre' },
            { v: '+15', l: 'Años' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.serif, fontSize: 36, color: T.gold, lineHeight: 1, fontWeight: 700 }}>{s.v}</div>
              <div style={{ fontSize: 9, color: T.ink3, marginTop: 6, letterSpacing: '.12em', textTransform: 'uppercase' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Gold rule */}
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${T.gold}, transparent)` }} />

      {/* FEATURED PROPERTIES — dark luxury grid */}
      <section style={{ padding: '96px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56 }}>
          <div>
            <div style={{ fontSize: 10, color: T.gold, textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: 14 }}>Selección curada</div>
            <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(38px, 4vw, 60px)', color: T.ink, margin: 0, fontStyle: 'italic', fontWeight: 700, lineHeight: 1 }}>
              Propiedades<br />exclusivas.
            </h2>
          </div>
          <Link href={`/${slug}/propiedades`} style={{ fontSize: 12, color: T.gold, border: `1px solid ${T.border}`, padding: '10px 22px', borderRadius: 2, textDecoration: 'none', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            Ver cartera →
          </Link>
        </div>

        {/* Masonry-style: 1 large + 2 side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 2, marginBottom: 2 }}>
          {/* Large card */}
          {featured[0] && (
            <Link href={`/${slug}/propiedades/${featured[0].id}`} style={{ textDecoration: 'none' }}>
              <div style={{ position: 'relative', height: 580, overflow: 'hidden', borderRadius: 2 }}>
                <img src={featured[0].images[0]} alt={featured[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(.9)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,20,18,.94) 0%, rgba(20,20,18,.25) 55%, transparent 100%)' }} />
                <div style={{ position: 'absolute', top: 20, right: 20 }}>
                  <span style={{ fontSize: 9, color: T.gold, border: `1px solid ${T.gold}`, padding: '4px 10px', borderRadius: 1, letterSpacing: '.12em', textTransform: 'uppercase' }}>{featured[0].operation}</span>
                </div>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 32px' }}>
                  <div style={{ fontFamily: T.serif, fontSize: 26, color: T.ink, fontWeight: 600, lineHeight: 1.2, marginBottom: 8, fontStyle: 'italic' }}>{featured[0].title}</div>
                  <div style={{ fontSize: 13, color: T.ink3, marginBottom: 14, letterSpacing: '.04em' }}>{featured[0].neighborhood} · {featured[0].city}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 30, color: T.gold, fontWeight: 700 }}>{featured[0].currency} {featured[0].price.toLocaleString('es-AR')}</div>
                </div>
              </div>
            </Link>
          )}

          {/* Two side cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {featured.slice(1, 3).map(prop => (
              <Link key={prop.id} href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                <div style={{ position: 'relative', height: '100%', minHeight: 220, overflow: 'hidden', borderRadius: 2 }}>
                  <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(.85)' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,20,18,.88) 0%, transparent 60%)' }} />
                  <div style={{ position: 'absolute', bottom: 0, padding: '20px 22px' }}>
                    <div style={{ fontFamily: T.serif, fontSize: 18, color: T.ink, fontStyle: 'italic', marginBottom: 4 }}>{prop.title}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 20, color: T.gold, fontWeight: 700 }}>{prop.currency} {prop.price.toLocaleString('es-AR')}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Remaining properties */}
        {featured.length > 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {featured.slice(3).map(prop => (
              <Link key={prop.id} href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(.85)' }} />
                  </div>
                  <div style={{ padding: '20px 20px 22px' }}>
                    <div style={{ fontSize: 9, color: T.gold, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 8 }}>{prop.operation}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, fontStyle: 'italic', marginBottom: 10 }}>{prop.title}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 19, color: T.gold, fontWeight: 700 }}>{prop.currency} {prop.price.toLocaleString('es-AR')}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section style={{ background: T.bg2, borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, padding: '80px 56px' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 10, color: T.gold, textTransform: 'uppercase', letterSpacing: '.2em', marginBottom: 14 }}>Servicios</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 3.5vw, 50px)', color: T.ink, margin: 0, fontStyle: 'italic', fontWeight: 700 }}>Una experiencia integral.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            { label: 'Comprar', desc: 'Acompañamiento personalizado en cada etapa de la compra. Desde la búsqueda hasta la escritura.', href: `/${slug}/propiedades?op=venta` },
            { label: 'Alquilar', desc: 'Propiedades de categoría con contratos claros y gestión integral post-firma.', href: `/${slug}/propiedades?op=alquiler` },
            { label: 'Invertir', desc: 'Cartera de inversión curada con análisis de rentabilidad y protección patrimonial.', href: `/${slug}/contacto` },
          ].map((s, i) => (
            <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '40px 36px', background: i === 0 ? T.surface : T.bg2, border: `1px solid ${T.border}`, borderRadius: 2, height: '100%', boxSizing: 'border-box' }}>
                <div style={{ fontFamily: T.serif, fontSize: 10, color: T.gold, textTransform: 'uppercase', letterSpacing: '.18em', marginBottom: 18 }}>0{i + 1}</div>
                <div style={{ fontFamily: T.serif, fontSize: 26, color: T.ink, fontStyle: 'italic', marginBottom: 14, fontWeight: 600 }}>{s.label}</div>
                <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.7 }}>{s.desc}</div>
                <div style={{ marginTop: 24, fontSize: 12, color: T.gold, letterSpacing: '.08em', textTransform: 'uppercase' }}>Ver más →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '96px 56px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${T.goldLight} 0%, transparent 70%)` }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 10, color: T.gold, textTransform: 'uppercase', letterSpacing: '.22em', marginBottom: 24 }}>Contacto privado</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 5vw, 68px)', color: T.ink, margin: '0 0 20px', fontStyle: 'italic', fontWeight: 700, lineHeight: 1.05 }}>
            Hablemos de tu<br />próxima propiedad.
          </h2>
          <p style={{ fontSize: 16, color: T.ink2, marginBottom: 44, maxWidth: 440, margin: '0 auto 44px', lineHeight: 1.7 }}>
            Asesoramiento discreto y personalizado. Nuestro equipo está a su disposición.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
            <Link href={`/${slug}/contacto`} style={{ fontSize: 14, color: T.bg, background: T.gold, padding: '14px 36px', borderRadius: 2, textDecoration: 'none', letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600 }}>
              Contactar
            </Link>
            {agency.phone && (
              <a href={`https://wa.me/${agency.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: T.ink2, border: `1px solid ${T.border}`, padding: '13px 28px', borderRadius: 2, textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0A0A08', padding: '48px 56px 32px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid rgba(200,160,94,.1)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: 9999, background: T.gold }} />
              <span style={{ fontFamily: T.serif, fontSize: 18, color: T.ink, fontStyle: 'italic' }}>{agency.name}</span>
            </div>
            {agency.address && <p style={{ fontSize: 12, color: T.ink3, maxWidth: 280, lineHeight: 1.6, margin: 0 }}>{agency.address}</p>}
          </div>
          <div style={{ display: 'flex', gap: 56 }}>
            <div>
              <div style={{ fontSize: 9, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 14 }}>Navegar</div>
              {([['Propiedades', `/${slug}/propiedades`], ['Contacto', `/${slug}/contacto`]] as [string, string][]).map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', fontSize: 13, color: T.ink3, textDecoration: 'none', marginBottom: 8 }}>{l}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 9, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 14 }}>Contacto</div>
              {agency.phone && <div style={{ fontSize: 12, color: T.ink3, marginBottom: 6 }}>{agency.phone}</div>}
              {agency.email && <div style={{ fontSize: 12, color: T.ink3 }}>{agency.email}</div>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, color: 'rgba(200,160,94,.3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>© 2026 {agency.name}</div>
          <div style={{ fontSize: 10, color: 'rgba(200,160,94,.3)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Powered by NIMO</div>
        </div>
      </footer>
    </div>
  )
}
