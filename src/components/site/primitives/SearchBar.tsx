'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  slug: string
  accent: string
  accentContrast: string
  surface: string
  border: string
  ink: string
  ink2: string
  ink3: string
  radius?: string
  variant?: 'floating' | 'hairline' | 'minimal'
}

const BARRIOS = ['Palermo', 'Belgrano', 'Recoleta', 'Caballito', 'Villa Crespo', 'Núñez', 'Colegiales', 'San Telmo', 'Flores', 'Once']
const TIPOS = ['departamento', 'casa', 'ph', 'local', 'terreno']
const PRECIOS_VENTA = ['USD 80.000', 'USD 150.000', 'USD 250.000', 'USD 400.000', 'USD 600.000+']
const PRECIOS_ALQ = ['USD 500/mes', 'USD 800/mes', 'USD 1.200/mes', 'USD 2.000/mes+']

export default function SearchBar({ slug, accent, accentContrast, surface, border, ink, ink2, ink3, radius = '8px', variant = 'floating' }: SearchBarProps) {
  const router = useRouter()
  const [op, setOp] = useState<'venta' | 'alquiler'>('venta')
  const [tipo, setTipo] = useState('')
  const [barrio, setBarrio] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (op) params.set('op', op)
    if (tipo) params.set('tipo', tipo)
    if (barrio) params.set('barrio', barrio)
    router.push(`/${slug}/propiedades?${params.toString()}`)
  }

  const selectStyle: React.CSSProperties = {
    flex: 1,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    fontSize: 14,
    color: ink,
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
    minWidth: 0,
    fontFamily: 'inherit',
  }

  if (variant === 'minimal') {
    return (
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {(['venta', 'alquiler'] as const).map((o) => (
          <button
            key={o}
            onClick={() => setOp(o)}
            style={{ padding: '8px 18px', borderRadius: radius, border: `1px solid ${op === o ? accent : border}`, background: op === o ? accent : 'transparent', color: op === o ? accentContrast : ink2, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
          >
            {o === 'venta' ? 'Comprar' : 'Alquilar'}
          </button>
        ))}
        <select value={tipo} onChange={e => setTipo(e.target.value)} style={{ ...selectStyle, border: `1px solid ${border}`, background: surface, padding: '8px 12px', borderRadius: radius, flex: 'none' }}>
          <option value="">Tipo</option>
          {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select>
        <button onClick={handleSearch} style={{ padding: '9px 22px', borderRadius: radius, background: accent, color: accentContrast, border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Buscar
        </button>
      </div>
    )
  }

  const precios = op === 'alquiler' ? PRECIOS_ALQ : PRECIOS_VENTA

  return (
    <div style={{
      background: surface,
      border: variant === 'hairline' ? `1px solid ${border}` : 'none',
      borderRadius: variant === 'floating' ? '16px' : radius,
      boxShadow: variant === 'floating' ? '0 8px 40px rgba(0,0,0,.12)' : undefined,
      overflow: 'hidden',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${border}` }}>
        {([['venta', 'Comprar'], ['alquiler', 'Alquilar']] as const).map(([val, lbl]) => (
          <button
            key={val}
            onClick={() => setOp(val)}
            style={{ flex: 1, padding: '12px', background: op === val ? surface : 'transparent', border: 'none', borderBottom: op === val ? `2px solid ${accent}` : '2px solid transparent', color: op === val ? accent : ink3, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}
          >
            {lbl}
          </button>
        ))}
      </div>
      {/* Inputs */}
      <div style={{ display: 'flex', borderBottom: `1px solid ${border}` }}>
        {/* Barrio */}
        <div style={{ flex: 1, padding: '14px 18px', borderRight: `1px solid ${border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Barrio</div>
          <select value={barrio} onChange={e => setBarrio(e.target.value)} style={selectStyle}>
            <option value="">Todos los barrios</option>
            {BARRIOS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        {/* Tipo */}
        <div style={{ flex: 1, padding: '14px 18px', borderRight: `1px solid ${border}` }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Tipo</div>
          <select value={tipo} onChange={e => setTipo(e.target.value)} style={selectStyle}>
            <option value="">Cualquier tipo</option>
            {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        {/* Precio */}
        <div style={{ flex: 1, padding: '14px 18px' }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>Precio máx.</div>
          <select style={selectStyle}>
            <option value="">Sin límite</option>
            {precios.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      {/* CTA */}
      <div style={{ padding: '14px 18px' }}>
        <button
          onClick={handleSearch}
          style={{ width: '100%', background: accent, color: accentContrast, border: 'none', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer', letterSpacing: '.01em' }}
        >
          Buscar propiedades →
        </button>
      </div>
    </div>
  )
}
