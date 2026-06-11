import { AGENCIES } from '@/lib/dummy'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#EDEBE6',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  coral: '#FF6B6B', coralLight: 'rgba(255,107,107,.08)',
}

function EditorialPreview() {
  return (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px 8px 0 0' }}>
      <rect width="360" height="240" fill="#FAF7F0"/>
      <rect width="360" height="44" fill="#FAF7F0"/>
      <rect x="20" y="16" width="3" height="14" fill="#B25431"/>
      <rect x="30" y="19" width="60" height="8" rx="2" fill="#1A1614" opacity=".7"/>
      <rect x="260" y="18" width="40" height="8" rx="3" fill="#B25431" opacity=".8"/>
      <rect x="310" y="18" width="30" height="8" rx="3" fill="#B25431" opacity=".3"/>
      <rect width="360" height="1" y="44" fill="#DBD2C2"/>
      <rect x="0" y="44" width="200" height="110" fill="#FAF7F0"/>
      <rect x="20" y="62" width="14" height="2" fill="#B25431"/>
      <rect x="20" y="72" width="140" height="14" rx="2" fill="#1A1614"/>
      <rect x="20" y="90" width="120" height="14" rx="2" fill="#1A1614"/>
      <rect x="20" y="108" width="90" height="14" rx="2" fill="#B25431"/>
      <rect x="20" y="132" width="70" height="16" rx="3" fill="#B25431"/>
      <rect x="96" y="132" width="60" height="16" rx="3" fill="none" stroke="#DBD2C2" strokeWidth="1"/>
      <rect x="200" y="44" width="160" height="110" fill="#E8E2DA"/>
      <rect x="10" y="162" width="105" height="68" rx="3" fill="#FFFFFF" stroke="#DBD2C2" strokeWidth="1"/>
      <rect x="10" y="162" width="105" height="32" fill="#E5DFDA"/>
      <rect x="15" y="200" width="60" height="7" rx="2" fill="#1A1614" opacity=".6"/>
      <rect x="15" y="212" width="45" height="10" rx="2" fill="#B25431"/>
      <rect x="125" y="162" width="105" height="68" rx="3" fill="#FFFFFF" stroke="#DBD2C2" strokeWidth="1"/>
      <rect x="125" y="162" width="105" height="32" fill="#D8D2CC"/>
      <rect x="130" y="200" width="60" height="7" rx="2" fill="#1A1614" opacity=".6"/>
      <rect x="130" y="212" width="45" height="10" rx="2" fill="#B25431"/>
      <rect x="240" y="162" width="110" height="68" rx="3" fill="#FFFFFF" stroke="#DBD2C2" strokeWidth="1"/>
      <rect x="240" y="162" width="110" height="32" fill="#E8E3DE"/>
      <rect x="245" y="200" width="60" height="7" rx="2" fill="#1A1614" opacity=".6"/>
      <rect x="245" y="212" width="45" height="10" rx="2" fill="#B25431"/>
    </svg>
  )
}

function SpatialPreview() {
  return (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px 8px 0 0' }}>
      <rect width="360" height="240" fill="#FFFFFF"/>
      <rect width="360" height="44" fill="#FFFFFF"/>
      <rect x="20" y="14" width="26" height="16" rx="6" fill="#1F4DD6"/>
      <rect x="52" y="19" width="70" height="7" rx="2" fill="#0A0A0A" opacity=".7"/>
      <rect x="270" y="17" width="70" height="11" rx="5" fill="#1F4DD6"/>
      <rect width="360" height="1" y="44" fill="#E0E5EF"/>
      <rect x="0" y="44" width="360" height="90" fill="#F2F4F8"/>
      <rect x="80" y="60" width="200" height="14" rx="3" fill="#0A0A0A" opacity=".12"/>
      <rect x="100" y="78" width="160" height="14" rx="3" fill="#0A0A0A" opacity=".08"/>
      <rect x="40" y="100" width="280" height="28" rx="12" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="280" y="104" width="36" height="20" rx="6" fill="#1F4DD6"/>
      <rect x="50" y="136" width="40" height="12" rx="999" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="96" y="136" width="44" height="12" rx="999" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="146" y="136" width="36" height="12" rx="999" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="10" y="158" width="105" height="72" rx="12" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="10" y="158" width="105" height="36" rx="12" fill="#DDEAFF"/>
      <rect x="15" y="200" width="50" height="7" rx="2" fill="#0A0A0A" opacity=".5"/>
      <rect x="15" y="212" width="38" height="9" rx="2" fill="#0A0A0A" opacity=".8"/>
      <rect x="125" y="158" width="105" height="72" rx="12" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="125" y="158" width="105" height="36" rx="12" fill="#C8DAFF"/>
      <rect x="130" y="200" width="50" height="7" rx="2" fill="#0A0A0A" opacity=".5"/>
      <rect x="130" y="212" width="38" height="9" rx="2" fill="#1F4DD6"/>
      <rect x="240" y="158" width="110" height="72" rx="12" fill="#FFFFFF" stroke="#E0E5EF" strokeWidth="1"/>
      <rect x="240" y="158" width="110" height="36" rx="12" fill="#E8EEFF"/>
      <rect x="245" y="200" width="50" height="7" rx="2" fill="#0A0A0A" opacity=".5"/>
      <rect x="245" y="212" width="38" height="9" rx="2" fill="#0A0A0A" opacity=".8"/>
    </svg>
  )
}

