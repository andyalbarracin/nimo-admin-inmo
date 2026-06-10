'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Agency } from '@/lib/dummy'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

interface Props {
  slug: string
  agency: Agency | null
  agents: TeamMember[]
}

const themes = {
  editorial: { bg: '#FAF7F0', ink: '#1A1614', ink2: '#5C5247', ink3: '#9E9389', accent: '#B25431', accentContrast: '#FAF7F0', surface: '#FFFFFF', border: '#DBD2C2', serif: true },
  spatial:   { bg: '#F2F4F8', ink: '#0A0A0A', ink2: '#3A4A63', ink3: '#7A8BA8', accent: '#1F4DD6', accentContrast: '#FFFFFF', surface: '#FFFFFF', border: '#E0E5EF', serif: false },
  atelier:   { bg: '#F5F1EC', ink: '#2E2620', ink2: '#6E6258', ink3: '#9A8F82', accent: '#7A8264', accentContrast: '#F5F1EC', surface: '#FFFFFF', border: '#DDD5CA', serif: true },
}

export default function ContactPageContent({ slug, agency, agents }: Props) {
  const themeId = (agency?.theme ?? 'editorial') as keyof typeof themes
  const T = themes[themeId] ?? themes.editorial

  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/webhooks/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agency_slug: slug,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: `[${form.topic}] ${form.message}`,
          source: 'form',
        }),
      })
      if (!res.ok) throw new Error('Error')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8,
    padding: '12px 14px', color: T.ink, fontSize: 14, outline: 'none', boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 700, color: T.ink3,
    marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.07em',
  }

  return (
    <div style={{ fontFamily: 'var(--font-sans)', background: T.bg, color: T.ink, minHeight: '100vh' }}>
      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.bg + 'F0', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.border}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: T.accentContrast, fontSize: 15 }}>
            {(agency?.name ?? slug).charAt(0).toUpperCase()}
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: T.ink }}>{agency?.name ?? slug}</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href={`/${slug}/propiedades`} style={{ color: T.ink2, fontSize: 14, textDecoration: 'none' }}>Propiedades</Link>
          <Link href={`/${slug}/contacto`} style={{ color: T.accent, fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Contacto</Link>
        </nav>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '56px 48px 80px' }}>
        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: T.accent, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 12 }}>Contacto</div>
          <h1 style={{ fontFamily: T.serif ? 'var(--font-serif)' : 'inherit', fontSize: 48, fontWeight: T.serif ? 700 : 800, color: T.ink, margin: '0 0 12px', letterSpacing: '-.02em', fontStyle: T.serif ? 'italic' : 'normal' }}>Hablemos.</h1>
          <p style={{ fontSize: 16, color: T.ink2, maxWidth: 460, lineHeight: 1.6 }}>Respondemos en menos de 24 horas. Sin presión, sin compromiso.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48 }}>
          {/* Form */}
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 36 }}>
            {status === 'success' ? (
              <div style={{ textAlign: 'center', padding: '48px 24px' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, marginBottom: 8 }}>¡Mensaje enviado!</div>
                <p style={{ fontSize: 14, color: T.ink2 }}>Te respondemos en menos de 24 horas.</p>
                <button onClick={() => setStatus('idle')} style={{ marginTop: 20, background: T.accent, color: T.accentContrast, border: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 24, marginTop: 0 }}>Envianos un mensaje</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={labelStyle}>Nombre *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Tu nombre" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="tu@email.com" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Teléfono</label>
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+54 11 ..." style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>¿En qué podemos ayudarte?</label>
                    <select value={form.topic} onChange={e => setForm(f => ({ ...f, topic: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                      <option value="">Seleccioná una opción</option>
                      <option value="comprar">Quiero comprar una propiedad</option>
                      <option value="alquilar">Quiero alquilar</option>
                      <option value="vender">Quiero vender mi propiedad</option>
                      <option value="tasacion">Solicitar tasación</option>
                      <option value="otro">Otra consulta</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Mensaje</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Contanos qué buscás, tu presupuesto, zona preferida..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
                  </div>
                  {status === 'error' && (
                    <div style={{ fontSize: 13, color: '#E74C3C', background: 'rgba(231,76,60,.08)', border: '1px solid rgba(231,76,60,.2)', padding: '10px 14px', borderRadius: 8 }}>
                      Hubo un error al enviar. Intentá de nuevo.
                    </div>
                  )}
                  <button type="submit" disabled={status === 'loading'} style={{ background: status === 'loading' ? T.border : T.accent, color: status === 'loading' ? T.ink3 : T.accentContrast, border: 'none', padding: '14px', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: status === 'loading' ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                    {status === 'loading' ? 'Enviando…' : 'Enviar consulta →'}
                  </button>
                  <p style={{ fontSize: 11, color: T.ink3, textAlign: 'center', margin: 0 }}>
                    Al enviar aceptás nuestra política de privacidad. No compartimos tus datos.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Contact info */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 20, marginTop: 0 }}>Datos de contacto</h3>
              {[
                { icon: '📍', label: 'Dirección', value: agency?.address ?? 'Buenos Aires, Argentina' },
                { icon: '📞', label: 'Teléfono', value: agency?.phone ?? '', sub: 'Lun–Vie 9–18hs' },
                { icon: '✉️', label: 'Email', value: agency?.email ?? '', sub: 'Respondemos en 24hs' },
              ].filter(i => i.value).map((item) => (
                <div key={item.label} style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
                  <div style={{ fontSize: 20, marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.ink3, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{item.value}</div>
                    {item.sub && <div style={{ fontSize: 12, color: T.ink3 }}>{item.sub}</div>}
                  </div>
                </div>
              ))}
              {agency?.phone && (
                <a href={`https://wa.me/${agency.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: 'white', padding: '12px', borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
                  💬 WhatsApp directo
                </a>
              )}
            </div>

            {/* Team */}
            {agents.length > 0 && (
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 20, marginTop: 0 }}>Nuestro equipo</h3>
                {agents.map((member) => (
                  <div key={member.id} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 9999, background: T.accent + '20', border: `2px solid ${T.accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: T.accent, fontSize: 16, flexShrink: 0 }}>
                      {member.avatar}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{member.name}</div>
                      <div style={{ fontSize: 11, color: T.ink3 }}>{member.email}</div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, background: T.accent + '15', color: T.accent, padding: '3px 8px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                      {member.role === 'owner' ? 'Director' : 'Asesor'}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Hours */}
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 16, marginTop: 0 }}>Horario de atención</h3>
              {[
                { day: 'Lunes – Viernes', hours: '9:00 – 18:00' },
                { day: 'Sábados', hours: '10:00 – 13:00' },
                { day: 'Domingos', hours: 'Cerrado' },
              ].map((h) => (
                <div key={h.day} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: T.ink2 }}>{h.day}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: h.hours === 'Cerrado' ? T.ink3 : T.ink }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
