import Link from 'next/link'
import { AGENCIES, PLATFORM_STATS } from '@/lib/dummy'

const MONTHLY_MRR = [820, 940, 1020, 1080, 1140, 1196]
const MONTHLY_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
const MAX_MRR = Math.max(...MONTHLY_MRR)

const ZR = {
  black: '#111111',
  cream: '#F5F5F0',
  cream2: '#FFFFFF',
  creamBorder: '#DEDED4',
  ink2: '#4A4A47',
  ink3: '#8A8A83',
  orange: '#FF6A00',
  red: '#E71D0A',
  yellow: '#FFC107',
  stripe: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)',
}

export default function SuperadminDashboard() {
  const recentAgencies = AGENCIES.slice(0, 5)

  return (
    <div style={{ padding: '40px 48px', minHeight: '100vh', background: ZR.cream, fontFamily: "'Archivo', system-ui, sans-serif", color: ZR.black }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 44 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 8 }}>
            // PANEL DE CONTROL
          </div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 36, fontWeight: 900, color: ZR.black, margin: 0, lineHeight: 0.96, textTransform: 'uppercase', letterSpacing: '-.01em' }}>
            NIMO Platform
          </h1>
          <p style={{ fontSize: 14, color: ZR.ink2, margin: '10px 0 0', fontWeight: 400 }}>Junio 2026 — Visión global</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/superadmin/agencias" style={{ fontSize: 13, color: ZR.ink2, textDecoration: 'none', padding: '10px 18px', background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, fontWeight: 500 }}>
            Ver agencias
          </Link>
          <Link href="/superadmin/planes" style={{ fontSize: 13, color: '#fff', textDecoration: 'none', padding: '10px 20px', background: ZR.black, borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Archivo Black', sans-serif", letterSpacing: '.02em' }}>
            + NUEVA AGENCIA
          </Link>
        </div>
      </div>

      {/* Zaire stripe accent rule */}
      <div style={{ height: 4, background: ZR.stripe, borderRadius: 2, marginBottom: 36 }} />

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'MRR MENSUAL',      value: `$${PLATFORM_STATS.mrr.toLocaleString()}`, sub: `ARR $${PLATFORM_STATS.arr.toLocaleString()}`, accent: ZR.orange },
          { label: 'AGENCIAS ACTIVAS', value: PLATFORM_STATS.active_agencies,            sub: `${PLATFORM_STATS.total_agencies} en total`,   accent: ZR.black },
          { label: 'PROPIEDADES',      value: PLATFORM_STATS.total_properties,           sub: 'en la plataforma',                            accent: ZR.black },
          { label: 'CRECIMIENTO MoM',  value: `+${PLATFORM_STATS.monthly_growth}%`,      sub: 'vs mes anterior',                             accent: '#2D7D5F' },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 12, padding: '24px 24px 20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 12 }}>
              // {kpi.label}
            </div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 40, fontWeight: 900, color: kpi.accent, lineHeight: 1, marginBottom: 6 }}>
              {kpi.value}
            </div>
            <div style={{ fontSize: 12, color: ZR.ink3, fontWeight: 400 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, marginBottom: 24 }}>
        {/* MRR chart */}
        <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 12, padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>
                // EVOLUCIÓN MRR
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 18, color: ZR.black }}>Últimos 6 meses</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: ZR.orange }}>${PLATFORM_STATS.mrr}</div>
              <div style={{ fontSize: 11, color: '#2D7D5F', fontWeight: 600 }}>+{PLATFORM_STATS.monthly_growth}% este mes</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 100 }}>
            {MONTHLY_MRR.map((v, i) => {
              const h = (v / MAX_MRR) * 100
              const isLast = i === MONTHLY_MRR.length - 1
              return (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: isLast ? ZR.orange : ZR.ink3 }}>${v}</div>
                  <div style={{ width: '100%', height: `${h}%`, background: isLast ? ZR.orange : '#DEDED4', borderRadius: '3px 3px 0 0', minHeight: 6 }} />
                  <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: ZR.ink3, textTransform: 'uppercase' }}>{MONTHLY_LABELS[i]}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Plan distribution */}
        <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 12, padding: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>
            // PLANES
          </div>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16, color: ZR.black, marginBottom: 20 }}>Distribución</div>
          {[
            { plan: 'Enterprise', count: 0, color: ZR.orange, mrr: 0 },
            { plan: 'Business',   count: 2, color: '#8B5CF6', mrr: 1198 },
            { plan: 'Pro',        count: 2, color: '#4A90E2', mrr: 598 },
            { plan: 'Starter',    count: 1, color: '#4ECDC4', mrr: 0 },
            { plan: 'Trial',      count: 1, color: ZR.yellow, mrr: 0 },
          ].map((p) => (
            <div key={p.plan} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div style={{ width: 7, height: 7, borderRadius: 9999, background: p.count > 0 ? p.color : ZR.creamBorder }} />
                  <span style={{ fontSize: 12, color: p.count > 0 ? ZR.black : ZR.ink3, fontWeight: p.count > 0 ? 500 : 400 }}>{p.plan}</span>
                  <span style={{ fontSize: 11, color: ZR.ink3 }}>{p.count}</span>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: p.count > 0 ? p.color : ZR.creamBorder }}>{p.mrr > 0 ? `$${p.mrr}` : '—'}</span>
              </div>
              <div style={{ height: 3, background: '#EBEBDF', borderRadius: 9999 }}>
                <div style={{ height: '100%', width: `${(p.count / PLATFORM_STATS.total_agencies) * 100}%`, background: p.count > 0 ? p.color : 'transparent', borderRadius: 9999 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agencies table */}
      <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 28px 16px', borderBottom: `1px solid ${ZR.creamBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// AGENCIAS</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16, color: ZR.black }}>Recientes</div>
          </div>
          <Link href="/superadmin/agencias" style={{ fontSize: 12, color: ZR.orange, textDecoration: 'none', fontWeight: 600 }}>Ver todas →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '10px 28px', borderBottom: `1px solid ${ZR.creamBorder}`, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em' }}>
          <div>Agencia</div><div>Plan</div><div>Props</div><div>MRR</div><div>Estado</div><div>Acción</div>
        </div>
        {recentAgencies.map((agency, i) => {
          const sc = agency.plan_status === 'active' ? '#2D7D5F' : agency.plan_status === 'trial' ? '#9A7B0A' : ZR.red
          const sl = agency.plan_status === 'active' ? 'Activo' : agency.plan_status === 'trial' ? 'Trial' : 'Suspendido'
          return (
            <div key={agency.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 100px', padding: '16px 28px', borderBottom: i < recentAgencies.length - 1 ? `1px solid #F2F0EB` : 'none', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: ZR.black }}>{agency.name}</div>
                <div style={{ fontSize: 11, color: ZR.ink3, marginTop: 1 }}>{agency.owner_email}</div>
              </div>
              <div>
                <span style={{ fontSize: 10, background: '#111111', color: '#F5F5F0', padding: '3px 9px', borderRadius: 4, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '.06em' }}>{agency.plan}</span>
              </div>
              <div style={{ fontSize: 14, color: ZR.black, fontWeight: 500 }}>{agency.properties_count}</div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 15, color: agency.mrr > 0 ? ZR.orange : ZR.ink3 }}>{agency.mrr > 0 ? `$${agency.mrr}` : '—'}</div>
              <div>
                <span style={{ fontSize: 10, background: sc + '18', color: sc, padding: '3px 9px', borderRadius: 4, fontWeight: 600, border: `1px solid ${sc}33` }}>{sl}</span>
              </div>
              <Link href={`/superadmin/agencias/${agency.slug}`} style={{ fontSize: 12, color: ZR.orange, textDecoration: 'none', padding: '6px 12px', background: 'rgba(255,106,0,.08)', borderRadius: 6, fontWeight: 600 }}>
                Detalle
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
