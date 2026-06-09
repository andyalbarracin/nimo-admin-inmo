import Link from 'next/link'
import { PROPERTIES } from '@/lib/dummy'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#EDEBE6',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  coral: '#FF6B6B', coralLight: 'rgba(255,107,107,.08)',
}

const STATUS_STYLES = {
  available: { bg: 'rgba(45,125,95,.1)',   color: '#2D7D5F', label: 'Disponible' },
  reserved:  { bg: 'rgba(212,160,23,.12)', color: '#A07C0A', label: 'Reservado' },
  sold:      { bg: 'rgba(154,149,144,.12)', color: '#6A6A64', label: 'Vendido/Alq.' },
} as const

export default async function PropiedadesAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: LA.bg, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <div style={{ fontSize: 12, color: LA.ink3, marginBottom: 6, fontWeight: 500 }}>Panel de Control</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: LA.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Propiedades</h1>
          <p style={{ fontSize: 13, color: LA.ink2, margin: 0 }}>{PROPERTIES.length} propiedades en total</p>
        </div>
        <Link href={`/${slug}/admin/propiedades/nueva`} style={{ background: LA.coral, color: LA.white, padding: '11px 22px', borderRadius: 8, fontSize: 13, textDecoration: 'none', fontWeight: 700 }}>
          + Nueva propiedad
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['Todas', 'En venta', 'En alquiler', 'Destacadas', 'Reservadas'].map((f) => (
          <button key={f} style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: f === 'Todas' ? LA.coral : LA.white, color: f === 'Todas' ? LA.white : LA.ink2, border: `1px solid ${f === 'Todas' ? LA.coral : LA.border}`, cursor: 'pointer' }}>
            {f}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <input placeholder="Buscar propiedad…" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 8, padding: '8px 14px', color: LA.ink, fontSize: 13, outline: 'none', width: 220, fontFamily: 'inherit' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 110px 120px 100px', padding: '10px 20px', borderBottom: `1px solid ${LA.border}`, fontSize: 10, fontWeight: 700, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>
          <div>Propiedad</div><div>Precio</div><div>Ubicación</div><div>Operación</div><div>Estado</div><div>Acciones</div>
        </div>
        {PROPERTIES.map((prop, i) => {
          const statusStyle = STATUS_STYLES[prop.status as keyof typeof STATUS_STYLES] ?? STATUS_STYLES.available
          return (
            <div key={prop.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 110px 120px 100px', padding: '14px 20px', borderBottom: i < PROPERTIES.length - 1 ? `1px solid ${LA.border}` : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={prop.images[0]} alt={prop.title} style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: LA.ink }}>{prop.title}</div>
                  <div style={{ fontSize: 10, fontWeight: 600, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>{prop.type} · {prop.rooms ? `${prop.rooms} amb.` : `${prop.total_area}m²`}</div>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: LA.coral, letterSpacing: '-.01em' }}>
                {prop.currency} {prop.price.toLocaleString('es-AR')}
                {prop.operation === 'alquiler' && <span style={{ fontSize: 10, color: LA.ink3, fontWeight: 400 }}>/mes</span>}
              </div>
              <div>
                <div style={{ fontSize: 12, color: LA.ink }}>{prop.neighborhood}</div>
                <div style={{ fontSize: 11, color: LA.ink3 }}>{prop.city}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, background: prop.operation === 'venta' ? 'rgba(26,26,26,.07)' : LA.coralLight, color: prop.operation === 'venta' ? LA.ink2 : LA.coral, padding: '4px 10px', borderRadius: 999, display: 'inline-block', textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {prop.operation}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, background: statusStyle.bg, color: statusStyle.color, padding: '4px 10px', borderRadius: 999, display: 'inline-block' }}>
                {statusStyle.label}
              </span>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href={`/${slug}/admin/propiedades/${prop.id}`} style={{ fontSize: 12, color: LA.ink2, textDecoration: 'none', padding: '6px 10px', background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 6, fontWeight: 600 }}>Editar</Link>
                <Link href={`/${slug}/propiedades/${prop.id}`} target="_blank" style={{ fontSize: 12, color: LA.ink3, textDecoration: 'none', padding: '6px 10px', background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 6 }}>Ver</Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