function AtelierPreview() {
  return (
    <svg viewBox="0 0 360 240" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px 8px 0 0' }}>
      <rect width="360" height="240" fill="#F5F1EC"/>
      {/* Hero full bleed */}
      <rect x="0" y="0" width="360" height="160" fill="#EDE7DE"/>
      {/* Nav minimal */}
      <rect x="30" y="19" width="70" height="7" rx="2" fill="#2E2620" opacity=".5"/>
      <rect x="290" y="16" width="50" height="12" rx="2" fill="#7A8264"/>
      {/* Hero overlay text bottom-left */}
      <rect x="0" y="100" width="360" height="60" fill="url(#atelierGrad)"/>
      <defs>
        <linearGradient id="atelierGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F1EC" stopOpacity="0"/>
          <stop offset="100%" stopColor="#F5F1EC" stopOpacity="0.6"/>
        </linearGradient>
      </defs>
      <rect x="20" y="108" width="8" height="1" fill="#7A8264" opacity=".6"/>
      <rect x="20" y="116" width="160" height="12" rx="2" fill="#2E2620" opacity=".7"/>
      <rect x="20" y="132" width="120" height="12" rx="2" fill="#2E2620" opacity=".5"/>
      {/* Bottom grid — light cards */}
      <rect x="0" y="162" width="360" height="78" fill="#F5F1EC"/>
      <rect x="10" y="168" width="105" height="64" rx="2" fill="#FFFFFF" stroke="#DDD5CA" strokeWidth="1"/>
      <rect x="10" y="168" width="105" height="36" fill="#EDE7DE"/>
      <rect x="15" y="210" width="50" height="6" rx="1" fill="#2E2620" opacity=".5"/>
      <rect x="15" y="220" width="38" height="8" rx="1" fill="#7A8264"/>
      <rect x="125" y="168" width="105" height="64" rx="2" fill="#FFFFFF" stroke="#DDD5CA" strokeWidth="1"/>
      <rect x="125" y="168" width="105" height="36" fill="#E8E2D8"/>
      <rect x="130" y="210" width="50" height="6" rx="1" fill="#2E2620" opacity=".5"/>
      <rect x="130" y="220" width="38" height="8" rx="1" fill="#7A8264"/>
      <rect x="240" y="168" width="110" height="64" rx="2" fill="#FFFFFF" stroke="#DDD5CA" strokeWidth="1"/>
      <rect x="240" y="168" width="110" height="36" fill="#F0EBE4"/>
      <rect x="245" y="210" width="50" height="6" rx="1" fill="#2E2620" opacity=".5"/>
      <rect x="245" y="220" width="38" height="8" rx="1" fill="#7A8264"/>
    </svg>
  )
}

const THEMES = [
  {
    id: 'editorial' as const,
    name: 'Editorial',
    tagline: 'Tipografía serif, papel cálido, acento terracota',
    palette: ['#FAF7F0', '#B25431', '#1A1614', '#DBD2C2'],
    paletteLabels: ['Fondo', 'Acento', 'Texto', 'Borde'],
    preview: <EditorialPreview />,
    tags: ['Playfair Display', 'Serif', 'Warm'],
  },
  {
    id: 'spatial' as const,
    name: 'Spatial',
    tagline: 'Blanco limpio, azul eléctrico, enfoque en búsqueda',
    palette: ['#FFFFFF', '#1F4DD6', '#0A0A0A', '#E0E5EF'],
    paletteLabels: ['Fondo', 'Acento', 'Texto', 'Borde'],
    preview: <SpatialPreview />,
    tags: ['Syne', 'Sans-Serif', 'PropTech'],
  },
  {
    id: 'atelier' as const,
    name: 'Atelier',
    tagline: 'Papel bone, verde salvia, estética boutique de galería',
    palette: ['#F5F1EC', '#7A8264', '#2E2620', '#DDD5CA'],
    paletteLabels: ['Fondo', 'Acento', 'Texto', 'Borde'],
    preview: <AtelierPreview />,
    tags: ['DM Serif Display', 'Light', 'Boutique'],
  },
]

