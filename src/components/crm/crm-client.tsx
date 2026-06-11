'use client'

import { useMemo, useState } from 'react'
import type { Lead, LeadStage, ClientType, TeamMember } from '@/lib/dummy'
import type { LeadInput } from '@/lib/leads/server'
import { createLead, updateLead, deleteLead, moveLeadStage } from '@/lib/leads/actions'
import KanbanBoard, { type KanbanCard, type KanbanColumn } from './kanban-client'

/* ============================================================
 * CRM de la inmobiliaria · Gestión de Leads (Universo A)
 * Persistencia real: lee de Supabase (server page) y escribe vía server
 * actions. UI optimista (estado local) para que el drag siga fluido; el
 * stage se persiste al soltar (onCardMove). El agente (assigned_to uuid)
 * no se persiste aún.
 * ============================================================ */

function toInput(l: Lead): LeadInput {
  return {
    name: l.name, email: l.email, phone: l.phone, stage: l.stage, source: l.source,
    property_interest: l.property_interest, budget: l.budget, notes: l.notes,
    client_type: l.client_type, operation_interest: l.operation_interest,
    contact2_name: l.contact2_name, contact2_phone: l.contact2_phone,
  }
}

const LA = {
  bg: '#FAF7F2', cream: '#F4F0E8', white: '#FFFFFF', border: '#E8E2D8',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  coral: '#FF6B6B', coralSoft: '#FFE5DB', green: '#2D7D5F', danger: '#C0392B',
  sans: 'var(--font-sans), system-ui, sans-serif',
  mono: "var(--font-mono), ui-monospace, monospace",
}

const DEFAULT_STAGES: KanbanColumn[] = [
  { id: 'new',        label: 'Prospecto',  color: '#FF6B6B' },
  { id: 'contacted',  label: 'Contactado', color: '#4A90E2' },
  { id: 'interested', label: 'Interesado', color: '#D4A017' },
  { id: 'visit',      label: 'Visita',     color: '#E8804A' },
  { id: 'proposal',   label: 'Propuesta',  color: '#8B5CF6' },
  { id: 'won',        label: 'Cerrado',    color: '#2D7D5F' },
  { id: 'lost',       label: 'Perdido',    color: '#9A9590' },
]
const PALETTE = ['#1F4DD6', '#7A8264', '#B25431', '#E8804A', '#8B5CF6', '#4A90E2', '#D4A017', '#2D7D5F']

// Etapas = defaults + cualquier estado custom presente en los leads (para que
// los leads en etapas custom no desaparezcan tras recargar).
function mergeStages(leads: Lead[]): KanbanColumn[] {
  const ids = new Set(DEFAULT_STAGES.map(s => s.id))
  const extra = Array.from(new Set(leads.map(l => l.stage as string)))
    .filter(s => !ids.has(s))
    .map((s, i) => ({ id: s, label: s, color: PALETTE[i % PALETTE.length]! }))
  return [...DEFAULT_STAGES, ...extra]
}
const labelMap = (stages: KanbanColumn[]) => Object.fromEntries(stages.map(s => [s.id, s.label]))
const colorMap = (stages: KanbanColumn[]) => Object.fromEntries(stages.map(s => [s.id, s.color]))

const CLIENT_TYPES: ClientType[] = ['comprador', 'inquilino', 'vendedor', 'propietario', 'inversor']
const SOURCES = ['Formulario web', 'WhatsApp', 'Redes sociales', 'Referido', 'Tasación', 'QR', 'Llamada']

function emptyLead(stage: LeadStage = 'new'): Lead {
  return {
    id: `lead-${Date.now()}`,
    name: '', email: '', phone: '', stage, source: 'Formulario web',
    property_interest: '', budget: '', notes: '', agent: '',
    created_at: new Date().toISOString().slice(0, 10),
    last_contact: new Date().toISOString().slice(0, 10),
    client_type: 'comprador', operation_interest: 'venta',
    contact2_name: '', contact2_phone: '',
  }
}

