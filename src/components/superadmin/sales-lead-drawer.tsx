'use client'

import { useRef, useState } from 'react'
import { uploadCrmFile } from '@/lib/crm/upload-action'
import type { SalesLead, SalesFile } from '@/lib/sales-crm/server'

export type { SalesLead, SalesFile }

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF', border: '#DEDED4',
  ink2: '#4A4A47', ink3: '#8A8A83', orange: '#FF6A00', green: '#2D7D5F', red: '#E71D0A',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}

const PLANS = ['Starter', 'Pro', 'Business', 'Enterprise']
const SOURCES = ['Recomendación', 'Búsqueda web', 'Instagram', 'Evento / feria', 'Llamada en frío', 'Webinar', 'Otro']

export default function SalesLeadDrawer({ lead, isNew, onSave, onDelete, onClose }: {
  lead: SalesLead; isNew: boolean
  onSave: (l: SalesLead) => void; onDelete: (id: string) => void; onClose: () => void
}) {
  const [form, setForm] = useState<SalesLead>(lead)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const set = <K extends keyof SalesLead>(k: K, v: SalesLead[K]) => setForm(f => ({ ...f, [k]: v }))

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.set('file', file)
    const res = await uploadCrmFile(fd)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
    if (!res.ok || !res.url) { alert('No se pudo subir: ' + (res.error ?? 'error')); return }
    setForm(f => ({ ...f, files: [...f.files, { name: res.name ?? file.name, url: res.url! }] }))
  }
  const removeFile = (url: string) => setForm(f => ({ ...f, files: f.files.filter(x => x.url !== url) }))

  const field: React.CSSProperties = { width: '100%', background: ZR.white, border: `1px solid ${ZR.border}`, padding: '9px 11px', fontSize: 13, color: ZR.black, fontFamily: ZR.body, outline: 'none', boxSizing: 'border-box' }
  const label: React.CSSProperties = { fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5, display: 'block' }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.35)', zIndex: 300 }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(480px, 100vw)', background: ZR.cream, borderLeft: `2px solid ${ZR.black}`, zIndex: 301, display: 'flex', flexDirection: 'column', fontFamily: ZR.body }}>
        <div style={{ padding: '18px 22px', borderBottom: `2px solid ${ZR.black}`, background: ZR.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em' }}>// {isNew ? 'NUEVO CLIENTE' : 'FICHA DE CLIENTE'}</div>
            <h2 style={{ fontFamily: ZR.display, fontSize: 18, margin: '4px 0 0', textTransform: 'uppercase' }}>{form.company || 'Sin nombre'}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ZR.ink3, fontSize: 24, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label style={label}>Inmobiliaria *</label><input style={field} value={form.company} onChange={e => set('company', e.target.value)} /></div>
            <div><label style={label}>Contacto</label><input style={field} value={form.contact} onChange={e => set('contact', e.target.value)} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label style={label}>Email</label><input style={field} value={form.email} onChange={e => set('email', e.target.value)} placeholder="contacto@..." /></div>
            <div><label style={label}>Ciudad</label><input style={field} value={form.city} onChange={e => set('city', e.target.value)} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div><label style={label}>Teléfono 1</label><input style={field} value={form.phone1} onChange={e => set('phone1', e.target.value)} /></div>
            <div><label style={label}>Teléfono 2</label><input style={field} value={form.phone2} onChange={e => set('phone2', e.target.value)} /></div>
          </div>
          <div><label style={label}>Dirección</label><input style={field} value={form.address} onChange={e => set('address', e.target.value)} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, borderTop: `1px solid ${ZR.border}`, paddingTop: 14 }}>
            <div><label style={label}>Plan interés</label>
              <select style={{ ...field, cursor: 'pointer' }} value={form.plan} onChange={e => set('plan', e.target.value)}>{PLANS.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label style={label}>MRR (USD)</label><input type="number" style={field} value={form.monthly} onChange={e => set('monthly', Number(e.target.value))} /></div>
            <div><label style={label}>Presupuesto</label><input style={field} value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="Anual…" /></div>
          </div>
          <div><label style={label}>¿Cómo nos conoció?</label>
            <select style={{ ...field, cursor: 'pointer' }} value={form.source} onChange={e => set('source', e.target.value)}>
              <option value="">Sin especificar</option>{SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select></div>
          <div><label style={label}>Observaciones</label><textarea style={{ ...field, resize: 'vertical', minHeight: 80 }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notas de venta, objeciones, próximos pasos…" /></div>

          {/* Archivos (Storage) */}
          <div style={{ borderTop: `1px solid ${ZR.border}`, paddingTop: 14 }}>
            <label style={label}>Archivos · propuesta / handoff / invoice (PDF)</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {form.files.length === 0 && <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.06em' }}>Sin archivos</div>}
              {form.files.map(f => (
                <div key={f.url} style={{ display: 'flex', alignItems: 'center', gap: 8, border: `1px solid ${ZR.border}`, background: ZR.white, padding: '8px 10px' }}>
                  <span style={{ fontFamily: ZR.mono, fontSize: 9, fontWeight: 700, color: ZR.orange }}>PDF</span>
                  <a href={f.url} target="_blank" rel="noreferrer" style={{ flex: 1, fontSize: 12, color: ZR.black, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</a>
                  <a href={f.url} target="_blank" rel="noreferrer" style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink2, textDecoration: 'none' }}>VER ↗</a>
                  <button onClick={() => removeFile(f.url)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: ZR.red, fontSize: 14, lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,image/*" onChange={onFile} style={{ display: 'none' }} />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="z-btn-bk" style={{ width: '100%', justifyContent: 'center' }}>
              {uploading ? 'SUBIENDO…' : '[ + SUBIR ARCHIVO ]'}
            </button>
          </div>
        </div>

        <div style={{ padding: '14px 22px', borderTop: `2px solid ${ZR.black}`, background: ZR.white, display: 'flex', gap: 8, alignItems: 'center' }}>
          {!isNew && <button onClick={() => onDelete(form.id)} className="z-btn-bk" style={{ color: ZR.red, borderColor: ZR.red }}>ELIMINAR</button>}
          <button onClick={onClose} className="z-btn-bk" style={{ marginLeft: 'auto' }}>CANCELAR</button>
          <button onClick={() => onSave(form)} disabled={!form.company.trim()} className="z-btn-bk is-orange">{isNew ? 'CREAR' : 'GUARDAR'}</button>
        </div>
      </div>
    </>
  )
}
