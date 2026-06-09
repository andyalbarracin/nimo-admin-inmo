import Link from 'next/link'
import type { Property, Agency } from '@/lib/dummy'

const T = {
  bg: '#F7F3EE', bg2: '#EDE7DE', white: '#FFFFFF',
  border: '#DDD5C8', ink: '#1E1A16', ink2: '#4D453C', ink3: '#9E9389',
  accent: '#7B4F3C',
  serif: "var(--font-serif), Georgia, serif",
  body: "var(--font-sans), system-ui, sans-serif",
}

interface Props {
  slug: string
  agency: Agency
  featured: Property[]
  stats: { total_properties: number; conversion_rate: number; visits_this_month: number }
}

export default function EditorialHome({ slug, agency, featured, stats }: Props) {
  return (
    <div style={{ fontFamily: T.body, background: T.bg, color: T.ink }}>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(247,243,238,.95)', backdropFilter: 'blur(10px)', borderBottom: `1px solid ${T.border}`, padding: '0 56px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 6, height: 36, background: T.accent, borderRadius: 1 }} />
          <span style={{ fontFamily: T.serif, fontSize: 20, color: T.ink, fontStyle: 'italic', letterSpacing: '-.01em' }}>{agency.name}</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {[{ label: 'Propiedades', href: `/${slug}/propiedades` }, { label: 'Contacto', href: `/${slug}/contacto` }].map(n => (
            <Link key={n.label} href={n.href} style={{ fontSize: 14, color: T.ink2, textDecoration: 'none', fontWeight: 400, letterSpacing: '.01em' }}>{n.label}</Link>
          ))}
          <Link href={`/${slug}/contacto`} style={{ fontSize: 13, color: T.bg, background: T.accent, padding: '9px 22px', borderRadius: T.border, textDecoration: 'none', letterSpacing: '.02em' }}>
            Asesoramiento
          </Link>
        </nav>
      </header>

      {/* HERO — editorial split */}
      <section style={{ display: 'grid', gridTemplateColumns: '55% 45%', minHeight: '86vh' }}>
        {/* Left: text column */}
        <div style={{ padding: '96px 64px 96px 56px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ width: 48, height: 2, background: T.accent, marginBottom: 36 }} />
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(52px, 5vw, 80px)', color: T.ink, lineHeight: 1.05, margin: '0 0 28px', letterSpacing: '-.02em', fontWeight: 700 }}>
            Encontrá el hogar<br /><em style={{ fontStyle: 'italic', color: T.accent }}>que siempre</em><br />imaginaste.
          </h1>
          <p style={{ fontSize: 17, color: T.ink2, lineHeight: 1.7, maxWidth: 420, marginBottom: 40, fontWeight: 300 }}>
            {agency.tagline ?? 'Propiedades seleccionadas con criterio editorial. Cada detalle importa.'}
          </p>
          <div style={{ display: 'flex', gap: 14 }}>
            <Link href={`/${slug}/propiedades`} style={{ fontSize: 14, color: T.bg, background: T.accent, padding: '14px 30px', borderRadius: 2, textDecoration: 'none', letterSpacing: '.02em' }}>
              Ver propiedades
            </Link>
            <Link href={`/${slug}/contacto`} style={{ fontSize: 14, color: T.ink, border: `1.5px solid ${T.border}`, padding: '13px 26px', borderRadius: 2, textDecoration: 'none' }}>
              Contactar
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 48, marginTop: 64, paddingTop: 40, borderTop: `1px solid ${T.border}` }}>
            {[
              { v: stats.total_properties, l: 'Propiedades' },
              { v: `${stats.conversion_rate}%`, l: 'Tasa de cierre' },
              { v: '+15', l: 'Años en el mercado' },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: T.serif, fontSize: 40, color: T.accent, lineHeight: 1, fontWeight: 700 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: T.ink3, marginTop: 6, letterSpacing: '.06em', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: stacked images */}
        <div style={{ position: 'relative', overflow: 'hidden', background: T.bg2 }}>
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000"
            alt="Propiedad destacada"
            style={{ width: '100%', height: '60%', objectFit: 'cover', display: 'block' }}
          />
          <div style={{ height: '40%', padding: '28px 32px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {featured[0] && (
              <Link href={`/${slug}/propiedades/${featured[0].id}`} style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: 12, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>Propiedad destacada</div>
                <div style={{ fontFamily: T.serif, fontSize: 20, color: T.ink, fontWeight: 600, marginBottom: 6, lineHeight: 1.2 }}>{featured[0].title}</div>
                <div style={{ fontSize: 14, color: T.ink2, marginBottom: 10 }}>{featured[0].neighborhood} · {featured[0].city}</div>
                <div style={{ fontFamily: T.serif, fontSize: 22, color: T.accent, fontWeight: 700 }}>{featured[0].currency} {featured[0].price.toLocaleString('es-AR')}</div>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Ruled divider */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '0 56px' }}>
        <div style={{ flex: 1, height: 1, background: T.border }} />
        <div style={{ padding: '0 24px', fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.2em' }}>Selección</div>
        <div style={{ flex: 1, height: 1, background: T.border }} />
      </div>

      {/* FEATURED PROPERTIES — editorial magazine layout */}
      <section style={{ padding: '72px 56px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48 }}>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 3.5vw, 56px)', color: T.ink, margin: 0, lineHeight: 1, fontWeight: 700, fontStyle: 'italic' }}>
            Propiedades<br />seleccionadas.
          </h2>
          <Link href={`/${slug}/propiedades`} style={{ fontSize: 13, color: T.accent, textDecoration: 'none', borderBottom: `1px solid ${T.accent}`, paddingBottom: 2 }}>
            Ver todas →
          </Link>
        </div>

        {/* Big lead card + 2 smaller */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Lead card */}
          {featured[0] && (
            <Link href={`/${slug}/propiedades/${featured[0].id}`} style={{ textDecoration: 'none', gridRow: 'span 2' }}>
              <div style={{ position: 'relative', height: '100%', minHeight: 560, overflow: 'hidden', borderRadius: T.border }}>
                <img src={featured[0].images[0]} alt={featured[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,26,22,.88) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '32px 28px' }}>
                  <div style={{ fontSize: 10, color: 'rgba(237,233,224,.6)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 8 }}>{featured[0].operation}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 24, color: '#EDE9E0', fontWeight: 600, lineHeight: 1.2, marginBottom: 8 }}>{featured[0].title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(237,233,224,.7)', marginBottom: 12 }}>{featured[0].neighborhood}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 28, color: '#C8A05E', fontWeight: 700 }}>{featured[0].currency} {featured[0].price.toLocaleString('es-AR')}</div>
                </div>
              </div>
            </Link>
          )}

          {/* Two smaller cards stacked */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {featured.slice(1, 3).map(prop => (
              <Link key={prop.id} href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', background: T.white, border: `1px solid ${T.border}`, borderRadius: T.border, overflow: 'hidden', height: '100%', minHeight: 180 }}>
                  <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>{prop.operation}</div>
                      <div style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, fontWeight: 600, lineHeight: 1.3, marginBottom: 6 }}>{prop.title}</div>
                      <div style={{ fontSize: 13, color: T.ink2 }}>{prop.neighborhood} · {prop.city}</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
                        {prop.rooms && <span style={{ fontSize: 12, color: T.ink2 }}>{prop.rooms} amb.</span>}
                        {prop.covered_area && <span style={{ fontSize: 12, color: T.ink2 }}>{prop.covered_area}m²</span>}
                      </div>
                      <div style={{ fontFamily: T.serif, fontSize: 20, color: T.accent, fontWeight: 700 }}>{prop.currency} {prop.price.toLocaleString('es-AR')}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary grid — remaining properties */}
        {featured.length > 3 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginTop: 2 }}>
            {featured.slice(3).map(prop => (
              <Link key={prop.id} href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none' }}>
                <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: T.border, overflow: 'hidden' }}>
                  <div style={{ height: 200, overflow: 'hidden' }}>
                    <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ padding: '20px 20px 22px' }}>
                    <div style={{ fontSize: 10, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>{prop.operation}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 16, color: T.ink, fontWeight: 600, marginBottom: 4 }}>{prop.title}</div>
                    <div style={{ fontSize: 12, color: T.ink3, marginBottom: 12 }}>{prop.neighborhood}</div>
                    <div style={{ fontFamily: T.serif, fontSize: 19, color: T.accent, fontWeight: 700 }}>{prop.currency} {prop.price.toLocaleString('es-AR')}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* OPERATIONS — editorial category cards */}
      <section style={{ background: T.bg2, padding: '80px 56px', borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(32px, 3vw, 48px)', color: T.ink, margin: 0, fontStyle: 'italic', fontWeight: 700 }}>¿Qué buscás?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            { label: 'Comprar', desc: 'Encontrá el departamento, casa o PH que imaginaste.', href: `/${slug}/propiedades?op=venta`, img: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700' },
            { label: 'Alquilar', desc: 'Alquileres con contratos claros y asesoría completa.', href: `/${slug}/propiedades?op=alquiler`, img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=700' },
            { label: 'Invertir', desc: 'Oportunidades con alta rentabilidad en los mejores barrios.', href: `/${slug}/contacto`, img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=700' },
          ].map(op => (
            <Link key={op.label} href={op.href} style={{ textDecoration: 'none', display: 'block', position: 'relative', height: 340, overflow: 'hidden', borderRadius: T.border }}>
              <img src={op.img} alt={op.label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(30,26,22,.82) 0%, rgba(30,26,22,.1) 60%, transparent 100%)' }} />
              <div style={{ position: 'absolute', bottom: 0, padding: '28px 24px' }}>
                <div style={{ fontFamily: T.serif, fontSize: 28, color: '#EDE9E0', fontWeight: 700, marginBottom: 8, fontStyle: 'italic' }}>{op.label}</div>
                <div style={{ fontSize: 13, color: 'rgba(237,233,224,.72)', lineHeight: 1.5 }}>{op.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 56px', background: T.accent, textAlign: 'center' }}>
        <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(36px, 4vw, 60px)', color: '#F7F3EE', margin: '0 0 20px', fontStyle: 'italic', fontWeight: 700, lineHeight: 1 }}>
          Hablemos de tu próxima propiedad.
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(247,243,238,.75)', marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          Nuestro equipo está disponible para asesorarte sin compromiso.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link href={`/${slug}/contacto`} style={{ fontSize: 14, color: T.accent, background: '#F7F3EE', padding: '14px 32px', borderRadius: 2, textDecoration: 'none', fontWeight: 600 }}>
            Contactar ahora
          </Link>
          {agency.phone && (
            <a href={`https://wa.me/${agency.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ fontSize: 14, color: '#F7F3EE', border: '1.5px solid rgba(247,243,238,.35)', padding: '13px 28px', borderRadius: 2, textDecoration: 'none' }}>
              WhatsApp
            </a>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.ink, padding: '48px 56px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid rgba(237,233,224,.1)' }}>
          <div>
            <div style={{ fontFamily: T.serif, fontSize: 22, color: '#EDE9E0', fontStyle: 'italic', marginBottom: 6 }}>{agency.name}</div>
            {agency.address && <p style={{ fontSize: 12, color: 'rgba(237,233,224,.5)', maxWidth: 280, lineHeight: 1.6, margin: 0 }}>{agency.address}</p>}
          </div>
          <div style={{ display: 'flex', gap: 60 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(237,233,224,.35)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 14 }}>Navegar</div>
              {([['Propiedades', `/${slug}/propiedades`], ['Contacto', `/${slug}/contacto`]] as [string, string][]).map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(237,233,224,.6)', textDecoration: 'none', marginBottom: 8 }}>{l}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(237,233,224,.35)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 14 }}>Contacto</div>
              {agency.phone && <div style={{ fontSize: 12, color: 'rgba(237,233,224,.5)', marginBottom: 6 }}>{agency.phone}</div>}
              {agency.email && <div style={{ fontSize: 12, color: 'rgba(237,233,224,.5)' }}>{agency.email}</div>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 11, color: 'rgba(237,233,224,.25)', textTransform: 'uppercase', letterSpacing: '.1em' }}>© 2026 {agency.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(237,233,224,.25)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Powered by NIMO</div>
        </div>
      </footer>
    </div>
  )
}
