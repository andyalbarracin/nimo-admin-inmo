'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { QRCodeSVG } from 'qrcode.react'
import type { Property, Agency } from '@/lib/dummy'
import SiteFooter from '@/components/site/primitives/SiteFooter'
import Lightbox from '@/components/site/lightbox'
import QrDownload from '@/components/site/qr-download'

const SiteMap = dynamic(() => import('@/components/site/primitives/SiteMap'), { ssr: false })

/* ============================================================
 * T1 · EDITORIAL · Detalle de propiedad — réplica del mockup C2.
 * ============================================================ */

const T = {
  bg: '#FAF7F0',
  bg2: '#F1ECE2',
  paper: '#FFFFFF',
  rule: '#DBD2C2',
  ruleSoft: '#ECE5D5',
  ink: '#1A1614',
  ink2: '#5C5247',
  ink3: '#8A8071',
  rust: '#B25431',
  rustDark: '#8C3F22',
  rustSoft: '#E8D2C2',
  serif: "var(--font-fraunces), 'Playfair Display', Georgia, serif",
  body: "var(--font-sans), system-ui, sans-serif",
  mono: "var(--font-mono), ui-monospace, monospace",
}

const VISIT_SLOTS = ['Jue 11 · 11:00', 'Sáb 13 · 10:00', 'Sáb 13 · 12:00', 'Lun 15 · 16:00']

interface Props {
  slug: string
  agency: Agency
  prop: Property
  related: Property[]
}

