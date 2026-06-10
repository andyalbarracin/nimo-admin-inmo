import Link from 'next/link'
import { AGENCIES, PLATFORM_STATS } from '@/lib/dummy'

/* ============================================================
 * Universo B · ZAIRE · Dashboard superadmin — fidelidad B1.
 * ============================================================ */

const ZR = {
  black: '#111111',
  cream: '#F5F5F0',
  cream2: '#FFFFFF',
  ink2: '#4A4A47',
  ink3: '#8A8A83',
  orange: '#FF6A00',
  red: '#E71D0A',
  yellow: '#FFC107',
  green: '#2D7D5F',
  line: '#DEDED4',
  display: "var(--font-archivo-black), 'Archivo Black', system-ui, sans-serif",
  body: "var(--font-archivo), system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', ui-monospace, monospace",
}

const MRR_SPARK = [28, 42, 38, 65, 52, 78, 70, 88, 95, 80, 92, 100]
const LEADS_SPARK = [40, 55, 48, 62, 58, 80, 72, 90, 84, 96, 88, 100]

const PLAN_META: Record<string, { label: string; color: string; mrr: number }> = {
  starter: { label: 'STARTER', color: ZR.ink3, mrr: 39 },
  pro: { label: 'PRO', color: ZR.orange, mrr: 79 },
  business: { label: 'BUSINESS', color: ZR.yellow, mrr: 149 },
  enterprise: { label: 'ENTERPRISE', color: ZR.red, mrr: 299 },
}
const PLAN_ORDER = ['starter', 'pro', 'business', 'enterprise'] as const

const SERVICES: [string, string, 'ok' | 'warn' | 'crit'][] = [
  ['SUPABASE API', '45ms', 'ok'],
  ['STORAGE', 'OK', 'ok'],
  ['EMAILS · RESEND', 'OK', 'ok'],
  ['OPENROUTER', '112ms', 'ok'],
  ['WHATSAPP CLOUD', 'DEGRADED', 'warn'],
  ['VERCEL', 'OK', 'ok'],
  ['STRIPE', '218ms', 'ok'],
]

const EVENTS: [string, string][] = [
  ['5MIN', 'AGENCIA REGISTRADA · CASTELAR CENTRO'],
  ['1H', 'UPGRADE PRO→BUSINESS · BOUTIQUE DEL PLATA'],
  ['3H', 'WHATSAPP WEBHOOK TIMEOUT · RETRY 3/3'],
  ['5H', 'BACKUP COMPLETADO · TODAS LAS AGENCIAS'],
  ['8H', 'PROMPT DEPLOYED · LEAD_SCORING_V3'],
]

