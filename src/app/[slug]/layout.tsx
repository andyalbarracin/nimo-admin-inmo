import { AGENCIES } from '@/lib/dummy'
import { THEMES } from '@/lib/themes'
import { getAgencyAccess } from '@/lib/agencies/status'

export const dynamic = 'force-dynamic'

function SuspendedNotice() {
  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#0F0F0F', color: '#fff', fontFamily: 'system-ui, sans-serif', padding: 24, textAlign: 'center' }}>
      <div style={{ maxWidth: 460 }}>
        <div style={{ fontFamily: 'monospace', fontSize: 11, letterSpacing: '.16em', color: '#FF6A00', textTransform: 'uppercase', marginBottom: 12 }}>// SITIO NO DISPONIBLE</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px' }}>Este sitio está temporalmente suspendido</h1>
        <p style={{ color: '#9A9590', fontSize: 15, lineHeight: 1.6, margin: 0 }}>
          Si sos el responsable de esta inmobiliaria, contactá a NIMO para reactivar tu cuenta.
        </p>
      </div>
    </div>
  )
}

export default async function AgencyPublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // Ciclo de vida (Subsistema C): si la agencia real está suspendida/dada de baja,
  // se apaga el sitio y el panel. Las agencias demo (sin fila en DB) no se afectan.
  const access = await getAgencyAccess(slug)
  if (access?.blocked) return <SuspendedNotice />

  const agency = AGENCIES.find(a => a.slug === slug)
  const theme = THEMES[agency?.theme ?? 'editorial']

  return (
    <div
      style={{
        '--site-bg': theme.bg,
        '--site-bg2': theme.bg2,
        '--site-surface': theme.surface,
        '--site-rule': theme.rule,
        '--site-ink': theme.ink,
        '--site-ink2': theme.ink2,
        '--site-ink3': theme.ink3,
        '--site-accent': theme.accent,
        '--site-accent-dark': theme.accentDark,
        '--site-accent-soft': theme.accentSoft,
        '--site-accent-contrast': theme.accentContrast,
        '--site-radius': theme.radius,
        '--site-font-display': theme.fontDisplay,
        '--site-font-body': theme.fontBody,
        '--site-font-mono': theme.fontMono,
        minHeight: '100vh',
        background: theme.bg,
        color: theme.ink,
        fontFamily: theme.fontBody,
      } as React.CSSProperties}
    >
      {children}
    </div>
  )
}
