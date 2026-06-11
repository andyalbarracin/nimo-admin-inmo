'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Property, Agency } from '@/lib/dummy'

const SiteMap = dynamic(() => import('@/components/site/primitives/SiteMap'), { ssr: false })

/* ============================================================
 * T2 · SPATIAL · Listado split 50/50 — réplica del mockup C4.
 * ============================================================ */

const T = {
  white: '#FFFFFF',
  pale: '#F2F2F0',
  pale2: '#E8E8E5',
  graphite: '#0A0A0A',
  graphiteSoft: '#3D3D3D',
  mute: '#7A7A78',
  rule: '#D8D8D6',
  electric: '#1F4DD6',
  electricDark: '#163BA8',
  electricSoft: '#E7ECFB',
  display: "var(--font-inter-tight), 'Inter', system-ui, sans-serif",
  mono: "var(--font-mono), ui-monospace, monospace",
}

type SortKey = 'recent' | 'price-asc' | 'price-desc'

interface Props {
  slug: string
  agency: Agency
  properties: Property[]
  op: string
  tipo: string
}

export default function SpatialListado({ slug, agency, properties, op, tipo }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sort, setSort] = useState<SortKey>('recent')

  const sorted = useMemo(() => {
    const arr = [...properties]
    if (sort === 'price-asc') arr.sort((a, b) => a.price - b.price)
    else if (sort === 'price-desc') arr.sort((a, b) => b.price - a.price)
    else arr.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
    return arr
  }, [properties, sort])

  const markers = useMemo(
    () => sorted.map(p => ({ lat: p.lat, lng: p.lng, title: p.title, price: `${p.currency} ${p.price.toLocaleString('es-AR')}`, id: p.id })),
    [sorted],
  )

  const chips = [
    op && { k: 'op', label: op, href: buildHref(slug, { op: '', tipo }) },
    tipo && { k: 'tipo', label: tipo, href: buildHref(slug, { op, tipo: '' }) },
  ].filter(Boolean) as { k: string; label: string; href: string }[]

  return (
    <div className="rwd-autoh" style={{ fontFamily: T.display, background: T.white, color: T.graphite, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* NAV */}
      <header className="rwd-pad" style={{ borderBottom: `1.5px solid ${T.graphite}`, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 32, alignItems: 'center', height: 60, padding: '0 32px', flexShrink: 0 }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.03em', textTransform: 'uppercase' }}>{agency.name.split(' ')[0]}</span>
          <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.electric }}>/ PROPIEDADES</span>
        </Link>
        <nav style={{ display: 'flex', gap: 2, justifySelf: 'center' }}>
          {['MAPA', 'PROPIEDADES', 'BARRIOS', 'DATOS'].map((l, i) => (
            <Link key={l} href={i === 1 ? `/${slug}/propiedades` : `/${slug}#${l.toLowerCase()}`} style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.1em', fontWeight: 600, color: i === 1 ? T.white : T.graphite, background: i === 1 ? T.graphite : 'transparent', textDecoration: 'none', padding: '7px 13px', borderRadius: 4 }}>[ {l} ]</Link>
          ))}
        </nav>
        <Link href={`/${slug}/contacto`} style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: T.white, background: T.electric, padding: '10px 16px', borderRadius: 6, textDecoration: 'none' }}>TASAR →</Link>
      </header>

      {/* FILTER BAR */}
      <div style={{ borderBottom: `1.5px solid ${T.graphite}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 32px', flexShrink: 0, gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>{sorted.length} resultados</span>
          {chips.length > 0 && <span style={{ width: 1, height: 16, background: T.rule }} />}
          {chips.map(c => (
            <Link key={c.k} href={c.href} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: T.mono, fontSize: 10.5, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', color: T.electricDark, background: T.electricSoft, border: `1px solid ${T.electric}`, padding: '5px 10px', borderRadius: 5, textDecoration: 'none' }}>
              {c.label} <span style={{ fontSize: 13, lineHeight: 1 }}>×</span>
            </Link>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, color: T.mute, letterSpacing: '.08em', textTransform: 'uppercase' }}>Ordenar</span>
          <select value={sort} onChange={e => setSort(e.target.value as SortKey)} style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 600, letterSpacing: '.04em', textTransform: 'uppercase', border: `1.5px solid ${T.graphite}`, background: T.white, padding: '7px 10px', borderRadius: 5, cursor: 'pointer', color: T.graphite }}>
            <option value="recent">Recientes</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
          </select>
        </div>
      </div>

      {/* SPLIT 50/50 */}
      <div className="rwd-stack rwd-autoh" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', flex: 1, minHeight: 0 }}>
        {/* LIST */}
        <div style={{ overflowY: 'auto', borderRight: `1.5px solid ${T.graphite}`, padding: 16 }}>
          {sorted.length === 0 ? (
            <div style={{ padding: '64px 24px', textAlign: 'center', fontFamily: T.mono, fontSize: 12, color: T.mute, letterSpacing: '.06em', textTransform: 'uppercase' }}>
              // Sin resultados para este filtro
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {sorted.map((p, i) => {
                const active = activeId === p.id
                return (
                  <Link
                    key={p.id}
                    href={`/${slug}/propiedades/${p.id}`}
                    onMouseEnter={() => setActiveId(p.id)}
                    onMouseLeave={() => setActiveId(null)}
                    style={{ textDecoration: 'none', color: T.graphite, border: `1.5px solid ${active ? T.electric : T.graphite}`, background: active ? T.electricSoft : T.white, borderRadius: 6, overflow: 'hidden', transition: 'background .15s, border-color .15s', display: 'block' }}
                  >
                    <div style={{ position: 'relative', height: 140, borderBottom: `1.5px solid ${active ? T.electric : T.graphite}` }}>
                      <Image src={p.images[0] ?? ''} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="25vw" />
                      <span style={{ position: 'absolute', top: 8, left: 8, fontFamily: T.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: T.electric, color: T.white, padding: '3px 7px', borderRadius: 4 }}>{i + 1}</span>
                      <span style={{ position: 'absolute', top: 8, right: 8, fontFamily: T.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: T.white, color: T.graphite, padding: '3px 7px', border: `1px solid ${T.graphite}` }}>{p.operation}</span>
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontFamily: T.mono, fontSize: 9, color: T.mute, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>{p.neighborhood}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 700, letterSpacing: '-.02em', lineHeight: 1.2, marginBottom: 10, textTransform: 'uppercase' }}>{p.title}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: T.electric, letterSpacing: '-.03em' }}>{p.currency} {p.price.toLocaleString('es-AR')}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.mute, marginTop: 6 }}>{[p.rooms && `${p.rooms} AMB`, p.covered_area && `${p.covered_area}M²`].filter(Boolean).join(' · ')}</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* MAP */}
        <div className="rwd-maph" style={{ position: 'relative' }}>
          <SiteMap markers={markers} zoom={12} height="100%" accentColor={T.electric} tiles="positron" numbered activeId={activeId} onMarkerHover={setActiveId} />
        </div>
      </div>
    </div>
  )
}

function buildHref(slug: string, params: Record<string, string>) {
  const q = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => v && q.set(k, v))
  const s = q.toString()
  return `/${slug}/propiedades${s ? `?${s}` : ''}`
}