export default function SuperadminDashboard() {
  const total = AGENCIES.length
  const counts = PLAN_ORDER.map(p => ({ plan: p, count: AGENCIES.filter(a => a.plan === p).length }))
  const okServices = SERVICES.filter(s => s[2] === 'ok').length

  // donut
  const R = 40
  const C = 2 * Math.PI * R
  let acc = 0
  const segments = counts
    .filter(c => c.count > 0)
    .map(c => {
      const len = (c.count / total) * C
      const seg = { color: PLAN_META[c.plan]!.color, dash: len, offset: -acc }
      acc += len
      return seg
    })

  const topAgencies = [...AGENCIES].sort((a, b) => b.mrr - a.mrr)

  return (
    <div style={{ padding: '36px 40px 64px', minHeight: '100vh', background: ZR.cream, fontFamily: ZR.body, color: ZR.black }}>
      {/* HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontFamily: ZR.mono, fontSize: 11.5, letterSpacing: '.14em', textTransform: 'uppercase', color: ZR.ink3 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, background: ZR.green, borderRadius: 99, boxShadow: '0 0 0 3px rgba(45,125,95,.22)' }} />
              // VISTA GLOBAL · ÚLTIMOS 30 DÍAS
            </span>
          </div>
          <h1 style={{ fontFamily: ZR.display, fontSize: 'clamp(48px, 6vw, 80px)', letterSpacing: '.01em', lineHeight: 0.92, textTransform: 'uppercase', margin: '14px 0 10px' }}>
            OPER<span style={{ color: ZR.orange }}>A</span>CIONES
          </h1>
          <p style={{ fontFamily: ZR.mono, fontSize: 13, letterSpacing: '.04em', color: ZR.ink3, margin: 0, textTransform: 'uppercase' }}>
            {PLATFORM_STATS.active_agencies} inmobiliarias activas · MRR USD {PLATFORM_STATS.mrr.toLocaleString('es-AR')} · {PLATFORM_STATS.total_leads} leads este mes
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="z-btn-bk">[ ÚLTIMOS 30 DÍAS ▾ ]</span>
          <span className="z-btn-bk">[ EXPORT CSV ]</span>
          <Link href="/superadmin/planes" className="z-btn-bk is-orange">[ + AGENCIA ]</Link>
        </div>
      </div>

      {/* STRIPE */}
      <div className="z-stripe-3" style={{ margin: '24px 0' }} />

      {/* KPI BENTO */}
      <div className="dash-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0, marginBottom: 16 }}>
        <KpiCard label="MRR ESTIMADO" sup="USD" value={PLATFORM_STATS.mrr.toLocaleString('es-AR')} subDelta={`↑ +${PLATFORM_STATS.monthly_growth}%`} subRest="· META USD 5K" borderRight />
        <KpiCard label="INMOBILIARIAS" value={String(PLATFORM_STATS.total_agencies)} bar={(PLATFORM_STATS.active_agencies / 50) * 100} barSub={`${PLATFORM_STATS.active_agencies} / 50 · LÍMITE PLAN`} borderRight />
        <KpiCard label="LEADS PROCESADOS" value={PLATFORM_STATS.total_leads.toLocaleString('es-AR')} spark={LEADS_SPARK} subDelta="↑ +24%" subRest="· 30 DÍAS" borderRight />
        <KpiCard label="MRR ANUAL (ARR)" sup="USD" value={PLATFORM_STATS.arr.toLocaleString('es-AR')} spark={MRR_SPARK} subRest="· PROYECTADO" />
      </div>

      {/* BODY */}
      <div className="dash-2col" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 14 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* DONUT */}
          <section className="z-block" style={{ padding: 24 }}>
            <BlockHead title="INMOBILIARIAS POR PLAN" right={`TOTAL ${total}`} />
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 28, alignItems: 'center', marginTop: 16 }}>
              <div style={{ position: 'relative', width: 200, height: 200 }}>
                <svg viewBox="0 0 100 100" width="200" height="200" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="50" cy="50" r={R} fill="none" stroke={ZR.line} strokeWidth="18" />
                  {segments.map((s, i) => (
                    <circle key={i} cx="50" cy="50" r={R} fill="none" stroke={s.color} strokeWidth="18" strokeDasharray={`${s.dash} ${C}`} strokeDashoffset={s.offset} />
                  ))}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
                  <div>
                    <div style={{ fontFamily: ZR.display, fontSize: 44, lineHeight: 1 }}>{total}</div>
                    <div style={{ fontFamily: ZR.mono, fontSize: 9.5, letterSpacing: '.14em', color: ZR.ink3, textTransform: 'uppercase', marginTop: 4 }}>AGENCIAS</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {counts.map(c => (
                  <div key={c.plan} style={{ display: 'grid', gridTemplateColumns: '18px 1fr auto', gap: 12, alignItems: 'center', padding: '10px 14px', border: `1px solid ${ZR.black}` }}>
                    <span style={{ width: 18, height: 18, background: c.count > 0 ? PLAN_META[c.plan]!.color : ZR.line }} />
                    <span style={{ fontFamily: ZR.mono, fontSize: 12, letterSpacing: '.08em', fontWeight: 700, textTransform: 'uppercase' }}>// {PLAN_META[c.plan]!.label}</span>
                    <span style={{ fontFamily: ZR.display, fontSize: 18 }}>{c.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* TOP TABLE */}
          <section className="z-block" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 16px' }}>
              <BlockHead title="TOP INMOBILIARIAS · POR MRR" rightHref={{ label: '[ VER TODAS → ]', href: '/superadmin/agencias' }} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['#', 'NOMBRE', 'PLAN', 'PROPS', 'LEADS', 'MRR', 'ESTADO'].map((h, i) => (
                    <th key={h} style={{ fontFamily: ZR.mono, fontSize: 10.5, letterSpacing: '.12em', textTransform: 'uppercase', color: ZR.ink3, fontWeight: 700, padding: '12px 14px', textAlign: i > 2 && i < 6 ? 'right' : 'left', borderBottom: `2px solid ${ZR.black}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topAgencies.map((a, i) => {
                  const st = a.plan_status === 'active' ? { c: ZR.green, l: 'ACTIVA' } : a.plan_status === 'trial' ? { c: ZR.yellow, l: 'TRIAL' } : { c: ZR.red, l: 'SUSP.' }
                  return (
                    <tr key={a.id} className="z-row">
                      <td style={{ fontFamily: ZR.display, fontSize: 16, padding: '13px 14px', borderBottom: `1px solid ${ZR.line}`, width: 32 }}>{String(i + 1).padStart(2, '0')}</td>
                      <td style={{ fontFamily: ZR.body, fontWeight: 700, fontSize: 13.5, letterSpacing: '-.01em', textTransform: 'uppercase', padding: '13px 14px', borderBottom: `1px solid ${ZR.line}` }}>{a.name}</td>
                      <td style={{ padding: '13px 14px', borderBottom: `1px solid ${ZR.line}` }}>
                        <span className="z-pill-bordered" style={{ fontFamily: ZR.mono, fontSize: 9.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', border: `1px solid ${ZR.black}`, padding: '3px 8px' }}>{a.plan}</span>
                      </td>
                      <td className="z-row-mute" style={{ fontFamily: ZR.mono, fontSize: 12.5, fontWeight: 600, padding: '13px 14px', borderBottom: `1px solid ${ZR.line}`, textAlign: 'right' }}>{a.properties_count}</td>
                      <td className="z-row-mute" style={{ fontFamily: ZR.mono, fontSize: 12.5, fontWeight: 600, padding: '13px 14px', borderBottom: `1px solid ${ZR.line}`, textAlign: 'right' }}>{a.leads_count}</td>
                      <td style={{ fontFamily: ZR.mono, fontSize: 12.5, fontWeight: 700, color: a.mrr > 0 ? ZR.green : ZR.ink3, padding: '13px 14px', borderBottom: `1px solid ${ZR.line}`, textAlign: 'right' }}>{a.mrr > 0 ? `USD ${a.mrr}` : '—'}</td>
                      <td style={{ padding: '13px 14px', borderBottom: `1px solid ${ZR.line}` }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: ZR.mono, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 600 }}>
                          <span style={{ width: 7, height: 7, borderRadius: 99, background: st.c }} />{st.l}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* SERVICES */}
          <section className="z-block" style={{ padding: 24 }}>
            <BlockHead title="SALUD DE SERVICIOS" right={`${okServices}/${SERVICES.length} OK`} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 16 }}>
              {SERVICES.map(([name, lat, st]) => (
                <div key={name} className={`z-svc ${st}`}>
                  <span style={{ color: st === 'ok' ? ZR.green : st === 'warn' ? ZR.yellow : ZR.red }}>{st === 'warn' ? '[!]' : '[●]'}</span>
                  <span>{name}</span>
                  <span style={{ color: ZR.ink3 }}>{lat}</span>
                </div>
              ))}
            </div>
            <button className="z-btn-bk" style={{ width: '100%', justifyContent: 'center', marginTop: 16 }}>[ VERIFICAR AHORA → ]</button>
          </section>

          {/* EVENTS */}
          <section className="z-block" style={{ padding: 24 }}>
            <BlockHead title="EVENTOS RECIENTES" rightHref={{ label: '[ VER LOGS → ]', href: '/superadmin/crm' }} />
            <div style={{ marginTop: 8 }}>
              {EVENTS.map(([tm, msg], i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '64px 1fr', gap: 14, padding: '11px 0', borderTop: i === 0 ? 'none' : `1px solid ${ZR.line}`, fontFamily: ZR.mono, fontSize: 11.5, letterSpacing: '.04em', textTransform: 'uppercase', alignItems: 'center' }}>
                  <span style={{ color: ZR.orange, fontWeight: 700 }}>[{tm}]</span>
                  <span style={{ color: i === 2 ? ZR.red : ZR.black, fontWeight: i === 2 ? 700 : 400 }}>{msg}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

/* ---- subcomponentes ---- */

function KpiCard({ label, sup, value, subDelta, subRest, spark, bar, barSub, borderRight }: {
  label: string; sup?: string; value: string; subDelta?: string; subRest?: string
  spark?: number[]; bar?: number; barSub?: string; borderRight?: boolean
}) {
  return (
    <div className="z-kpi" style={{ padding: '22px 24px 20px', marginRight: borderRight ? -2 : 0, minHeight: 200, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="z-kpi-label" style={{ fontFamily: ZR.mono, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: ZR.ink3, fontWeight: 700 }}>// {label}</div>
      <div style={{ fontFamily: ZR.display, fontSize: 'clamp(40px, 4vw, 60px)', letterSpacing: '.01em', lineHeight: 0.9, textTransform: 'uppercase' }}>
        {sup && <span style={{ fontSize: 20, verticalAlign: 'super', color: ZR.ink3, marginRight: 4 }}>{sup}</span>}{value}
      </div>
      {spark && (
        <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: 28 }}>
          {spark.map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, background: ZR.orange }} />)}
        </div>
      )}
      {bar != null && (
        <div style={{ marginTop: 'auto' }}>
          <div style={{ height: 6, background: ZR.cream, border: `1px solid ${ZR.black}` }}>
            <div style={{ height: '100%', width: `${bar}%`, background: ZR.orange }} />
          </div>
        </div>
      )}
      <div className="z-kpi-sub" style={{ fontFamily: ZR.mono, fontSize: 11, letterSpacing: '.06em', color: ZR.ink3, display: 'flex', alignItems: 'center', gap: 8, marginTop: spark || bar != null ? 0 : 'auto' }}>
        {subDelta && <span style={{ display: 'inline-flex', padding: '3px 8px', fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: ZR.green, color: ZR.cream }}>{subDelta}</span>}
        {barSub ?? subRest}
      </div>
    </div>
  )
}

function BlockHead({ title, right, rightHref }: { title: string; right?: string; rightHref?: { label: string; href: string } }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: `2px solid ${ZR.black}` }}>
      <h4 style={{ fontFamily: ZR.display, fontSize: 15, letterSpacing: '.02em', textTransform: 'uppercase', margin: 0 }}>{title}</h4>
      {right && <span style={{ fontFamily: ZR.mono, fontSize: 10.5, color: ZR.ink3, letterSpacing: '.06em', textTransform: 'uppercase', fontWeight: 700 }}>{right}</span>}
      {rightHref && <Link href={rightHref.href} style={{ fontFamily: ZR.mono, fontSize: 10.5, color: ZR.orange, textDecoration: 'none', fontWeight: 700, letterSpacing: '.04em' }}>{rightHref.label}</Link>}
    </div>
  )
}
