'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import KanbanBoard, { type KanbanCard, type KanbanColumn } from '@/components/crm/kanban-client'
import SalesLeadDrawer from '@/components/superadmin/sales-lead-drawer'
import type { SalesLead } from '@/lib/sales-crm/server'
import { createSalesLead, updateSalesLead, deleteSalesLead, moveSalesLead } from '@/lib/sales-crm/actions'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF', border: '#DEDED4',
  ink2: '#4A4A47', ink3: '#8A8A83', orange: '#FF6A00', red: '#E71D0A', green: '#2D7D5F',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', system-ui, sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}

const COLUMNS: KanbanColumn[] = [
  { id: 'prospect', label: 'Prospecto', color: '#8A8A83' },
  { id: 'contacted', label: 'Contactado', color: '#4A90E2' },
  { id: 'demo', label: 'Demo agendada', color: '#FF6A00' },
  { id: 'proposal', label: 'Propuesta', color: '#8B5CF6' },
  { id: 'negotiation', label: 'Negociación', color: '#D4A017' },
  { id: 'client', label: 'Cliente', color: '#2D7D5F' },
  { id: 'churn_risk', label: 'Riesgo churn', color: '#E71D0A' },
]
const PLAN_COLOR: Record<string, string> = { Esencial: '#2D7D5F', Profesional: '#8B5CF6', 'A medida': '#E71D0A' }

const blank = (column: string): SalesLead => ({
  id: `tmp-${Date.now()}`, column, company: '', contact: '', city: '', email: '', phone1: '', phone2: '',
  address: '', plan: 'Profesional', monthly: 99, source: '', budget: '', notes: '', files: [],
})

export default function SalesCrmClient({ initialLeads, persisted }: { initialLeads: SalesLead[]; persisted: boolean }) {
  const [leads, setLeads] = useState<SalesLead[]>(initialLeads)
  const [editing, setEditing] = useState<SalesLead | null>(null)

  const cards: KanbanCard[] = useMemo(() => leads.map(l => ({
    id: l.id, column: l.column,
    title: l.company || 'Sin nombre',
    subtitle: [l.contact, l.city].filter(Boolean).join(' · '),
    meta: [l.source, l.files.length ? `${l.files.length} archivo${l.files.length !== 1 ? 's' : ''}` : ''].filter(Boolean).join(' · ') || 'Sin origen',
    tag: l.plan, tagColor: PLAN_COLOR[l.plan] ?? ZR.ink3,
    badge: `$${l.monthly}/mes`, phone: l.phone1,
  })), [leads])

  const handleCardsChange = (next: KanbanCard[]) => {
    setLeads(prev => prev.map(l => {
      const c = next.find(x => x.id === l.id)
      return c && c.column !== l.column ? { ...l, column: c.column } : l
    }))
  }
  const persistMove = (cardId: string, col: string) => {
    if (persisted) moveSalesLead(cardId, col).then(r => { if (!r.ok) console.error('[sales-crm] move:', r.error) })
  }
  const upsert = async (lead: SalesLead) => {
    const isNew = !leads.some(l => l.id === lead.id)
    const prev = leads
    setLeads(isNew ? [lead, ...leads] : leads.map(l => l.id === lead.id ? lead : l))
    setEditing(null)
    if (!persisted) return
    const res = isNew ? await createSalesLead(lead) : await updateSalesLead(lead.id, lead)
    if (!res.ok) { setLeads(prev); alert('No se pudo guardar: ' + (res.error ?? 'error')); return }
    if (isNew && res.id) setLeads(cur => cur.map(l => l.id === lead.id ? { ...l, id: res.id! } : l))
  }
  const remove = async (id: string) => {
    const prev = leads; setLeads(leads.filter(l => l.id !== id)); setEditing(null)
    if (!persisted) return
    const res = await deleteSalesLead(id)
    if (!res.ok) { setLeads(prev); alert('No se pudo eliminar: ' + (res.error ?? 'error')) }
  }

  const mrr = (cols: string[]) => leads.filter(l => cols.includes(l.column)).reduce((a, l) => a + (l.monthly || 0), 0)
  const METRICS = useMemo(() => [
    { label: 'MRR actual', value: `$${mrr(['client'])}`, color: '#2D7D5F' },
    { label: 'MRR potencial', value: `$${mrr(leads.map(l => l.column))}`, color: ZR.orange },
    { label: 'En pipeline', value: String(leads.filter(l => !['client', 'churn_risk'].includes(l.column)).length), color: '#4A90E2' },
    { label: 'Riesgo churn', value: String(leads.filter(l => l.column === 'churn_risk').length), color: ZR.red },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [leads])

  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: ZR.body, color: ZR.black }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
          <h1 style={{ fontFamily: ZR.display, fontSize: 'clamp(26px, 4vw, 36px)', margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>CRM — MIS CLIENTES</h1>
          <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>Clic en una card para abrir la ficha completa (con archivos)</p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Link href="/api/webhooks/crm" className="z-btn-bk">[ API DOCS → ]</Link>
          <button onClick={() => setEditing(blank('prospect'))} className="z-btn-bk is-orange">[ + NUEVO CLIENTE ]</button>
        </div>
      </div>

      {!persisted && (
        <div style={{ background: '#FFF7E0', border: `1px solid #D4A017`, padding: '10px 16px', marginBottom: 20, fontFamily: ZR.mono, fontSize: 11, color: '#8A6D0A', letterSpacing: '.04em' }}>
          // MODO DEMO (EN SESIÓN) · CORRÉ <b>0007_platform_crm.sql</b> EN SUPABASE PARA PERSISTIR. LOS ARCHIVOS YA PERSISTEN EN STORAGE.
        </div>
      )}

      <div className="dash-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {METRICS.map(m => (
          <div key={m.label} className="z-block" style={{ padding: '18px 20px' }}>
            <div style={{ fontFamily: ZR.display, fontSize: 28, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      <KanbanBoard
        columns={COLUMNS}
        cards={cards}
        onCardsChange={handleCardsChange}
        onCardMove={persistMove}
        onAddCard={(col) => setEditing(blank(col))}
        onCardOpen={(card) => { const l = leads.find(x => x.id === card.id); if (l) setEditing(l) }}
        addLabel="+ Agregar"
      />

      <div className="z-block" style={{ marginTop: 36, padding: 24 }}>
        <div style={{ fontFamily: ZR.mono, fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 16 }}>// AUTOMATIZACIÓN — WEBHOOKS</div>
        <div className="rwd-3col" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { endpoint: '/api/webhooks/crm', desc: 'Crear o actualizar lead en el CRM. JSON con name, contact, stage, plan_interest, mrr_potential.' },
            { endpoint: '/api/webhooks/lead', desc: 'Recibir leads entrantes de agencias.' },
            { endpoint: '/api/webhooks/agency/signup', desc: 'Notifica alta de nueva agencia.' },
          ].map(wh => (
            <div key={wh.endpoint} style={{ padding: '14px 16px', background: ZR.cream, border: `1px solid ${ZR.border}`, minWidth: 0 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: ZR.display, fontSize: 9, background: ZR.black, color: ZR.cream, padding: '2px 7px' }}>POST</span>
                <code style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, overflowWrap: 'anywhere' }}>{wh.endpoint}</code>
              </div>
              <div style={{ fontSize: 11, color: ZR.ink3, lineHeight: 1.5 }}>{wh.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {editing && (
        <SalesLeadDrawer lead={editing} isNew={!leads.some(l => l.id === editing.id)} onSave={upsert} onDelete={remove} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}
