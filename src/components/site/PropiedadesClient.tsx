'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Property, Agency } from '@/lib/dummy'

const SiteMap = dynamic(() => import('@/components/site/primitives/SiteMap'), { ssr: false })

const THEMES = {
  editorial: {
    bg: '#FAF7F0', bg2: '#F1ECE2', surface: '#FFFFFF', rule: '#DBD2C2',
    ink: '#1A1614', ink2: '#5C5247', ink3: '#9E9389',
    accent: '#B25431', accentContrast: '#FAF7F0',
    serif: "var(--font-serif), Georgia, serif",
    r: '2px', tiles: 'voyager' as const,
  },
  spatial: {
    bg: '#FFFFFF', bg2: '#F2F4F8', surface: '#FFFFFF', rule: '#E0E5EF',
    ink: '#0A0A0A', ink2: '#3A4A63', ink3: '#7A8BA8',
    accent: '#1F4DD6', accentContrast: '#FFFFFF',
    serif: "var(--font-syne), Syne, system-ui, sans-serif",
    r: '12px', tiles: 'positron' as const,
  },
  atelier: {
    bg: '#F5F1EC', bg2: '#EDE7DE', surface: '#FFFFFF', rule: '#DDD5CA',
    ink: '#2E2620', ink2: '#6E6258', ink3: '#9A8F82',
    accent: '#7A8264', accentContrast: '#F5F1EC',
    serif: "var(--font-dm-serif), 'DM Serif Display', Georgia, serif",
    r: '2px', tiles: 'positron' as const,
  },
}

interface Props {
  slug: string
  agency: Agency
  properties: Property[]
  op?: string
  tipo?: string
}

const OP_LABELS = ['Todas', 'En venta', 'En alquiler']
const OP_VALS = ['', 'venta', 'alquiler']
const TIPO_LABELS = ['Todos', 'Depto', 'Casa', 'PH', 'Local', 'Terreno']
const TIPO_VALS = ['', 'departamento', 'casa', 'ph', 'local', 'terreno']

