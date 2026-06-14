'use client'

/*
 * Archivo : new-agency-modal.tsx
 * Ruta    : src/components/superadmin/new-agency-modal.tsx
 * Modif.  : 2026-06-13
 * Descripción: Modal de alta rápida de inmobiliaria (provisioning). Crea un tenant
 *              real (agencia + owner + theme + settings) vía la server action
 *              createAgency. Puede venir pre-cargado desde un lead del CRM.
 */
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createAgency } from '@/lib/agencies/provision'
import { slugify } from '@/lib/utils/slug'
import type { PlanId } from '@/lib/plans/server'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF', border: '#DEDED4',
  ink3: '#8A8A83', orange: '#FF6A00', red: '#E71D0A',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}

const PLAN_OPTIONS: { code: PlanId; label: string }[] = [
  { code: 'esencial', label: 'Esencial' },
  { code: 'profesional', label: 'Profesional' },
  { code: 'a_medida', label: 'A medida' },
]

const lbl: React.CSSProperties = { fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 5, display: 'block' }
const inp: React.CSSProperties = { width: '100%', background: ZR.white, border: `2px solid ${ZR.black}`, padding: '9px 12px', color: ZR.black, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: ZR.body }

export default function NewAgencyModal({
  open, onClose, prefill,
}: {
  open: boolean
  onClose: () => void
  prefill?: { name?: string; email?: string; crmLeadId?: string }
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState(prefill?.name ?? '')
  const [slug, setSlug] = useState(prefill?.name ? slugify(prefill.name) : '')
  const [slugTouched, setSlugTouched] = useState(false)
  const [planCode, setPlanCode] = useState<PlanId>('esencial')
  const [ownerEmail, setOwnerEmail] = useState(prefill?.email ?? '')
  const [ownerPassword, setOwnerPassword] = useState('')

  if (!open) return null

  const onName = (v: string) => {
    setName(v)
    if (!slugTouched) setSlug(slugify(v))
  }

  const genPassword = () => {
    const p = Array.from({ length: 14 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$'[Math.floor(Math.random() * 58)]).join('')
    setOwnerPassword(p)
  }

  const submit = () => {
    setError(null)
    startTransition(async () => {
      const res = await createAgency({
        name, slug, planCode, ownerEmail, ownerPassword, crmLeadId: prefill?.crmLeadId,
      })
      if (!res.ok) { setError(res.error ?? 'Error desconocido'); return }
      router.push(`/superadmin/agencias/${res.slug}`)
      router.refresh()
      onClose()
    })
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(17,17,17,.55)', zIndex: 500, display: 'grid', placeItems: 'center', padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: ZR.cream, border: `2px solid ${ZR.black}`, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto', fontFamily: ZR.body, color: ZR.black }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #E71D0A 0 33.3%, #FF6A00 33.3% 66.6%, #FFC107 66.6% 100%)' }} />
        <div style={{ padding: '24px 28px' }}>
          <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// PROVISIONING</div>
          <h2 style={{ fontFamily: ZR.display, fontSize: 24, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '-.01em' }}>Nueva agencia</h2>
          <p style={{ fontSize: 12.5, color: ZR.ink3, margin: '0 0 20px' }}>Crea el tenant y su usuario owner. Lo fiscal, documentos y credenciales se cargan después en la ficha.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={lbl}>Nombre de la inmobiliaria</label>
              <input style={inp} value={name} onChange={e => onName(e.target.value)} placeholder="López & Asociados" />
            </div>
            <div>
              <label style={lbl}>Slug (URL)</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <span style={{ fontFamily: ZR.mono, fontSize: 12, color: ZR.ink3, padding: '9px 8px 9px 0' }}>/</span>
                <input style={inp} value={slug} onChange={e => { setSlugTouched(true); setSlug(slugify(e.target.value)) }} placeholder="lopez-asociados" />
              </div>
            </div>
            <div>
              <label style={lbl}>Plan</label>
              <select style={inp} value={planCode} onChange={e => setPlanCode(e.target.value as PlanId)}>
                {PLAN_OPTIONS.map(p => <option key={p.code} value={p.code}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label style={lbl}>Email del owner</label>
              <input style={inp} type="email" value={ownerEmail} onChange={e => setOwnerEmail(e.target.value)} placeholder="owner@inmobiliaria.com" />
            </div>
            <div>
              <label style={lbl}>Contraseña inicial del owner</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input style={inp} value={ownerPassword} onChange={e => setOwnerPassword(e.target.value)} placeholder="mín. 8 caracteres" />
                <button type="button" onClick={genPassword} style={{ flexShrink: 0, fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, background: ZR.white, border: `2px solid ${ZR.black}`, padding: '0 12px', cursor: 'pointer', textTransform: 'uppercase' }}>Generar</button>
              </div>
            </div>
          </div>

          {error && <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(231,29,10,.08)', border: `1px solid ${ZR.red}`, color: ZR.red, fontSize: 12.5 }}>{error}</div>}

          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button onClick={submit} disabled={pending} className="z-btn-bk is-orange" style={{ flex: 1, opacity: pending ? .6 : 1, cursor: pending ? 'default' : 'pointer' }}>
              {pending ? 'CREANDO…' : '[ CREAR AGENCIA ]'}
            </button>
            <button onClick={onClose} disabled={pending} style={{ fontFamily: ZR.mono, fontSize: 11, fontWeight: 700, background: ZR.white, border: `2px solid ${ZR.black}`, padding: '0 18px', cursor: 'pointer', textTransform: 'uppercase' }}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
