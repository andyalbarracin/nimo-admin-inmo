'use client'

/*
 * Archivo : agency-detail-live.tsx
 * Ruta    : src/components/superadmin/agency-detail-live.tsx
 * Modif.  : 2026-06-13
 * Descripción: Ficha de una agencia REAL (provisionada). Tabs: General,
 *              Comercial/Fiscal (editable), Documentos (bucket privado),
 *              Credenciales (secretos cifrados con "ojo"), Usuarios. Solo superadmin.
 */
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { updateAgencyFiscal } from '@/lib/agencies/provision'
import { uploadDocument, getDocumentUrl, deleteDocument, type AgencyDocument } from '@/lib/agencies/documents'
import { addCredential, revealCredential, deleteCredential, type AgencyCredential } from '@/lib/agencies/credentials'
import { setOnboardingEnabled } from '@/lib/agencies/onboarding'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF', border: '#DEDED4',
  ink2: '#4A4A47', ink3: '#8A8A83', orange: '#FF6A00', green: '#2D7D5F', red: '#E71D0A',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}
const lbl: React.CSSProperties = { fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5, display: 'block' }
const inp: React.CSSProperties = { width: '100%', background: ZR.white, border: `1px solid ${ZR.border}`, padding: '9px 12px', color: ZR.black, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: ZR.body }
const card: React.CSSProperties = { background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 8, padding: 24 }

const TAX = [
  { v: '', l: '—' },
  { v: 'responsable_inscripto', l: 'Responsable Inscripto' },
  { v: 'monotributo', l: 'Monotributo' },
  { v: 'exento', l: 'Exento' },
  { v: 'consumidor_final', l: 'Consumidor Final' },
]
const DOC_KINDS = [
  { v: 'payment', l: 'Pago' }, { v: 'proposal', l: 'Propuesta' },
  { v: 'budget', l: 'Presupuesto' }, { v: 'contract', l: 'Contrato' }, { v: 'other', l: 'Otro' },
]
const CRED_KINDS = [
  { v: 'api_key', l: 'API Key' }, { v: 'password', l: 'Contraseña' },
  { v: 'token', l: 'Token' }, { v: 'url', l: 'URL' }, { v: 'other', l: 'Otro' },
]