export default function PropiedadesClient({ slug, agency, properties, op = '', tipo = '' }: Props) {
  const T = THEMES[(agency.theme ?? 'editorial') as keyof typeof THEMES] ?? THEMES.editorial
  const [hovered, setHovered] = useState<string | null>(null)
  const [view, setView] = useState<'list' | 'map'>('list')

  const mapMarkers = properties.map(p => ({
    lat: p.lat, lng: p.lng,
    title: p.title,
    price: `${p.currency} ${p.price.toLocaleString('es-AR')}`,
    id: p.id,
  }))

  const makeHref = (newOp: string, newTipo: string) => {
    const params = new URLSearchParams()
    if (newOp) params.set('op', newOp)
    if (newTipo) params.set('tipo', newTipo)
    const qs = params.toString()
    return `/${slug}/propiedades${qs ? `?${qs}` : ''}`
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: T.bg, color: T.ink, minHeight: '100vh' }}>
      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.bg + 'F5', backdropFilter: 'blur(14px)', borderBottom: `1px solid ${T.rule}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: T.accentContrast, fontSize: 14 }}>
            {agency.name.charAt(0).toUpperCase()}
          </div>
          <span style={{ fontFamily: T.serif, fontWeight: 700, fontSize: 15, color: T.ink }}>{agency.name}</span>
        </Link>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href={`/${slug}/contacto`} style={{ color: T.ink2, fontSize: 14, textDecoration: 'none' }}>Contacto</Link>
          <Link href={`/${slug}/contacto`} style={{ background: T.accent, color: T.accentContrast, padding: '8px 18px', borderRadius: T.r, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Consultar
          </Link>
        </div>
      </header>

      {/* Filters bar */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.rule}`, padding: '14px 48px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Op tabs */}
        <div style={{ display: 'flex', gap: 4, background: T.bg2, padding: 4, borderRadius: T.r }}>
          {OP_VALS.map((val, i) => (
            <Link key={val} href={makeHref(val, tipo)} style={{
              padding: '7px 16px', borderRadius: T.r, fontSize: 13, fontWeight: 600, textDecoration: 'none',
              background: op === val ? T.accent : 'transparent',
              color: op === val ? T.accentContrast : T.ink2,
              transition: 'all .15s',
            }}>
              {OP_LABELS[i]}
            </Link>
          ))}
        </div>
        {/* Tipo */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TIPO_VALS.map((val, i) => (
            <Link key={val} href={makeHref(op, val)} style={{
              padding: '7px 14px', borderRadius: T.r, fontSize: 12, fontWeight: 500, textDecoration: 'none',
              background: tipo === val ? T.ink : T.surface,
              color: tipo === val ? T.accentContrast : T.ink2,
              border: `1px solid ${tipo === val ? T.ink : T.rule}`,
              transition: 'all .15s',
            }}>
              {TIPO_LABELS[i]}
            </Link>
          ))}
        </div>
        {/* Mobile toggle */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, background: T.bg2, padding: 4, borderRadius: T.r }}>
          {(['list', 'map'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} style={{
              padding: '7px 14px', borderRadius: T.r, fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
              background: view === v ? T.accent : 'transparent',
              color: view === v ? T.accentContrast : T.ink2,
            }}>
              {v === 'list' ? 'Lista' : 'Mapa'}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div style={{ padding: '16px 48px 0', fontSize: 12, color: T.ink3 }}>
        <span style={{ fontWeight: 600, color: T.ink }}>{properties.length}</span> {properties.length === 1 ? 'propiedad' : 'propiedades'} encontradas
      </div>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '42% 58%', height: 'calc(100vh - 160px)', minHeight: 600 }}>
        {/* List panel */}
        <div style={{ overflowY: 'auto', padding: '16px 48px 48px 48px', display: view === 'map' ? 'none' : undefined }}>
          {properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 16, color: T.ink3 }}>◉</div>
              <div style={{ fontSize: 16, color: T.ink3, marginBottom: 20 }}>Sin resultados con esos filtros.</div>
              <Link href={`/${slug}/propiedades`} style={{ color: T.accent, fontWeight: 600, textDecoration: 'none' }}>Ver todas</Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {properties.map(prop => (
                <Link
                  key={prop.id}
                  href={`/${slug}/propiedades/${prop.id}`}
                  onMouseEnter={() => setHovered(prop.id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article style={{
                    background: T.surface,
                    border: `1.5px solid ${hovered === prop.id ? T.accent : T.rule}`,
                    borderRadius: T.r,
                    overflow: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: '160px 1fr',
                    boxShadow: hovered === prop.id ? `0 4px 20px ${T.accent}22` : '0 1px 6px rgba(0,0,0,.04)',
                    transition: 'all .18s ease',
                  }}>
                    <div style={{ position: 'relative', height: 140 }}>
                      <Image
                        src={prop.images[0] ?? ''}
                        alt={prop.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="160px"
                      />
                      <div style={{ position: 'absolute', top: 8, left: 8 }}>
                        <span style={{ fontSize: 9, fontWeight: 700, background: T.accent, color: T.accentContrast, padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '.06em' }}>
                          {prop.operation === 'venta' ? 'Venta' : 'Alquiler'}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 11, color: T.ink3, marginBottom: 4 }}>{prop.neighborhood}</div>
                        <div style={{ fontFamily: T.serif, fontSize: 14, fontWeight: 700, color: T.ink, lineHeight: 1.25, marginBottom: 8 }}>{prop.title}</div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                          {prop.rooms && <span style={{ fontSize: 11, color: T.ink3 }}>{prop.rooms} amb.</span>}
                          {prop.covered_area && <span style={{ fontSize: 11, color: T.ink3 }}>{prop.covered_area} m²</span>}
                          {prop.bathrooms && <span style={{ fontSize: 11, color: T.ink3 }}>{prop.bathrooms} ba.</span>}
                        </div>
                        <div style={{ fontFamily: T.serif, fontSize: 18, fontWeight: 700, color: T.accent }}>
                          {prop.currency} {prop.price.toLocaleString('es-AR')}
                          {prop.operation === 'alquiler' && <span style={{ fontSize: 11, fontWeight: 400, color: T.ink3 }}>/mes</span>}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Map panel */}
        <div style={{ position: 'sticky', top: 160, display: view === 'list' ? undefined : 'block', height: 'calc(100vh - 160px)' }}>
          <SiteMap
            markers={mapMarkers}
            zoom={12}
            height="100%"
            accentColor={T.accent}
            tiles={T.tiles}
          />
        </div>
      </div>
    </div>
  )
}
