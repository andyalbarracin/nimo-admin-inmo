'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AGENCIES } from '@/lib/dummy'
import { updatePlan } from '@/lib/plans/actions'
import type { PlanRow } from '@/lib/plans/server'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF', border: '#DEDED4',
  ink2: '#4A4A47', ink3: '#8A8A83', orange: '#FF6A00', green: '#2D7D5F',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}

const COLOR: Record<string, string> = { esencial: '#6A6A64', profesional: '#FF6A00', a_medida: '#E71D0A' }

interface Draft { name: string; monthly: number; setup: number; features: string; highlighted: boolean }

export default function PlanesClient({ initialPlans }: { initialPlans: PlanRow[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState<Draft>({ name: '', monthly: 0, setup: 0, features: '', highlighted: false })
  const [saving, setSaving] = useState(false)

  const countByPlan = (code: string) => AGENCIES.filter(a => a.plan === code).length
  const mrr = (code: string, monthly: number) => AGENCIES.filter(a => a.plan === code && a.plan_status === 'active').length * monthly

  const startEdit = (p: PlanRow) => { setEditing(p.code); setDraft({ name: p.name, monthly: p.monthly, setup: p.setup, features: p.features.join('\n'), highlighted: p.highlighted }) }
  const save = async (code: string) => {
    setSaving(true)
    const res = await updatePlan(code, {
      name: draft.name,
      monthly: draft.monthly,
      setup: draft.setup,
      features: draft.features.split('\n').map(s => s.trim()).filter(Boolean),
      highlighted: draft.highlighted,
    })
    setSaving(false)
    if (!res.ok) { alert('No se pudo guardar: ' + (res.error ?? 'error')); return }
    setEditing(null)
    router.refresh()
  }

  const num: React.CSSProperties = { width: 90, border: `2px solid ${ZR.black}`, padding: '4px 6px', fontFamily: ZR.display, fontSize: 18 }
  const inp: React.CSSProperties = { width: '100%', border: `1px solid ${ZR.black}`, padding: '6px 8px', fontFamily: ZR.body, fontSize: 13, boxSizing: 'border-box' }
  const lbl: React.CSSProperties = { fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }

  return (
    <div className="rwd-pad" style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: ZR.body, color: ZR.black }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
        <h1 style={{ fontFamily: ZR.display, fontSize: 'clamp(28px, 4vw, 40px)', margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>PLANES</h1>
        <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>Precios reales de la plataforma. Lo que edites acá <b>se refleja en la landing</b>.</p>
      </div>

      <div className="dash-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {initialPlans.map(plan => {
          const c = COLOR[plan.code] ?? ZR.ink3
          const isEditing = editing === plan.code
          const count = countByPlan(plan.code)
          const isCustom = plan.code === 'a_medida'
          return (
            <div key={plan.code} className="z-block" style={{ padding: 24, position: 'relative', borderColor: plan.highlighted ? c : ZR.black }}>
              {plan.highlighted && <div style={{ position: 'absolute', top: -2, right: 16, fontFamily: ZR.display, fontSize: 9, background: c, color: ZR.white, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Popular</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontFamily: ZR.display, fontSize: 16, color: c, textTransform: 'uppercase' }}>{plan.name}</div>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                      <label style={lbl}>Nombre<input value={draft.name} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} style={{ ...inp, marginTop: 4 }} /></label>
                      <label style={lbl}>USD/mes
                        <input type="number" value={draft.monthly} onChange={e => setDraft(d => ({ ...d, monthly: Number(e.target.value) }))} style={{ ...num, display: 'block', marginTop: 4 }} /></label>
                      <label style={lbl}>USD setup
                        <input type="number" value={draft.setup} onChange={e => setDraft(d => ({ ...d, setup: Number(e.target.value) }))} style={{ ...num, display: 'block', marginTop: 4 }} /></label>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontFamily: ZR.display, fontSize: 26, marginTop: 4 }}>{isCustom ? 'Desde ' : ''}USD {plan.monthly}<span style={{ fontFamily: ZR.body, fontSize: 12, fontWeight: 400, color: ZR.ink3 }}>/mes</span></div>
                      <div style={{ fontFamily: ZR.mono, fontSize: 10.5, color: ZR.orange, fontWeight: 700, marginTop: 4 }}>{isCustom ? 'Desde ' : '+ '}USD {plan.setup} setup</div>
                    </>
                  )}
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: ZR.display, fontSize: 24, color: c }}>{count}</div>
                  <div style={{ fontFamily: ZR.mono, fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em' }}>agencias</div>
                </div>
              </div>

              {isEditing ? (
                <label style={{ ...lbl, display: 'block', marginBottom: 16 }}>Features (una por línea)
                  <textarea value={draft.features} onChange={e => setDraft(d => ({ ...d, features: e.target.value }))} rows={6} style={{ ...inp, marginTop: 4, resize: 'vertical', fontFamily: ZR.body }} />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, textTransform: 'none', letterSpacing: 0, fontSize: 12, color: ZR.ink2 }}>
                    <input type="checkbox" checked={draft.highlighted} onChange={e => setDraft(d => ({ ...d, highlighted: e.target.checked }))} /> Destacado (badge &quot;Popular&quot;)
                  </label>
                </label>
              ) : (
                <div style={{ marginBottom: 16 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ fontSize: 12, color: ZR.ink2, marginBottom: 6, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: c, fontFamily: ZR.display, fontSize: 10, marginTop: 1 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
              )}

              <div style={{ paddingTop: 14, borderTop: `1px solid ${ZR.border}` }}>
                <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>MRR de este plan</div>
                <div style={{ fontFamily: ZR.display, fontSize: 18, color: count > 0 ? ZR.orange : ZR.ink3 }}>${mrr(plan.code, plan.monthly).toLocaleString()}</div>
              </div>

              {isEditing ? (
                <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
                  <button onClick={() => setEditing(null)} className="z-btn-bk" style={{ flex: 1, justifyContent: 'center' }}>CANCELAR</button>
                  <button onClick={() => save(plan.code)} disabled={saving} className="z-btn-bk is-orange" style={{ flex: 1, justifyContent: 'center' }}>{saving ? '…' : 'GUARDAR'}</button>
                </div>
              ) : (
                <button onClick={() => startEdit(plan)} className="z-btn-bk" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>EDITAR PRECIOS</button>
              )}
            </div>
          )
        })}
      </div>

      <div className="z-block rwd-tablewrap" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 14px', borderBottom: `2px solid ${ZR.black}`, fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em' }}>// AGENCIAS POR PLAN</div>
        {AGENCIES.map((agency, i) => {
          const active = agency.plan_status === 'active'
          const sc = active ? '#2D7D5F' : '#E71D0A'
          const sl = active ? 'Activo' : 'Suspendido'
          return (
            <div key={agency.id} className="z-row rwd-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 130px', padding: '13px 24px', borderTop: i > 0 ? `1px solid ${ZR.border}` : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{agency.name}</div>
              <span style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, background: 'rgba(255,106,0,.1)', color: ZR.orange, padding: '3px 9px', textTransform: 'uppercase', width: 'fit-content' }}>{agency.plan.replace('_', ' ')}</span>
              <span style={{ fontFamily: ZR.mono, fontSize: 9, background: sc + '18', color: sc, padding: '3px 9px', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '.08em' }}>{sl}</span>
              <Link href={`/superadmin/agencias/${agency.slug}`} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: ZR.black, textDecoration: 'none', padding: '6px 12px', background: ZR.cream, border: `1px solid ${ZR.black}`, width: 'fit-content' }}>Cambiar plan</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
