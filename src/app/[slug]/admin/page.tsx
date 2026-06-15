import Link from 'next/link'
import { redirect } from 'next/navigation'
import { PROPERTIES, LEADS, AGENCY_STATS, AGENCIES, TEAM } from '@/lib/dummy'
import { THEMES } from '@/lib/themes'
import { getOnboardingStatus } from '@/lib/agencies/onboarding'
import { getLiveAgency } from '@/lib/agencies/provision'
import { listPropertiesForAgency } from '@/lib/properties/server'
import { listLeadsForAgency } from '@/lib/leads/server'
import { listAgencyMembers } from '@/lib/agencies/members'
import AgencyDashboardLive from '@/components/agency/agency-dashboard-live'
import { guardAgencyAccess } from '@/lib/auth/require-tenant'

export const dynamic = 'force-dynamic'

/* ============================================================
 * Universo A · CORAL & CREAM · Dashboard del Panel — A4.
 * ============================================================ */

const LA = {
  bg: '#FAF7F2',
  cream: '#F4F0E8',
  white: '#FFFFFF',
  border: '#E8E2D8',
  ink: '#1A1A1A',
  ink2: '#525252',
  ink3: '#8A8A8A',
  coral: '#FF6B6B',
  coralSoft: '#FFE5DB',
  green: '#2D7D5F',
  mustard: '#D6A03C',
  sans: 'var(--font-sans), system-ui, sans-serif',
  mono: "var(--font-mono), ui-monospace, monospace",
}

const STAGE_COLORS: Record<string, string> = {
  new: '#FF6B6B', contacted: '#4A90E2', interested: '#D4A017',
  visit: '#E8804A', proposal: '#8B5CF6', won: '#2D7D5F', lost: '#9A9590',
}

const VISITS_SPARK = [42, 60, 48, 72, 55, 80, 65, 88, 74, 92, 80, 100]
const WA_BARS = [30, 55, 42, 68, 52, 75, 48, 88, 62, 100, 80, 65]

const PLAN_PRICE: Record<string, number> = { esencial: 49, profesional: 99, a_medida: 199 }
const PLAN_LIMIT: Record<string, number> = { esencial: 50, profesional: 9999, a_medida: 99999 }
const PLAN_USERS: Record<string, number> = { esencial: 2, profesional: 6, a_medida: 99 }