interface Props {
  slug: string
  initialLeads: Lead[]
  team: TeamMember[]
}

export default function CrmClient({ slug, initialLeads, team }: Props) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [view, setView] = useState<'tabla' | 'kanban'>('kanban')
  const [editing, setEditing] = useState<Lead | null>(null)
  const [stages, setStages] = useState<KanbanColumn[]>(() => mergeStages(initialLeads))
  const [editStages, setEditStages] = useState(false)
  const stageLabel = useMemo(() => labelMap(stages), [stages])
  const stageColor = useMemo(() => colorMap(stages), [stages])

  // ── edición de etapas ──
  const renameStage = (id: string, label: string) => setStages(prev => prev.map(s => s.id === id ? { ...s, label } : s))
  const recolorStage = (id: string, color: string) => setStages(prev => prev.map(s => s.id === id ? { ...s, color } : s))
  const addStage = () => setStages(prev => [...prev, { id: `st-${Date.now()}`, label: 'Nueva etapa', color: PALETTE[prev.length % PALETTE.length]! }])
  const removeStage = (id: string) => {
    if (stages.length <= 1) return
    const fallback = stages.find(s => s.id !== id)!.id
    // reasignar leads de la etapa borrada a la primera etapa restante (optimista + persistir)
    leads.filter(l => (l.stage as string) === id).forEach(l => moveLeadStage(slug, l.id, fallback as LeadStage))
    setLeads(prev => prev.map(l => (l.stage as string) === id ? { ...l, stage: fallback as LeadStage } : l))
    setStages(prev => prev.filter(s => s.id !== id))
  }

  const cards: KanbanCard[] = useMemo(() => leads.map(l => ({
    id: l.id,
    column: l.stage,
    title: l.name || 'Sin nombre',
    subtitle: l.property_interest,
    meta: [l.client_type, l.budget].filter(Boolean).join(' · '),
    tag: l.source,
    badge: l.phone,
  })), [leads])

  const handleCardsChange = (next: KanbanCard[]) => {
    setLeads(prev => prev.map(l => {
      const card = next.find(c => c.id === l.id)
      return card && card.column !== l.stage ? { ...l, stage: card.column as LeadStage } : l
    }))
  }

  const upsert = async (lead: Lead) => {
    const isNew = !leads.some(l => l.id === lead.id)
    const prev = leads
    setLeads(isNew ? [lead, ...leads] : leads.map(l => l.id === lead.id ? lead : l)) // optimista
    setEditing(null)
    const res = isNew ? await createLead(slug, toInput(lead)) : await updateLead(slug, lead.id, toInput(lead))
    if (!res.ok) { setLeads(prev); alert('No se pudo guardar: ' + (res.error ?? 'error')); return }
    if (isNew && res.id) setLeads(cur => cur.map(l => l.id === lead.id ? { ...l, id: res.id! } : l))
  }
  const remove = async (id: string) => {
    const prev = leads
    setLeads(leads.filter(l => l.id !== id)); setEditing(null)
    const res = await deleteLead(slug, id)
    if (!res.ok) { setLeads(prev); alert('No se pudo eliminar: ' + (res.error ?? 'error')) }
  }
  const persistMove = (cardId: string, newColumn: string) => {
    moveLeadStage(slug, cardId, newColumn as LeadStage).then(res => { if (!res.ok) console.error('[leads] move:', res.error) })
  }

  return (
    <div style={{ padding: '0 0 40px', background: LA.bg, minHeight: '100vh', color: LA.ink, fontFamily: LA.sans }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderBottom: `1px solid ${LA.border}`, gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: LA.mono, fontSize: 11, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>CRM · {slug}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>Gestión de Leads</h1>
          <p style={{ fontSize: 13, color: LA.ink2, margin: '4px 0 0' }}>{leads.length} leads · arrastrá entre etapas o editá cada ficha</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* Toggle vista */}
          <div style={{ display: 'flex', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: 3 }}>
            {(['kanban', 'tabla'] as const).map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, textTransform: 'capitalize', background: view === v ? 'var(--admin-accent, #FF6B6B)' : 'transparent', color: view === v ? LA.white : LA.ink2, fontFamily: 'inherit' }}>{v}</button>
            ))}
          </div>
          <button onClick={() => setEditing(emptyLead())} style={{ background: 'var(--admin-accent, #FF6B6B)', color: LA.white, padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Nuevo lead</button>
        </div>
      </header>

      <div style={{ padding: '24px 40px' }}>
        {/* Stage stats */}
        <div style={{ display: 'flex', gap: 8, marginBottom: editStages ? 14 : 22, flexWrap: 'wrap', alignItems: 'center' }}>
          {stages.map(stage => {
            const count = leads.filter(l => (l.stage as string) === stage.id).length
            return (
              <div key={stage.id} style={{ background: LA.white, border: `1px solid ${count > 0 ? stage.color + '55' : LA.border}`, borderRadius: 99, padding: '7px 14px', display: 'flex', gap: 7, alignItems: 'center' }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: count > 0 ? stage.color : LA.border }} />
                <span style={{ fontSize: 12, color: count > 0 ? LA.ink2 : LA.ink3, fontWeight: 500 }}>{stage.label}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: count > 0 ? stage.color : LA.ink3 }}>{count}</span>
              </div>
            )
          })}
          <button onClick={() => setEditStages(v => !v)} style={{ marginLeft: 'auto', background: 'none', border: `1px solid ${LA.border}`, borderRadius: 99, padding: '7px 14px', fontSize: 12, fontWeight: 600, color: editStages ? 'var(--admin-accent, #FF6B6B)' : LA.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>
            {editStages ? '✓ Listo' : '⚙ Editar etapas'}
          </button>
        </div>

        {editStages && (
          <StageEditor stages={stages} leadCount={id => leads.filter(l => (l.stage as string) === id).length} onRename={renameStage} onRecolor={recolorStage} onAdd={addStage} onRemove={removeStage} />
        )}

        {view === 'kanban' ? (
          <KanbanBoard
            columns={stages}
            cards={cards}
            onCardsChange={handleCardsChange}
            onCardMove={persistMove}
            onAddCard={(col) => setEditing(emptyLead(col as LeadStage))}
            onCardOpen={(card) => { const l = leads.find(x => x.id === card.id); if (l) setEditing(l) }}
            addLabel="+ Agregar lead"
          />
        ) : (
          <LeadsTable leads={leads} stageLabel={stageLabel} stageColor={stageColor} onRowClick={setEditing} />
        )}
      </div>

      {editing && (
        <LeadDrawer
          lead={editing}
          team={team}
          slug={slug}
          stages={stages}
          isNew={!leads.some(l => l.id === editing.id)}
          onSave={upsert}
          onDelete={remove}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  )
}

/* ─── Editor de etapas ──────────────────────────────────── */
function StageEditor({ stages, leadCount, onRename, onRecolor, onAdd, onRemove }: {
  stages: KanbanColumn[]
  leadCount: (id: string) => number
  onRename: (id: string, label: string) => void
  onRecolor: (id: string, color: string) => void
  onAdd: () => void
  onRemove: (id: string) => void
}) {
  return (
    <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 16, padding: '16px 18px', marginBottom: 22 }}>
      <div style={{ fontFamily: LA.mono, fontSize: 10, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Configurar etapas · cambios solo en esta sesión</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {stages.map(s => {
          const n = leadCount(s.id)
          return (
            <div key={s.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <input type="color" value={s.color} onChange={e => onRecolor(s.id, e.target.value)} title="Color" style={{ width: 30, height: 30, padding: 0, border: `1px solid ${LA.border}`, borderRadius: 8, background: 'none', cursor: 'pointer', flexShrink: 0 }} />
              <input value={s.label} onChange={e => onRename(s.id, e.target.value)} style={{ flex: 1, background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 8, padding: '8px 11px', fontSize: 13.5, color: LA.ink, fontFamily: 'inherit', outline: 'none' }} />
              <span style={{ fontSize: 11.5, color: LA.ink3, minWidth: 56, textAlign: 'right' }}>{n} lead{n === 1 ? '' : 's'}</span>
              <button onClick={() => onRemove(s.id)} disabled={stages.length <= 1} title={n > 0 ? `Los ${n} leads pasan a la primera etapa` : 'Eliminar etapa'} style={{ background: 'none', border: `1px solid ${LA.border}`, borderRadius: 8, width: 30, height: 30, color: stages.length <= 1 ? LA.border : LA.danger, cursor: stages.length <= 1 ? 'not-allowed' : 'pointer', fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</button>
            </div>
          )
        })}
      </div>
      <button onClick={onAdd} style={{ marginTop: 12, background: 'none', border: `1px dashed ${LA.border}`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontWeight: 600, color: LA.ink2, cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}>+ Agregar etapa</button>
    </div>
  )
}

/* ─── Tabla ─────────────────────────────────────────────── */
function LeadsTable({ leads, stageLabel, stageColor, onRowClick }: { leads: Lead[]; stageLabel: Record<string, string>; stageColor: Record<string, string>; onRowClick: (l: Lead) => void }) {
  const col = (s: string) => stageColor[s] ?? '#9A9590'
  return (
    <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 16, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.2fr 1fr 1fr 110px', gap: 12, padding: '12px 20px', borderBottom: `1px solid ${LA.border}`, fontFamily: LA.mono, fontSize: 10, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>
        <div>Cliente</div><div>Tipo</div><div>Contacto</div><div>Interés</div><div>Agente</div><div>Etapa</div>
      </div>
      {leads.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: LA.ink3, fontSize: 13 }}>Sin leads todavía.</div>}
      {leads.map((l, i) => (
        <button key={l.id} onClick={() => onRowClick(l)} className="coral-row" style={{ width: '100%', textAlign: 'left', display: 'grid', gridTemplateColumns: '1.6fr 1fr 1.2fr 1fr 1fr 110px', gap: 12, padding: '14px 20px', alignItems: 'center', background: 'none', border: 'none', borderTop: i > 0 ? `1px solid ${LA.border}` : 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ width: 32, height: 32, borderRadius: 99, background: col(l.stage) + '1A', color: col(l.stage), display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, flexShrink: 0 }}>{(l.name || '·').split(' ').map(w => w[0]).slice(0, 2).join('')}</span>
            <span style={{ fontSize: 14, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name || 'Sin nombre'}</span>
          </div>
          <div style={{ fontSize: 12.5, color: LA.ink2, textTransform: 'capitalize' }}>{l.client_type ?? '—'}</div>
          <div style={{ fontSize: 12.5, color: LA.ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.phone || l.email || '—'}</div>
          <div style={{ fontSize: 12.5, color: LA.ink2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.property_interest || '—'}</div>
          <div style={{ fontSize: 12.5, color: LA.ink2 }}>{l.agent || '—'}</div>
          <div><span style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: col(l.stage) + '18', color: col(l.stage) }}>{stageLabel[l.stage] ?? l.stage}</span></div>
        </button>
      ))}
    </div>
  )
}

/* ─── Drawer de alta/edición ────────────────────────────── */
function LeadDrawer({ lead, team, slug, stages, isNew, onSave, onDelete, onClose }: {
  lead: Lead; team: TeamMember[]; slug: string; stages: KanbanColumn[]; isNew: boolean
  onSave: (l: Lead) => void; onDelete: (id: string) => void; onClose: () => void
}) {
  const [form, setForm] = useState<Lead>(lead)
  const set = <K extends keyof Lead>(k: K, v: Lead[K]) => setForm(f => ({ ...f, [k]: v }))

  const field: React.CSSProperties = { width: '100%', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 13.5, color: LA.ink, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const label: React.CSSProperties = { fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6, display: 'block' }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.3)', zIndex: 300 }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(460px, 100vw)', background: LA.bg, borderLeft: `1px solid ${LA.border}`, zIndex: 301, display: 'flex', flexDirection: 'column', fontFamily: LA.sans }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${LA.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: LA.white }}>
          <div>
            <div style={{ fontFamily: LA.mono, fontSize: 10, color: 'var(--admin-accent, #FF6B6B)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{isNew ? 'Nuevo lead' : 'Editar lead'}</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-.01em' }}>{form.name || 'Sin nombre'}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: LA.ink3, fontSize: 24, lineHeight: 1 }}>×</button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div><label style={label}>Nombre y apellido</label><input style={field} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ej: Camila R." /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>Tipo de cliente</label>
              <select style={field} value={form.client_type ?? 'comprador'} onChange={e => set('client_type', e.target.value as ClientType)}>
                {CLIENT_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div><label style={label}>Operación</label>
              <select style={field} value={form.operation_interest ?? 'venta'} onChange={e => set('operation_interest', e.target.value as 'venta' | 'alquiler')}>
                <option value="venta">Venta</option><option value="alquiler">Alquiler</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>Etapa</label>
              <select style={field} value={form.stage} onChange={e => set('stage', e.target.value as LeadStage)}>
                {stages.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div><label style={label}>Origen</label>
              <select style={field} value={form.source} onChange={e => set('source', e.target.value)}>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${LA.border}`, paddingTop: 16 }}>
            <div style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>// Contacto principal</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={label}>Teléfono</label><input style={field} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+54 11 ..." /></div>
              <div><label style={label}>Email</label><input style={field} value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@..." /></div>
            </div>
          </div>

          <div>
            <div style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>// Contacto secundario</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={label}>Nombre</label><input style={field} value={form.contact2_name ?? ''} onChange={e => set('contact2_name', e.target.value)} placeholder="Ej: cónyuge, socio" /></div>
              <div><label style={label}>Teléfono</label><input style={field} value={form.contact2_phone ?? ''} onChange={e => set('contact2_phone', e.target.value)} placeholder="+54 11 ..." /></div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, borderTop: `1px solid ${LA.border}`, paddingTop: 16 }}>
            <div><label style={label}>Interés / propiedad</label><input style={field} value={form.property_interest} onChange={e => set('property_interest', e.target.value)} placeholder="Ej: 2 amb Palermo" /></div>
            <div><label style={label}>Presupuesto</label><input style={field} value={form.budget} onChange={e => set('budget', e.target.value)} placeholder="USD 150.000" /></div>
          </div>

          <div><label style={label}>Agente asignado</label>
            <select style={field} value={form.agent} onChange={e => set('agent', e.target.value)}>
              <option value="">Sin asignar</option>
              {team.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}
            </select>
          </div>

          <div><label style={label}>Observaciones</label>
            <textarea style={{ ...field, resize: 'vertical', minHeight: 90 }} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Notas internas, preferencias, seguimiento..." />
          </div>
        </div>

        {/* Footer actions */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${LA.border}`, background: LA.white, display: 'flex', gap: 10, alignItems: 'center' }}>
          {!isNew && (
            <button onClick={() => onDelete(form.id)} style={{ background: 'none', border: `1px solid ${LA.border}`, color: LA.danger, padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Eliminar</button>
          )}
          {!isNew && (
            <a href={`/api/pdf/lead/${form.id}?slug=${slug}`} target="_blank" rel="noreferrer" style={{ background: LA.white, border: `1px solid ${LA.border}`, color: LA.ink2, padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Ficha PDF ↓</a>
          )}
          <button onClick={onClose} style={{ marginLeft: 'auto', background: LA.white, border: `1px solid ${LA.border}`, color: LA.ink2, padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
          <button onClick={() => onSave({ ...form, last_contact: new Date().toISOString().slice(0, 10) })} disabled={!form.name.trim()} style={{ background: form.name.trim() ? 'var(--admin-accent, #FF6B6B)' : LA.border, color: form.name.trim() ? LA.white : LA.ink3, border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: form.name.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
            {isNew ? 'Crear lead' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </>
  )
}
