'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import type { Agency } from '@/lib/dummy'
import { saveAgencyLogoUrl, removeAgencyLogo } from '@/lib/agency/logo-action'
import { uploadFile } from '@/lib/storage/upload-client'
import ZaireCredit from '@/components/zaire-credit'

/* Admin · Configuración — form funcional en sesión, themed. */

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#E8E2D8',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590', green: '#2D7D5F',
  accent: 'var(--admin-accent, #FF6B6B)',
  sans: 'var(--font-sans), system-ui, sans-serif',
  mono: "var(--font-mono), ui-monospace, monospace",
}

interface Settings {
  name: string; tagline: string; address: string; phone: string; email: string; instagram: string
  hours: string; whatsapp_auto: boolean; seo_title: string; seo_description: string
}

export default function ConfiguracionAdmin({ agency, initialLogo = '' }: { agency: Agency; initialLogo?: string }) {
  const [form, setForm] = useState<Settings>({
    name: agency.name, tagline: agency.tagline ?? '', address: agency.address ?? '',
    phone: agency.phone ?? '', email: agency.email ?? '', instagram: agency.instagram ?? '',
    hours: 'Lun a Vie 9 a 18 h · Sáb 10 a 13 h', whatsapp_auto: true,
    seo_title: `${agency.name} — Propiedades`, seo_description: agency.tagline ?? '',
  })
  const [saved, setSaved] = useState(false)
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => { setForm(f => ({ ...f, [k]: v })); setSaved(false) }
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  // Logo (persiste en la DB al subir)
  const params = useParams()
  const slug = (params?.slug as string) ?? ''
  const [logo, setLogo] = useState<string>(initialLogo)
  const [logoBusy, setLogoBusy] = useState(false)
  const [logoErr, setLogoErr] = useState('')
  const onLogoFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setLogoErr('El archivo debe ser una imagen'); return }
    setLogoBusy(true); setLogoErr('')
    // Subida DIRECTA del navegador a Supabase (evita el tope de Vercel).
    const up = await uploadFile(slug, 'agency-assets', file)
    if (up.url) {
      const res = await saveAgencyLogoUrl(slug, up.url)
      if (res.ok) setLogo(up.url)
      else setLogoErr(res.error ?? 'No se pudo guardar el logo')
    } else {
      setLogoErr(up.error ?? 'No se pudo subir el logo')
    }
    setLogoBusy(false)
  }
  const clearLogo = async () => { setLogo(''); await removeAgencyLogo(slug) }

  const field: React.CSSProperties = { width: '100%', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: '11px 13px', fontSize: 13.5, color: LA.ink, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const label: React.CSSProperties = { fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6, display: 'block' }

  const Card = ({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) => (
    <div className="coral-card" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 18, padding: 24, marginBottom: 18 }}>
      <div style={{ marginBottom: 18 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{title}</h3>
        <p style={{ fontSize: 12.5, color: LA.ink3, margin: '3px 0 0' }}>{desc}</p>
      </div>
      {children}
    </div>
  )

  return (
    <div style={{ padding: '0 0 40px', minHeight: '100vh', background: LA.bg, fontFamily: LA.sans, color: LA.ink }}>
      <header className="rwd-pad rwd-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderBottom: `1px solid ${LA.border}`, gap: 24, position: 'sticky', top: 0, background: LA.bg, zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: LA.mono, fontSize: 11, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Panel</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>Configuración</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {saved && <span style={{ fontSize: 13, color: LA.green, fontWeight: 600 }}>✓ Cambios guardados</span>}
          <button onClick={save} style={{ background: LA.accent, color: LA.white, padding: '11px 24px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>Guardar cambios</button>
        </div>
      </header>

      <div className="rwd-pad" style={{ padding: '24px 40px', maxWidth: 720 }}>
        <Card title="Logo" desc="Aparece en tu panel y en el sitio público. PNG o SVG, fondo transparente recomendado.">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ width: 96, height: 96, borderRadius: 16, border: `1px solid ${LA.border}`, background: LA.bg, display: 'grid', placeItems: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {logo
                ? <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                : <div style={{ width: 44, height: 44, borderRadius: 12, background: LA.accent, display: 'grid', placeItems: 'center', color: LA.white, fontWeight: 800, fontSize: 20 }}>{form.name.charAt(0).toUpperCase()}</div>}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ background: LA.accent, color: LA.white, padding: '10px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: logoBusy ? 'wait' : 'pointer', display: 'inline-block' }}>
                <input type="file" accept="image/*" disabled={logoBusy} onChange={e => { onLogoFile(e.target.files?.[0]); e.target.value = '' }} style={{ display: 'none' }} />
                {logoBusy ? 'Subiendo…' : logo ? 'Cambiar logo' : 'Subir logo'}
              </label>
              {logo && <button onClick={clearLogo} style={{ background: 'none', border: 'none', color: LA.ink3, fontSize: 12, cursor: 'pointer', textAlign: 'left', padding: 0, fontFamily: 'inherit' }}>Quitar logo</button>}
              {logoErr && <span style={{ fontSize: 12, color: '#C0392B' }}>{logoErr}</span>}
            </div>
          </div>
        </Card>

        <Card title="Empresa" desc="Datos que aparecen en tu sitio público.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={label}>Nombre</label><input style={field} value={form.name} onChange={e => set('name', e.target.value)} /></div>
            <div><label style={label}>Tagline</label><input style={field} value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="Frase corta de la inmobiliaria" /></div>
            <div><label style={label}>Dirección</label><input style={field} value={form.address} onChange={e => set('address', e.target.value)} /></div>
          </div>
        </Card>

        <Card title="Contacto" desc="Cómo te encuentran tus clientes.">
          <div className="rwd-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div><label style={label}>Teléfono / WhatsApp</label><input style={field} value={form.phone} onChange={e => set('phone', e.target.value)} /></div>
            <div><label style={label}>Email</label><input style={field} value={form.email} onChange={e => set('email', e.target.value)} /></div>
            <div><label style={label}>Instagram</label><input style={field} value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@usuario" /></div>
            <div><label style={label}>Horarios</label><input style={field} value={form.hours} onChange={e => set('hours', e.target.value)} /></div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, fontSize: 13, color: LA.ink2, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.whatsapp_auto} onChange={e => set('whatsapp_auto', e.target.checked)} />
            Respuesta automática de WhatsApp para nuevos leads
          </label>
        </Card>

        <Card title="SEO" desc="Cómo aparece tu sitio en buscadores.">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={label}>Título SEO</label><input style={field} value={form.seo_title} onChange={e => set('seo_title', e.target.value)} /></div>
            <div><label style={label}>Descripción SEO</label><textarea style={{ ...field, resize: 'vertical', minHeight: 80 }} value={form.seo_description} onChange={e => set('seo_description', e.target.value)} /></div>
          </div>
        </Card>

        <ZaireCredit name={form.name || 'NIMO'} color={LA.ink3} accent="var(--admin-accent, #FF6B6B)" style={{ marginTop: 8, paddingTop: 20, borderTop: `1px solid ${LA.border}` }} />
      </div>
    </div>
  )
}
