'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Property, Agency } from '@/lib/dummy'
import Lightbox from '@/components/site/lightbox'
import QrDownload from '@/components/site/qr-download'

const SiteMap = dynamic(() => import('@/components/site/primitives/SiteMap'), { ssr: false })

/* ============================================================
 * T3 · ATELIER · Detalle — réplica del mockup C7.
 * ============================================================ */

const T = {
  bone: '#F5F1EC',
  paper: '#FFFFFF',
  cocoa: '#2E2620',
  cocoaSoft: '#6B5D52',
  mute: '#9A8F82',
  rule: '#DDD5CA',
  sage: '#7A8264',
  sageDark: '#5E6B4E',
  sageSoft: '#E4E7DC',
  gold: '#B89968',
  serif: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
  sans: "var(--font-sans), system-ui, sans-serif",
}

const DOW = ['D', 'L', 'M', 'M', 'J', 'V', 'S']
const HORAS = ['10:00', '11:30', '15:00', '16:30']

interface Props {
  slug: string
  agency: Agency
  prop: Property
  related: Property[]
}

export default function AtelierDetail({ slug, agency, prop, related }: Props) {
  const [day, setDay] = useState(20)
  const [hora, setHora] = useState(1)
  const [lb, setLb] = useState<number | null>(null)

  const word = agency.name.split(' ')
  const images = prop.images.length ? prop.images : ['']
  const i0 = images[0] ?? ''
  const book: [string, string, string, string] = [i0, images[1] ?? i0, images[2] ?? i0, images[3] ?? i0]
  const priceLabel = prop.price.toLocaleString('es-AR')
  const url = `https://${slug}.nimo.app/propiedades/${prop.id}`

  const ficha: [string, string][] = [
    ['Tipo', prop.type],
    ['Operación', prop.operation],
    prop.total_area ? ['Lote', `${prop.total_area} m²`] : ['Lote', '—'],
    prop.covered_area ? ['Cubierta', `${prop.covered_area} m²`] : ['Cubierta', '—'],
    ['Ambientes', String(prop.rooms ?? '—')],
    ['Baños', String(prop.bathrooms ?? '—')],
    ['Barrio', prop.neighborhood],
    ['Orientación', 'Norte franco'],
  ]

  // calendario simple — junio 2026 empieza en lunes
  const cells: (number | null)[] = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  return (
    <div className="site-theme" style={{ fontFamily: T.serif, background: T.bone, color: T.cocoa, minHeight: '100vh' }}>
      {/* NAV */}
      <nav style={{ padding: '40px 0 32px', textAlign: 'center', borderBottom: `1px solid ${T.rule}` }}>
        <Link href={`/${slug}`} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: T.cocoa, textDecoration: 'none' }}>
          {word[0]} <span style={{ color: T.sageDark }}>{word.slice(1).join(' ')}</span>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 44, marginTop: 22 }}>
          {([['Propiedades', `/${slug}/propiedades`], ['Concierge', `/${slug}#concierge`], ['Equipo', `/${slug}#equipo`], ['Contacto', `/${slug}/contacto`]] as [string, string][]).map(([l, h]) => (
            <Link key={l} href={h} style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: T.cocoaSoft, textDecoration: 'none', fontWeight: 500 }}>{l}</Link>
          ))}
        </div>
      </nav>

      {/* FLOATING SIDE */}
      <aside style={{ position: 'fixed', right: 40, top: '50%', transform: 'translateY(-50%)', zIndex: 40 }} className="atelier-float">
        <div style={{ background: T.paper, padding: '28px 30px', boxShadow: '0 24px 70px -30px rgba(46,38,32,.3)', textAlign: 'center', maxWidth: 240 }}>
          <div style={{ fontFamily: T.serif, fontSize: 26, marginBottom: 4 }}>
            <span style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: '.14em', color: T.mute, marginRight: 8 }}>{prop.currency}</span>{priceLabel}
          </div>
          <div style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: T.mute, marginBottom: 20 }}>{prop.neighborhood}</div>
          <Link href="#visita" style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: T.bone, background: T.sage, padding: '13px 22px', borderRadius: 999, textDecoration: 'none', display: 'block' }}>Agendar una visita</Link>
          <a href={agency.phone ? `https://wa.me/${agency.phone.replace(/\D/g, '')}` : '#'} target="_blank" rel="noreferrer" style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 15, color: T.cocoaSoft, marginTop: 16, display: 'block', textDecoration: 'none' }}>↗ Conversar con el equipo</a>
        </div>
      </aside>

      {/* HEADER */}
      <header style={{ textAlign: 'center', padding: '88px 0 64px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 48px' }}>
          <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.cocoaSoft }}>
            {prop.neighborhood} <span style={{ color: T.sageDark }}>/</span> {prop.currency} {priceLabel}
          </span>
          <h1 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(64px, 9vw, 128px)', lineHeight: 0.92, letterSpacing: '-.02em', margin: '24px 0 28px' }}>{prop.title}</h1>
          <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 22, lineHeight: 1.6, color: T.cocoaSoft, maxWidth: 640, margin: '0 auto' }}>
            {[prop.total_area && `${prop.total_area} m²`, prop.rooms && `${prop.rooms} ambientes`, prop.neighborhood].filter(Boolean).join(' · ')}.
          </p>
        </div>
      </header>

      {/* GALERÍA BOOK */}
      <section style={{ padding: '0 24px 40px' }}>
        <div className="rwd-stack" style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: 28, maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Figure src={book[0]} ratio="3 / 4" caption="El espacio principal, luz de mañana." alt={prop.title} onOpen={() => setLb(0)} />
            <Figure src={book[1]} ratio="16 / 10" caption="Hacia el exterior." alt={prop.title} onOpen={() => setLb(1)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            <Figure src={book[2]} ratio="1 / 1" caption="Detalle de carpintería." alt={prop.title} onOpen={() => setLb(2)} />
            <Figure src={book[3]} ratio="3 / 4" caption="El ambiente, mediodía." alt={prop.title} onOpen={() => setLb(3)} />
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 28, display: 'flex', justifyContent: 'center', gap: 32, alignItems: 'baseline', flexWrap: 'wrap' }}>
          <button onClick={() => setLb(0)} style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 18, color: T.sageDark, background: 'none', border: 'none', cursor: 'pointer' }}>Ver todas las fotografías →</button>
          <a href={`/api/pdf/propiedad/${prop.id}?slug=${slug}`} target="_blank" rel="noreferrer" style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 18, color: T.sageDark, textDecoration: 'none' }}>Descargar ficha PDF →</a>
          <QrDownload url={url} agencyName={agency.name} fileBase={prop.id} fg={T.cocoa} buttonStyle={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 18, color: T.sageDark, background: 'none', border: 'none', cursor: 'pointer' }}>Descargar QR →</QrDownload>
        </div>
      </section>

      {/* CONTENT */}
      <div style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
          {/* EDIFICIO */}
          <section style={{ marginBottom: 120, maxWidth: 760 }}>
            <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.sageDark, display: 'block', marginBottom: 20 }}>— La propiedad</span>
            <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(44px, 5vw, 72px)', lineHeight: 0.98, letterSpacing: '-.015em', margin: '0 0 36px' }}>
              Una casa con <em style={{ fontStyle: 'italic' }}>carácter.</em>
            </h2>
            <p style={{ fontFamily: T.serif, fontSize: 21, lineHeight: 1.75, margin: 0, color: T.cocoa }}>
              <span style={{ float: 'left', fontFamily: T.serif, fontSize: 92, lineHeight: 0.78, paddingRight: 14, paddingTop: 10, fontWeight: 300, color: T.sageDark }}>{prop.description.charAt(0)}</span>
              {prop.description.slice(1)}
            </p>
          </section>

          {/* DETALLES */}
          <section style={{ marginBottom: 120 }}>
            <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.sageDark, display: 'block', marginBottom: 20 }}>— Detalles</span>
            <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(40px, 4.6vw, 64px)', letterSpacing: '-.015em', margin: '0 0 36px' }}>La <em style={{ fontStyle: 'italic' }}>ficha.</em></h2>
            <div className="rwd-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 72px', maxWidth: 880 }}>
              {ficha.map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', padding: '18px 0', borderBottom: `1px solid ${T.rule}`, alignItems: 'baseline' }}>
                  <span style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: T.mute }}>{k}</span>
                  <span style={{ fontFamily: T.serif, fontSize: 21, textTransform: 'capitalize' }}>{v}</span>
                </div>
              ))}
            </div>
          </section>

          {/* PLANO */}
          <section style={{ marginBottom: 120 }}>
            <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.sageDark, display: 'block', marginBottom: 20 }}>— Plano</span>
            <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(40px, 4.6vw, 64px)', letterSpacing: '-.015em', margin: '0 0 36px' }}>La <em style={{ fontStyle: 'italic' }}>traza.</em></h2>
            <div style={{ background: T.paper, padding: 56, maxWidth: 980 }}>
              <div style={{ position: 'relative', aspectRatio: '16 / 9', background: T.bone }}>
                <div style={{ position: 'absolute', inset: '6%', border: `1.5px solid ${T.sage}` }} />
                {[['Living', '14%', '24%'], ['Comedor', '42%', '24%'], ['Galería', '70%', '24%'], ['Cocina', '14%', '64%'], ['Patio', '42%', '64%'], ['Servicio', '70%', '64%']].map(([l, left, top]) => (
                  <span key={l} style={{ position: 'absolute', left, top, fontFamily: T.sans, fontSize: 9.5, letterSpacing: '.16em', textTransform: 'uppercase', color: T.sageDark, background: T.bone, padding: '3px 8px' }}>{l}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, fontFamily: T.serif, fontStyle: 'italic', fontSize: 17, color: T.cocoaSoft }}>
                <span>Planta baja · escala 1:150</span>
                <span style={{ color: T.sageDark }}>Ver planta alta →</span>
              </div>
            </div>
          </section>

          {/* BARRIO */}
          <section style={{ marginBottom: 120 }}>
            <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.sageDark, display: 'block', marginBottom: 20 }}>— El barrio</span>
            <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(40px, 4.6vw, 64px)', letterSpacing: '-.015em', margin: '0 0 36px' }}>El <em style={{ fontStyle: 'italic' }}>entorno.</em></h2>
            <div style={{ height: 420, maxWidth: 980, overflow: 'hidden' }}>
              <SiteMap markers={[{ lat: prop.lat, lng: prop.lng, title: prop.title, price: `${prop.currency} ${priceLabel}`, id: prop.id }]} center={{ lat: prop.lat, lng: prop.lng }} zoom={15} height="100%" accentColor={T.sage} tiles="positron" />
            </div>
            <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 19, color: T.cocoaSoft, marginTop: 28, maxWidth: 640, lineHeight: 1.65 }}>
              {prop.address}. La dirección exacta se comparte luego del primer contacto.
            </p>
          </section>

          {/* VISITA */}
          <section id="visita" style={{ marginBottom: 0 }}>
            <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.sageDark, display: 'block', marginBottom: 20 }}>— Visita</span>
            <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(40px, 4.6vw, 64px)', letterSpacing: '-.015em', margin: '0 0 36px' }}>Conocerla <em style={{ fontStyle: 'italic' }}>en persona.</em></h2>
            <div className="rwd-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 72, maxWidth: 980, alignItems: 'start' }}>
              <div style={{ background: T.paper, padding: 40 }}>
                <div style={{ textAlign: 'center', fontFamily: T.serif, fontSize: 24, marginBottom: 24 }}>Junio <em style={{ fontStyle: 'italic' }}>2026</em></div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
                  {DOW.map((d, i) => <span key={i} style={{ fontFamily: T.sans, fontSize: 9, letterSpacing: '.14em', color: T.mute, textTransform: 'uppercase', padding: '8px 0' }}>{d}</span>)}
                  {cells.map((n, i) => (
                    n === null
                      ? <span key={i} />
                      : <button key={i} onClick={() => setDay(n)} style={{ fontFamily: T.serif, fontSize: 16, padding: '10px 0', cursor: 'pointer', border: 'none', background: day === n ? T.sage : 'transparent', color: day === n ? T.bone : T.cocoa, borderRadius: 2 }}>{n}</button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 21, lineHeight: 1.65, color: T.cocoaSoft, margin: '0 0 36px' }}>
                  Las visitas se coordinan con un día de anticipación y duran lo que tengan que durar.
                </p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 40 }}>
                  {HORAS.map((h, i) => (
                    <button key={h} onClick={() => setHora(i)} style={{ padding: '12px 22px', border: `1px solid ${hora === i ? T.sage : T.rule}`, background: hora === i ? T.sageSoft : 'transparent', color: hora === i ? T.sageDark : T.cocoa, fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.14em', cursor: 'pointer' }}>{h}</button>
                  ))}
                </div>
                <Link href={`/${slug}/contacto`} style={{ fontFamily: T.sans, fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: T.bone, background: T.sage, padding: '15px 30px', borderRadius: 999, textDecoration: 'none', display: 'inline-block' }}>
                  Confirmar sábado {day} · {HORAS[hora]} →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* SIMILARES */}
      {related.length > 0 && (
        <section style={{ padding: '100px 0 130px', background: T.paper }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <span style={{ fontFamily: T.sans, fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: T.sageDark }}>En el mismo portfolio</span>
              <h2 style={{ fontFamily: T.serif, fontWeight: 300, fontSize: 'clamp(44px, 5vw, 72px)', letterSpacing: '-.015em', margin: '16px 0 0' }}>Otras <em style={{ fontStyle: 'italic' }}>casas.</em></h2>
            </div>
            <div className="rwd-3col" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 28, alignItems: 'start' }}>
              {related.map((r, i) => (
                <Link key={r.id} href={`/${slug}/propiedades/${r.id}`} style={{ textDecoration: 'none', color: T.cocoa }}>
                  <div style={{ position: 'relative', aspectRatio: i === 1 ? '1 / 1' : '4 / 5', overflow: 'hidden', marginBottom: 20 }}>
                    <Image src={r.images[0] ?? ''} alt={r.title} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                  </div>
                  <b style={{ fontFamily: T.serif, fontWeight: 400, fontSize: 25, display: 'block' }}>{r.title}</b>
                  <span style={{ fontFamily: T.sans, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: T.mute, display: 'block', marginTop: 8 }}>{r.neighborhood} · {r.currency} {r.price.toLocaleString('es-AR')}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${T.rule}`, padding: '80px 0 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 48px' }}>
          <Link href={`/${slug}`} style={{ fontFamily: T.sans, fontSize: 14, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: T.cocoa, textDecoration: 'none' }}>
            {word[0]} <span style={{ color: T.sageDark }}>{word.slice(1).join(' ')}</span>
          </Link>
          <div style={{ fontFamily: T.serif, fontStyle: 'italic', fontSize: 18, lineHeight: 1.9, color: T.cocoaSoft, marginTop: 28 }}>
            {agency.address}<br />{agency.phone} · {agency.email}
          </div>
        </div>
      </footer>

      <Lightbox images={images} index={lb} onClose={() => setLb(null)} onChange={setLb} accent={T.sage} mono={T.sans} />
    </div>
  )
}

function Figure({ src, ratio, caption, alt, onOpen }: { src: string; ratio: string; caption: string; alt: string; onOpen?: () => void }) {
  return (
    <figure onClick={onOpen} style={{ margin: 0, position: 'relative', overflow: 'hidden', aspectRatio: ratio, cursor: onOpen ? 'pointer' : 'default' }}>
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} sizes="50vw" />
      <figcaption style={{ position: 'absolute', left: 22, bottom: 18, color: '#F5F1EC', fontFamily: "var(--font-cormorant), Georgia, serif", fontStyle: 'italic', fontSize: 17, textShadow: '0 1px 8px rgba(28,22,16,.5)' }}>{caption}</figcaption>
    </figure>
  )
}
