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

const COLOR: Record<string, string> = { starter: '#6A6A64', pro: '#FF6A00', business: '#A07C0A', enterprise: '#E71D0A' }
const FEATURES: Record<string, string[]> = {
  starter: ['30 propiedades', '2 usuarios', '1 layout', 'QR para carteles', 'Soporte por email'],
  pro: ['Propiedades ilimitadas', '4 usuarios', 'CRM con Kanban', 'WhatsApp integrado', '3 layouts premium', 'Fichas PDF'],
  business: ['Todo lo de Pro', '10 usuarios', 'Dominio propio', 'API + integraciones', 'Reportes avanzados'],
  enterprise: ['Todo ilimitado', 'Multi-sede', 'SLA garantizado', 'Manager dedicado', 'Implementación custom'],
}

export default function PlanesClient({ initialPlans }: { initialPlans: PlanRow[] }) {
  const router = useRouter()
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft] = useState({ monthly: 0, setup: 0 })
  const [saving, setSaving] = useState(false)

  const countByPlan = (code: string) => AGENCIES.filter(a => a.plan === code).length
  const mrr = (code: string, monthly: number) => AGENCIES.filter(a => a.plan === code && a.plan_status === 'active').length * monthly

  const startEdit = (p: PlanRow) => { setEditing(p.code); setDraft({ monthly: p.monthly, setup: p.setup }) }
  const save = async (code: string) => {
    setSaving(true)
    const res = await updatePlan(code, { monthly: draft.monthly, setup: draft.setup })
    setSaving(false)
    if (!res.ok) { alert('No se pudo guardar: ' + (res.error ?? 'error')); return }
    setEditing(null)
    router.refresh()
  }

  const num: React.CSSProperties = { width: 80, border: `2px solid ${ZR.black}`, padding: '4px 6px', fontFamily: ZR.display, fontSize: 18 }

  return (
    <div className="rwd-pad" style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: ZR.body, color: ZR.black }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
        <h1 style={{ fontFamily: ZR.display, fontSize: 'clamp(28px, 4vw, 40px)', margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>PLANES</h1>
        <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>Precios reales de la plataforma (Supabase). Lo que edites acá <b>se refleja en la landing</b>.</p>
      </div>

      <div className="dash-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {initialPlans.map(plan => {
          const c = COLOR[plan.code] ?? ZR.ink3
          const isEditing = editing === plan.code
          const count = countByPlan(plan.code)
          return (
            <div key={plan.code} className="z-block" style={{ padding: 24, position: 'relative', borderColor: plan.code === 'pro' ? c : ZR.black }}>
              {plan.code === 'pro' && <div style={{ position: 'absolute', top: -2, right: 16, fontFamily: ZR.display, fontSize: 9, background: c, color: ZR.white, padding: '4px 10px', textTransform: 'uppercase', letterSpacing: '.06em' }}>Popular</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: ZR.display, fontSize: 16, color: c, textTransform: 'uppercase' }}>{plan.name}</div>
                  {isEditing ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                      <label style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>USD/mes
                        <input type="number" value={draft.monthly} onChange={e => setDraft(d => ({ ...d, monthly: Number(e.target.value) }))} style={{ ...num, display: 'block', marginTop: 4 }} /></label>
                      <label style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>USD setup
                        <input type="number" value={draft.setup} onChange={e => setDraft(d => ({ ...d, setup: Number(e.target.value) }))} style={{ ...num, display: 'block', marginTop: 4 }} /></label>
                    </div>
                  ) : plan.code === 'enterprise' ? (
                    <div style={{ fontFamily: ZR.display, fontSize: 20, marginTop: 4 }}>A medida</div>
                  ) : (
                    <>
                      <div style={{ fontFamily: ZR.display, fontSize: 26, marginTop: 4 }}>USD {plan.monthly}<span style={{ fontFamily: ZR.body, fontSize: 12, fontWeight: 400, color: ZR.ink3 }}>/mes</span></div>
                      <div style={{ fontFamily: ZR.mono, fontSize: 10.5, color: ZR.orange, fontWeight: 700, marginTop: 4 }}>+ USD {plan.setup} setup</div>
                    </>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: ZR.display, fontSize: 24, color: c }}>{count}</div>
                  <div style={{ fontFamily: ZR.mono, fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em' }}>agencias</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                {(FEATURES[plan.code] ?? []).map(f => (
                  <div key={f} style={{ fontSize: 12, color: ZR.ink2, marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: c, fontFamily: ZR.display, fontSize: 10 }}>✓</span> {f}
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: 14, borderTop: `1px solid ${ZR.border}` }}>
                <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>MRR de este plan</div>
                <div style={{ fontFamily: ZR.display, fontSize: 18, color: plan.code !== 'enterprise' && count > 0 ? ZR.orange : ZR.ink3 }}>{plan.code === 'enterprise' ? 'Custom' : `$${mrr(plan.code, plan.monthly).toLocaleString()}`}</div>
              </div>

              {plan.code !== 'enterprise' && (
                isEditing ? (
                  <div style={{ display: 'flex', gap: 6, marginTop: 16 }}>
                    <button onClick={() => setEditing(null)} className="z-btn-bk" style={{ flex: 1, justifyContent: 'center' }}>CANCELAR</button>
                    <button onClick={() => save(plan.code)} disabled={saving} className="z-btn-bk is-orange" style={{ flex: 1, justifyContent: 'center' }}>{saving ? '…' : 'GUARDAR'}</button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(plan)} className="z-btn-bk" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>EDITAR PRECIOS</button>
                )
              )}
            </div>
          )
        })}
      </div>

      <div className="z-block rwd-tablewrap" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 14px', borderBottom: `2px solid ${ZR.black}`, fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em' }}>// AGENCIAS POR PLAN</div>
        {AGENCIES.map((agency, i) => {
          const sc = agency.plan_status === 'active' ? '#2D7D5F' : agency.plan_status === 'trial' ? '#A07C0A' : '#E71D0A'
          const sl = agency.plan_status === 'active' ? 'Activo' : agency.plan_status === 'trial' ? 'Trial' : 'Suspendido'
          return (
            <div key={agency.id} className="z-row rwd-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 130px', padding: '13px 24px', borderTop: i > 0 ? `1px solid ${ZR.border}` : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{agency.name}</div>
              <span style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, background: 'rgba(255,106,0,.1)', color: ZR.orange, padding: '3px 9px', textTransform: 'uppercase', width: 'fit-content' }}>{agency.plan}</span>
              <span style={{ fontFamily: ZR.mono, fontSize: 9, background: sc + '18', color: sc, padding: '3px 9px', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '.08em' }}>{sl}</span>
              <Link href={`/superadmin/agencias/${agency.slug}`} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: ZR.black, textDecoration: 'none', padding: '6px 12px', background: ZR.cream, border: `1px solid ${ZR.black}`, width: 'fit-content' }}>Cambiar plan</Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
