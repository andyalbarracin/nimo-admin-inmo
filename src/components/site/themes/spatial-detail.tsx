'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Property, Agency } from '@/lib/dummy'

const SiteMap = dynamic(() => import('@/components/site/primitives/SiteMap'), { ssr: false })

/* ============================================================
 * T2 · SPATIAL · Detalle — réplica del mockup C5.
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

const SLOTS = ['Jue 11 · 11:00', 'Sáb 13 · 10:00', 'Sáb 13 · 12:00', 'Lun 15 · 16:00']
const MESES = ['JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC', 'ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN']
const BARS = [58, 60, 59, 64, 66, 63, 70, 74, 72, 80, 86, 92]

interface Props {
  slug: string
  agency: Agency
  prop: Property
  related: Property[]
}

export default function SpatialDetail({ slug, agency, prop, related }: Props) {
  const [slot, setSlot] = useState(1)

  const priceLabel = `${prop.currency} ${prop.price.toLocaleString('es-AR')}`
  const m2Price = prop.total_area ? Math.round(prop.price / prop.total_area) : null
  const images = prop.images.length ? prop.images : ['']
  const gallery = images.slice(0, 5)
  const extra = Math.max(0, images.length - 5)

  const specs: [string, string, string?][] = [
    ['SUP. TOTAL', String(prop.total_area ?? '—'), 'M²'],
    ['SUP. CUBIERTA', String(prop.covered_area ?? '—'), 'M²'],
    ['DORMITORIOS', String(prop.rooms ?? '—')],
    ['BAÑOS', String(prop.bathrooms ?? '—')],
    ['OPERACIÓN', prop.operation.toUpperCase()],
    ['TIPO', prop.type.toUpperCase()],
    ['BARRIO', prop.neighborhood.toUpperCase()],
    ['ESTADO', prop.status === 'available' ? 'DISPONIBLE' : prop.status === 'reserved' ? 'RESERVADA' : 'VENDIDA'],
  ]

  const POIS: [string, string, string][] = [
    ['350 M', 'PLAZA DEL BARRIO', 'VERDE'],
    ['600 M', 'ESTACIÓN DE TREN', 'TRANSPORTE'],
    ['800 M', 'AVENIDA + SUBTE', 'TRANSPORTE'],
    ['1.1 KM', 'POLO GASTRONÓMICO', 'GASTRO'],
    ['1.4 KM', 'COSTANERA', 'VERDE'],
    ['2.0 KM', 'CENTRO COMERCIAL', 'SERVICIOS'],
  ]

  const refNum = prop.id.replace(/\D/g, '')

  return (
    <div style={{ fontFamily: T.display, background: T.white, color: T.graphite, minHeight: '100vh', maxWidth: 1440, margin: '0 auto' }}>
      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(10px)', borderBottom: `1.5px solid ${T.graphite}`, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 40, alignItems: 'center', height: 64, padding: '0 40px' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.03em', textTransform: 'uppercase' }}>{agency.name.split(' ')[0]}</span>
          <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric }}>/ PROPIEDADES</span>
        </Link>
        <nav style={{ display: 'flex', gap: 2, justifySelf: 'center' }}>
          {['MAPA', 'PROPIEDADES', 'BARRIOS', 'DATOS'].map((l, i) => (
            <Link key={l} href={i === 1 ? `/${slug}/propiedades` : `/${slug}#${l.toLowerCase()}`} style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.1em', fontWeight: 600, color: i === 1 ? T.white : T.graphite, background: i === 1 ? T.graphite : 'transparent', textDecoration: 'none', padding: '8px 14px', borderRadius: 4 }}>[ {l} ]</Link>
          ))}
        </nav>
        <Link href={`/${slug}/contacto`} style={{ fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: T.white, background: T.electric, padding: '11px 18px', borderRadius: 6, textDecoration: 'none' }}>TASAR MI PROPIEDAD →</Link>
      </header>

      {/* BREADCRUMB */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 40px', borderBottom: `1.5px solid ${T.graphite}`, fontFamily: T.mono, fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: T.mute, fontWeight: 600 }}>
        <span><Link href={`/${slug}/propiedades`} style={{ color: T.electric, textDecoration: 'none' }}>← Volver al listado</Link> &nbsp;//&nbsp; {prop.neighborhood} / {prop.type} / <b style={{ color: T.graphite }}>#{refNum}</b></span>
        <div style={{ display: 'flex', gap: 10 }}>
          {['GUARDAR ☆', 'COMPARTIR ↗', 'FICHA PDF ↓'].map(a => (
            <span key={a} style={{ color: T.graphite, cursor: 'pointer' }}>[ {a} ]</span>
          ))}
        </div>
      </div>

      {/* HEADER strip */}
      <header style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end', padding: '40px 40px 28px', borderBottom: `1.5px solid ${T.graphite}` }}>
        <div>
          <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.1em', color: T.electric, fontWeight: 700, textTransform: 'uppercase' }}>// {prop.operation} · {prop.type} · {prop.neighborhood}</span>
          <h1 style={{ fontSize: 'clamp(38px, 4.4vw, 56px)', fontWeight: 800, lineHeight: 0.94, letterSpacing: '-.04em', textTransform: 'uppercase', margin: '14px 0 10px', maxWidth: 760 }}>{prop.title}</h1>
          <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.06em', color: T.graphiteSoft, textTransform: 'uppercase', fontWeight: 600 }}>{prop.address} &nbsp;//&nbsp; {prop.lat.toFixed(4)}, {prop.lng.toFixed(4)}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', color: T.mute, textTransform: 'uppercase' }}>// Precio publicado</span>
          <div style={{ fontSize: 'clamp(34px, 3.6vw, 52px)', fontWeight: 800, letterSpacing: '-.04em', color: T.electric, lineHeight: 1, marginTop: 8 }}>{priceLabel}</div>
          {m2Price && <span style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '.06em', color: T.mute, marginTop: 8, display: 'block' }}>{prop.currency} {m2Price.toLocaleString('es-AR')}/M²</span>}
        </div>
      </header>

      {/* GALLERY */}
      <section style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: '240px 240px', borderBottom: `1.5px solid ${T.graphite}` }}>
        {gallery.map((img, i) => (
          <div key={i} style={{ position: 'relative', gridRow: i === 0 ? 'span 2' : undefined, borderRight: i === 0 || i === 1 || i === 3 ? `1.5px solid ${T.graphite}` : 'none', borderBottom: i === 1 || i === 2 ? `1.5px solid ${T.graphite}` : 'none' }}>
            <Image src={img} alt={`${prop.title} ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes={i === 0 ? '50vw' : '25vw'} priority={i === 0} />
            <span style={{ position: 'absolute', top: 12, left: 12, fontFamily: T.mono, fontSize: 9.5, letterSpacing: '.08em', background: 'rgba(255,255,255,.92)', padding: '3px 7px', borderRadius: 3, fontWeight: 700 }}>{String(i + 1).padStart(2, '0')}{i === 0 ? ` / ${images.length}` : ''}</span>
            {i === gallery.length - 1 && extra > 0 && (
              <span style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,.62)', display: 'grid', placeItems: 'center', color: 'white', fontFamily: T.mono, fontSize: 12, letterSpacing: '.1em', fontWeight: 700 }}>[ + {extra} FOTOS ]</span>
            )}
          </div>
        ))}
      </section>

      {/* BODY */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr' }}>
        {/* MAIN */}
        <div style={{ borderRight: `1.5px solid ${T.graphite}` }}>
          {/* FICHA */}
          <section style={{ padding: '40px 40px', borderBottom: `1.5px solid ${T.graphite}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric, fontWeight: 700, letterSpacing: '.08em' }}>/// 01 — FICHA</span>
            <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: '12px 0 24px' }}>Especificaciones</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: `1.5px solid ${T.graphite}` }}>
              {specs.map(([k, v, u], i) => (
                <div key={k} style={{ padding: '18px 20px', borderRight: (i + 1) % 4 !== 0 ? `1.5px solid ${T.graphite}` : 'none', borderBottom: i < 4 ? `1.5px solid ${T.graphite}` : 'none' }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9.5, letterSpacing: '.1em', color: T.mute, textTransform: 'uppercase' }}>{k}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.025em', marginTop: 6 }}>{v}{u && <span style={{ fontSize: 13, color: T.mute }}> {u}</span>}</div>
                </div>
              ))}
            </div>
          </section>

          {/* DESCRIPCIÓN */}
          <section style={{ padding: '40px 40px', borderBottom: `1.5px solid ${T.graphite}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric, fontWeight: 700, letterSpacing: '.08em' }}>/// 02 — DESCRIPCIÓN</span>
            <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: '12px 0 24px' }}>La propiedad</h2>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: T.graphiteSoft, margin: '0 0 18px', maxWidth: 640 }}>{prop.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 24 }}>
              {prop.features.map((f, i) => (
                <span key={f} style={{ padding: '8px 13px', border: `1.5px solid ${i < 3 ? T.electric : T.rule}`, borderRadius: 5, fontFamily: T.mono, fontSize: 10.5, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, color: i < 3 ? T.electricDark : T.graphiteSoft, background: i < 3 ? T.electricSoft : 'transparent' }}>{f}</span>
              ))}
            </div>
          </section>

          {/* UBICACIÓN */}
          <section style={{ padding: '40px 40px', borderBottom: `1.5px solid ${T.graphite}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric, fontWeight: 700, letterSpacing: '.08em' }}>/// 03 — UBICACIÓN</span>
            <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: '12px 0 24px' }}>El entorno</h2>
            <div style={{ height: 360, border: `1.5px solid ${T.graphite}`, position: 'relative' }}>
              <SiteMap markers={[{ lat: prop.lat, lng: prop.lng, title: prop.title, price: priceLabel, id: prop.id }]} center={{ lat: prop.lat, lng: prop.lng }} zoom={15} height="100%" accentColor={T.electric} tiles="positron" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: `1.5px solid ${T.graphite}`, borderTop: 'none' }}>
              {POIS.map(([d, name, cat], i) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 12, padding: '12px 18px', fontFamily: T.mono, fontSize: 11, letterSpacing: '.04em', borderBottom: i < POIS.length - 2 ? `1px solid ${T.rule}` : 'none', borderRight: i % 2 === 0 ? `1.5px solid ${T.graphite}` : 'none', alignItems: 'center', textTransform: 'uppercase' }}>
                  <span style={{ color: T.electric, fontWeight: 700 }}>{d}</span>
                  <b style={{ color: T.graphite, fontWeight: 700 }}>{name}</b>
                  <span style={{ color: T.mute }}>{cat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* DATOS DEL BARRIO */}
          <section style={{ padding: '40px 40px' }}>
            <span style={{ fontFamily: T.mono, fontSize: 11, color: T.electric, fontWeight: 700, letterSpacing: '.08em' }}>/// 04 — DATOS DEL BARRIO</span>
            <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: '12px 0 24px' }}>USD/M² en {prop.neighborhood}</h2>
            <div style={{ border: `1.5px solid ${T.graphite}`, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 18, fontFamily: T.mono, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600, color: T.mute }}>
                <span>// Evolución 12 meses</span>
                <span><b style={{ fontSize: 26, letterSpacing: '-.03em', color: T.graphite, fontWeight: 800 }}>USD 2.420</b> /M² · ↑ 2.1%</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, alignItems: 'end', height: 140 }}>
                {BARS.map((h, i) => (
                  <div key={i} style={{ height: `${h}%`, background: i === BARS.length - 1 ? T.electric : T.pale2, borderRadius: '3px 3px 0 0' }} />
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, fontFamily: T.mono, fontSize: 8.5, color: T.mute, textAlign: 'center', marginTop: 8, letterSpacing: '.04em' }}>
                {MESES.map(m => <span key={m}>{m}</span>)}
              </div>
            </div>
            {m2Price && (
              <p style={{ fontFamily: T.mono, fontSize: 10.5, letterSpacing: '.06em', color: T.mute, margin: '14px 0 0', textTransform: 'uppercase' }}>
                // Esta propiedad: USD {m2Price.toLocaleString('es-AR')}/M²
              </p>
            )}
          </section>
        </div>

        {/* SIDE */}
        <aside style={{ position: 'sticky', top: 64, alignSelf: 'start' }}>
          <div style={{ padding: 32, borderBottom: `1.5px solid ${T.graphite}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', color: T.electric, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>// Agendar visita</span>
            <h3 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.025em', textTransform: 'uppercase', margin: '0 0 16px' }}>Coordinar ahora</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
              {SLOTS.map((s, i) => (
                <button key={s} onClick={() => setSlot(i)} style={{ padding: '10px 8px', border: `1.5px solid ${slot === i ? T.electric : T.rule}`, background: slot === i ? T.electric : 'transparent', color: slot === i ? T.white : T.graphite, borderRadius: 5, textAlign: 'center', fontFamily: T.mono, fontSize: 10, letterSpacing: '.04em', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase' }}>{s}</button>
              ))}
            </div>
            <Link href={`/${slug}/contacto`} style={{ display: 'block', textAlign: 'center', background: T.electric, color: T.white, padding: '13px', borderRadius: 6, textDecoration: 'none', fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>Confirmar visita →</Link>
            {agency.phone && (
              <a href={`https://wa.me/${agency.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, me interesa ${prop.title}`)}`} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', border: `1.5px solid ${T.graphite}`, color: T.graphite, padding: '12px', borderRadius: 6, textDecoration: 'none', fontFamily: T.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase' }}>WhatsApp directo</a>
            )}
          </div>

          <div style={{ padding: 32, borderBottom: `1.5px solid ${T.graphite}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', color: T.electric, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>// Tu contacto</span>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: 8, background: T.electricSoft, border: `1.5px solid ${T.graphite}`, display: 'grid', placeItems: 'center', fontWeight: 800, color: T.electric, fontSize: 18, flexShrink: 0 }}>{prop.agent.split(' ').map(n => n[0]).slice(0, 2).join('')}</div>
              <div>
                <b style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-.02em', display: 'block', textTransform: 'uppercase' }}>{prop.agent}</b>
                <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.06em', color: T.mute, textTransform: 'uppercase', display: 'block', marginTop: 3 }}>BROKER · {prop.neighborhood}</span>
                <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.06em', color: T.electric, textTransform: 'uppercase', display: 'block', marginTop: 2 }}>RESPONDE EN ~22 MIN</span>
              </div>
            </div>
          </div>

          <div style={{ padding: 32, borderBottom: `1.5px solid ${T.graphite}` }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', color: T.electric, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 16 }}>// Documentos</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <a href={`/api/pdf/propiedad/${prop.id}?slug=${slug}`} target="_blank" rel="noreferrer" style={{ border: `1.5px solid ${T.electric}`, background: T.electricSoft, color: T.electricDark, padding: '10px', borderRadius: 5, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: '.04em', textAlign: 'center', textDecoration: 'none' }}>FICHA PDF ↓</a>
              {['PLANO ↓', 'REGLAMENTO ↓', 'EXPENSAS ↓'].map(d => (
                <button key={d} style={{ border: `1.5px solid ${T.graphite}`, background: T.white, color: T.graphite, padding: '10px', borderRadius: 5, fontFamily: T.mono, fontSize: 10, fontWeight: 700, letterSpacing: '.04em', cursor: 'pointer' }}>{d}</button>
              ))}
            </div>
          </div>

          <div style={{ padding: 32 }}>
            <span style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '.1em', color: T.electric, fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>// ID ficha</span>
            <div style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '.06em', color: T.graphiteSoft, lineHeight: 1.8, textTransform: 'uppercase' }}>
              REF: #{refNum}<br />
              PUBLICADO: {new Date(prop.created_at).toLocaleDateString('es-AR')}<br />
              ESTADO: {prop.status === 'available' ? 'DISPONIBLE' : prop.status === 'reserved' ? 'RESERVADA' : 'VENDIDA'}
            </div>
          </div>
        </aside>
      </div>

      {/* SIMILARES */}
      {related.length > 0 && (
        <section style={{ padding: '40px 40px', borderTop: `1.5px solid ${T.graphite}` }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase', margin: '0 0 24px' }}>Propiedades similares</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0, border: `1.5px solid ${T.graphite}` }}>
            {related.map((r, i) => (
              <Link key={r.id} href={`/${slug}/propiedades/${r.id}`} style={{ textDecoration: 'none', color: T.graphite, borderRight: i < related.length - 1 ? `1.5px solid ${T.graphite}` : 'none' }}>
                <div style={{ position: 'relative', height: 180, borderBottom: `1.5px solid ${T.graphite}` }}>
                  <Image src={r.images[0] ?? ''} alt={r.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                </div>
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.mute, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 6 }}>{r.neighborhood}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1.2, marginBottom: 10 }}>{r.title}</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: T.electric, letterSpacing: '-.03em' }}>{r.currency} {r.price.toLocaleString('es-AR')}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
