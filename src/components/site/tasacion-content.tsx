'use client'

import { useState } from 'react'
import type { Agency, LeadStage } from '@/lib/dummy'
import { THEMES, type ThemeId } from '@/lib/themes'
import { submitPublicLead } from '@/lib/leads/actions'
import ThemedNav from '@/components/site/themed-nav'

const TIPOS = ['Departamento', 'Casa', 'PH', 'Local', 'Terreno', 'Oficina']
const TITLE: Record<ThemeId, string> = { editorial: 'Tasá tu propiedad', spatial: 'TASÁ TU PROPIEDAD', atelier: 'Tasación de excepción' }

export default function TasacionContent({ slug, agency }: { slug: string; agency: Agency | null }) {
  const themeId = (agency?.theme ?? 'editorial') as ThemeId
  const T = THEMES[themeId]
  const r = T.radius
  const upper = themeId === 'spatial'
  const centered = themeId === 'atelier'

  const [form, setForm] = useState({ name: '', email: '', phone: '', tipo: '', address: '', neighborhood: '', rooms: '', area: '', message: '' })
  const [hp, setHp] = useState('') // honeypot anti-bot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.tipo) return
    setStatus('loading')
    const detalle = [form.address, form.neighborhood, form.rooms && `${form.rooms} amb`, form.area && `${form.area} m²`, form.message].filter(Boolean).join(' · ')
    const res = await submitPublicLead(slug, {
      name: form.name, email: form.email, phone: form.phone,
      stage: 'new' as LeadStage, source: 'Tasación',
      property_interest: `Tasación: ${form.tipo}${form.neighborhood ? ` en ${form.neighborhood}` : ''}`,
      budget: '', notes: detalle, client_type: 'propietario', operation_interest: 'venta',
    }, hp)
    const ok = res.ok || (res.error ?? '').toLowerCase().includes('no encontrada')
    setStatus(ok ? 'success' : 'error')
  }

  const input: React.CSSProperties = { width: '100%', background: T.bg, border: `1px solid ${T.rule}`, borderRadius: r, padding: '12px 14px', color: T.ink, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: T.fontBody }
  const label: React.CSSProperties = { display: 'block', fontFamily: T.fontMono, fontSize: 10, fontWeight: 600, color: T.ink3, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }

  return (
    <div style={{ fontFamily: T.fontBody, background: T.bg, color: T.ink, minHeight: '100vh' }}>
      <ThemedNav slug={slug} agencyName={agency?.name ?? slug} themeId={themeId} T={T} active="tasacion" />

      <div style={{ maxWidth: 1080, margin: '0 auto', padding: centered ? '72px 48px 90px' : '56px 48px 80px' }}>
        <div style={{ marginBottom: 44, textAlign: centered ? 'center' : 'left' }}>
          <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent, letterSpacing: '.14em', textTransform: 'uppercase' }}>Tasación sin cargo</span>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: 'clamp(40px, 5.5vw, 80px)', fontWeight: upper ? 800 : centered ? 300 : 400, letterSpacing: '-.02em', lineHeight: .98, textTransform: upper ? 'uppercase' : 'none', margin: '14px 0 16px' }}>
            {TITLE[themeId]}{themeId === 'editorial' && <em style={{ fontStyle: 'italic', color: T.accent }}>.</em>}
          </h1>
          <p style={{ fontFamily: centered ? T.fontDisplay : T.fontBody, fontStyle: centered ? 'italic' : 'normal', fontSize: centered ? 22 : 16, color: T.ink2, maxWidth: 520, lineHeight: 1.6, margin: centered ? '0 auto' : 0 }}>
            Una tasación honesta, hecha por alguien que conoce el barrio. Sin compromiso, con un informe que podés usar como quieras.
          </p>
        </div>

        <div style={{ maxWidth: 620, margin: centered ? '0 auto' : 0, background: T.surface, border: `1px solid ${T.rule}`, borderRadius: r, padding: 36 }}>
          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <div style={{ fontFamily: T.fontDisplay, fontSize: 26, color: T.accent, marginBottom: 10 }}>¡Solicitud recibida!</div>
              <p style={{ fontSize: 14, color: T.ink2 }}>Un asesor de {agency?.name ?? 'la inmobiliaria'} te contacta para coordinar la tasación. Quedó registrado en el CRM.</p>
            </div>
          ) : (
            <form onSubmit={submit}>
              {/* Honeypot anti-bot */}
              <input type="text" name="company_extra" value={hp} onChange={e => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={label}>Nombre *</label><input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tu nombre" style={input} /></div>
                  <div><label style={label}>Teléfono</label><input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+54 11 ..." style={input} /></div>
                </div>
                <div><label style={label}>Email *</label><input required type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="tu@email.com" style={input} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={label}>Tipo de propiedad *</label>
                    <select required value={form.tipo} onChange={e => set('tipo', e.target.value)} style={{ ...input, cursor: 'pointer' }}>
                      <option value="">Elegí…</option>{TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div><label style={label}>Barrio</label><input value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} placeholder="Ej: Palermo" style={input} /></div>
                </div>
                <div><label style={label}>Dirección</label><input value={form.address} onChange={e => set('address', e.target.value)} placeholder="Calle y número" style={input} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div><label style={label}>Ambientes</label><input type="number" value={form.rooms} onChange={e => set('rooms', e.target.value)} style={input} /></div>
                  <div><label style={label}>Superficie (m²)</label><input type="number" value={form.area} onChange={e => set('area', e.target.value)} style={input} /></div>
                </div>
                <div><label style={label}>Comentarios</label><textarea value={form.message} onChange={e => set('message', e.target.value)} placeholder="Estado, antigüedad, lo que quieras agregar…" rows={3} style={{ ...input, resize: 'vertical' }} /></div>
                {status === 'error' && <div style={{ fontSize: 13, color: '#C0392B', background: 'rgba(192,57,43,.08)', border: '1px solid rgba(192,57,43,.2)', padding: '10px 14px', borderRadius: r }}>Hubo un error. Intentá de nuevo.</div>}
                <button type="submit" disabled={status === 'loading'} style={{ background: status === 'loading' ? T.rule : T.accent, color: status === 'loading' ? T.ink3 : T.accentContrast, border: 'none', padding: '14px', borderRadius: r, fontFamily: upper ? T.fontMono : T.fontBody, fontWeight: 700, fontSize: 15, letterSpacing: upper ? '.06em' : 0, textTransform: upper ? 'uppercase' : 'none', cursor: status === 'loading' ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                  {status === 'loading' ? 'Enviando…' : 'Pedir tasación →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
