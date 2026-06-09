'use client'

import Link from 'next/link'
import KanbanBoard, { type KanbanCard, type KanbanColumn } from '@/components/crm/kanban-client'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF',
  border: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00', red: '#E71D0A',
}

const COLUMNS: KanbanColumn[] = [
  { id: 'prospect',    label: 'Prospecto',     color: '#8A8A83' },
  { id: 'contacted',  label: 'Contactado',    color: '#4A90E2' },
  { id: 'demo',       label: 'Demo agendada', color: '#FF6A00' },
  { id: 'proposal',   label: 'Propuesta',     color: '#8B5CF6' },
  { id: 'negotiation',label: 'Negociación',   color: '#D4A017' },
  { id: 'client',     label: 'Cliente',       color: '#2D7D5F' },
  { id: 'churn_risk', label: 'Riesgo churn',  color: '#E71D0A' },
]

const INITIAL_CARDS: KanbanCard[] = [
  {
    id: 'crm-001', column: 'demo',
    title: 'Inmobiliaria Roca', subtitle: 'Martín Roca · Rosario',
    meta: 'Enviar propuesta Pro',
    tag: 'Pro', tagColor: '#8B5CF6',
    badge: '$59/mes',
    phone: '+5491144221111',
    notes: [{ id: 'n1', text: 'Tiene 3 asesores, viene de Tokko. Muy interesado en el módulo de IA.', author: 'Superadmin', date: 'Hoy, 10:30' }],
  },
  {
    id: 'crm-002', column: 'proposal',
    title: 'Grupo Sur', subtitle: 'Laura Herrera · Buenos Aires',
    meta: 'Llamar para cerrar',
    tag: 'Business', tagColor: '#4A90E2',
    badge: '$119/mes',
    phone: '+5491145557890',
    notes: [],
  },
  {
    id: 'crm-003', column: 'contacted',
    title: 'Propiedades del Norte', subtitle: 'Carlos Vega · Córdoba',
    meta: 'Agendar demo',
    tag: 'Starter', tagColor: '#2D7D5F',
    badge: '$29/mes',
    phone: '+543514220000',
    notes: [{ id: 'n2', text: 'Agencia unipersonal, sensible al precio. Ofrecer plan anual con descuento.', author: 'Superadmin', date: 'hace 2 días' }],
  },
  {
    id: 'crm-004', column: 'client',
    title: 'Realty BA', subtitle: 'Ana Torres · Buenos Aires',
    meta: 'Check in mensual',
    tag: 'Pro', tagColor: '#8B5CF6',
    badge: '$59/mes',
    phone: '+5491140012222',
    notes: [],
  },
  {
    id: 'crm-005', column: 'prospect',
    title: 'Gestión Integral', subtitle: 'Roberto Díaz · Rosario',
    meta: 'Primer contacto',
    tag: 'Pro', tagColor: '#8B5CF6',
    badge: '$59/mes',
    phone: '+543414880000',
    notes: [],
  },
  {
    id: 'crm-006', column: 'negotiation',
    title: 'Casas & Campos', subtitle: 'Sandra Ruiz · Pilar',
    meta: 'Enviar contrato — piden 10% dto anual',
    tag: 'Business', tagColor: '#4A90E2',
    badge: '$119/mes',
    phone: '+5491149003333',
    notes: [],
  },
  {
    id: 'crm-007', column: 'churn_risk',
    title: 'InmoRed Patagonia', subtitle: 'Diego Alvarado · Bariloche',
    meta: 'URGENTE: Sin login en 3 semanas',
    tag: 'Pro', tagColor: '#8B5CF6',
    badge: '$59/mes',
    phone: '+542944450000',
    notes: [{ id: 'n3', text: 'Posible abandono. No usa el CRM. Llamar esta semana sí o sí.', author: 'Superadmin', date: 'hace 3 semanas' }],
  },
]

const totalMRR = INITIAL_CARDS.filter(c => c.column === 'client').reduce((acc, c) => {
  const match = c.badge?.match(/\$(\d+)/)
  return acc + (match ? parseInt(match[1] ?? '0') : 0)
}, 0)

const METRICS = [
  { label: 'MRR actual',    value: `$${totalMRR}`, color: '#2D7D5F' },
  { label: 'MRR potencial', value: `$${INITIAL_CARDS.reduce((a, c) => { const m = c.badge?.match(/\$(\d+)/); return a + (m ? parseInt(m[1] ?? '0') : 0) }, 0)}`, color: ZR.orange },
  { label: 'En pipeline',   value: String(INITIAL_CARDS.filter(c => !['client','churn_risk'].includes(c.column)).length), color: '#4A90E2' },
  { label: 'Riesgo churn',  value: String(INITIAL_CARDS.filter(c => c.column === 'churn_risk').length), color: ZR.red },
]

export default function SuperadminCRM() {
  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: ZR.black, margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>CRM — MIS CLIENTES</h1>
          <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>Drag & drop entre etapas · clic en card para notas · 3 puntos para opciones</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/api/webhooks/crm" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.ink3, textDecoration: 'none', padding: '10px 14px', background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 3, textTransform: 'uppercase', letterSpacing: '.1em' }}>
            API Docs →
          </Link>
          <button style={{ background: ZR.black, color: ZR.cream, padding: '11px 20px', borderRadius: 4, fontFamily: "'Archivo Black', sans-serif", fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
            + NUEVO LEAD
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
        {METRICS.map((m) => (
          <div key={m.label} style={{ background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, padding: '18px 20px' }}>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: m.color, lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginTop: 6 }}>{m.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban with DnD */}
      <KanbanBoard
        columns={COLUMNS}
        initialCards={INITIAL_CARDS}
        addLabel="+ Agregar"
      />

      {/* Webhook docs */}
      <div style={{ marginTop: 40, background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, padding: 24 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 16 }}>// AUTOMATIZACIÓN — WEBHOOKS</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { endpoint: '/api/webhooks/crm', desc: 'Crear o actualizar lead en el CRM. Acepta JSON con name, contact, stage, plan_interest, mrr_potential.' },
            { endpoint: '/api/webhooks/lead', desc: 'Recibir leads entrantes de agencias. Usado por agentes IA para capturar consultas.' },
            { endpoint: '/api/webhooks/agency/signup', desc: 'Notifica alta de nueva agencia. Ideal para trigger de onboarding automático.' },
          ].map((wh) => (
            <div key={wh.endpoint} style={{ padding: '14px 16px', background: ZR.cream, border: `1px solid ${ZR.border}`, borderRadius: 4 }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 9, background: ZR.black, color: ZR.cream, padding: '2px 7px', borderRadius: 2 }}>POST</span>
                <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange }}>{wh.endpoint}</code>
              </div>
              <div style={{ fontSize: 11, color: ZR.ink3, lineHeight: 1.5 }}>{wh.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