export default function EditorialDetail({ slug, agency, prop, related }: Props) {
  const [slot, setSlot] = useState(1)
  const [open, setOpen] = useState<number | null>(0)
  const [lightbox, setLightbox] = useState<number | null>(null)

  const images = prop.images.length ? prop.images : ['']
  const main = images[0] ?? ''
  const thumbs = images.slice(1, 4)
  const extra = Math.max(0, images.length - 4)

  const priceLabel = `${prop.currency} ${prop.price.toLocaleString('es-AR')}`
  const m2Price = prop.total_area ? Math.round(prop.price / prop.total_area) : null
  const url = `https://${slug}.nimo.app/propiedades/${prop.id}`

  const ficha: [string, string][] = [
    ['Operación', prop.operation],
    ['Tipo', prop.type],
    prop.rooms ? ['Ambientes', String(prop.rooms)] : ['Ambientes', '—'],
    prop.bathrooms ? ['Baños', String(prop.bathrooms)] : ['Baños', '—'],
    prop.covered_area ? ['Sup. cubierta', `${prop.covered_area} m²`] : ['Sup. cubierta', '—'],
    prop.total_area ? ['Sup. total', `${prop.total_area} m²`] : ['Sup. total', '—'],
    ['Barrio', prop.neighborhood],
    ['Estado', prop.status === 'available' ? 'Disponible' : prop.status === 'reserved' ? 'Reservada' : 'Vendida'],
  ]

  const detalles: [string, string][] = [
    ['Expensas', prop.operation === 'alquiler' ? 'Incluidas en consulta' : 'A confirmar'],
    ['Orientación', 'Norte / Frente'],
    ['Antigüedad', 'Consultar con el asesor'],
    ['Disponibilidad', 'Entrega inmediata'],
  ]

  const POIS: [string, string, string][] = [
    ['350 m', 'Plaza del barrio', 'Verde'],
    ['600 m', 'Estación de subte', 'Transporte'],
    ['800 m', 'Avenida comercial', 'Servicios'],
    ['1.1 km', 'Polo gastronómico', 'Gastro'],
  ]

  return (
    <div className="site-theme" style={{ fontFamily: T.body, background: T.bg, color: T.ink, minHeight: '100vh' }}>
      {/* ── NAV con borde ── */}
      <header className="rwd-pad" style={{ position: 'sticky', top: 0, zIndex: 50, background: T.bg + 'F2', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.ink}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ fontFamily: T.serif, fontWeight: 600, fontSize: 22, color: T.ink, textDecoration: 'none', letterSpacing: '-.01em' }}>
          {agency.name.split(' ')[0]}{' '}
          <em style={{ fontStyle: 'italic', color: T.rust }}>{agency.name.split(' ').slice(1).join(' ') || 'Propiedades'}</em>
        </Link>
        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.mono, fontSize: 11, color: T.ink2, textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase' }}>← Volver al listado</Link>
          <Link href={`/${slug}/contacto`} style={{ fontFamily: T.mono, fontSize: 11, color: T.bg, background: T.rust, padding: '9px 18px', borderRadius: 99, textDecoration: 'none', letterSpacing: '.08em', textTransform: 'uppercase' }}>Consultar</Link>
        </nav>
      </header>

      {/* ── HEADER 2-col ── */}
      <section className="rwd-stack" style={{ padding: '48px 48px 32px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end', borderBottom: `1px solid ${T.rule}` }}>
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 11, color: T.rust, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 14 }}>
            {prop.operation} · {prop.type} · {prop.neighborhood}, {prop.city}
          </div>
          <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(40px, 4.6vw, 68px)', fontWeight: 400, lineHeight: 0.98, letterSpacing: '-.025em', margin: '0 0 14px', maxWidth: 720 }}>
            {prop.title}
          </h1>
          <div style={{ fontSize: 14, color: T.ink2 }}>{prop.address}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, letterSpacing: '.1em', textTransform: 'uppercase' }}>Precio</div>
          <div style={{ fontFamily: T.serif, fontSize: 'clamp(34px, 3.4vw, 52px)', color: T.rust, fontWeight: 500, lineHeight: 1, marginTop: 8, letterSpacing: '-.02em' }}>{priceLabel}</div>
          {m2Price && <div style={{ fontFamily: T.mono, fontSize: 11, color: T.ink3, marginTop: 8 }}>{prop.currency} {m2Price.toLocaleString('es-AR')}/m²</div>}
        </div>
      </section>

      {/* ── GALERÍA ── */}
      <section className="rwd-gallery" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 4, padding: '4px 48px 0', height: 520 }}>
        <button onClick={() => setLightbox(0)} style={{ position: 'relative', border: 'none', padding: 0, cursor: 'pointer', overflow: 'hidden', borderRadius: 4 }}>
          <Image src={main} alt={prop.title} fill style={{ objectFit: 'cover' }} sizes="70vw" priority />
        </button>
        <div style={{ display: 'grid', gridTemplateRows: 'repeat(3, 1fr)', gap: 4 }}>
          {thumbs.map((img, i) => (
            <button key={i} onClick={() => setLightbox(i + 1)} style={{ position: 'relative', border: 'none', padding: 0, cursor: 'pointer', overflow: 'hidden', borderRadius: 4 }}>
              <Image src={img} alt={`${prop.title} ${i + 2}`} fill style={{ objectFit: 'cover' }} sizes="320px" />
              {i === thumbs.length - 1 && extra > 0 && (
                <span style={{ position: 'absolute', inset: 0, background: 'rgba(26,22,20,.6)', display: 'grid', placeItems: 'center', color: T.bg, fontFamily: T.mono, fontSize: 13, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                  + {extra} fotos
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ── BODY ── */}
      <div className="rwd-stack rwd-pad" style={{ display: 'grid', gridTemplateColumns: '1.55fr 1fr', gap: 56, padding: '56px 48px 80px', alignItems: 'start' }}>
        {/* LEFT */}
        <div>
          {/* Ficha técnica */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, margin: '0 0 24px', letterSpacing: '-.02em' }}>
              Ficha <em style={{ fontStyle: 'italic', color: T.rust }}>técnica</em>
            </h2>
            <div className="rwd-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px' }}>
              {ficha.map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '14px 0', borderBottom: `1px solid ${T.rule}` }}>
                  <span style={{ fontFamily: T.mono, fontSize: 10.5, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{k}</span>
                  <span style={{ fontFamily: T.serif, fontSize: 17, color: T.ink, textTransform: 'capitalize' }}>{v}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Descripción */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, margin: '0 0 24px', letterSpacing: '-.02em' }}>
              La <em style={{ fontStyle: 'italic', color: T.rust }}>propiedad</em>
            </h2>
            <p style={{ fontFamily: T.serif, fontSize: 19, color: T.ink, lineHeight: 1.7, margin: 0, maxWidth: 620 }}>
              <span style={{ float: 'left', fontFamily: T.serif, fontSize: 78, lineHeight: 0.74, paddingRight: 14, paddingTop: 8, color: T.rust }}>
                {prop.description.charAt(0)}
              </span>
              {prop.description.slice(1)}
            </p>
            <blockquote style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 24, color: T.ink2, lineHeight: 1.45, margin: '36px 0 0', paddingLeft: 28, borderLeft: `2px solid ${T.rust}`, maxWidth: 560 }}>
              {prop.features.slice(0, 3).join('. ')}.
            </blockquote>
          </section>

          {/* Plano */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, margin: '0 0 24px', letterSpacing: '-.02em' }}>El <em style={{ fontStyle: 'italic', color: T.rust }}>plano</em></h2>
            <div style={{ position: 'relative', aspectRatio: '16 / 8', background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4 }}>
              <div style={{ position: 'absolute', inset: '8%', border: `1.5px solid ${T.rustSoft}` }} />
              {[['Living', '12%', '20%'], ['Cocina', '46%', '20%'], ['Dormitorio', '74%', '20%'], ['Baño', '12%', '64%'], ['Balcón', '74%', '64%']].map(([label, l, t]) => (
                <span key={label} style={{ position: 'absolute', left: l, top: t, fontFamily: T.mono, fontSize: 9.5, color: T.ink3, letterSpacing: '.08em', textTransform: 'uppercase', background: T.paper, padding: '3px 7px' }}>{label}</span>
              ))}
              <span style={{ position: 'absolute', bottom: 14, right: 16, fontFamily: T.mono, fontSize: 10, color: T.ink3, letterSpacing: '.06em' }}>Plano ilustrativo · escala 1:150</span>
            </div>
          </section>

          {/* Ubicación */}
          <section style={{ marginBottom: 56 }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, margin: '0 0 24px', letterSpacing: '-.02em' }}>El <em style={{ fontStyle: 'italic', color: T.rust }}>entorno</em></h2>
            <div style={{ height: 360, borderRadius: 4, overflow: 'hidden', border: `1px solid ${T.rule}` }}>
              <SiteMap markers={[{ lat: prop.lat, lng: prop.lng, title: prop.title, price: priceLabel, id: prop.id }]} center={{ lat: prop.lat, lng: prop.lng }} zoom={15} height="100%" accentColor={T.rust} tiles="positron" />
            </div>
            <div className="rwd-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 48px', marginTop: 12 }}>
              {POIS.map(([d, name, cat]) => (
                <div key={name} style={{ display: 'grid', gridTemplateColumns: '60px 1fr auto', gap: 12, alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${T.ruleSoft}` }}>
                  <span style={{ fontFamily: T.mono, fontSize: 11, color: T.rust, fontWeight: 600 }}>{d}</span>
                  <span style={{ fontFamily: T.serif, fontSize: 16 }}>{name}</span>
                  <span style={{ fontFamily: T.mono, fontSize: 9.5, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{cat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Detalles accordion */}
          <section>
            <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, margin: '0 0 24px', letterSpacing: '-.02em' }}>Más <em style={{ fontStyle: 'italic', color: T.rust }}>detalles</em></h2>
            <div style={{ borderTop: `1px solid ${T.ink}` }}>
              {detalles.map(([k, v], i) => (
                <div key={k} style={{ borderBottom: `1px solid ${T.rule}` }}>
                  <button onClick={() => setOpen(open === i ? null : i)} style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 4px', textAlign: 'left' }}>
                    <span style={{ fontFamily: T.serif, fontSize: 19, color: T.ink }}>{k}</span>
                    <span style={{ fontFamily: T.serif, fontSize: 24, color: T.rust, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform .2s ease', lineHeight: 1 }}>+</span>
                  </button>
                  {open === i && (
                    <div style={{ padding: '0 4px 22px', fontSize: 15, color: T.ink2, lineHeight: 1.65, maxWidth: 540 }}>{v}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT · sticky sidebar */}
        <aside className="rwd-unsticky" style={{ position: 'sticky', top: 88, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Agendar visita */}
          <div style={{ background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4, padding: 28 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.rust, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 6 }}>Agendar visita</div>
            <h3 style={{ fontFamily: T.serif, fontSize: 24, fontWeight: 400, margin: '0 0 18px' }}>Coordiná un día</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
              {VISIT_SLOTS.map((s, i) => (
                <button key={s} onClick={() => setSlot(i)} style={{ padding: '12px 8px', border: `1px solid ${slot === i ? T.rust : T.rule}`, background: slot === i ? T.rust : 'transparent', color: slot === i ? T.bg : T.ink, borderRadius: 4, cursor: 'pointer', fontFamily: T.mono, fontSize: 10.5, letterSpacing: '.04em' }}>{s}</button>
              ))}
            </div>
            <Link href={`/${slug}/contacto`} style={{ display: 'block', textAlign: 'center', background: T.rust, color: T.bg, padding: '14px', borderRadius: 99, textDecoration: 'none', fontFamily: T.mono, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 8 }}>
              Confirmar visita →
            </Link>
            {agency.phone && (
              <a href={`https://wa.me/${agency.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, me interesa ${prop.title}`)}`} target="_blank" rel="noreferrer" style={{ display: 'block', textAlign: 'center', border: `1px solid ${T.ink}`, color: T.ink, padding: '13px', borderRadius: 99, textDecoration: 'none', fontFamily: T.mono, fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                WhatsApp directo
              </a>
            )}
          </div>

          {/* Tu agente */}
          <div style={{ background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4, padding: 28 }}>
            <div style={{ fontFamily: T.mono, fontSize: 10.5, color: T.rust, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 16 }}>Tu agente</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ width: 52, height: 52, borderRadius: 99, background: T.rustSoft, color: T.rustDark, display: 'grid', placeItems: 'center', fontFamily: T.serif, fontSize: 20, fontWeight: 500, flexShrink: 0 }}>
                {prop.agent.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </div>
              <div>
                <div style={{ fontFamily: T.serif, fontSize: 19 }}>{prop.agent}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.ink3, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 4 }}>Asesor · {prop.neighborhood}</div>
                <div style={{ fontFamily: T.mono, fontSize: 10, color: T.rust, letterSpacing: '.06em', textTransform: 'uppercase', marginTop: 2 }}>Responde en ~20 min</div>
              </div>
            </div>
          </div>

          {/* Quick actions + QR */}
          <div style={{ background: T.paper, border: `1px solid ${T.rule}`, borderRadius: 4, padding: 28, display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <a href={`/api/pdf/propiedad/${prop.id}?slug=${slug}`} target="_blank" rel="noreferrer" style={{ textAlign: 'left', fontFamily: T.body, fontSize: 13.5, color: T.rust, fontWeight: 600, textDecoration: 'none' }}>
                Descargar ficha PDF →
              </a>
              <QrDownload url={url} agencyName={agency.name} fileBase={prop.id} fg={T.ink} buttonStyle={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: T.body, fontSize: 13.5, color: T.rust, fontWeight: 600 }}>Descargar QR ↓</QrDownload>
              {['Guardar propiedad', 'Compartir'].map(a => (
                <button key={a} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: T.body, fontSize: 13.5, color: T.ink2 }}>
                  {a} →
                </button>
              ))}
            </div>
            <div style={{ background: T.paper, padding: 8, border: `1px solid ${T.rule}`, borderRadius: 4 }}>
              <QRCodeSVG value={url} size={76} bgColor={T.paper} fgColor={T.ink} level="M" />
            </div>
          </div>
        </aside>
      </div>

      {/* ── SIMILARES ── */}
      {related.length > 0 && (
        <section style={{ padding: '0 48px 88px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 32, paddingBottom: 18, borderBottom: `1px solid ${T.ink}` }}>
            <h2 style={{ fontFamily: T.serif, fontSize: 30, fontWeight: 400, margin: 0, letterSpacing: '-.02em' }}>Propiedades <em style={{ fontStyle: 'italic', color: T.rust }}>similares</em></h2>
            <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.ink, textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          <div className="rwd-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {related.map(r => (
              <Link key={r.id} href={`/${slug}/propiedades/${r.id}`} style={{ textDecoration: 'none' }}>
                <article>
                  <div style={{ position: 'relative', height: 240, borderRadius: 4, overflow: 'hidden', marginBottom: 14 }}>
                    <Image src={r.images[0] ?? ''} alt={r.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 9.5, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>{r.operation} · {r.neighborhood}</div>
                  <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.ink, lineHeight: 1.25, marginBottom: 8 }}>{r.title}</div>
                  <div style={{ fontFamily: T.serif, fontSize: 19, color: T.rust, fontWeight: 500 }}>{r.currency} {r.price.toLocaleString('es-AR')}</div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      <SiteFooter slug={slug} agency={agency} accent={T.rust} bg={T.ink} ink="#FAF7F0" ink2="rgba(250,247,240,.6)" ink3="rgba(250,247,240,.35)" rule="rgba(250,247,240,.1)" fontDisplay={T.serif} />

      {/* ── LIGHTBOX ── */}
      <Lightbox images={images} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} accent={T.rust} mono={T.mono} />
    </div>
  )
}
