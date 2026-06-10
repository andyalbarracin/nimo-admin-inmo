interface AgentCardProps {
  name: string
  role: string
  email: string
  phone?: string
  avatar: string
  accent: string
  accentContrast: string
  surface: string
  border: string
  ink: string
  ink2: string
  ink3: string
}

export default function AgentCard({ name, role, email, phone, avatar, accent, accentContrast, surface, border, ink, ink2, ink3 }: AgentCardProps) {
  const roleLabel = role === 'owner' ? 'Director' : role === 'admin' ? 'Coordinadora' : 'Asesor'
  return (
    <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 12, padding: 20, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
      <div style={{ width: 48, height: 48, borderRadius: 9999, background: accent + '20', border: `2px solid ${accent}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: accent, fontSize: 16, flexShrink: 0 }}>
        {avatar}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: ink, marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 6 }}>{roleLabel}</div>
        <div style={{ fontSize: 12, color: ink3 }}>{email}</div>
        {phone && (
          <a href={`https://wa.me/${phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 10, background: '#25D366', color: 'white', padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
            💬 WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}
