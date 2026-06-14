'use client'

/*
 * Archivo : agencias-client.tsx
 * Ruta    : src/components/superadmin/agencias-client.tsx
 * Modif.  : 2026-06-13
 * Descripción: Listado de agencias del superadmin. Mergea las agencias DEMO
 *              (dummy, para mostrar a prospectos) con las agencias REALES (LIVE)
 *              creadas vía provisioning. El botón "Nueva Agencia" abre el modal
 *              de alta (createAgency).
 */
import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { Agency } from '@/lib/dummy'
import type { PlanId } from '@/lib/plans/server'
import type { LiveAgency } from '@/lib/agencies/provision'
import NewAgencyModal from './new-agency-modal'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF', border: '#DEDED4',
  ink2: '#4A4A47', ink3: '#8A8A83', orange: '#FF6A00', green: '#2D7D5F', red: '#E71D0A',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}

const PLAN_COLORS: Record<string, { bg: string; color: string }> = {
  a_medida: { bg: 'rgba(231,29,10,.1)', color: '#E71D0A' },
  profesional: { bg: 'rgba(255,106,0,.12)', color: '#FF6A00' },
  esencial: { bg: 'rgba(138,138,131,.14)', color: '#6A6A64' },
}
const STATUS = {
  active: { bg: 'rgba(45,125,95,.12)', color: '#2D7D5F', label: 'Activo' },
  suspended: { bg: 'rgba(231,29,10,.1)', color: '#E71D0A', label: 'Suspendido' },
} as const

type Row = Agency & { __live?: boolean }

type Filter = 'todas' | 'esencial' | 'profesional' | 'a_medida' | 'suspendidas'
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todas', label: 'Todas' }, { id: 'esencial', label: 'Esencial' }, { id: 'profesional', label: 'Profesional' },
  { id: 'a_medida', label: 'A medida' }, { id: 'suspendidas', label: 'Suspendidas' },
]

function liveToRow(l: LiveAgency): Row {
  const plan = (['esencial', 'profesional', 'a_medida'].includes(l.plan_code) ? l.plan_code : 'esencial') as PlanId
  const status: 'active' | 'suspended' = l.plan_status === 'suspended' ? 'suspended' : 'active'
  return {
    id: l.id, name: l.name, slug: l.slug, plan, plan_status: status,
    properties_count: 0, leads_count: 0, members_count: 1, mrr: 0,
    owner_email: l.owner_email, created_at: l.created_at, theme: 'editorial', __live: true,
  }
}

