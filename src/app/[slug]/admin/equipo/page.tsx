import { TEAM } from '@/lib/dummy'

const ZR = {
  black: '#1A1A1A', cream: '#FAF7F2', cream2: '#FFFFFF',
  creamBorder: '#EDEBE6', ink2: '#4A4845', ink3: '#9A9590',
  orange: '#FF6B6B',
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  owner:  { label: 'Propietario', color: '#FF6A00' },
  admin:  { label: 'Admin',       color: '#8B5CF6' },
  agent:  { label: 'Agente',      color: '#4A90E2' },
  viewer: { label: 'Visor',       color: '#8A8A83' },
}

export default async function EquipoAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: _ } = await params

  return (
    <div style={{ padding: '36px 44px', minHeight: '100vh', background: ZR.cream, color: ZR.black, fontFamily: "'Archivo', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// GESTIÓN</div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, fontWeight: 900, color: ZR.black, margin: '0 0 4px', lineHeight: 0.97, textTransform: 'uppercase', letterSpacing: '-.01em' }}>
            EQUIPO
          </h1>
          <p style={{ fontSize: 13, color: ZR.ink2, margin: 0 }}>{TEAM.length} miembros · Plan Pro (hasta 10 usuarios)</p>
        </div>
        <button style={{ fontFamily: "'Archivo Black', sans-serif", background: ZR.black, color: ZR.cream, padding: '10px 22px', borderRadius: 4, fontSize: 12, fontWeight: 900, border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
          + INVITAR
        </button>
      </div>

      {/* Stripe */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', borderRadius: 2, marginBottom: 26 }} />

      {/* Team grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 26 }}>
        {TEAM.map((member) => {
          const role = ROLE_LABELS[member.role] ?? { label: member.role, color: ZR.ink3 }
          return (
            <div key={member.id} style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 9999, background: role.color + '18', border: `2px solid ${role.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontWeight: 900, color: role.color, fontSize: 14 }}>
                    {member.avatar}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: ZR.black }}>{member.name}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 3 }}>{member.email}</div>
                  </div>
                </div>
                <span style={{ fontSize: 9, background: role.color + '15', color: role.color, padding: '4px 10px', borderRadius: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', border: `1px solid ${role.color}33` }}>
                  {role.label}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2, marginBottom: 14 }}>
                <div style={{ background: ZR.cream, borderRadius: 3, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: ZR.orange, lineHeight: 1 }}>{member.properties_count}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>Propiedades</div>
                </div>
                <div style={{ background: ZR.cream, borderRadius: 3, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: '#4A90E2', lineHeight: 1 }}>{member.leads_count}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>Leads</div>
                </div>
                <div style={{ background: ZR.cream, borderRadius: 3, padding: '12px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: ZR.ink2, wordBreak: 'break-all', lineHeight: 1.2 }}>{member.phone.slice(-8)}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>Teléfono</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ flex: 1, padding: '8px', background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4, color: ZR.ink2, fontSize: 12, cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
                  Editar
                </button>
                {member.role !== 'owner' && (
                  <button style={{ padding: '8px 14px', background: 'transparent', border: '1px solid rgba(231,29,10,.2)', borderRadius: 4, color: '#E71D0A', fontSize: 12, cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
                    Remover
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {/* Invite placeholder */}
        <div style={{ background: 'transparent', border: `1.5px dashed ${ZR.creamBorder}`, borderRadius: 8, padding: 22, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 180, gap: 8 }}>
          <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, color: ZR.creamBorder, lineHeight: 1 }}>+</div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em' }}>Invitar nuevo miembro</div>
          <button style={{ background: ZR.black, color: ZR.cream, border: 'none', padding: '8px 18px', borderRadius: 4, fontSize: 11, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", letterSpacing: '.04em', marginTop: 4 }}>
            + INVITAR
          </button>
        </div>
      </div>

      {/* Roles explanation */}
      <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 22 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// PERMISOS</div>
        <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 15, color: ZR.black, marginBottom: 16 }}>Acceso por rol</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {[
            { role: 'Propietario', color: ZR.orange,   perms: ['Todo el acceso', 'Facturación', 'Eliminar cuenta', 'Configuración'] },
            { role: 'Admin',       color: '#8B5CF6',   perms: ['Propiedades', 'Leads', 'Equipo', 'Configuración'] },
            { role: 'Agente',      color: '#4A90E2',   perms: ['Sus propiedades', 'Sus leads', 'Ver equipo', 'Ver sitio'] },
            { role: 'Visor',       color: ZR.ink3,     perms: ['Solo lectura', 'Sin edición', 'Sin CRM', 'Reportes'] },
          ].map((r) => (
            <div key={r.role} style={{ background: ZR.cream, borderRadius: 4, padding: '14px 14px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: r.color, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 10 }}>{r.role}</div>
              {r.perms.map((p) => (
                <div key={p} style={{ fontSize: 11, color: ZR.ink2, marginBottom: 5, display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ color: r.color, fontSize: 9, fontWeight: 900 }}>✓</span> {p}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
