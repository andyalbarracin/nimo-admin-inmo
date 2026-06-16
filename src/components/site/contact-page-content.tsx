'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import type { Agency, ClientType, LeadStage } from '@/lib/dummy'
import { THEMES, type ThemeId } from '@/lib/themes'
import { submitPublicLead } from '@/lib/leads/actions'

const SiteMap = dynamic(() => import('@/components/site/primitives/SiteMap'), { ssr: false })

interface TeamMember { id: string; name: string; email: string; role: string; avatar: string }
interface Props { slug: string; agency: Agency | null; agents: TeamMember[] }

const TOPIC_MAP: Record<string, { ct?: ClientType; op?: 'venta' | 'alquiler' }> = {
  comprar: { ct: 'comprador', op: 'venta' },
  alquilar: { ct: 'inquilino', op: 'alquiler' },
  vender: { ct: 'vendedor', op: 'venta' },
  tasacion: { ct: 'propietario', op: 'venta' },
  otro: {},
}

export default function ContactPageContent({ slug, agency, agents }: Props) {
  const themeId = (agency?.theme ?? 'editorial') as ThemeId
  const T = THEMES[themeId]
  const r = T.radius // editorial 4px · spatial 8px · atelier 2px

  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', message: '' })
  const [hp, setHp] = useState('') // honeypot anti-bot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setStatus('loading')
    const t = TOPIC_MAP[form.topic] ?? {}
    const res = await submitPublicLead(slug, {
      name: form.name, email: form.email, phone: form.phone,
      stage: 'new' as LeadStage, source: 'Formulario web',
      property_interest: form.topic ? form.topic : '', budget: '', notes: form.message,
      client_type: t.ct, operation_interest: t.op,
    }, hp)
    // Agencias del demo que solo viven en dummy no tienen CRM en DB → éxito de demo igual.
    const ok = res.ok || (res.error ?? '').toLowerCase().includes('no encontrada')
    setStatus(ok ? 'success' : 'error')
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: T.bg, border: `1px solid ${T.rule}`, borderRadius: r,
    padding: '12px 14px', color: T.ink, fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: T.fontBody,
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontFamily: T.fontMono, fontSize: 10, fontWeight: 600, color: T.ink3,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em',
  }

  // Nav por theme
  const nameParts = (agency?.name ?? slug).split(' ')
  const Nav = () => {
    if (themeId === 'spatial') {
      return (
        <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(10px)', borderBottom: `1.5px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 40px' }}>
          <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 19, letterSpacing: '-.03em', textTransform: 'uppercase', color: T.ink }}>{nameParts[0]}</span>
            <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent }}>/ {nameParts.slice(1).join(' ') || 'PROPIEDADES'}</span>
          </Link>
          <nav style={{ display: 'flex', gap: 4 }}>
            <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: '.1em', fontWeight: 600, color: T.ink, textDecoration: 'none', padding: '8px 12px' }}>[ PROPIEDADES ]</Link>
            <Link href={`/${slug}/contacto`} style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: '.1em', fontWeight: 600, color: T.accentContrast, background: T.ink, textDecoration: 'none', padding: '8px 12px' }}>[ CONTACTO ]</Link>
          </nav>
        </header>
      )
    }
    if (themeId === 'atelier') {
      return (
        <nav style={{ padding: '36px 0 28px', textAlign: 'center', borderBottom: `1px solid ${T.rule}` }}>
          <Link href={`/${slug}`} style={{ fontFamily: T.fontBody, fontSize: 14, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: T.ink, textDecoration: 'none' }}>
            {nameParts[0]} <span style={{ color: T.accentDark }}>{nameParts.slice(1).join(' ')}</span>
          </Link>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 20 }}>
            <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.fontBody, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: T.ink2, textDecoration: 'none' }}>Propiedades</Link>
            <Link href={`/${slug}/contacto`} style={{ fontFamily: T.fontBody, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: T.accentDark, textDecoration: 'none' }}>Contacto</Link>
          </div>
        </nav>
      )
    }
    // editorial
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.bg + 'F2', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.ink}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ fontFamily: T.fontDisplay, fontWeight: 600, fontSize: 22, color: T.ink, textDecoration: 'none' }}>
          {nameParts[0]} <em style={{ fontStyle: 'italic', color: T.accent }}>{nameParts.slice(1).join(' ') || 'Propiedades'}</em>
        </Link>
        <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          <Link href={`/${slug}/propiedades`} style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: T.ink2, textDecoration: 'none' }}>Propiedades</Link>
          <Link href={`/${slug}/contacto`} style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', color: T.bg, background: T.accent, padding: '9px 18px', borderRadius: 99, textDecoration: 'none' }}>Contacto</Link>
        </nav>
      </header>
    )
  }

  // Título por theme
  const Title = () => {
    if (themeId === 'spatial') return <h1 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(40px,5vw,64px)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '-.04em', lineHeight: .95, margin: '0 0 12px' }}>Hablemos.</h1>
    if (themeId === 'atelier') return <h1 style={{ fontFamily: T.fontDisplay, fontWeight: 300, fontSize: 'clamp(56px,7vw,96px)', letterSpacing: '-.02em', lineHeight: .95, margin: '0 0 16px' }}>Conversemos.</h1>
    return <h1 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(44px,5vw,72px)', fontWeight: 400, letterSpacing: '-.02em', margin: '0 0 12px' }}>Hablemos<em style={{ fontStyle: 'italic', color: T.accent }}>.</em></h1>
  }

  return (
    <div style={{ fontFamily: T.fontBody, background: T.bg, color: T.ink, minHeight: '100vh' }}>
      <Nav />

      <div className="rwd-pad" style={{ maxWidth: 1180, margin: '0 auto', padding: themeId === 'atelier' ? '72px 48px 90px' : '56px 48px 80px', textAlign: themeId === 'atelier' ? 'center' : 'left' }}>
        <div style={{ marginBottom: 48 }}>
          <span style={{ fontFamily: T.fontMono, fontSize: 11, fontWeight: 600, color: T.accent, letterSpacing: '.14em', textTransform: 'uppercase' }}>Contacto</span>
          <div style={{ marginTop: 14 }}><Title /></div>
          <p style={{ fontFamily: themeId === 'atelier' ? T.fontDisplay : T.fontBody, fontStyle: themeId === 'atelier' ? 'italic' : 'normal', fontSize: themeId === 'atelier' ? 21 : 16, color: T.ink2, maxWidth: 480, lineHeight: 1.6, margin: themeId === 'atelier' ? '0 auto' : 0 }}>
            Respondemos en menos de 24 horas. Sin presión, sin compromiso.
          </p>
        </div>

        <div className="rwd-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, textAlign: 'left' }}>
          {/* Form */}
          <div style={{ background: T.surface, border: `1px solid ${T.rule}`, borderRadius: r, padding: 36 }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontFamily: T.fontDisplay, fontSize: 26, color: T.accent, marginBottom: 10 }}>¡Mensaje enviado!</div>
                <p style={{ fontSize: 14, color: T.ink2 }}>Quedó registrado en el CRM de {agency?.name ?? 'la inmobiliaria'}. Te respondemos en menos de 24 horas.</p>
                <button onClick={() => { setForm({ name: '', email: '', phone: '', topic: '', message: '' }); setStatus('idle') }} style={{ marginTop: 20, background: T.accent, color: T.accentContrast, border: 'none', padding: '11px 24px', borderRadius: r, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Honeypot anti-bot: invisible para humanos, los bots lo completan. */}
                <input type="text" name="company_extra" value={hp} onChange={e => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
                <h2 style={{ fontFamily: T.fontDisplay, fontSize: 22, color: T.ink, margin: '0 0 24px', fontWeight: themeId === 'atelier' ? 400 : themeId === 'spatial' ? 800 : 400, textTransform: themeId === 'spatial' ? 'uppercase' : 'none' }}>Envianos un mensaje</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div className="rwd-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div><label style={labelStyle}>Nombre *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre" style={inputStyle} /></div>
                    <div><label style={labelStyle}>Email *</label><input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@email.com" style={inputStyle} /></div>
                  </div>
                  <div><label style={labelStyle}>Teléfono</label><input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+54 11 ..." style={inputStyle} /></div>
                  <div><label style={labelStyle}>¿En qué podemos ayudarte?</label>
                    <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Seleccioná una opción</option>
                      <option value="comprar">Quiero comprar una propiedad</option>
                      <option value="alquilar">Quiero alquilar</option>
                      <option value="vender">Quiero vender mi propiedad</option>
                      <option value="tasacion">Solicitar tasación</option>
                      <option value="otro">Otra consulta</option>
                    </select>
                  </div>
                  <div><label style={labelStyle}>Mensaje</label><textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Contanos qué buscás, tu presupuesto, zona preferida..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
                  {status === 'error' && <div style={{ fontSize: 13, color: '#C0392B', background: 'rgba(192,57,43,.08)', border: '1px solid rgba(192,57,43,.2)', padding: '10px 14px', borderRadius: r }}>Hubo un error al enviar. Intentá de nuevo.</div>}
                  <button type="submit" disabled={status === 'loading'} style={{ background: status === 'loading' ? T.rule : T.accent, color: status === 'loading' ? T.ink3 : T.accentContrast, border: 'none', padding: '14px', borderRadius: r, fontFamily: themeId === 'spatial' ? T.fontMono : T.fontBody, fontWeight: 700, fontSize: 15, letterSpacing: themeId === 'spatial' ? '.06em' : 0, textTransform: themeId === 'spatial' ? 'uppercase' : 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                    {status === 'loading' ? 'Enviando…' : 'Enviar consulta →'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ background: T.surface, border: `1px solid ${T.rule}`, borderRadius: r, padding: 28 }}>
              <h3 style={{ fontFamily: T.fontDisplay, fontSize: 16, color: T.ink, margin: '0 0 20px', fontWeight: themeId === 'spatial' ? 800 : 400 }}>Datos de contacto</h3>
              {[
                { label: 'Dirección', value: agency?.address ?? 'Buenos Aires, Argentina' },
                { label: 'Teléfono', value: agency?.phone ?? '', sub: 'Lun–Vie 9–18hs' },
                { label: 'Email', value: agency?.email ?? '', sub: 'Respondemos en 24hs' },
              ].filter(i => i.value).map(item => (
                <div key={item.label} style={{ marginBottom: 16 }}>
                  <div style={{ fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 3 }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{item.value}</div>
                  {item.sub && <div style={{ fontSize: 12, color: T.ink3 }}>{item.sub}</div>}
                </div>
              ))}
              {agency?.phone && (
                <a href={`https://wa.me/${agency.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: T.accent, color: T.accentContrast, padding: '12px', borderRadius: r, fontWeight: 700, fontSize: 14, textDecoration: 'none', marginTop: 6 }}>
                  WhatsApp directo →
                </a>
              )}
            </div>

            <div style={{ background: T.surface, border: `1px solid ${T.rule}`, borderRadius: r, padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 200 }}>
                <SiteMap markers={[{ lat: -34.6037, lng: -58.3816, title: agency?.name ?? 'Oficina', id: 'office' }]} center={{ lat: -34.6037, lng: -58.3816 }} zoom={14} height="100%" accentColor={T.accent} tiles="positron" />
              </div>
            </div>

            {agents.length > 0 && (
              <div style={{ background: T.surface, border: `1px solid ${T.rule}`, borderRadius: r, padding: 28 }}>
                <h3 style={{ fontFamily: T.fontDisplay, fontSize: 16, color: T.ink, margin: '0 0 18px', fontWeight: themeId === 'spatial' ? 800 : 400 }}>Nuestro equipo</h3>
                {agents.map(member => (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 9999, background: T.accent + '20', border: `2px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: T.accent, fontSize: 15, flexShrink: 0 }}>{member.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{member.name}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{member.email}</div>
                    </div>
                    <span style={{ fontFamily: T.fontMono, fontSize: 9, fontWeight: 600, background: T.accent + '15', color: T.accent, padding: '3px 8px', borderRadius: r, textTransform: 'uppercase', letterSpacing: '.04em' }}>{member.role === 'owner' ? 'Director' : 'Asesor'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
