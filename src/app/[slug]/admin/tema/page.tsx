import { AGENCIES } from '@/lib/dummy'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#EDEBE6',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  coral: '#FF6B6B', coralLight: 'rgba(255,107,107,.08)',
}

// Mini browser mockup preview for each theme
function EditorialPreview() {
  return (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px 8px 0 0' }}>
      {/* Background */}
      <rect width="360" height="240" fill="#F7F3EE"/>
      {/* Nav */}
      <rect width="360" height="44" fill="#F7F3EE"/>
      <rect x="20" y="16" width="3" height="14" fill="#7B4F3C"/>
      <rect x="30" y="19" width="60" height="8" rx="2" fill="#1E1A16" opacity=".7"/>
      <rect x="260" y="18" width="40" height="8" rx="3" fill="#7B4F3C" opacity=".8"/>
      <rect x="310" y="18" width="30" height="8" rx="3" fill="#7B4F3C" opacity=".3"/>
      <rect width="360" height="1" y="44" fill="#DDD5C8"/>
      {/* Hero — 2 columns */}
      <rect x="0" y="44" width="200" height="110" fill="#F7F3EE"/>
      <rect x="20" y="62" width="14" height="2" fill="#7B4F3C"/>
      <rect x="20" y="72" width="140" height="14" rx="2" fill="#1E1A16"/>
      <rect x="20" y="90" width="120" height="14" rx="2" fill="#1E1A16"/>
      <rect x="20" y="108" width="90" height="14" rx="2" fill="#7B4F3C"/>
      <rect x="20" y="132" width="70" height="16" rx="3" fill="#7B4F3C"/>
      <rect x="96" y="132" width="60" height="16" rx="3" fill="none" stroke="#DDD5C8" strokeWidth="1"/>
      <image href="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400" x="200" y="44" width="160" height="110" preserveAspectRatio="xMidYMid slice"/>
      {/* Cards */}
      <rect x="0" y="154" width="360" height="1" fill="#DDD5C8"/>
      <rect x="10" y="162" width="105" height="68" rx="3" fill="#FFFFFF" stroke="#DDD5C8" strokeWidth="1"/>
      <rect x="10" y="162" width="105" height="32" fill="#E5DFDA"/>
      <rect x="15" y="200" width="60" height="7" rx="2" fill="#1E1A16" opacity=".6"/>
      <rect x="15" y="212" width="45" height="10" rx="2" fill="#7B4F3C"/>
      <rect x="125" y="162" width="105" height="68" rx="3" fill="#FFFFFF" stroke="#DDD5C8" strokeWidth="1"/>
      <rect x="125" y="162" width="105" height="32" fill="#D8D2CC"/>
      <rect x="130" y="200" width="60" height="7" rx="2" fill="#1E1A16" opacity=".6"/>
      <rect x="130" y="212" width="45" height="10" rx="2" fill="#7B4F3C"/>
      <rect x="240" y="162" width="110" height="68" rx="3" fill="#FFFFFF" stroke="#DDD5C8" strokeWidth="1"/>
      <rect x="240" y="162" width="110" height="32" fill="#E8E3DE"/>
      <rect x="245" y="200" width="60" height="7" rx="2" fill="#1E1A16" opacity=".6"/>
      <rect x="245" y="212" width="45" height="10" rx="2" fill="#7B4F3C"/>
    </svg>
  )
}

function SpatialPreview() {
  return (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px 8px 0 0' }}>
      <rect width="360" height="240" fill="#FFFFFF"/>
      {/* Nav */}
      <rect width="360" height="44" fill="#FFFFFF"/>
      <rect x="20" y="14" width="26" height="16" rx="6" fill="#2B5FE8"/>
      <rect x="52" y="19" width="70" height="7" rx="2" fill="#0B1426" opacity=".7"/>
      <rect x="270" y="17" width="70" height="11" rx="5" fill="#2B5FE8"/>
      <rect width="360" height="1" y="44" fill="#E0E5EF"/>
      {/* Hero — search centered */}
      <rect x="0" y="44" width="360" height="90" fill="#F4F6FA"/>
      <rect x="80" y="60" width="200" height="14" rx="3" fill="#0B1426" opacity=".12"/>
      <rect x="100" y="78" width="160" height="14" rx="3" fill="#0B1426" opacity=".08"/>
      {/* Search bar */}
      <rect x="40" y="100" width="280" height="28" rx="7" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="280" y="104" width="36" height="20" rx="5" fill="#2B5FE8"/>
      {/* Filter pills */}
      <rect x="50" y="136" width="40" height="12" rx="999" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="96" y="136" width="44" height="12" rx="999" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="146" y="136" width="36" height="12" rx="999" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      {/* Cards */}
      <rect x="10" y="158" width="105" height="72" rx="10" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="10" y="158" width="105" height="36" rx="10" fill="#DDEAFF"/>
      <rect x="15" y="200" width="50" height="7" rx="2" fill="#0B1426" opacity=".5"/>
      <rect x="15" y="212" width="38" height="9" rx="2" fill="#0B1426" opacity=".8"/>
      <rect x="125" y="158" width="105" height="72" rx="10" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="125" y="158" width="105" height="36" rx="10" fill="#C8DAFF"/>
      <rect x="130" y="200" width="50" height="7" rx="2" fill="#0B1426" opacity=".5"/>
      <rect x="130" y="212" width="38" height="9" rx="2" fill="#2B5FE8"/>
      <rect x="240" y="158" width="110" height="72" rx="10" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="240" y="158" width="110" height="36" rx="10" fill="#E8EEFF"/>
      <rect x="245" y="200" width="50" height="7" rx="2" fill="#0B1426" opacity=".5"/>
      <rect x="245" y="212" width="38" height="9" rx="2" fill="#0B1426" opacity=".8"/>
    </svg>
  )
}