type Tab = 'general' | 'fiscal' | 'docs' | 'creds' | 'users'
const TABS: { id: Tab; label: string }[] = [
  { id: 'general', label: 'General' }, { id: 'fiscal', label: 'Comercial / Fiscal' },
  { id: 'docs', label: 'Documentos' }, { id: 'creds', label: 'Credenciales' }, { id: 'users', label: 'Usuarios' },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function AgencyDetailLive({ agency, documents, credentials }: { agency: any; documents: AgencyDocument[]; credentials: AgencyCredential[] }) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('general')

  return (
    <div style={{ padding: '36px 48px', minHeight: '100vh', background: ZR.cream, color: ZR.black, fontFamily: ZR.body }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
        <Link href="/superadmin/agencias" style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>← AGENCIAS</Link>
        <span style={{ color: ZR.border }}>/</span>
        <h1 style={{ fontFamily: ZR.display, fontSize: 22, margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{agency.name}</h1>
        <span style={{ fontFamily: ZR.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', background: ZR.green, color: ZR.white, padding: '2px 6px' }}>LIVE</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href={`/${agency.slug}`} target="_blank" style={{ fontSize: 12, color: ZR.ink2, textDecoration: 'none', padding: '8px 14px', background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4 }}>Ver sitio →</Link>
          <Link href={`/${agency.slug}/admin`} target="_blank" style={{ fontFamily: ZR.display, fontSize: 11, color: ZR.cream, textDecoration: 'none', padding: '8px 16px', background: ZR.orange, borderRadius: 4, letterSpacing: '.04em', textTransform: 'uppercase' }}>Ingresar como agencia</Link>
        </div>
      </div>
      <div style={{ height: 3, background: 'linear-gradient(90deg, #E71D0A 0 33.3%, #FF6A00 33.3% 66.6%, #FFC107 66.6% 100%)', borderRadius: 2, marginBottom: 20 }} />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', border: `2px solid ${ZR.black}`, fontFamily: ZR.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: tab === t.id ? ZR.black : ZR.white, color: tab === t.id ? ZR.cream : ZR.black, cursor: 'pointer' }}>{t.label}</button>
        ))}
      </div>

      {tab === 'general' && <GeneralTab agency={agency} />}
      {tab === 'fiscal' && <FiscalTab agency={agency} onSaved={() => router.refresh()} />}
      {tab === 'docs' && <DocsTab agencyId={agency.id} documents={documents} onChange={() => router.refresh()} />}
      {tab === 'creds' && <CredsTab agencyId={agency.id} credentials={credentials} onChange={() => router.refresh()} />}
      {tab === 'users' && <UsersTab agency={agency} />}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function GeneralTab({ agency }: { agency: any }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const enabled = !!agency.onboarding_enabled
  const completed = !!agency.onboarding_completed
  const toggle = () => start(async () => { await setOnboardingEnabled(agency.id, !enabled); router.refresh() })

  const fields = [
    { label: 'Nombre', value: agency.name },
    { label: 'Slug / URL', value: `/${agency.slug}` },
    { label: 'Plan', value: agency.plan?.name ?? agency.plan?.code ?? '—' },
    { label: 'Estado', value: agency.plan_status },
    { label: 'Email de contacto', value: agency.email_contact ?? '—' },
    { label: 'Fecha de alta', value: (agency.created_at ?? '').slice(0, 10) },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={card}>
        <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// DATOS DE LA AGENCIA</div>
        <div style={{ fontFamily: ZR.display, fontSize: 14, marginBottom: 18 }}>Información general</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {fields.map(f => (
            <div key={f.label}>
              <span style={lbl}>{f.label}</span>
              <div style={{ fontSize: 14, color: ZR.ink2, fontWeight: 500 }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// ONBOARDING</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontFamily: ZR.display, fontSize: 14, marginBottom: 2 }}>Wizard de primer login</div>
            <div style={{ fontSize: 12.5, color: ZR.ink3 }}>
              {completed ? 'Completado por la agencia ✓' : enabled ? 'Activado · pendiente de completar' : 'Desactivado'}
            </div>
          </div>
          <button onClick={toggle} disabled={pending} style={{ fontFamily: ZR.mono, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.04em', padding: '9px 16px', cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1, background: enabled ? ZR.white : ZR.green, color: enabled ? ZR.red : ZR.white, border: `2px solid ${enabled ? ZR.red : ZR.green}` }}>
            {pending ? '…' : enabled ? 'Desactivar' : 'Activar onboarding'}
          </button>
        </div>
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function FiscalTab({ agency, onSaved }: { agency: any; onSaved: () => void }) {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const [f, setF] = useState({
    business_name: agency.business_name ?? '', legal_id: agency.legal_id ?? '', cucicba_id: agency.cucicba_id ?? '',
    tax_condition: agency.tax_condition ?? '', billing_email: agency.billing_email ?? '', billing_address: agency.billing_address ?? '',
    phone: agency.phone ?? '', whatsapp_number: agency.whatsapp_number ?? '', address: agency.address ?? '',
    city: agency.city ?? '', province: agency.province ?? '', notes_internal: agency.notes_internal ?? '',
  })
  const set = (k: string, v: string) => setF(prev => ({ ...prev, [k]: v }))
  const save = () => { setMsg(null); start(async () => { const r = await updateAgencyFiscal(agency.id, f); setMsg(r.ok ? 'Guardado ✓' : (r.error ?? 'Error')); if (r.ok) onSaved() }) }

  const TEXT_FIELDS: { k: keyof typeof f; label: string; type?: string }[] = [
    { k: 'business_name', label: 'Razón social' },
    { k: 'legal_id', label: 'CUIT' },
    { k: 'cucicba_id', label: 'Matrícula (CUCICBA / colegio)' },
    { k: 'billing_email', label: 'Email de facturación', type: 'email' },
    { k: 'billing_address', label: 'Domicilio de facturación' },
    { k: 'phone', label: 'Teléfono' },
    { k: 'whatsapp_number', label: 'WhatsApp' },
    { k: 'address', label: 'Dirección' },
    { k: 'city', label: 'Ciudad' },
    { k: 'province', label: 'Provincia' },
  ]
  return (
    <div style={card}>
      <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// GESTIÓN COMERCIAL Y FISCAL</div>
      <div style={{ fontFamily: ZR.display, fontSize: 14, marginBottom: 18 }}>Datos comerciales / impositivos</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <div><span style={lbl}>Condición fiscal</span>
          <select style={inp} value={f.tax_condition} onChange={e => set('tax_condition', e.target.value)}>
            {TAX.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
          </select>
        </div>
        {TEXT_FIELDS.map(({ k, label, type }) => (
          <div key={k}><span style={lbl}>{label}</span><input style={inp} type={type ?? 'text'} value={f[k]} onChange={e => set(k, e.target.value)} /></div>
        ))}
      </div>
      <div style={{ marginBottom: 16 }}>
        <span style={lbl}>Notas internas (superadmin)</span>
        <textarea rows={3} style={{ ...inp, resize: 'vertical' }} value={f.notes_internal} onChange={e => set('notes_internal', e.target.value)} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={save} disabled={pending} className="z-btn-bk is-orange" style={{ cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1 }}>{pending ? 'GUARDANDO…' : '[ GUARDAR ]'}</button>
        {msg && <span style={{ fontSize: 12.5, color: msg.includes('✓') ? ZR.green : ZR.red }}>{msg}</span>}
      </div>
    </div>
  )
}

function DocsTab({ agencyId, documents, onChange }: { agencyId: string; documents: AgencyDocument[]; onChange: () => void }) {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('agency_id', agencyId)
    setMsg(null)
    start(async () => { const r = await uploadDocument(fd); setMsg(r.ok ? 'Subido ✓' : (r.error ?? 'Error')); if (r.ok) { form.reset(); onChange() } })
  }
  const open = (path: string) => start(async () => { const url = await getDocumentUrl(path); if (url) window.open(url, '_blank') })
  const del = (id: string, path: string) => { if (!confirm('¿Borrar documento?')) return; start(async () => { const r = await deleteDocument(id, path); if (r.ok) onChange(); else setMsg(r.error ?? 'Error') }) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <form onSubmit={onSubmit} style={card}>
        <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 14 }}>// SUBIR DOCUMENTO</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
          <div><span style={lbl}>Título</span><input name="title" style={inp} placeholder="Factura mayo" required /></div>
          <div><span style={lbl}>Tipo</span><select name="kind" style={inp} defaultValue="payment">{DOC_KINDS.map(k => <option key={k.v} value={k.v}>{k.l}</option>)}</select></div>
          <div><span style={lbl}>Monto</span><input name="amount" type="number" step="0.01" style={inp} placeholder="0" /></div>
          <div><span style={lbl}>Moneda</span><select name="currency" style={inp} defaultValue=""><option value="">—</option><option value="USD">USD</option><option value="ARS">ARS</option></select></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <input name="file" type="file" required style={{ fontSize: 12 }} />
          <button type="submit" disabled={pending} className="z-btn-bk is-orange" style={{ cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1 }}>{pending ? '…' : '[ SUBIR ]'}</button>
          {msg && <span style={{ fontSize: 12.5, color: msg.includes('✓') ? ZR.green : ZR.red }}>{msg}</span>}
        </div>
      </form>

      <div style={card}>
        <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 14 }}>// DOCUMENTOS ({documents.length})</div>
        {documents.length === 0 && <div style={{ color: ZR.ink3, fontSize: 13 }}>Sin documentos.</div>}
        {documents.map(d => (
          <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${ZR.border}` }}>
            <span style={{ fontFamily: ZR.mono, fontSize: 9, background: ZR.cream, padding: '3px 7px', textTransform: 'uppercase', color: ZR.ink2 }}>{DOC_KINDS.find(k => k.v === d.kind)?.l ?? d.kind}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{d.title}</div>
              <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3 }}>{d.created_at?.slice(0, 10)}{d.amount ? ` · ${d.currency ?? ''} ${d.amount}` : ''}</div>
            </div>
            <button onClick={() => open(d.file_path)} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: ZR.black, padding: '6px 9px', background: ZR.cream, border: `1px solid ${ZR.black}`, cursor: 'pointer' }}>VER</button>
            <button onClick={() => del(d.id, d.file_path)} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: ZR.red, padding: '6px 9px', background: ZR.white, border: `1px solid ${ZR.red}`, cursor: 'pointer' }}>BORRAR</button>
          </div>
        ))}
      </div>
    </div>
  )
}

function CredsTab({ agencyId, credentials, onChange }: { agencyId: string; credentials: AgencyCredential[]; onChange: () => void }) {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)
  const [revealed, setRevealed] = useState<Record<string, string>>({})
  const [form, setForm] = useState({ label: '', kind: 'api_key', url: '', username: '', secret: '' })
  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }))

  const add = () => { setMsg(null); start(async () => { const r = await addCredential({ agency_id: agencyId, ...form }); setMsg(r.ok ? 'Agregada ✓' : (r.error ?? 'Error')); if (r.ok) { setForm({ label: '', kind: 'api_key', url: '', username: '', secret: '' }); onChange() } }) }
  const reveal = (id: string) => { if (revealed[id] !== undefined) { setRevealed(p => { const n = { ...p }; delete n[id]; return n }); return } start(async () => { const r = await revealCredential(id); if (r.ok) setRevealed(p => ({ ...p, [id]: r.secret ?? '' })); else setMsg(r.error ?? 'Error') }) }
  const del = (id: string) => { if (!confirm('¿Borrar credencial?')) return; start(async () => { const r = await deleteCredential(id); if (r.ok) onChange(); else setMsg(r.error ?? 'Error') }) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={card}>
        <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// NUEVA CREDENCIAL</div>
        <div style={{ fontSize: 11.5, color: ZR.ink3, marginBottom: 14 }}>El secreto se cifra (AES-256-GCM). La DB nunca guarda el valor en claro.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: 12, marginBottom: 12 }}>
          <div><span style={lbl}>Label</span><input style={inp} value={form.label} onChange={e => set('label', e.target.value)} placeholder="Meta WhatsApp token" /></div>
          <div><span style={lbl}>Tipo</span><select style={inp} value={form.kind} onChange={e => set('kind', e.target.value)}>{CRED_KINDS.map(k => <option key={k.v} value={k.v}>{k.l}</option>)}</select></div>
          <div><span style={lbl}>URL (no sensible)</span><input style={inp} value={form.url} onChange={e => set('url', e.target.value)} placeholder="https://..." /></div>
          <div><span style={lbl}>Usuario (no sensible)</span><input style={inp} value={form.username} onChange={e => set('username', e.target.value)} /></div>
          <div style={{ gridColumn: 'span 2' }}><span style={lbl}>Secreto (se cifra)</span><input style={inp} value={form.secret} onChange={e => set('secret', e.target.value)} /></div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button onClick={add} disabled={pending} className="z-btn-bk is-orange" style={{ cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1 }}>{pending ? '…' : '[ AGREGAR ]'}</button>
          {msg && <span style={{ fontSize: 12.5, color: msg.includes('✓') ? ZR.green : ZR.red }}>{msg}</span>}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 14 }}>// CREDENCIALES ({credentials.length})</div>
        {credentials.length === 0 && <div style={{ color: ZR.ink3, fontSize: 13 }}>Sin credenciales.</div>}
        {credentials.map(c => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: `1px solid ${ZR.border}` }}>
            <span style={{ fontFamily: ZR.mono, fontSize: 9, background: ZR.cream, padding: '3px 7px', textTransform: 'uppercase', color: ZR.ink2 }}>{CRED_KINDS.find(k => k.v === c.kind)?.l ?? c.kind}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
              <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.ink3 }}>
                {c.url ? <a href={c.url} target="_blank" rel="noreferrer" style={{ color: ZR.orange }}>{c.url}</a> : null}{c.username ? ` · ${c.username}` : ''}
                {c.has_secret && <> · 🔒 {revealed[c.id] !== undefined ? <strong style={{ color: ZR.black }}>{revealed[c.id] || '(vacío)'}</strong> : '•••••••'}</>}
              </div>
            </div>
            {c.has_secret && <button onClick={() => reveal(c.id)} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: ZR.black, padding: '6px 9px', background: ZR.cream, border: `1px solid ${ZR.black}`, cursor: 'pointer' }}>{revealed[c.id] !== undefined ? 'OCULTAR' : '👁 VER'}</button>}
            <button onClick={() => del(c.id)} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: ZR.red, padding: '6px 9px', background: ZR.white, border: `1px solid ${ZR.red}`, cursor: 'pointer' }}>BORRAR</button>
          </div>
        ))}
      </div>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UsersTab({ agency }: { agency: any }) {
  return (
    <div style={card}>
      <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// USUARIOS</div>
      <div style={{ fontFamily: ZR.display, fontSize: 14, marginBottom: 12 }}>Equipo de la agencia</div>
      <div style={{ fontSize: 13, color: ZR.ink2, marginBottom: 8 }}>Owner: <strong>{agency.email_contact ?? '—'}</strong></div>
      <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.ink3, background: ZR.cream, border: `1px dashed ${ZR.border}`, padding: '10px 12px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '.06em' }}>
        Invitar / gestionar equipo · próximamente
      </div>
    </div>
  )
}
