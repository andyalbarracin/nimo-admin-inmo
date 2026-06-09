import Link from 'next/link'
import { PROPERTIES, LEADS, AGENCY_STATS, AGENCIES } from '@/lib/dummy'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#EDEBE6',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  coral: '#FF6B6B', coralLight: 'rgba(255,107,107,.08)',
}

const STAGE_COLORS: Record<string, string> = {
  new: '#FF6B6B', contacted: '#4A90E2', interested: '#D4A017',
  visit: '#E8804A', proposal: '#8B5CF6', won: '#2D7D5F', lost: '#9A9590',
}
const STAGE_LABELS: Record<string, string> = {
  new: 'Nuevo', contacted: 'Contactado', interested: 'Interesado',
  visit: 'Visita', proposal: 'Propuesta', won: 'Cerrado', lost: 'Perdido',
}

export default async function AdminDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  const recentLeads = LEADS.slice(0, 5)
  const featuredProps = PROPERTIES.filter(p => p.is_featured).slice(0, 4)

  return (
    <div style={{ padding: '36px 44px', background: LA.bg, minHeight: '100vh', color: LA.ink, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 12, color: LA.ink3, marginBottom: 6, fontWeight: 500 }}>Panel de Control</div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: LA.ink, margin: '0 0 4px', lineHeight: 1, letterSpacing: '-.02em' }}>
            {agency?.name ?? 'Tu Inmobiliaria'}
          </h1>
          <p style={{ fontSize: 13, color: LA.ink2, margin: 0 }}>Buen día. Resumen de actividad.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href={`/${slug}`} target="_blank" style={{ fontSize: 13, color: LA.ink2, textDecoration: 'none', padding: '9px 16px', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 8, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            Ver sitio
          </Link>
          <Link href={`/${slug}/admin/propiedades/nueva`} style={{ fontSize: 13, color: LA.white, textDecoration: 'none', padding: '9px 18px', background: LA.coral, borderRadius: 8, fontWeight: 700 }}>
            + Nueva propiedad
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Propiedades activas', value: AGENCY_STATS.available_properties, sub: `${AGENCY_STATS.total_properties} en total`, color: LA.coral, href: `/${slug}/admin/propiedades` },
          { label: 'Leads este mes', value: AGENCY_STATS.leads_this_month, sub: `${AGENCY_STATS.total_leads} en total`, color: '#4A90E2', href: `/${slug}/admin/leads` },
          { label: 'Visitas al sitio', value: AGENCY_STATS.visits_this_month, sub: 'este mes', color: '#8B5CF6', href: null },
          { label: 'Leads nuevos', value: AGENCY_STATS.new_leads, sub: 'sin contactar', color: '#2D7D5F', href: `/${slug}/admin/leads` },
        ].map((kpi) => (
          <div key={kpi.label} style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, padding: '20px 20px 16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: LA.ink3 }}>{kpi.label}</div>
              {kpi.href && <Link href={kpi.href} style={{ fontSize: 11, color: kpi.color, textDecoration: 'none', fontWeight: 600 }}>Ver →</Link>}
            </div>
            <div style={{ fontSize: 38, fontWeight: 800, color: kpi.color, lineHeight: 1, marginBottom: 4, letterSpacing: '-.02em' }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: LA.ink3 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, marginBottom: 18 }}>
        {/* Recent leads */}
        <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${LA.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>CRM</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: LA.ink }}>Últimos leads</div>
            </div>
            <Link href={`/${slug}/admin/leads`} style={{ fontSize: 12, color: LA.coral, textDecoration: 'none', fontWeight: 600 }}>Ver todos →</Link>
          </div>
          {recentLeads.map((lead, i) => (
            <Link key={lead.id} href={`/${slug}/admin/leads/${lead.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px', textDecoration: 'none', borderBottom: i < recentLeads.length - 1 ? `1px solid ${LA.border}` : 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 9999, background: (STAGE_COLORS[lead.stage] ?? LA.coral) + '18', border: `1.5px solid ${(STAGE_COLORS[lead.stage] ?? LA.coral)}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: STAGE_COLORS[lead.stage] ?? LA.coral, fontSize: 12, flexShrink: 0 }}>
                {lead.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: LA.ink }}>{lead.name}</div>
                <div style={{ fontSize: 11, color: LA.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.property_interest}</div>
              </div>
              <span style={{ fontSize: 11, background: (STAGE_COLORS[lead.stage] ?? LA.coral) + '15', color: STAGE_COLORS[lead.stage] ?? LA.coral, padding: '3px 9px', borderRadius: 999, fontWeight: 600 }}>
                {STAGE_LABELS[lead.stage] ?? lead.stage}
              </span>
            </Link>
          ))}
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Pipeline */}
          <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>Pipeline CRM</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: LA.ink, marginBottom: 14 }}>Por etapa</div>
            {Object.entries(AGENCY_STATS.leads_by_stage).map(([stage, count]) => (
              count > 0 && (
                <div key={stage} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                  <div style={{ width: 6, height: 6, borderRadius: 9999, background: STAGE_COLORS[stage] ?? LA.coral, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: 11, color: LA.ink2 }}>{STAGE_LABELS[stage]}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: LA.ink }}>{count}</span>
                    </div>
                    <div style={{ height: 3, background: LA.border, borderRadius: 9999 }}>
                      <div style={{ height: '100%', width: `${(count / AGENCY_STATS.total_leads) * 100}%`, background: STAGE_COLORS[stage] ?? LA.coral, borderRadius: 9999 }} />
                    </div>
                  </div>
                </div>
              )
            ))}
            <Link href={`/${slug}/admin/leads`} style={{ display: 'block', marginTop: 12, background: LA.coral, color: LA.white, padding: '8px', borderRadius: 8, textAlign: 'center', fontSize: 12, textDecoration: 'none', fontWeight: 700 }}>
              Abrir CRM →
            </Link>
          </div>

          {/* Quick actions */}
          <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>Acciones rápidas</div>
            {[
              { label: 'Nueva propiedad', href: `/${slug}/admin/propiedades/nueva` },
              { label: 'Ver propiedades', href: `/${slug}/admin/propiedades` },
              { label: 'Gestionar leads', href: `/${slug}/admin/leads` },
              { label: 'Configuración', href: `/${slug}/admin/configuracion` },
              { label: 'Tema del sitio', href: `/${slug}/admin/tema` },
            ].map((action) => (
              <Link key={action.label} href={action.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px', borderRadius: 8, textDecoration: 'none', marginBottom: 2, color: LA.ink2, fontSize: 13 }}>
                {action.label}
                <span style={{ fontSize: 12, color: LA.coral, fontWeight: 700 }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${LA.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>Destacadas</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: LA.ink }}>Propiedades destacadas</div>
          </div>
          <Link href={`/${slug}/admin/propiedades`} style={{ fontSize: 12, color: LA.coral, textDecoration: 'none', fontWeight: 600 }}>Gestionar →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {featuredProps.map((prop, i) => (
            <Link key={prop.id} href={`/${slug}/admin/propiedades/${prop.id}`} style={{ textDecoration: 'none', borderRight: i < featuredProps.length - 1 ? `1px solid ${LA.border}` : 'none' }}>
              <div style={{ padding: '14px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
                <img src={prop.images[0]} alt={prop.title} style={{ width: 50, height: 38, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: LA.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 2 }}>{prop.title}</div>
                  <div style={{ fontSize: 12, color: LA.coral, fontWeight: 700 }}>{prop.currency} {prop.price.toLocaleString('es-AR')}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