function LoftPreview() {
  return (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px 8px 0 0' }}>
      <rect width="360" height="240" fill="#141412"/>
      {/* Hero full bleed image overlay */}
      <rect x="0" y="0" width="360" height="160" fill="#1C1C1A"/>
      <rect x="0" y="0" width="360" height="160" fill="url(#grad)" opacity=".7"/>
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141412"/>
          <stop offset="100%" stopColor="#141412" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {/* Nav */}
      <rect x="20" y="16" width="5" height="5" rx="999" fill="#C8A05E"/>
      <rect x="32" y="18" width="70" height="6" rx="2" fill="#EDE9E0" opacity=".6"/>
      <rect x="290" y="15" width="50" height="12" rx="2" fill="#C8A05E"/>
      {/* Hero text */}
      <rect x="20" y="50" width="8" height="1" fill="#C8A05E" opacity=".7"/>
      <rect x="20" y="60" width="160" height="16" rx="3" fill="#EDE9E0" opacity=".8"/>
      <rect x="20" y="80" width="140" height="16" rx="3" fill="#EDE9E0" opacity=".8"/>
      <rect x="20" y="100" width="100" height="16" rx="3" fill="#C8A05E" opacity=".9"/>
      <rect x="20" y="128" width="70" height="14" rx="2" fill="#C8A05E"/>
      <rect x="96" y="128" width="60" height="14" rx="2" fill="none" stroke="#363633" strokeWidth="1"/>
      {/* Cards dark */}
      <rect x="0" y="162" width="360" height="78" fill="#141412"/>
      <rect x="10" y="168" width="105" height="64" rx="2" fill="#222220" stroke="#363633" strokeWidth="1"/>
      <rect x="10" y="168" width="105" height="32" fill="#2A2A28"/>
      <rect x="15" y="206" width="50" height="6" rx="1" fill="#EDE9E0" opacity=".4"/>
      <rect x="15" y="218" width="38" height="8" rx="1" fill="#C8A05E"/>
      <rect x="125" y="168" width="105" height="64" rx="2" fill="#222220" stroke="#363633" strokeWidth="1"/>
      <rect x="125" y="168" width="105" height="32" fill="#1C1C1A"/>
      <rect x="130" y="206" width="50" height="6" rx="1" fill="#EDE9E0" opacity=".4"/>
      <rect x="130" y="218" width="38" height="8" rx="1" fill="#C8A05E"/>
      <rect x="240" y="168" width="110" height="64" rx="2" fill="#222220" stroke="#363633" strokeWidth="1"/>
      <rect x="240" y="168" width="110" height="32" fill="#222220"/>
      <rect x="245" y="206" width="50" height="6" rx="1" fill="#EDE9E0" opacity=".4"/>
      <rect x="245" y="218" width="38" height="8" rx="1" fill="#C8A05E"/>
    </svg>
  )
}

