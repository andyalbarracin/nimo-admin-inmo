import Link from 'next/link'
import { notFound } from 'next/navigation'
import { AGENCIES, PROPERTIES, LEADS, TEAM } from '@/lib/dummy'
import ThemeSelector from '@/components/superadmin/theme-selector'
import AgencyControls from '@/components/superadmin/agency-controls'

const ZR = {
  black: '#111111', cream: '#F5F5F0', cream2: '#FFFFFF',
  creamBorder: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00', red: '#E71D0A', green: '#2D7D5F',
}

const STATUS_MAP = {
  active:    { label: 'Activo',     color: ZR.green },
  suspended: { label: 'Suspendido', color: ZR.red },
} as const

const DUMMY_COMMERCIAL = {
  phone: '+54 11 4512-3456',
  phone2: '+54 9 11 4512-3456',
  rating: 4.7,
  reviews: 23,
  contract_start: '2024-03-15',
  contract_end: '2025-03-15',
  contract_value: 3588,
  notes: 'Agencia sólida, paga puntualmente. Dueño es Martín López, muy comunicativo. Interesado en upgrading a A medida a fin de año.',
  commercial_contact: 'Andrés García',
  last_visit: '2026-05-10',
  next_followup: '2026-07-01',
}

function Mono({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: accent ? ZR.orange : ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>
      {children}
    </div>
  )
}

