'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PROVINCIAS_ARGENTINA } from '@/lib/constants/neighborhoods-ar'
import CityAutocomplete from '@/components/site/city-autocomplete'

const T = {
  white: '#FFFFFF', graphite: '#0A0A0A', mute: '#7A7A78', rule: '#D8D8D6',
  electric: '#1F4DD6', electricSoft: '#E7ECFB',
  mono: "var(--font-mono), ui-monospace, monospace",
  display: "var(--font-inter-tight), 'Inter', system-ui, sans-serif",
}

const TIPOS = ['departamento', 'casa', 'ph', 'local', 'terreno', 'oficina']

export default function SpatialSearch({ slug }: { slug: string }) {
  const router = useRouter()
  const [op, setOp] = useState<'venta' | 'alquiler'>('venta')
  const [prov, setProv] = useState('')
  const [barrio, setBarrio] = useState('')
  const [cp, setCp] = useState('')
  const [tipo, setTipo] = useState('')

  const submit = () => {
    const q = new URLSearchParams()
    q.set('op', op)
    if (tipo) q.set('tipo', tipo)
    if (barrio) q.set('barrio', barrio)
    if (prov) q.set('prov', prov)
    if (cp) q.set('cp', cp)
    router.push(`/${slug}/propiedades?${q.toString()}`)
  }

  const sel: React.CSSProperties = { width: '100%', height: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: T.display, fontSize: 14, fontWeight: 600, color: T.graphite, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', padding: '0 4px' }
  const cell: React.CSSProperties = { borderRight: `1.5px solid ${T.graphite}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }
  const lab: React.CSSProperties = { fontFamily: T.mono, fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: T.mute }

  return (
    <section style={{ borderBottom: `1.5px solid ${T.graphite}`, background: T.white }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1.1fr 1.4fr 1.1fr auto', alignItems: 'stretch', borderTop: `1.5px solid ${T.graphite}` }}>
        {/* Operación toggle */}
        <div style={{ display: 'flex', borderRight: `1.5px solid ${T.graphite}` }}>
          {(['venta', 'alquiler'] as const).map(o => (
            <button key={o} onClick={() => setOp(o)} style={{ fontFamily: T.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '0 18px', border: 'none', background: op === o ? T.graphite : 'transparent', color: op === o ? T.white : T.graphite, cursor: 'pointer' }}>
              {o === 'venta' ? 'Comprar' : 'Alquilar'}
            </button>
          ))}
        </div>
        {/* Provincia */}
        <div style={cell}>
          <span style={lab}>Provincia</span>
          <select value={prov} onChange={e => setProv(e.target.value)} style={sel}>
            <option value="">Todas</option>
            {PROVINCIAS_ARGENTINA.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {/* Ciudad / barrio / CP — autocomplete híbrido */}
        <div style={cell}>
          <span style={lab}>Ciudad / barrio / CP</span>
          <CityAutocomplete
            value={barrio}
            onSelect={l => { setBarrio(l.city); if (l.province) setProv(l.province); setCp(l.cp) }}
            placeholder="Buscá ciudad o CP…"
            inputStyle={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: T.display, fontSize: 14, fontWeight: 600, color: T.graphite, padding: '2px 0' }}
            accent={T.electric} surface={T.white} ink={T.graphite} ink3={T.mute} rule={T.graphite} fontMono={T.mono} radius={0}
          />
        </div>
        {/* Tipo */}
        <div style={cell}>
          <span style={lab}>Tipo</span>
          <select value={tipo} onChange={e => setTipo(e.target.value)} style={sel}>
            <option value="">Cualquiera</option>
            {TIPOS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
          </select>
        </div>
        {/* Buscar */}
        <button onClick={submit} style={{ fontFamily: T.mono, fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: T.electric, color: T.white, border: 'none', padding: '0 32px', cursor: 'pointer' }}>
          Buscar →
        </button>
      </div>
    </section>
  )
}
