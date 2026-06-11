'use client'

import { useState } from 'react'

const ZR = {
  black: '#111111', cream: '#F5F5F0', cream2: '#FFFFFF', border: '#DEDED4',
  ink2: '#4A4A47', ink3: '#8A8A83', orange: '#FF6A00', green: '#2D7D5F', red: '#E71D0A', yellow: '#D4A017',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}

const PLANS = ['starter', 'pro', 'business', 'enterprise']
type Status = 'active' | 'trial' | 'suspended'
const STATUS_META: Record<Status, { label: string; color: string }> = {
  active: { label: 'Activo', color: ZR.green },
  trial: { label: 'Trial', color: ZR.yellow },
  suspended: { label: 'Suspendido', color: ZR.red },
}

const card: React.CSSProperties = { background: ZR.cream2, border: `1px solid ${ZR.border}`, borderRadius: 8, padding: 20 }
const mono: React.CSSProperties = { fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }
const title: React.CSSProperties = { fontFamily: ZR.display, fontSize: 13, color: ZR.black, marginBottom: 12 }

export default function AgencyControls({ plan: initialPlan, status: initialStatus }: { plan: string; status: Status }) {
  const [plan, setPlan] = useState(initialPlan)
  const [selPlan, setSelPlan] = useState(initialPlan)
  const [status, setStatus] = useState<Status>(initialStatus)
  const [toast, setToast] = useState<string | null>(null)

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2200) }
  const applyPlan = () => { setPlan(selPlan); flash(`Plan cambiado a ${selPlan}`) }
  const setSt = (s: Status) => { setStatus(s); flash(`Cuenta: ${STATUS_META[s].label}`) }

  return (
    <>
      {/* Plan */}
      <div style={card}>
        <div style={mono}>// PLAN</div>
        <div style={title}>Control del plan</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {PLANS.map(p => (
            <button key={p} onClick={() => setSelPlan(p)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 4, background: p === selPlan ? 'rgba(255,106,0,.1)' : ZR.cream, border: `1px solid ${p === selPlan ? 'rgba(255,106,0,.4)' : ZR.border}`, cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: 6, height: 6, borderRadius: 99, background: p === selPlan ? ZR.orange : ZR.border, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: p === selPlan ? ZR.orange : ZR.ink2, fontWeight: p === selPlan ? 700 : 400, textTransform: 'capitalize', fontFamily: ZR.body }}>{p}</span>
              {p === plan && <span style={{ marginLeft: 'auto', fontFamily: ZR.mono, fontSize: 8, color: ZR.green, textTransform: 'uppercase', letterSpacing: '.08em' }}>actual</span>}
            </button>
          ))}
        </div>
        <button onClick={applyPlan} disabled={selPlan === plan} style={{ width: '100%', marginTop: 10, fontFamily: ZR.display, background: selPlan === plan ? ZR.border : ZR.black, color: selPlan === plan ? ZR.ink3 : ZR.cream, padding: '10px', borderRadius: 4, fontWeight: 900, fontSize: 11, border: 'none', cursor: selPlan === plan ? 'not-allowed' : 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          CAMBIAR PLAN
        </button>
      </div>

      {/* Estado */}
      <div style={card}>
        <div style={mono}>// ESTADO</div>
        <div style={title}>Control de cuenta · <span style={{ color: STATUS_META[status].color }}>{STATUS_META[status].label}</span></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button onClick={() => setSt('active')} disabled={status === 'active'} style={{ padding: '9px', background: 'rgba(45,125,95,.08)', border: `1px solid ${status === 'active' ? ZR.green : 'rgba(45,125,95,.2)'}`, borderRadius: 4, color: ZR.green, fontSize: 12, cursor: status === 'active' ? 'default' : 'pointer', fontFamily: ZR.body, fontWeight: status === 'active' ? 700 : 400 }}>Activar cuenta</button>
          <button onClick={() => setSt('trial')} disabled={status === 'trial'} style={{ padding: '9px', background: 'rgba(212,160,23,.08)', border: `1px solid ${status === 'trial' ? ZR.yellow : 'rgba(212,160,23,.2)'}`, borderRadius: 4, color: ZR.yellow, fontSize: 12, cursor: status === 'trial' ? 'default' : 'pointer', fontFamily: ZR.body, fontWeight: status === 'trial' ? 700 : 400 }}>Resetear a trial</button>
          <button onClick={() => setSt('suspended')} disabled={status === 'suspended'} style={{ padding: '9px', background: 'rgba(231,29,10,.06)', border: `1px solid ${status === 'suspended' ? ZR.red : 'rgba(231,29,10,.2)'}`, borderRadius: 4, color: ZR.red, fontSize: 12, cursor: status === 'suspended' ? 'default' : 'pointer', fontFamily: ZR.body, fontWeight: status === 'suspended' ? 700 : 400 }}>Suspender cuenta</button>
        </div>
      </div>

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: ZR.black, color: ZR.cream, padding: '12px 18px', borderRadius: 6, fontFamily: ZR.mono, fontSize: 11, letterSpacing: '.04em', textTransform: 'uppercase', boxShadow: '0 12px 40px rgba(0,0,0,.3)' }}>
          ✓ {toast}
        </div>
      )}
    </>
  )
}
