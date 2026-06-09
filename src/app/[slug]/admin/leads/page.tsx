import { LEADS } from '@/lib/dummy'
import LeadsKanbanWrapper from '@/components/crm/leads-kanban-wrapper'

const STAGE_COLORS: Record<string, string> = {
  new: '#FF6A00', contacted: '#4A90E2', interested: '#D4A017',
  visit: '#E8804A', proposal: '#8B5CF6', won: '#2D7D5F', lost: '#8A8A83',
}

const STAGES = [
  { id: 'new', label: 'Nuevo' }, { id: 'contacted', label: 'Contactado' },
  { id: 'interested', label: 'Interesado' }, { id: 'visit', label: 'Visita' },
  { id: 'proposal', label: 'Propuesta' }, { id: 'won', label: 'Cerrado' }, { id: 'lost', label: 'Perdido' },
]

const ZR = {
  black: '#1A1A1A', cream: '#FAF7F2', white: '#FFFFFF',
  border: '#EDEBE6', ink2: '#4A4845', ink3: '#9A9590',
  orange: '#FF6B6B',
}

export default async function LeadsAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const leadsData = LEADS.map(l => ({
    id: l.id,
    name: l.name,
    stage: l.stage,
    source: l.source,
    property_interest: l.property_interest,
    budget: l.budget,
    agent: l.agent,
    phone: l.phone,
  }))

  return (
    <div style={{ padding: '36px 44px', minHeight: '100vh', background: ZR.cream, color: ZR.black, fontFamily: "'Archivo', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, color: ZR.ink3, marginBottom: 6, fontWeight: 500 }}>CRM — {slug}</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: ZR.black, margin: '0 0 4px', letterSpacing: '-.02em' }}>Gestión de Leads</h1>
          <p style={{ fontSize: 13, color: ZR.ink2, margin: 0 }}>{LEADS.length} leads · drag & drop para mover entre etapas</p>
        </div>
        <button style={{ background: ZR.orange, color: ZR.white, padding: '10px 22px', borderRadius: 8, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>
          + Nuevo lead
        </button>
      </div>

      {/* Accent line */}
      <div style={{ height: 2, background: ZR.orange, borderRadius: 2, marginBottom: 22 }} />

      {/* Stage stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22, flexWrap: 'wrap' }}>
        {STAGES.map((stage) => {
          const count = LEADS.filter(l => l.stage === stage.id).length
          const color = STAGE_COLORS[stage.id] ?? ZR.ink3
          return (
            <div key={stage.id} style={{ background: ZR.white, border: `1px solid ${count > 0 ? color + '44' : ZR.border}`, borderRadius: 4, padding: '7px 12px', display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ width: 6, height: 6, borderRadius: 9999, background: count > 0 ? color : ZR.border }} />
              <span style={{ fontSize: 11, color: count > 0 ? ZR.ink2 : ZR.ink3, fontWeight: 500 }}>{stage.label}</span>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: count > 0 ? color : ZR.ink3 }}>{count}</span>
            </div>
          )
        })}
      </div>

      {/* Kanban with DnD */}
      <LeadsKanbanWrapper leads={leadsData} slug={slug} />
    </div>
  )
}
