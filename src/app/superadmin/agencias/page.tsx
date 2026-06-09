import Link from 'next/link'
import { AGENCIES, PLATFORM_STATS } from '@/lib/dummy'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF',
  border: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00',
}

const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  enterprise: { bg: 'rgba(231,29,10,.1)',  color: '#E71D0A' },
  business:   { bg: 'rgba(139,92,246,.1)', color: '#8B5CF6' },
  pro:        { bg: 'rgba(74,144,226,.1)', color: '#4A90E2' },
  starter:    { bg: 'rgba(45,125,95,.1)',  color: '#2D7D5F' },
}

const STATUS_COLORS = {
  active:    { bg: 'rgba(45,125,95,.1)',  color: '#2D7D5F', label: 'Activo' },
  trial:     { bg: 'rgba(255,193,7,.15)', color: '#A07C0A', label: 'Trial' },
  suspended: { bg: 'rgba(231,29,10,.1)',  color: '#E71D0A', label: 'Suspendido' },
} as const

export default function AgenciasAdmin() {
  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: ZR.black, margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>AGENCIAS</h1>
          <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>{PLATFORM_STATS.total_agencies} inmobiliarias registradas</p>
        </div>
        <button style={{ background: ZR.black, color: ZR.cream, padding: '12px 22px', borderRadius: 4, fontFamily: "'Archivo Black', sans-serif", fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
          + NUEVA AGENCIA
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {['Todas', 'Business', 'Pro', 'Starter', 'Trial', 'Suspendidas'].map((f) => (
          <button key={f} style={{ padding: '8px 16px', borderRadius: 3, fontFamily: "'Archivo Black', sans-serif", fontSize: 10, letterSpacing: '.05em', textTransform: 'uppercase', background: f === 'Todas' ? ZR.black : ZR.white, color: f === 'Todas' ? ZR.cream : ZR.ink2, border: `1px solid ${f === 'Todas' ? ZR.black : ZR.border}`, cursor: 'pointer' }}>
            {f}
          </button>
        ))}
        <div style={{ marginLeft: 'auto' }}>
          <input placeholder="Buscar agencia..." style={{ background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, padding: '8px 14px', color: ZR.black, fontSize: 13, outline: 'none', width: 220, fontFamily: 'inherit' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 60px 60px 60px 1fr 110px 100px', padding: '10px 24px', borderBottom: `1px solid ${ZR.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em' }}>
          <div>Agencia</div><div>Plan</div><div>Props</div><div>Leads</div><div>Equipo</div><div>Owner</div><div>MRR</div><div>Acciones</div>
        </div>
        {AGENCIES.map((agency, i) => {
          const planStyle = PLAN_COLORS[agency.plan] ?? PLAN_COLORS['starter'] ?? { bg: 'rgba(138,138,131,.1)', color: '#8A8A83' }
          const status = STATUS_COLORS[agency.plan_status as keyof typeof STATUS_COLORS] ?? STATUS_COLORS.active
          return (
            <div key={agency.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 60px 60px 60px 1fr 110px 100px', padding: '14px 24px', borderBottom: i < AGENCIES.length - 1 ? `1px solid ${ZR.border}` : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: planStyle.bg, border: `1px solid ${planStyle.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: planStyle.color }}>
                  {agency.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: ZR.black }}>{agency.name}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3 }}>/{agency.slug}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 10, fontFamily: "'Archivo Black', sans-serif", letterSpacing: '.04em', background: planStyle.bg, color: planStyle.color, padding: '3px 9px', borderRadius: 2, textTransform: 'uppercase', display: 'inline-block', width: 'fit-content' }}>{agency.plan}</span>
                <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.06em', background: status.bg, color: status.color, padding: '2px 8px', borderRadius: 2, display: 'inline-block', width: 'fit-content' }}>{status.label}</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: ZR.black }}>{agency.properties_count}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: ZR.black }}>{agency.leads_count}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: ZR.black }}>{agency.members_count}</div>
              <div style={{ fontSize: 12, color: ZR.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agency.owner_email}</div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: agency.mrr > 0 ? ZR.orange : ZR.border }}>
                {agency.mrr > 0 ? `$${agency.mrr}/mes` : 'Trial'}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href={`/superadmin/agencias/${agency.slug}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.black, textDecoration: 'none', padding: '6px 10px', background: ZR.cream, border: `1px solid ${ZR.border}`, borderRadius: 3 }}>Ver</Link>
                <Link href={`/${agency.slug}/admin`} target="_blank" style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 10, color: ZR.orange, textDecoration: 'none', padding: '6px 10px', background: 'rgba(255,106,0,.08)', borderRadius: 3 }}>→</Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
