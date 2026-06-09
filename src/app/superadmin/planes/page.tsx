import Link from 'next/link'
import { AGENCIES } from '@/lib/dummy'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF',
  border: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00',
}

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    color: '#2D7D5F',
    features: ['30 propiedades', '2 usuarios', '1 layout', 'QR para carteles', 'Soporte por email'],
    limits: { properties: 30, users: 2 },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 59,
    color: '#4A90E2',
    popular: true,
    features: ['Propiedades ilimitadas', '4 usuarios', 'CRM con Kanban', 'WhatsApp integrado', '3 layouts premium', 'Fichas PDF'],
    limits: { properties: -1, users: 4 },
  },
  {
    id: 'business',
    name: 'Business',
    price: 119,
    color: '#8B5CF6',
    features: ['Todo lo de Pro', '10 usuarios', 'Dominio propio', 'API + integraciones', 'Reportes avanzados'],
    limits: { properties: -1, users: 10 },
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: null,
    color: '#E71D0A',
    features: ['Todo ilimitado', 'Multi-sede', 'SLA garantizado', 'Manager dedicado', 'Implementación custom'],
    limits: { properties: -1, users: -1 },
  },
]

export default function PlanesAdmin() {
  const getAgenciesByPlan = (planId: string) => AGENCIES.filter(a => a.plan === planId).length
  const getPlanMRR = (planId: string, price: number | null) => {
    if (!price) return 'Custom'
    const count = AGENCIES.filter(a => a.plan === planId && a.plan_status === 'active').length
    return `$${(count * price).toLocaleString()}`
  }

  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: 'var(--font-sans)' }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: ZR.black, margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>PLANES</h1>
        <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>Configuración de planes y precios de la plataforma.</p>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 36 }}>
        {PLANS.map((plan) => {
          const agenciesCount = getAgenciesByPlan(plan.id)
          const mrr = getPlanMRR(plan.id, plan.price)
          return (
            <div key={plan.id} style={{ background: ZR.white, border: `1px solid ${plan.popular ? plan.color + '55' : ZR.border}`, borderRadius: 4, padding: 24, position: 'relative' }}>
              {plan.popular && (
                <div style={{ position: 'absolute', top: -1, right: 16, fontFamily: "'Archivo Black', sans-serif", fontSize: 9, background: plan.color, color: ZR.white, padding: '4px 10px', borderRadius: '0 0 4px 4px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Popular
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16, color: plan.color, textTransform: 'uppercase', letterSpacing: '.02em' }}>{plan.name}</div>
                  {plan.price ? (
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, color: ZR.black, marginTop: 4 }}>
                      USD {plan.price}<span style={{ fontFamily: "'Archivo', sans-serif", fontSize: 12, fontWeight: 400, color: ZR.ink3 }}>/mes</span>
                    </div>
                  ) : (
                    <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 20, color: ZR.black, marginTop: 4 }}>Custom</div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, color: plan.color }}>{agenciesCount}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em' }}>agencias</div>
                </div>
              </div>

              <div style={{ marginBottom: 16 }}>
                {plan.features.map((f) => (
                  <div key={f} style={{ fontSize: 12, color: ZR.ink2, marginBottom: 6, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ color: plan.color, fontFamily: "'Archivo Black', sans-serif", fontSize: 10 }}>✓</span> {f}
                  </div>
                ))}
              </div>

              <div style={{ paddingTop: 14, borderTop: `1px solid ${ZR.border}` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>MRR de este plan</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 18, color: agenciesCount > 0 ? ZR.orange : ZR.border }}>{mrr}</div>
              </div>

              <button style={{ width: '100%', marginTop: 16, background: ZR.cream, border: `1px solid ${plan.color}44`, color: plan.color, padding: '9px', borderRadius: 3, fontFamily: "'Archivo Black', sans-serif", fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer' }}>
                EDITAR PLAN
              </button>
            </div>
          )
        })}
      </div>

      {/* Agencies by plan */}
      <div style={{ background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px 14px', borderBottom: `1px solid ${ZR.border}` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em' }}>// AGENCIAS POR PLAN</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '10px 24px', borderBottom: `1px solid ${ZR.border}`, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em' }}>
          <div>Agencia</div><div>Plan actual</div><div>MRR</div><div>Estado</div><div>Acción</div>
        </div>
        {AGENCIES.map((agency, i) => {
          const plan = PLANS.find(p => p.id === agency.plan) ?? PLANS[0]!
          const statusColor = agency.plan_status === 'active' ? '#2D7D5F' : agency.plan_status === 'trial' ? '#A07C0A' : '#E71D0A'
          const statusLabel = agency.plan_status === 'active' ? 'Activo' : agency.plan_status === 'trial' ? 'Trial' : 'Suspendido'
          return (
            <div key={agency.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', padding: '13px 24px', borderBottom: i < AGENCIES.length - 1 ? `1px solid ${ZR.border}` : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: ZR.black }}>{agency.name}</div>
              <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 10, background: 'rgba(255,106,0,.1)', color: ZR.orange, padding: '3px 9px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '.04em', display: 'inline-block', width: 'fit-content' }}>{plan.name}</span>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: agency.mrr > 0 ? ZR.orange : ZR.ink3 }}>{agency.mrr > 0 ? `$${agency.mrr}` : 'Trial'}</div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, background: statusColor + '18', color: statusColor, padding: '3px 9px', borderRadius: 2, display: 'inline-block', width: 'fit-content', textTransform: 'uppercase', letterSpacing: '.08em' }}>{statusLabel}</span>
              <Link href={`/superadmin/agencias/${agency.slug}`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.black, textDecoration: 'none', padding: '6px 12px', background: ZR.cream, border: `1px solid ${ZR.border}`, borderRadius: 3, display: 'inline-block' }}>
                Cambiar plan
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