export default function AgenciasClient({ initialAgencies, live = [] }: { initialAgencies: Agency[]; live?: LiveAgency[] }) {
  const [filter, setFilter] = useState<Filter>('todas')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [suspended, setSuspended] = useState<Record<string, boolean>>({})

  // Merge: LIVE primero, luego dummy (sin duplicar slugs ya presentes en dummy).
  const rows: Row[] = useMemo(() => {
    const liveRows = live.filter(l => !initialAgencies.some(d => d.slug === l.slug)).map(liveToRow)
    return [...liveRows, ...initialAgencies.map(a => ({ ...a } as Row))]
  }, [initialAgencies, live])

  const filtered = useMemo(() => rows.filter(a => {
    const ps = suspended[a.id] ? 'suspended' : a.plan_status
    if (filter === 'suspendidas' && ps !== 'suspended') return false
    if (['esencial', 'profesional', 'a_medida'].includes(filter) && a.plan !== filter) return false
    if (query && !`${a.name} ${a.slug} ${a.owner_email}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [rows, filter, query, suspended])

  const toggleSuspend = (id: string) => setSuspended(prev => ({ ...prev, [id]: !prev[id] }))
  const liveCount = rows.filter(r => r.__live).length

  return (
    <div className="rwd-pad" style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: ZR.body, color: ZR.black }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
          <h1 style={{ fontFamily: ZR.display, fontSize: 'clamp(28px, 4vw, 40px)', margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>AGENCIAS</h1>
          <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>{rows.length} registradas · {liveCount} reales (LIVE)</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="z-btn-bk is-orange" style={{ cursor: 'pointer', border: 'none' }}>[ + NUEVA AGENCIA ]</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '8px 14px', border: `2px solid ${ZR.black}`, fontFamily: ZR.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', background: filter === f.id ? ZR.black : ZR.white, color: filter === f.id ? ZR.cream : ZR.black, cursor: 'pointer' }}>{f.label}</button>
        ))}
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar agencia..." style={{ marginLeft: 'auto', background: ZR.white, border: `2px solid ${ZR.black}`, padding: '8px 14px', color: ZR.black, fontSize: 13, outline: 'none', width: 240, fontFamily: 'inherit' }} />
      </div>

      {/* Table */}
      <div className="z-block rwd-tablewrap" style={{ overflow: 'hidden' }}>
        <div className="rwd-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 64px 64px 1.4fr 110px 150px', padding: '12px 24px', borderBottom: `2px solid ${ZR.black}`, fontFamily: ZR.mono, fontSize: 9.5, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em', fontWeight: 700 }}>
          <div>Agencia</div><div>Plan / Estado</div><div>Props</div><div>Leads</div><div>Owner</div><div>MRR</div><div>Acciones</div>
        </div>
        {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: ZR.ink3, fontSize: 13 }}>Sin agencias para ese filtro.</div>}
        {filtered.map((agency, i) => {
          const ps = PLAN_COLORS[agency.plan] ?? PLAN_COLORS.esencial!
          const statusKey = suspended[agency.id] ? 'suspended' : agency.plan_status
          const st = STATUS[statusKey]
          return (
            <div key={agency.id} className="z-row rwd-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 64px 64px 1.4fr 110px 150px', padding: '14px 24px', borderTop: i > 0 ? `1px solid ${ZR.border}` : 'none', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, background: ps.bg, border: `1px solid ${ps.color}33`, display: 'grid', placeItems: 'center', fontFamily: ZR.display, fontSize: 13, color: ps.color }}>{agency.name[0]}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '-.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}>
                    {agency.name}
                    {agency.__live && <span style={{ fontFamily: ZR.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', background: ZR.green, color: ZR.white, padding: '1px 5px' }}>LIVE</span>}
                  </div>
                  <div className="z-row-mute" style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3 }}>/{agency.slug}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{ fontSize: 9.5, fontFamily: ZR.mono, fontWeight: 700, letterSpacing: '.04em', background: ps.bg, color: ps.color, padding: '3px 8px', textTransform: 'uppercase', width: 'fit-content' }}>{agency.plan.replace('_', ' ')}</span>
                <span style={{ fontSize: 9, fontFamily: ZR.mono, letterSpacing: '.06em', background: st.bg, color: st.color, padding: '2px 8px', textTransform: 'uppercase', width: 'fit-content' }}>{st.label}</span>
              </div>
              <div style={{ fontFamily: ZR.mono, fontSize: 12.5, fontWeight: 600 }}>{agency.properties_count}</div>
              <div style={{ fontFamily: ZR.mono, fontSize: 12.5, fontWeight: 600 }}>{agency.leads_count}</div>
              <div className="z-row-mute" style={{ fontSize: 12, color: ZR.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{agency.owner_email}</div>
              <div style={{ fontFamily: ZR.display, fontSize: 14, color: agency.mrr > 0 ? ZR.orange : ZR.ink3 }}>{agency.mrr > 0 ? `$${agency.mrr}` : '—'}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <Link href={`/superadmin/agencias/${agency.slug}`} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: ZR.black, textDecoration: 'none', padding: '6px 9px', background: ZR.cream, border: `1px solid ${ZR.black}` }}>VER</Link>
                {!agency.__live && (
                  <button onClick={() => toggleSuspend(agency.id)} style={{ fontFamily: ZR.mono, fontSize: 10, fontWeight: 700, color: statusKey === 'suspended' ? ZR.green : ZR.red, padding: '6px 9px', background: ZR.white, border: `1px solid ${statusKey === 'suspended' ? ZR.green : ZR.red}`, cursor: 'pointer', textTransform: 'uppercase' }}>{statusKey === 'suspended' ? 'Activar' : 'Suspender'}</button>
                )}
                <Link href={`/${agency.slug}/admin`} target="_blank" style={{ fontFamily: ZR.display, fontSize: 10, color: ZR.orange, textDecoration: 'none', padding: '6px 9px', background: 'rgba(255,106,0,.08)' }}>→</Link>
              </div>
            </div>
          )
        })}
      </div>

      <NewAgencyModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