export default async function TemaAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  const currentTheme = agency?.theme ?? 'editorial'

  return (
    <div style={{ padding: '36px 44px', minHeight: '100vh', background: LA.bg, color: LA.ink, fontFamily: 'var(--font-sans)' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: LA.ink3, marginBottom: 6, fontWeight: 500 }}>Panel de Control</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: LA.ink, margin: '0 0 4px', letterSpacing: '-.02em' }}>Tema del sitio</h1>
        <p style={{ fontSize: 13, color: LA.ink2, margin: 0 }}>El tema activo es <strong>{currentTheme}</strong>. Para cambiarlo, contactá al equipo NIMO.</p>
      </div>

      <div style={{ background: 'color-mix(in srgb, var(--admin-accent, #FF6B6B) 9%, transparent)', border: `1px solid rgba(255,107,107,.25)`, borderRadius: 10, padding: '12px 18px', marginBottom: 28, display: 'flex', gap: 12, alignItems: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={'var(--admin-accent, #FF6B6B)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <div style={{ fontSize: 13, color: LA.ink2 }}>
          Tema actual: <strong style={{ color: 'var(--admin-accent, #FF6B6B)' }}>{currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1)}</strong>. Los cambios son aplicados por el superadministrador.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        {THEMES.map((theme) => {
          const isActive = theme.id === currentTheme
          return (
            <div key={theme.id} style={{ background: LA.white, border: `2px solid ${isActive ? 'var(--admin-accent, #FF6B6B)' : LA.border}`, borderRadius: 12, overflow: 'hidden', boxShadow: isActive ? '0 4px 20px rgba(255,107,107,.15)' : '0 2px 8px rgba(0,0,0,.04)' }}>
              <div style={{ background: '#F0EEE9', padding: '8px 12px', display: 'flex', gap: 5, alignItems: 'center', borderBottom: '1px solid #E0DDD8' }}>
                <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#E74C3C', opacity: .7 }}/>
                <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#F39C12', opacity: .7 }}/>
                <div style={{ width: 8, height: 8, borderRadius: 9999, background: '#27AE60', opacity: .7 }}/>
                <div style={{ flex: 1, background: '#E8E5E0', borderRadius: 3, padding: '2px 8px', marginLeft: 8, fontSize: 8, color: '#9A9590' }}>
                  {slug}.nimo.app
                </div>
              </div>
              <div style={{ overflow: 'hidden' }}>{theme.preview}</div>
              <div style={{ padding: '16px 18px 18px', borderTop: '1px solid #F0EEE9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: LA.ink }}>{theme.name}</div>
                  {isActive && (
                    <span style={{ fontSize: 10, fontWeight: 700, background: 'color-mix(in srgb, var(--admin-accent, #FF6B6B) 9%, transparent)', color: 'var(--admin-accent, #FF6B6B)', padding: '3px 8px', borderRadius: 999 }}>Activo</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: LA.ink3, lineHeight: 1.5, marginBottom: 12 }}>{theme.tagline}</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 10 }}>
                  {theme.palette.map((c, i) => (
                    <div key={i} title={theme.paletteLabels[i]} style={{ width: 18, height: 18, borderRadius: 4, background: c, border: '1px solid rgba(0,0,0,.1)', flexShrink: 0 }} />
                  ))}
                  <span style={{ fontSize: 10, color: LA.ink3, marginLeft: 4 }}>{theme.palette[0]}</span>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 14 }}>
                  {theme.tags.map(t => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 600, background: '#F0EEE9', color: LA.ink3, padding: '2px 8px', borderRadius: 999 }}>{t}</span>
                  ))}
                </div>
                <a
                  href={`/${slug}?preview=${theme.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, width: '100%', fontSize: 12.5, fontWeight: 700, color: isActive ? LA.white : 'var(--admin-accent, #FF6B6B)', background: isActive ? 'var(--admin-accent, #FF6B6B)' : 'color-mix(in srgb, var(--admin-accent, #FF6B6B) 9%, transparent)', border: `1px solid ${isActive ? 'var(--admin-accent, #FF6B6B)' : 'rgba(255,107,107,.3)'}`, padding: '10px', borderRadius: 8, textDecoration: 'none' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  Vista previa{isActive ? ' (tu tema)' : ''}
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, padding: '28px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: LA.ink, marginBottom: 4 }}>¿Querés cambiar de tema?</div>
          <p style={{ fontSize: 13, color: LA.ink2, margin: 0, maxWidth: 480 }}>
            Cada tema tiene una estética radicalmente diferente. Nuestro equipo puede aplicar el cambio en 24 horas.
          </p>
        </div>
        <a href={`mailto:soporte@nimo.app?subject=Cambio de tema — ${slug}`} style={{ fontSize: 13, color: LA.white, background: 'var(--admin-accent, #FF6B6B)', padding: '12px 24px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 24 }}>
          Solicitar cambio →
        </a>
      </div>
    </div>
  )
}