export default async function AdminDashboard({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await guardAgencyAccess(slug)

  // Onboarding: si está activado y sin completar, el owner va primero al wizard.
  // (Solo aplica a agencias reales con la fila en DB; las demo no tienen registro.)
  const onboarding = await getOnboardingStatus(slug)
  if (onboarding && onboarding.enabled && !onboarding.completed) redirect(`/${slug}/admin/onboarding`)

  // Coexistencia: las agencias DEMO (en dummy) mantienen el dashboard de muestra;
  // una agencia REAL (no demo) ve su propio dashboard con datos reales.
  const isDemo = AGENCIES.some(a => a.slug === slug)
  if (!isDemo) {
    const live = await getLiveAgency(slug)
    if (live) {
      const [props, leads, members] = await Promise.all([
        listPropertiesForAgency(slug),
        listLeadsForAgency(slug),
        listAgencyMembers(slug),
      ])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const available = props.filter((p: any) => p.status === 'available').length
      return (
        <AgencyDashboardLive
          slug={slug}
          agencyName={live.name}
          planName={live.plan?.name ?? live.plan?.code ?? ''}
          stats={{ properties: props.length, available, leads: leads.length, members: members.length }}
          recentLeads={leads}
          recentProperties={props}
        />
      )
    }
  }

  const agency = AGENCIES.find(a => a.slug === slug)
  const accent = THEMES[agency?.theme ?? 'editorial'].accent
  const accentSoft = accent + '24'
  const owner = TEAM.find(m => m.role === 'owner')
  const ownerFirst = owner?.name.split(' ')[0] ?? 'equipo'
  const recentLeads = LEADS.slice(0, 5)
  const featured = PROPERTIES.filter(p => p.is_featured).slice(0, 5)
  const plan = agency?.plan ?? 'profesional'
  const planName = plan.replace('_', ' ')
  const planPrice = PLAN_PRICE[plan] ?? 99
  const planLimit = PLAN_LIMIT[plan] ?? 9999
  const planUsers = PLAN_USERS[plan] ?? 6
  const unlimited = planLimit >= 9999

  const kpis = [
    { label: 'Propiedades activas', value: AGENCY_STATS.available_properties, pill: '+3 esta semana', pillKind: 'neutral' as const, href: `/${slug}/admin/propiedades` },
    { label: 'Leads nuevos (mes)', value: AGENCY_STATS.leads_this_month, pill: '↗ +18% vs mes ant.', pillKind: 'success' as const, href: `/${slug}/admin/leads` },
    { label: 'Visitas al sitio', value: AGENCY_STATS.visits_this_month, spark: VISITS_SPARK, href: null },
    { label: 'Tasa de respuesta', value: 94, suffix: '%', progress: 94, href: null },
  ]

  const activity = [
    { who: 'MS', color: '#FF6B6B', a: 'Mateo S.', b: 'cargó una propiedad en', c: 'Palermo', t: 'hace 5 min' },
    { who: '·', color: '#2D7D5F', a: 'Nuevo lead', b: 'desde WhatsApp:', c: 'Camila R.', t: 'hace 32 min' },
    { who: 'VP', color: '#8B5CF6', a: 'Valentina P.', b: 'movió un lead a', c: 'Visita agendada', t: 'hace 1 h' },
    { who: 'TL', color: '#D6A03C', a: 'Tomás L.', b: 'actualizó el', c: 'tema del sitio', t: 'hace 2 h' },
  ]

  const visits = [
    { d: '15', m: 'JUN · 11h', t: 'Depto 2 amb · Palermo', who: 'Camila R.', av: 'C', color: '#FF6B6B' },
    { d: '16', m: 'JUN · 16h', t: 'Casa 4 amb · Caballito', who: 'Sofía M.', av: 'S', color: '#8B5CF6' },
    { d: '17', m: 'JUN · 10h', t: 'PH 3 amb · Belgrano', who: 'Bruno C.', av: 'B', color: '#D6A03C' },
  ]

  return (
    <div style={{ padding: '0 0 40px', background: LA.bg, minHeight: '100vh', color: LA.ink, fontFamily: LA.sans }}>
      {/* TOP HEADER */}
      <header className="rwd-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 40px', background: LA.bg, borderBottom: `1px solid ${LA.border}`, gap: 24, flexWrap: 'wrap' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: 0, lineHeight: 1.1 }}>Buen día, {ownerFirst} 👋</h1>
          <div style={{ fontSize: 13, color: LA.ink2, marginTop: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s-7-6-7-12a7 7 0 0 1 14 0c0 6-7 12-7 12z" /><circle cx="12" cy="10" r="3" /></svg>
            {agency?.address ?? 'Buenos Aires'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Link href={`/${slug}`} target="_blank" style={{ fontSize: 13, color: LA.ink2, textDecoration: 'none', padding: '9px 16px', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, fontWeight: 500 }}>
            Ver sitio público
          </Link>
          <Link href={`/${slug}/admin/propiedades?new=1`} style={{ fontSize: 13, color: LA.white, textDecoration: 'none', padding: '10px 18px', background: accent, borderRadius: 12, fontWeight: 700 }}>
            + Nueva propiedad
          </Link>
        </div>
      </header>

      <div className="rwd-pad" style={{ padding: '28px 40px' }}>
        {/* KPIs */}
        <div className="dash-kpis" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 20 }}>
          {kpis.map(kpi => (
            <div key={kpi.label} className="coral-card" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 24, padding: '22px 24px', boxShadow: '0 1px 2px rgba(26,26,26,.04)', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 156 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: LA.mono, fontSize: 10.5, letterSpacing: '.08em', textTransform: 'uppercase', color: LA.ink3 }}>{kpi.label}</span>
                {kpi.href && <Link href={kpi.href} style={{ fontSize: 12, color: LA.ink, textDecoration: 'none', fontWeight: 600 }}>Ver →</Link>}
              </div>
              <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: '-.035em', lineHeight: 1 }}>
                {typeof kpi.value === 'number' ? kpi.value.toLocaleString('es-AR') : kpi.value}{kpi.suffix}
              </div>
              <div style={{ marginTop: 'auto' }}>
                {kpi.pill && (
                  <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: kpi.pillKind === 'success' ? 'rgba(45,125,95,.1)' : LA.cream, color: kpi.pillKind === 'success' ? LA.green : LA.ink2 }}>{kpi.pill}</span>
                )}
                {kpi.spark && (
                  <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: 28 }}>
                    {kpi.spark.map((h, i) => <div key={i} style={{ flex: 1, background: accent, borderRadius: '2px 2px 0 0', height: `${h}%`, opacity: .9 }} />)}
                  </div>
                )}
                {kpi.progress != null && (
                  <div style={{ height: 6, background: LA.cream, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${kpi.progress}%`, background: accent, borderRadius: 99 }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* MAIN GRID */}
        <div className="dash-2col" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 18 }}>
          {/* LEFT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Destacadas */}
            <div className="coral-card" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 24, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Propiedades destacadas</h3>
                  <p style={{ fontSize: 12.5, color: LA.ink3, margin: '3px 0 0' }}>Las que aparecen primero en tu sitio público.</p>
                </div>
                <Link href={`/${slug}/admin/propiedades`} style={{ fontSize: 13, color: accent, textDecoration: 'none', fontWeight: 600 }}>Gestionar →</Link>
              </div>
              <div>
                {featured.map((prop, i) => (
                  <Link key={prop.id} href={`/${slug}/admin/propiedades/${prop.id}`} className="coral-row" style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto auto', gap: 16, alignItems: 'center', padding: '12px', textDecoration: 'none', borderTop: i > 0 ? `1px solid ${LA.border}` : 'none' }}>
                    <img src={prop.images[0]} alt={prop.title} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 12 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontFamily: LA.mono, fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: LA.ink3 }}>{prop.neighborhood}</div>
                      <div style={{ fontSize: 14.5, fontWeight: 700, color: LA.ink, marginTop: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.title}</div>
                      <div style={{ fontSize: 12.5, color: LA.ink2, marginTop: 3 }}>{[prop.rooms && `${prop.rooms} amb`, prop.bathrooms && `${prop.bathrooms} baños`, prop.covered_area && `${prop.covered_area} m²`].filter(Boolean).join(' · ')}</div>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: prop.operation === 'venta' ? LA.coralSoft : 'rgba(214,160,60,.14)', color: prop.operation === 'venta' ? '#C0392B' : LA.mustard, textTransform: 'capitalize' }}>{prop.operation}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.06em' }}>{prop.currency}</div>
                      <div style={{ fontSize: 18, fontWeight: 800, color: prop.operation === 'venta' ? accent : LA.ink, letterSpacing: '-.02em' }}>{prop.price.toLocaleString('es-AR')}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actividad */}
            <div className="coral-card" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 24, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Actividad reciente</h3>
                <Link href={`/${slug}/admin/leads`} style={{ fontSize: 13, color: accent, textDecoration: 'none', fontWeight: 600 }}>Ver todo →</Link>
              </div>
              {activity.map((ev, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '36px 1fr auto', gap: 14, alignItems: 'center', padding: '12px 0', borderTop: i > 0 ? `1px solid ${LA.border}` : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 99, background: ev.color, color: LA.white, display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 13 }}>{ev.who}</div>
                  <div style={{ fontSize: 14, lineHeight: 1.4 }}>
                    <b>{ev.a}</b> <span style={{ color: LA.ink2 }}>{ev.b}</span> <b>{ev.c}</b>
                  </div>
                  <span style={{ fontFamily: LA.mono, fontSize: 10.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.04em' }}>{ev.t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Próximas visitas */}
            <div className="coral-card" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 24, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Próximas visitas</h3>
                <Link href={`/${slug}/admin/leads`} style={{ fontSize: 13, color: accent, textDecoration: 'none', fontWeight: 600 }}>Agenda →</Link>
              </div>
              {visits.map((v, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '56px 1fr 28px', gap: 12, alignItems: 'center', padding: '12px 0', borderTop: i > 0 ? `1px solid ${LA.border}` : 'none' }}>
                  <div style={{ background: LA.ink, color: LA.white, padding: '8px 6px', borderRadius: 10, textAlign: 'center', lineHeight: 1 }}>
                    <b style={{ display: 'block', fontSize: 16, fontWeight: 800 }}>{v.d}</b>
                    <span style={{ display: 'block', fontFamily: LA.mono, fontSize: 8, letterSpacing: '.06em', marginTop: 3, opacity: .8 }}>{v.m}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{v.t}</div>
                    <div style={{ fontSize: 12, color: LA.ink2, marginTop: 2 }}>{v.who}</div>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: 99, background: v.color, color: LA.white, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700 }}>{v.av}</div>
                </div>
              ))}
            </div>

            {/* Tu plan */}
            <div className="coral-card" style={{ background: `linear-gradient(180deg, ${LA.cream}, ${LA.white})`, border: `1px solid ${LA.border}`, borderRadius: 24, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <span style={{ fontFamily: LA.mono, fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: LA.ink3, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 99, background: accent }} /> Tu plan
                  </span>
                  <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', marginTop: 6 }}>
                    <span style={{ fontSize: 13, color: LA.ink3, verticalAlign: 'super' }}>USD </span>{planPrice}
                    <span style={{ fontSize: 13, color: LA.ink3, fontWeight: 500, textTransform: 'capitalize' }}> /mes · {planName}</span>
                  </div>
                </div>
                <Link href={`/${slug}/admin/configuracion`} style={{ fontSize: 13, color: accent, textDecoration: 'none', fontWeight: 600 }}>Cambiar →</Link>
              </div>
              {[
                { label: 'Propiedades', val: unlimited ? `${AGENCY_STATS.total_properties} · ilimitadas` : `${AGENCY_STATS.total_properties} / ${planLimit}`, pct: unlimited ? 100 : (AGENCY_STATS.total_properties / planLimit) * 100, color: accent },
                { label: 'Usuarios', val: `${agency?.members_count ?? 3} / ${planUsers}`, pct: Math.min(100, ((agency?.members_count ?? 3) / planUsers) * 100), color: accent },
                { label: 'Leads gestionados (mes)', val: `${AGENCY_STATS.leads_this_month} · sin límite`, pct: 100, color: LA.green },
              ].map(u => (
                <div key={u.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                    <span style={{ color: LA.ink2 }}>{u.label}</span>
                    <b>{u.val}</b>
                  </div>
                  <div style={{ height: 6, background: LA.cream, borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(u.pct, 100)}%`, background: u.color, borderRadius: 99 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp del día */}
            <div className="coral-card" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 24, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>WhatsApp del día</h3>
                <span style={{ fontSize: 11.5, fontWeight: 600, padding: '4px 10px', borderRadius: 99, background: 'rgba(45,125,95,.1)', color: LA.green }}>● Conectado</span>
              </div>
              <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.03em' }}>
                {AGENCY_STATS.contacts_this_month}<span style={{ fontSize: 14, color: LA.ink2, fontWeight: 500, marginLeft: 6 }}>mensajes hoy</span>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'end', height: 52, margin: '14px 0 0' }}>
                {WA_BARS.map((h, i) => <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(180deg, #4FB28E, #2D7D5F)', borderRadius: '3px 3px 0 0' }} />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
