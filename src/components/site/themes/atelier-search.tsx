'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PROVINCIAS_ARGENTINA } from '@/lib/constants/neighborhoods-ar'
import CityAutocomplete from '@/components/site/city-autocomplete'

const T = {
  bone: '#F5F1EC', paper: '#FFFFFF', cocoa: '#2E2620', cocoaSoft: '#6B5D52',
  mute: '#9A8F82', rule: '#DDD5CA', sage: '#7A8264', sageDark: '#5E6B4E',
  serif: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  sans: "var(--font-sans), system-ui, sans-serif",
}
const TIPOS = ['Departamento', 'Casa', 'PH', 'Local', 'Terreno']

export default function AtelierSearch({ slug }: { slug: string }) {
  const router = useRouter()
  const [op, setOp] = useState<'venta' | 'alquiler'>('venta')
  const [prov, setProv] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [cp, setCp] = useState('')
  const [tipo, setTipo] = useState('')

  const submit = () => {
    const q = new URLSearchParams()
    q.set('op', op)
    if (tipo) q.set('tipo', tipo.toLowerCase())
    if (ciudad) q.set('barrio', ciudad)
    if (prov) q.set('prov', prov)
    if (cp) q.set('cp', cp)
    router.push(`/${slug}/propiedades?${q.toString()}`)
  }

  const lab: React.CSSProperties = { fontFamily: T.sans, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: T.mute, marginBottom: 6, display: 'block' }
  const sel: React.CSSProperties = { width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${T.rule}`, outline: 'none', fontFamily: T.serif, fontSize: 19, color: T.cocoa, cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', padding: '4px 0 8px' }

  return (
    <section style={{ padding: '0 48px', margin: '-40px auto 0', maxWidth: 1180, position: 'relative', zIndex: 5 }}>
      <div style={{ background: T.paper, boxShadow: '0 24px 70px -36px rgba(46,38,32,.28)', padding: '36px 44px' }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.sageDark }}>Buscá tu próxima propiedad</span>
          {/* Operación */}
          <div style={{ display: 'inline-flex', gap: 28, marginTop: 14, justifyContent: 'center', width: '100%' }}>
            {(['venta', 'alquiler'] as const).map(o => (
              <button key={o} onClick={() => setOp(o)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: T.serif, fontStyle: 'italic', fontSize: 22, color: op === o ? T.sageDark : T.mute, borderBottom: op === o ? `2px solid ${T.sage}` : '2px solid transparent', paddingBottom: 4 }}>
                {o === 'venta' ? 'Comprar' : 'Alquilar'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 28, alignItems: 'end' }}>
          <div>
            <label style={lab}>Provincia</label>
            <select value={prov} onChange={e => setProv(e.target.value)} style={sel}>
              <option value="">Todas</option>{PROVINCIAS_ARGENTINA.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label style={lab}>Ciudad / barrio / CP</label>
            <CityAutocomplete
              value={ciudad}
              onSelect={l => { setCiudad(l.city); if (l.province) setProv(l.province); setCp(l.cp) }}
              placeholder="Buscá ciudad o CP…"
              inputStyle={{ width: '100%', background: 'transparent', border: 'none', borderBottom: `1px solid ${T.rule}`, outline: 'none', fontFamily: T.serif, fontSize: 19, color: T.cocoa, padding: '4px 0 8px' }}
              accent={T.sageDark} surface={T.paper} ink={T.cocoa} ink3={T.mute} rule={T.rule} fontMono={T.sans} radius={0}
            />
          </div>
          <div>
            <label style={lab}>Tipo</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)} style={sel}>
              <option value="">Cualquiera</option>{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <button onClick={submit} style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: T.bone, background: T.sage, border: 'none', padding: '15px 32px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Buscar →
          </button>
        </div>
      </div>
    </section>
  )
}
