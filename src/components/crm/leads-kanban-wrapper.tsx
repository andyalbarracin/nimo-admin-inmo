'use client'

import KanbanBoard, { type KanbanCard, type KanbanColumn } from './kanban-client'

interface Lead {
  id: string
  name: string
  stage: string
  source: string
  property_interest: string
  budget: string
  agent: string
  phone?: string
}

interface LeadsKanbanWrapperProps {
  leads: Lead[]
  slug: string
}

const STAGES: KanbanColumn[] = [
  { id: 'new',        label: 'Nuevo',      color: '#FF6A00' },
  { id: 'contacted',  label: 'Contactado', color: '#4A90E2' },
  { id: 'interested', label: 'Interesado', color: '#D4A017' },
  { id: 'visit',      label: 'Visita',     color: '#E8804A' },
  { id: 'proposal',   label: 'Propuesta',  color: '#8B5CF6' },
  { id: 'won',        label: 'Cerrado',    color: '#2D7D5F' },
  { id: 'lost',       label: 'Perdido',    color: '#8A8A83' },
]

export default function LeadsKanbanWrapper({ leads }: LeadsKanbanWrapperProps) {
  const cards: KanbanCard[] = leads.map(lead => ({
    id: lead.id,
    column: lead.stage,
    title: lead.name,
    subtitle: lead.property_interest,
    meta: `${lead.budget} · ${lead.agent}`,
    tag: lead.source,
    phone: lead.phone,
    notes: [],
  }))

  return (
    <KanbanBoard
      columns={STAGES}
      initialCards={cards}
      addLabel="+ Agregar lead"
    />
  )
}
