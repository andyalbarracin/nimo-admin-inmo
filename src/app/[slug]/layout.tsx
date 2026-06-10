import { AGENCIES } from '@/lib/dummy'
import { THEMES } from '@/lib/themes'

export default async function AgencyPublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
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
