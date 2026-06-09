// Dev-only quick access page — does NOT appear in production builds.
// Visit /dev to get one-click access to any role.

export const metadata = { title: 'Dev Access — NIMO' }

const ROLES = [
  {
    id: 'superadmin',
    label: 'Super Admin',
    email: 'albarracin.andres@gmail.com',
    desc: 'Panel de plataforma. Ve todas las agencias, planes y configuración global.',
    href: '/api/dev/access?as=superadmin',
    direct: '/superadmin',
    color: '#1A1A1A',
  },
  {
    id: 'owner',
    label: 'Owner — López & Asociados',
    email: 'owner@lopezasociados.com',
    desc: 'Panel de agencia completo. Propiedades, leads, configuración y facturación.',
    href: '/api/dev/access?as=owner',
    direct: '/lopez-asociados/admin',
    color: '#FF6B6B',
  },
  {
    id: 'agent',
    label: 'Agente — López & Asociados',
    email: 'agente@lopezasociados.com',
    desc: 'Vista de agente. Propiedades y leads sin acceso a config o billing.',
    href: '/api/dev/access?as=agent',
    direct: '/lopez-asociados/admin',
    color: '#4ECDC4',
  },
]

export default function DevPage() {
  if (process.env.NODE_ENV === 'production') {
    return <p style={{ padding: 40 }}>Not available in production.</p>
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0F0F0F', color: 'white', padding: '60px 40px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>

        <div style={{ marginBottom: 48 }}>
          <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '.14em', color: '#666', marginBottom: 8 }}>// DEV ONLY — NO DISPONIBLE EN PRODUCCIÓN</div>
          <h1 style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.03em', margin: '0 0 12px' }}>Acceso rápido NIMO</h1>
          <p style={{ color: '#888', fontSize: 16, margin: 0 }}>
            Entrá como cualquier rol con un click. Requiere que el SQL de seed esté corrido en Supabase.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ROLES.map((role) => (
            <div key={role.id} style={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 16, padding: '24px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 9999, background: role.color }} />
                    <span style={{ fontWeight: 700, fontSize: 18 }}>{role.label}</span>
                  </div>
                  <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#666', marginBottom: 8 }}>{role.email}</div>
                  <p style={{ color: '#888', fontSize: 14, margin: 0 }}>{role.desc}</p>
                </div>
                <a
                  href={role.href}
                  style={{
                    background: role.color,
                    color: 'white',
                    padding: '12px 22px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 14,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    marginLeft: 24,
                    flexShrink: 0,
                  }}
                >
                  Entrar →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: '24px 28px', background: '#1A1A1A', borderRadius: 16, border: '1px solid #2A2A2A' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 14, fontFamily: 'monospace', letterSpacing: '.1em', color: '#666', textTransform: 'uppercase' }}>Acceso manual</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Login super admin</div>
              <code style={{ fontSize: 13, color: '#4ECDC4' }}>/superadmin/login</code>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Login agencia</div>
              <code style={{ fontSize: 13, color: '#4ECDC4' }}>/lopez-asociados/admin/login</code>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Dashboard super admin</div>
              <code style={{ fontSize: 13, color: '#FF6B6B' }}>/superadmin</code>
            </div>
            <div>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Dashboard agencia</div>
              <code style={{ fontSize: 13, color: '#FF6B6B' }}>/lopez-asociados/admin</code>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, padding: '20px 28px', background: '#0A0A0A', borderRadius: 12, border: '1px solid #1E1E1E' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.6 }}>
            Si el botón &quot;Entrar&quot; devuelve error 401:{' '}
            <strong style={{ color: '#888' }}>corrí los 3 SQL en Supabase SQL Editor</strong> (0001, 0002, 0003)
            y verificá que <code style={{ color: '#4ECDC4' }}>.env.local</code> tenga{' '}
            <code style={{ color: '#4ECDC4' }}>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          </p>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <a href="/" style={{ color: '#444', fontSize: 13, textDecoration: 'none' }}>← Volver al inicio</a>
        </div>

      </div>
    </main>
  )
}