const THEMES = [
  {
    id: 'editorial' as const,
    name: 'Editorial',
    tagline: 'Tipografía serif, papel cálido, acento terracota',
    palette: ['#F7F3EE', '#7B4F3C', '#1E1A16', '#DDD5C8'],
    paletteLabels: ['Fondo', 'Acento', 'Texto', 'Borde'],
    preview: <EditorialPreview />,
    tags: ['Playfair Display', 'Serif', 'Warm'],
  },
  {
    id: 'spatial' as const,
    name: 'Spatial',
    tagline: 'Blanco limpio, azul eléctrico, enfoque en búsqueda',
    palette: ['#FFFFFF', '#2B5FE8', '#0B1426', '#E0E5EF'],
    paletteLabels: ['Fondo', 'Acento', 'Texto', 'Borde'],
    preview: <SpatialPreview />,
    tags: ['Inter', 'Sans-Serif', 'Tech'],
  },
  {
    id: 'loft' as const,
    name: 'Loft',
    tagline: 'Negro profundo, oro cálido, tipografía serif elegante',
    palette: ['#141412', '#C8A05E', '#EDE9E0', '#363633'],
    paletteLabels: ['Fondo', 'Oro', 'Texto', 'Borde'],
    preview: <LoftPreview />,
    tags: ['Playfair Display', 'Dark', 'Luxury'],
  },
]

export default async function TemaAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  const currentTheme = agency?.theme ?? 'editorial'

  return (
    <div style={{ padding: '36px 44px', minHeight: '100vh', background: LA.bg, color: LA.ink, fontFamily: 'var(--font-sans)' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: LA.ink3, marginBottom: 6, fontWeight: 500 }}>Panel de Control</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: LA.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Tema del sitio</h1>
        <p style={{ fontSize: 13, color: LA.ink2, margin: 0 }}>El tema activo es <strong>{currentTheme}</strong>. Para cambiarlo, contactá al equipo NIMO o pedile a tu superadmin.</p>
      </div>

      {/* Info notice */}
      <div style={{ background: LA.coralLight, border: `1px solid rgba(255,107,107,.25)`, borderRadius: 10, padding: '12px 18px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={LA.coral} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style={{ fontSize: 13, color: LA.ink2 }}>
          Tema actual: <strong style={{ color: LA.coral }}>{currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</strong>. Los cambios de tema son aplicados por el superadministrador de la plataforma.
        </div>
      </div>

      {/* Theme cards with visual previews */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {THEMES.map((theme) => {
          const isActive = theme.id === currentTheme
          return (
            <div key={theme.id} style={{ background: LA.white, border: `2px solid ${isActive ? LA.coral : LA.border}`, borderRadius: 12, overflow: 'hidden', opacity: 1, boxShadow: isActive ? '0 4px 20px rgba(255,107,107,.15)' : '0 2px 8px rgba(0,0,0,.04)' }}>
              {/* Browser chrome */}
              <div style={{ background: '#F0EEE9', padding: '8px 12px', display: 'flex', gap: 5, alignItems: 'center', borderBottom: '1px solid #E0DDD8' }}>
                <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#E74C3C', opacity: .7 }}/>
                <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#F39C12', opacity: .7 }}/>
                <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#27AE60', opacity: .7 }}/>
                <div style={{ flex: 1, background: '#E8E5E0', borderRadius: 3, padding: '2px 8px', marginLeft: 8, fontSize: 8, color: '#9A9590' }}>
                  {slug}.nimo.app
                </div>
              </div>
              {/* Preview */}
              <div style={{ overflow: 'hidden' }}>
                {theme.preview}
              </div>
              {/* Info */}
              <div style={{ padding: '16px 18px 18px', borderTop: '1px solid #F0EEE9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: LA.ink }}>{theme.name}</div>
                  {isActive && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: LA.coralLight, color: LA.coral, padding: '3px 8px', borderRadius: 999 }}>Activo</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: LA.ink3, lineHeight: 1.5, marginBottom: 12 }}>{theme.tagline}</div>
                {/* Palette dots */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                  {theme.palette.map((c, i) => (
                    <div key={i} title={theme.paletteLabels[i]} style={{ width: 18, height: 18, borderRadius: 4, background: c, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                  ))}
                  <span style={{ fontSize: 10, color: LA.ink3, marginLeft: 4 }}>{theme.palette[0]}</span>
                </div>
                {/* Tags */}
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {theme.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 600, background: '#F0EEE9', color: LA.ink3, padding: '2px 8px', borderRadius: 999 }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Request change CTA */}
      <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: LA.ink, marginBottom: 4 }}>¿Querés cambiar de tema?</div>
          <p style={{ fontSize: 13, color: LA.ink2, margin: 0, maxWidth: 480 }}>
            Cada tema tiene una estética radicalmente diferente. Nuestro equipo puede aplicar el cambio en 24 horas.
          </p>
        </div>
        <a href="mailto:soporte@nimo.app?subject=Cambio de tema — ${slug}" style={{ fontSize: 13, color: LA.white, background: LA.coral, padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 24 }}>
          Solicitar cambio →
        </a>
      </div>
    </div>
  )
}
