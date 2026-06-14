/*
 * Archivo : agency-dashboard-live.tsx
 * Ruta    : src/components/agency/agency-dashboard-live.tsx
 * Modif.  : 2026-06-14
 * Descripción: Dashboard REAL del panel de una inmobiliaria provisionada (lee sus
 *              propios datos, no la demo). Presentacional: recibe stats y listas ya
 *              calculadas en el server. Para agencias nuevas muestra estados vacíos
 *              con CTAs.
 */
import Link from 'next/link'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#E8E2D8', cream: '#F4F0E8',
  ink: '#1A1A1A', ink2: '#525252', ink3: '#9A9590', coral: '#FF6B6B', green: '#2D7D5F',
  sans: 'var(--font-sans), system-ui, sans-serif',
}

interface Stats { properties: number; available: number; leads: number; members: number }

export default function AgencyDashboardLive({
  slug, agencyName, planName, stats, recentLeads, recentProperties,
}: {
  slug: string
  agencyName: string
  planName: string
  stats: Stats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentLeads: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recentProperties: any[]
}) {
  const base = `/${slug}/admin`
  const kpis = [
    { label: 'Propiedades', value: stats.properties, href: `${base}/propiedades` },
    { label: 'Disponibles', value: stats.available, href: `${base}/propiedades` },
    { label: 'Leads', value: stats.leads, href: `${base}/leads` },
    { label: 'Equipo', value: stats.members, href: `${base}/equipo` },
  ]

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh', background: LA.bg, color: LA.ink, fontFamily: LA.sans }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: LA.coral, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Panel · {planName}</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-.02em' }}>{agencyName}</h1>
        <p style={{ fontSize: 13, color: LA.ink3, margin: '4px 0 0' }}>Resumen de tu inmobiliaria.</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
        {kpis.map(k => (
          <Link key={k.label} href={k.href} style={{ textDecoration: 'none', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, padding: '18px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: LA.ink, lineHeight: 1 }}>{k.value}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        {/* Recent properties */}
        <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${LA.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Propiedades recientes</div>
            <Link href={`${base}/propiedades`} style={{ fontSize: 12, color: LA.coral, textDecoration: 'none', fontWeight: 600 }}>Gestionar →</Link>
          </div>
          {recentProperties.length === 0 ? (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <p style={{ color: LA.ink3, fontSize: 13, margin: '0 0 12px' }}>Todavía no cargaste propiedades.</p>
              <Link href={`${base}/propiedades/nueva`} style={{ display: 'inline-block', background: LA.coral, color: LA.white, fontSize: 13, fontWeight: 700, padding: '9px 18px', borderRadius: 8, textDecoration: 'none' }}>+ Cargar la primera</Link>
            </div>
          ) : recentProperties.slice(0, 5).map((p, i) => (
            <div key={p.id ?? i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px', borderBottom: i < Math.min(recentProperties.length, 5) - 1 ? `1px solid ${LA.cream}` : 'none' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title ?? 'Sin título'}</div>
                <div style={{ fontSize: 11, color: LA.ink3 }}>{p.neighborhood ?? ''}{p.operation ? ` · ${p.operation}` : ''}</div>
              </div>
              {p.price ? <div style={{ fontSize: 13, fontWeight: 700, color: LA.coral }}>{p.currency ?? 'USD'} {Number(p.price).toLocaleString('es-AR')}</div> : null}
            </div>
          ))}
        </div>

        {/* Recent leads */}
        <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px 12px', borderBottom: `1px solid ${LA.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Leads recientes</div>
            <Link href={`${base}/leads`} style={{ fontSize: 12, color: LA.coral, textDecoration: 'none', fontWeight: 600 }}>Ver CRM →</Link>
          </div>
          {recentLeads.length === 0 ? (
            <div style={{ padding: '28px 20px', textAlign: 'center' }}>
              <p style={{ color: LA.ink3, fontSize: 13, margin: 0 }}>Todavía no recibiste leads. Aparecerán acá cuando alguien complete el formulario de tu sitio.</p>
            </div>
          ) : recentLeads.slice(0, 5).map((l, i) => (
            <div key={l.id ?? i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px', borderBottom: i < Math.min(recentLeads.length, 5) - 1 ? `1px solid ${LA.cream}` : 'none' }}>
              <div style={{ width: 30, height: 30, borderRadius: 9999, background: 'rgba(255,107,107,.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: LA.coral, flexShrink: 0 }}>
                {(l.name ?? '?').split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.name ?? '—'}</div>
                <div style={{ fontSize: 11, color: LA.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.property_interest ?? l.email ?? ''}</div>
              </div>
              {l.stage ? <span style={{ fontSize: 10, background: 'rgba(255,107,107,.1)', color: LA.coral, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase', fontWeight: 600 }}>{l.stage}</span> : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
