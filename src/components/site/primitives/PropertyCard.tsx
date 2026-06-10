import Image from 'next/image'
import Link from 'next/link'
import type { Property } from '@/lib/dummy'

interface PropertyCardProps {
  property: Property
  href: string
  variant?: 'grid' | 'lead' | 'compact'
  accent: string
  accentContrast: string
  surface: string
  border: string
  ink: string
  ink2: string
  ink3: string
  radius?: string
}

export default function PropertyCard({
  property: p,
  href,
  variant = 'grid',
  accent,
  accentContrast,
  surface,
  border,
  ink,
  ink2,
  ink3,
  radius = '8px',
}: PropertyCardProps) {
  if (variant === 'compact') {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'flex', gap: 12, alignItems: 'center', padding: '12px 0' }}>
        <div style={{ width: 64, height: 52, borderRadius: 4, overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
          <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="64px" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: ink, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
          <div style={{ fontSize: 11, color: ink3, marginTop: 2 }}>{p.neighborhood}</div>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: accent, flexShrink: 0 }}>
          {p.currency} {(p.price / 1000).toFixed(0)}K
        </div>
      </Link>
    )
  }

  if (variant === 'lead') {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius, overflow: 'hidden', boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}>
          <div style={{ height: 300, position: 'relative', overflow: 'hidden' }}>
            <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover', transition: 'transform .5s ease' }} sizes="(max-width: 768px) 100vw, 50vw" />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,.35) 0%, transparent 60%)' }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', gap: 6 }}>
              <span style={{ background: accent, color: accentContrast, padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {p.operation}
              </span>
            </div>
          </div>
          <div style={{ padding: '20px 22px 22px' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: accent, letterSpacing: '-.02em', marginBottom: 6 }}>
              {p.currency} {p.price.toLocaleString('es-AR')}
              {p.operation === 'alquiler' && <span style={{ fontSize: 14, fontWeight: 400, color: ink3 }}>/mes</span>}
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: ink, lineHeight: 1.35, marginBottom: 8 }}>{p.title}</div>
            <div style={{ fontSize: 12, color: ink3, marginBottom: 14 }}>📍 {p.address}</div>
            <div style={{ display: 'flex', gap: 14, paddingTop: 14, borderTop: `1px solid ${border}` }}>
              {p.rooms && <span style={{ fontSize: 12, color: ink2 }}>🛏 {p.rooms} amb.</span>}
              {p.covered_area && <span style={{ fontSize: 12, color: ink2 }}>📐 {p.covered_area}m²</span>}
              {p.bathrooms && <span style={{ fontSize: 12, color: ink2 }}>🚿 {p.bathrooms}</span>}
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // grid (default)
  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: radius, overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,.04)', height: '100%' }}>
        <div style={{ height: 200, position: 'relative', overflow: 'hidden' }}>
          <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover', transition: 'transform .4s ease' }} sizes="(max-width: 768px) 100vw, 33vw" />
          <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 5 }}>
            <span style={{ background: p.operation === 'venta' ? accent : '#4ECDC4', color: p.operation === 'venta' ? accentContrast : '#000', padding: '3px 9px', borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>
              {p.operation}
            </span>
            {p.status === 'reserved' && (
              <span style={{ background: '#F5C242', color: '#000', padding: '3px 9px', borderRadius: 999, fontSize: 10, fontWeight: 700 }}>Reservado</span>
            )}
          </div>
        </div>
        <div style={{ padding: '16px 18px 18px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: accent, marginBottom: 4, letterSpacing: '-.01em' }}>
            {p.currency} {p.price.toLocaleString('es-AR')}
            {p.operation === 'alquiler' && <span style={{ fontSize: 12, fontWeight: 400, color: ink3 }}>/mes</span>}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: ink, lineHeight: 1.3, marginBottom: 4 }}>{p.title}</div>
          <div style={{ fontSize: 11, color: ink3, marginBottom: 12 }}>📍 {p.neighborhood}</div>
          <div style={{ display: 'flex', gap: 10, borderTop: `1px solid ${border}`, paddingTop: 12 }}>
            {p.rooms && <span style={{ fontSize: 11, color: ink2 }}>🛏 {p.rooms}</span>}
            {p.covered_area && <span style={{ fontSize: 11, color: ink2 }}>📐 {p.covered_area}m²</span>}
            {p.bathrooms && <span style={{ fontSize: 11, color: ink2 }}>🚿 {p.bathrooms}</span>}
          </div>
        </div>
      </div>
    </Link>
  )
}
