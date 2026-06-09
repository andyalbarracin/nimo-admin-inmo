import Link from 'next/link'
import { PROPERTIES, AGENCIES } from '@/lib/dummy'

const themeStyles = {
  editorial: {
    bg: '#F7F3EE', surface: '#FFFFFF', border: '#DDD5C8',
    ink: '#1E1A16', ink2: '#4D453C', ink3: '#9E9389',
    accent: '#7B4F3C', accentContrast: '#F7F3EE', navBg: 'rgba(247,243,238,.94)',
    pill: { active: { bg: '#7B4F3C', color: '#F7F3EE' }, inactive: { bg: '#FFFFFF', color: '#4D453C', border: '#DDD5C8' } },
    r: '4px', fontWeight: 700,
  },
  spatial: {
    bg: '#F4F6FA', surface: '#FFFFFF', border: '#E0E5EF',
    ink: '#0B1426', ink2: '#3A4A63', ink3: '#7A8BA8',
    accent: '#2B5FE8', accentContrast: '#FFFFFF', navBg: 'rgba(244,246,250,.96)',
    pill: { active: { bg: '#2B5FE8', color: '#FFFFFF' }, inactive: { bg: '#FFFFFF', color: '#3A4A63', border: '#E0E5EF' } },
    r: '999px', fontWeight: 600,
  },
  loft: {
    bg: '#141412', surface: '#222220', border: '#363633',
    ink: '#EDE9E0', ink2: '#B0A898', ink3: '#6E6860',
    accent: '#C8A05E', accentContrast: '#141412', navBg: 'rgba(20,20,18,.94)',
    pill: { active: { bg: '#C8A05E', color: '#141412' }, inactive: { bg: '#222220', color: '#B0A898', border: '#363633' } },
    r: '2px', fontWeight: 600,
  },
}

export default async function PropiedadesPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ op?: string; tipo?: string; q?: string }>
}) {
  const { slug } = await params
  const { op, tipo } = await searchParams

  const agency = AGENCIES.find(a => a.slug === slug)
  const T = themeStyles[agency?.theme ?? 'editorial'] ?? themeStyles.editorial

  let props = PROPERTIES
  if (op) props = props.filter(p => p.operation === op)
  if (tipo) props = props.filter(p => p.type === tipo)

  const filters = [
    { label: 'Todas', href: `/${slug}/propiedades` },
    { label: 'En venta', href: `/${slug}/propiedades?op=venta` },
    { label: 'En alquiler', href: `/${slug}/propiedades?op=alquiler` },
    { label: 'Casas', href: `/${slug}/propiedades?tipo=casa` },
    { label: 'Departamentos', href: `/${slug}/propiedades?tipo=departamento` },
    { label: 'PH', href: `/${slug}/propiedades?tipo=ph` },
  ]

  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: T.bg, color: T.ink, minHeight: '100vh' }}>
      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.navBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.border}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: T.accentContrast, fontSize: 15 }}>
            {(agency?.name ?? slug).charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: T.ink }}>{agency?.name ?? slug}</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href={`/${slug}/propiedades`} style={{ color: T.accent, fontSize: 14, textDecoration: 'none', fontWeight: 700 }}>Propiedades</Link>
          <Link href={`/${slug}/contacto`} style={{ color: T.ink2, fontSize: 14, textDecoration: 'none' }}>Contacto</Link>
          <Link href={`/${slug}/contacto`} style={{ background: T.accent, color: T.accentContrast, padding: '8px 18px', borderRadius: T.r === '999px' ? '999px' : '8px', fontSize: 13, fontWeight: T.fontWeight, textDecoration: 'none' }}>
            Consultar
          </Link>
        </nav>
      </header>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 48px 80px' }}>
        {/* Title + filters */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-.02em', color: T.ink, margin: '0 0 20px' }}>
            {op === 'venta' ? 'Propiedades en venta' : op === 'alquiler' ? 'Propiedades en alquiler' : 'Todas las propiedades'}
          </h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {filters.map((f) => {
              const currentFilter = `/${slug}/propiedades${op ? `?op=${op}` : ''}${tipo ? `?tipo=${tipo}` : ''}`
              const isActive = f.href === currentFilter || (f.href === `/${slug}/propiedades` && !op && !tipo)
              const style = isActive ? T.pill.active : T.pill.inactive
              return (
                <Link key={f.label} href={f.href} style={{
                  padding: '8px 16px', borderRadius: T.r === '999px' ? '999px' : '8px', fontSize: 13,
                  fontWeight: isActive ? T.fontWeight : 400, textDecoration: 'none',
                  background: style.bg, color: style.color,
                  border: `1px solid ${'border' in style ? style.border : 'transparent'}`,
                }}>
                  {f.label}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Results count */}
        <div style={{ fontSize: 13, color: T.ink3, marginBottom: 24 }}>
          {props.length} {props.length === 1 ? 'propiedad encontrada' : 'propiedades encontradas'}
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {props.map((prop) => (
            <Link key={prop.id} href={`/${slug}/propiedades/${prop.id}`} style={{ textDecoration: 'none' }}>
              <article style={{ background: T.surface, borderRadius: T.r === '999px' ? '16px' : T.r === '2px' ? '2px' : '12px', overflow: 'hidden', border: `1px solid ${T.border}`, boxShadow: T.bg === '#141412' ? 'none' : '0 2px 12px rgba(0,0,0,.04)' }}>
                <div style={{ height: 220, overflow: 'hidden', position: 'relative' }}>
                  <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
                    <span style={{ background: prop.operation === 'venta' ? T.accent : '#4ECDC4', color: prop.operation === 'venta' ? T.accentContrast : '#000', padding: '4px 10px', borderRadius: '999px', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      {prop.operation}
                    </span>
                    {prop.status === 'reserved' && (
                      <span style={{ background: '#F5C242', color: '#000', padding: '4px 10px', borderRadius: '999px', fontSize: 11, fontWeight: 700 }}>Reservado</span>
                    )}
                  </div>
                </div>
                <div style={{ padding: '20px 20px 18px' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: T.accent, marginBottom: 6, letterSpacing: '-.01em' }}>
                    {prop.currency} {prop.price.toLocaleString('es-AR')}
                    {prop.operation === 'alquiler' && <span style={{ fontSize: 14, fontWeight: 400, color: T.ink3 }}>/mes</span>}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, lineHeight: 1.3, marginBottom: 6 }}>{prop.title}</div>
                  <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>📍 {prop.address}</div>
                  <div style={{ display: 'flex', gap: 12, borderTop: `1px solid ${T.border}`, paddingTop: 14 }}>
                    {prop.rooms && <span style={{ fontSize: 12, color: T.ink2 }}>🛏 {prop.rooms} amb.</span>}
                    {prop.covered_area && <span style={{ fontSize: 12, color: T.ink2 }}>📐 {prop.covered_area}m²</span>}
                    {prop.bathrooms && <span style={{ fontSize: 12, color: T.ink2 }}>🚿 {prop.bathrooms} baños</span>}
                    {!prop.rooms && prop.total_area && <span style={{ fontSize: 12, color: T.ink2 }}>📐 {prop.total_area}m²</span>}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {props.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 18, color: T.ink3 }}>No encontramos propiedades con esos filtros.</div>
            <Link href={`/${slug}/propiedades`} style={{ display: 'inline-block', marginTop: 20, color: T.accent, textDecoration: 'none', fontWeight: 600 }}>
              Ver todas las propiedades
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