export default async function AgencyDetail({ params }: { params: Promise<{ agencySlug: string }> }) {
  const { agencySlug } = await params
  const agency = AGENCIES.find(a => a.slug === agencySlug)
  if (!agency) notFound()

  const status = STATUS_MAP[agency.plan_status as keyof typeof STATUS_MAP] ?? STATUS_MAP.active
  const isLopez = agencySlug === 'lopez-asociados'

  return (
    <div style={{ padding: '36px 48px', minHeight: '100vh', background: ZR.cream, color: ZR.black, fontFamily: "var(--font-archivo), 'Archivo', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Link href="/superadmin/agencias" style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>← AGENCIAS</Link>
        <span style={{ color: ZR.creamBorder }}>/</span>
        <h1 style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 22, fontWeight: 900, color: ZR.black, margin: 0, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{agency.name}</h1>
        <span style={{ fontSize: 9, background: status.color + '18', color: status.color, padding: '4px 10px', borderRadius: 2, fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', border: `1px solid ${status.color}44` }}>
          {status.label}
        </span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <Link href={`/${agency.slug}`} target="_blank" style={{ fontSize: 12, color: ZR.ink2, textDecoration: 'none', padding: '8px 14px', background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4 }}>
            Ver sitio →
          </Link>
          <Link href={`/${agency.slug}/admin`} target="_blank" style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 11, color: ZR.cream, textDecoration: 'none', padding: '8px 16px', background: ZR.orange, borderRadius: 4, letterSpacing: '.04em', textTransform: 'uppercase' }}>
            Ingresar como agencia
          </Link>
        </div>
      </div>

      {/* Stripe */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', borderRadius: 2, marginBottom: 24 }} />

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
        {[
          { label: 'PROPIEDADES', value: agency.properties_count, accent: ZR.orange },
          { label: 'LEADS',       value: agency.leads_count,      accent: '#4A90E2' },
          { label: 'EQUIPO',      value: agency.members_count,    accent: '#8B5CF6' },
          { label: 'MRR',         value: agency.mrr > 0 ? `$${agency.mrr}` : '—', accent: ZR.green },
        ].map((s) => (
          <div key={s.label} style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 6, padding: '18px 20px' }}>
            <Mono>{`// ${s.label}`}</Mono>
            <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 34, color: s.accent, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 18 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Agency data */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 24 }}>
            <Mono accent>// DATOS DE LA AGENCIA</Mono>
            <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 18 }}>Información general</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Nombre', value: agency.name },
                { label: 'Slug / URL', value: `/${agency.slug}` },
                { label: 'Owner email', value: agency.owner_email },
                { label: 'Fecha de alta', value: agency.created_at },
                { label: 'Plan', value: agency.plan.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()) },
                { label: 'Estado', value: status.label },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 14, color: ZR.ink2, fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Commercial info */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 24 }}>
            <Mono accent>// GESTIÓN COMERCIAL</Mono>
            <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 18 }}>Datos comerciales</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 16 }}>
              {[
                { label: 'Teléfono fijo', value: DUMMY_COMMERCIAL.phone },
                { label: 'WhatsApp', value: DUMMY_COMMERCIAL.phone2 },
                { label: 'Contacto comercial NIMO', value: DUMMY_COMMERCIAL.commercial_contact },
                { label: 'Última visita / reunión', value: DUMMY_COMMERCIAL.last_visit },
                { label: 'Próximo seguimiento', value: DUMMY_COMMERCIAL.next_followup },
                { label: 'Valor total contrato (12m)', value: `$${DUMMY_COMMERCIAL.contract_value}` },
              ].map((f) => (
                <div key={f.label}>
                  <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>{f.label}</div>
                  <div style={{ fontSize: 14, color: ZR.ink2, fontWeight: 500 }}>{f.value}</div>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div style={{ padding: '14px 16px', background: ZR.cream, borderRadius: 4, display: 'flex', gap: 20, alignItems: 'center', marginBottom: 14 }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>// CALIFICACIÓN</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 28, color: '#FFC107' }}>{DUMMY_COMMERCIAL.rating}</div>
                  <div style={{ fontSize: 11, color: ZR.ink3 }}>/ 5.0 · {DUMMY_COMMERCIAL.reviews} reviews</div>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const pct = star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 8 : 2
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                      <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, width: 12 }}>{star}</div>
                      <div style={{ flex: 1, height: 3, background: ZR.creamBorder, borderRadius: 9999 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: '#FFC107', borderRadius: 9999 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Notes */}
            <div>
              <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>// NOTAS INTERNAS</div>
              <textarea defaultValue={DUMMY_COMMERCIAL.notes} rows={4} style={{ width: '100%', background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4, padding: '10px 12px', color: ZR.black, fontSize: 13, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: "var(--font-archivo), 'Archivo', sans-serif" }} />
            </div>
          </div>

          {/* Contract */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 24 }}>
            <Mono accent>// CONTRATO</Mono>
            <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 16 }}>Historial de contratación</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
              {[
                { label: 'INICIO', value: DUMMY_COMMERCIAL.contract_start, bg: ZR.black, fg: ZR.cream, sub: ZR.orange },
                { label: 'VENCE', value: DUMMY_COMMERCIAL.contract_end, bg: ZR.cream, fg: ZR.black, sub: ZR.ink3 },
                { label: 'VALOR ANUAL', value: `$${DUMMY_COMMERCIAL.contract_value}`, bg: ZR.orange, fg: ZR.black, sub: ZR.black },
              ].map((c) => (
                <div key={c.label} style={{ background: c.bg, borderRadius: 4, padding: '16px 18px' }}>
                  <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 8, color: c.sub, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>{c.label}</div>
                  <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 18, color: c.fg }}>{c.value}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button style={{ fontSize: 11, color: ZR.ink2, background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, padding: '8px 16px', borderRadius: 3, cursor: 'pointer', fontFamily: "var(--font-archivo), 'Archivo', sans-serif" }}>
                Renovar contrato
              </button>
              <button style={{ fontSize: 11, color: ZR.ink2, background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, padding: '8px 16px', borderRadius: 3, cursor: 'pointer', fontFamily: "var(--font-archivo), 'Archivo', sans-serif" }}>
                Descargar PDF
              </button>
            </div>
          </div>

          {/* Properties + Leads preview for lopez */}
          {isLopez && (
            <>
              <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${ZR.creamBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Mono>// PROPIEDADES</Mono>
                    <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 13, color: ZR.black }}>Últimas {PROPERTIES.length}</div>
                  </div>
                  <Link href="/lopez-asociados/admin/propiedades" style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.08em' }}>GESTIONAR →</Link>
                </div>
                {PROPERTIES.slice(0, 5).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 22px', borderBottom: i < 4 ? `1px solid #F2F0EB` : 'none' }}>
                    <img src={p.images[0]} alt={p.title} style={{ width: 44, height: 34, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: ZR.black, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 600 }}>{p.title}</div>
                      <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 2 }}>{p.neighborhood} · {p.operation}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 13, color: ZR.orange }}>{p.currency} {p.price.toLocaleString('es-AR')}</div>
                  </div>
                ))}
              </div>

              <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ padding: '16px 22px 12px', borderBottom: `1px solid ${ZR.creamBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Mono>// LEADS</Mono>
                    <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 13, color: ZR.black }}>Pipeline actual</div>
                  </div>
                  <Link href="/lopez-asociados/admin/leads" style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.08em' }}>VER CRM →</Link>
                </div>
                {LEADS.slice(0, 5).map((l, i) => (
                  <div key={l.id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 22px', borderBottom: i < 4 ? `1px solid #F2F0EB` : 'none' }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9999, background: 'rgba(255,106,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 10, color: ZR.orange, flexShrink: 0 }}>
                      {l.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, color: ZR.black, fontWeight: 600 }}>{l.name}</div>
                      <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 2 }}>{l.property_interest.substring(0, 40)}</div>
                    </div>
                    <span style={{ fontSize: 9, background: 'rgba(255,106,0,.1)', color: ZR.orange, padding: '3px 8px', borderRadius: 2, fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '.06em' }}>{l.stage}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right sidebar — controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Plan + Estado (funcionales) */}
          <AgencyControls plan={agency.plan} status={agency.plan_status} />

          {/* Theme control */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 20 }}>
            <Mono accent>// TEMA DEL SITIO</Mono>
            <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 13, color: ZR.black, marginBottom: 12 }}>Tema activo: <span style={{ color: ZR.orange }}>{agency.theme}</span></div>
            <ThemeSelector agencySlug={agencySlug} currentTheme={agency.theme} />
          </div>

          {/* Branding */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 20 }}>
            <Mono accent>// BRANDING</Mono>
            <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 13, color: ZR.black, marginBottom: 12 }}>Identidad visual</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 12, color: ZR.ink3, lineHeight: 1.5 }}>Logo, colores de marca y favicon de la agencia. El tema se gestiona arriba.</div>
              <span style={{ display: 'block', textAlign: 'center', fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", background: ZR.cream, border: `1px dashed ${ZR.creamBorder}`, color: ZR.ink3, padding: '9px', borderRadius: 4, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                Editor de branding · próximamente
              </span>
            </div>
          </div>

          {/* Team */}
          {isLopez && (
            <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 20 }}>
              <Mono accent>// EQUIPO</Mono>
              <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 13, color: ZR.black, marginBottom: 12 }}>Miembros</div>
              {TEAM.map((m, i) => (
                <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: i < TEAM.length - 1 ? 10 : 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 9999, background: 'rgba(255,106,0,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 10, color: ZR.orange, flexShrink: 0 }}>{m.avatar}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: ZR.black }}>{m.name}</div>
                    <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
