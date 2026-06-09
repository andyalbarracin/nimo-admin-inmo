import Link from 'next/link'
import type { Property, Agency } from '@/lib/dummy'

const T = {
  bg: '#FFFFFF', bg2: '#F4F6FA', white: '#FFFFFF',
  border: '#E0E5EF', ink: '#0B1426', ink2: '#3A4A63', ink3: '#7A8BA8',
  accent: '#2B5FE8', accentLight: '#EEF2FD',
  sans: "var(--font-sans), system-ui, sans-serif",
  r: '10px',
}

interface Props {
  slug: string
  agency: Agency
  featured: Property[]
  stats: { total_properties: number; conversion_rate: number; visits_this_month: number }
}

export default function SpatialHome({ slug, agency, featured, stats }: Props) {
  const OPERATIONS = [
    { label: 'Departamentos', count: '84', icon: '🏢' },
    { label: 'Casas', count: '31', icon: '🏠' },
    { label: 'PH', count: '18', icon: '🏘️' },
    { label: 'Locales', count: '12', icon: '🏪' },
  ]

  return (
    <div style={{ fontFamily: T.sans, background: T.bg, color: T.ink }}>

      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${T.border}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.ink, letterSpacing: '-.02em' }}>{agency.name}</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {[{ label: 'Explorar', href: `/${slug}/propiedades` }, { label: 'Mapa', href: `#mapa` }, { label: 'Contacto', href: `/${slug}/contacto` }].map(n => (
            <Link key={n.label} href={n.href} style={{ fontSize: 14, color: T.ink2, textDecoration: 'none', fontWeight: 500 }}>{n.label}</Link>
          ))}
          <Link href={`/${slug}/contacto`} style={{ fontSize: 13, color: T.white, background: T.accent, padding: '9px 22px', borderRadius: T.r, textDecoration: 'none', fontWeight: 600 }}>
            Consultar
          </Link>
        </nav>
      </header>

      {/* HERO — search-forward */}
      <section style={{ background: T.bg2, padding: '80px 48px 64px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: T.accentLight, color: T.accent, padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 28, letterSpacing: '.01em' }}>
            <div style={{ width: 6, height: 6, borderRadius: 9999, background: T.accent }} />
            {stats.total_properties} propiedades disponibles
          </div>
          <h1 style={{ fontSize: 'clamp(44px, 5vw, 72px)', fontWeight: 800, color: T.ink, lineHeight: 1.08, margin: '0 0 20px', letterSpacing: '-.03em' }}>
            Buscá tu próxima<br />
            <span style={{ color: T.accent }}>propiedad.</span>
          </h1>
          <p style={{ fontSize: 18, color: T.ink2, lineHeight: 1.6, marginBottom: 40, fontWeight: 400 }}>
            {agency.tagline ?? 'Propiedades verificadas en los mejores barrios de la ciudad.'}
          </p>

          {/* Search bar */}
          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 14, padding: '6px 6px 6px 20px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 24px rgba(11,20,38,.06)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.ink3} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input
              type="text"
              placeholder="Barrio, dirección, tipo de propiedad..."
              readOnly
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, color: T.ink, fontFamily: T.sans, background: 'transparent', cursor: 'pointer' }}
            />
            <select style={{ border: `1px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: T.ink2, background: T.bg2, cursor: 'pointer', outline: 'none' }}>
              <option>Venta</option><option>Alquiler</option>
            </select>
            <Link href={`/${slug}/propiedades`} style={{ background: T.accent, color: T.white, padding: '12px 22px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              Buscar
            </Link>
          </div>

          {/* Quick filters */}
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 16 }}>
            {['Palermo', 'Recoleta', 'Belgrano', 'Villa Crespo', '1-2 amb.', '3+ amb.', 'USD -150k'].map(f => (
              <Link key={f} href={`/${slug}/propiedades`} style={{ fontSize: 12, color: T.ink2, background: T.white, border: `1px solid ${T.border}`, padding: '6px 14px', borderRadius: 999, textDecoration: 'none', fontWeight: 500 }}>
                {f}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <div style={{ background: T.ink, padding: '24px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 64 }}>
          {[
            { v: stats.total_properties, l: 'Propiedades' },
            { v: `${stats.conversion_rate}%`, l: 'Tasa de cierre' },
            { v: stats.visits_this_month, l: 'Visitas este mes' },
            { v: '+15', l: 'Años de trayectoria' },
          ].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: T.white, lineHeight: 1, letterSpacing: '-.02em' }}>{s.v}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', marginTop: 5, textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PROPERTY TYPES */}
      <section style={{ padding: '72px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: '-.02em' }}>Explorá por tipo</h2>
          <Link href={`/${slug}/propiedades`} style={{ fontSize: 13, color: T.accent, textDecoration: 'none', fontWeight: 600 }}>Ver todo →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {OPERATIONS.map(op => (
            <Link key={op.label} href={`/${slug}/propiedades`} style={{ textDecoration: 'none' }}>
              <div style={{ background: T.bg2, border: `1px solid ${T.border}`, borderRadius: T.r, padding: '28px 24px', textAlign: 'center', cursor: 'pointer' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{op.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: T.ink, marginBottom: 4 }}>{op.label}</div>
                <div style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>{op.count} disponibles</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED — horizontal scrolling property cards */}
      <section id="mapa" style={{ padding: '72px 48px', background: T.bg2, borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 13, color: T.accent, fontWeight: 600, marginBottom: 4, letterSpacing: '.01em' }}>Selección destacada</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: T.ink, margin: 0, letterSpacing: '-.02em' }}>Propiedades recomendadas</h2>
          </div>
          <Link href={`/${slug}/propiedades`} style={{ fontSize: 14, color: T.accent, background: T.accentLight, border: `1px solid ${T.accent}22`, padding: '10px 20px', borderRadius: T.r, textDecoration: 'none', fontWeight: 600 }}>
            Ver todas →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {featured.slice(0, 3).map(prop => (
            <Link key={prop.id} href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none' }}>
              <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: T.r, overflow: 'hidden', boxShadow: '0 2px 12px rgba(11,20,38,.04)' }}>
                <div style={{ position: 'relative', height: 220 }}>
                  <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, background: T.white, color: T.ink, padding: '4px 10px', borderRadius: 999, boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}>
                      {prop.operation === 'venta' ? 'Venta' : 'Alquiler'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: 12, right: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: T.accent, color: T.white, padding: '4px 10px', borderRadius: 999 }}>
                      {prop.is_featured ? 'Destacado' : ''}
                    </span>
                  </div>
                </div>
                <div style={{ padding: '20px 20px 22px' }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 4, lineHeight: 1.3 }}>{prop.title}</div>
                  <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>{prop.neighborhood} · {prop.city}</div>
                  <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
                    {prop.rooms && <span style={{ fontSize: 12, color: T.ink2, background: T.bg2, padding: '3px 10px', borderRadius: 999 }}>{prop.rooms} amb.</span>}
                    {prop.covered_area && <span style={{ fontSize: 12, color: T.ink2, background: T.bg2, padding: '3px 10px', borderRadius: 999 }}>{prop.covered_area}m²</span>}
                    {prop.bathrooms && <span style={{ fontSize: 12, color: T.ink2, background: T.bg2, padding: '3px 10px', borderRadius: 999 }}>{prop.bathrooms} baños</span>}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: '-.02em' }}>{prop.currency} {prop.price.toLocaleString('es-AR')}</div>
                    <div style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>Ver →</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: T.accent, padding: '80px 48px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(36px, 4vw, 56px)', fontWeight: 800, color: T.white, margin: '0 0 16px', letterSpacing: '-.03em' }}>
          Tu próxima propiedad, un click.
        </h2>
        <p style={{ fontSize: 17, color: 'rgba(255,255,255,.75)', marginBottom: 36, maxWidth: 460, margin: '0 auto 36px' }}>
          Coordiná una visita o consultá con nuestro equipo en minutos.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href={`/${slug}/contacto`} style={{ fontSize: 15, color: T.accent, background: T.white, padding: '14px 32px', borderRadius: T.r, textDecoration: 'none', fontWeight: 700 }}>
            Contactar ahora
          </Link>
          <Link href={`/${slug}/propiedades`} style={{ fontSize: 15, color: T.white, border: '2px solid rgba(255,255,255,.35)', padding: '13px 28px', borderRadius: T.r, textDecoration: 'none', fontWeight: 600 }}>
            Explorar propiedades
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.ink, padding: '48px 48px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40, paddingBottom: 32, borderBottom: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>{agency.name}</div>
              {agency.address && <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{agency.address}</div>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 48 }}>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>Navegar</div>
              {([['Propiedades', `/${slug}/propiedades`], ['Contacto', `/${slug}/contacto`]] as [string, string][]).map(([l, h]) => (
                <Link key={l} href={h} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,.55)', textDecoration: 'none', marginBottom: 8 }}>{l}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>Contacto</div>
              {agency.phone && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', marginBottom: 6 }}>{agency.phone}</div>}
              {agency.email && <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)' }}>{agency.email}</div>}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.1em' }}>© 2026 {agency.name}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Powered by NIMO</div>
        </div>
      </footer>
    </div>
  )
}
