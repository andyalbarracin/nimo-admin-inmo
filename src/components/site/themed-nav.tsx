import Link from 'next/link'
import type { SiteTheme, ThemeId } from '@/lib/themes'

/* Nav público themed reutilizable (contacto / nosotros / tasación). */

type ActiveKey = 'propiedades' | 'nosotros' | 'tasacion' | 'contacto' | null

const LINKS: { key: Exclude<ActiveKey, null>; label: string; href: (s: string) => string }[] = [
  { key: 'propiedades', label: 'Propiedades', href: s => `/${s}/propiedades` },
  { key: 'nosotros', label: 'Nosotros', href: s => `/${s}/nosotros` },
  { key: 'tasacion', label: 'Tasación', href: s => `/${s}/tasacion` },
  { key: 'contacto', label: 'Contacto', href: s => `/${s}/contacto` },
]

export default function ThemedNav({
  slug, agencyName, themeId, T, active,
}: { slug: string; agencyName: string; themeId: ThemeId; T: SiteTheme; active: ActiveKey }) {
  const parts = agencyName.split(' ')

  if (themeId === 'spatial') {
    return (
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,.94)', backdropFilter: 'blur(10px)', borderBottom: `1.5px solid ${T.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64, padding: '0 40px' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: T.fontDisplay, fontWeight: 800, fontSize: 19, letterSpacing: '-.03em', textTransform: 'uppercase', color: T.ink }}>{parts[0]}</span>
          <span style={{ fontFamily: T.fontMono, fontSize: 11, color: T.accent }}>/ {parts.slice(1).join(' ') || 'PROPIEDADES'}</span>
        </Link>
        <nav style={{ display: 'flex', gap: 2 }}>
          {LINKS.map(l => (
            <Link key={l.key} href={l.href(slug)} style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: '.1em', fontWeight: 600, color: active === l.key ? T.accentContrast : T.ink, background: active === l.key ? T.ink : 'transparent', textDecoration: 'none', padding: '8px 12px' }}>[ {l.label.toUpperCase()} ]</Link>
          ))}
        </nav>
      </header>
    )
  }

  if (themeId === 'atelier') {
    return (
      <nav style={{ padding: '36px 0 28px', textAlign: 'center', borderBottom: `1px solid ${T.rule}` }}>
        <Link href={`/${slug}`} style={{ fontFamily: T.fontBody, fontSize: 14, fontWeight: 600, letterSpacing: '.26em', textTransform: 'uppercase', color: T.ink, textDecoration: 'none' }}>
          {parts[0]} <span style={{ color: T.accentDark }}>{parts.slice(1).join(' ')}</span>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 20 }}>
          {LINKS.map(l => (
            <Link key={l.key} href={l.href(slug)} style={{ fontFamily: T.fontBody, fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: active === l.key ? T.accentDark : T.ink2, textDecoration: 'none' }}>{l.label}</Link>
          ))}
        </div>
      </nav>
    )
  }

  // editorial
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: T.bg + 'F2', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${T.ink}`, padding: '0 48px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Link href={`/${slug}`} style={{ fontFamily: T.fontDisplay, fontWeight: 600, fontSize: 22, color: T.ink, textDecoration: 'none' }}>
        {parts[0]} <em style={{ fontStyle: 'italic', color: T.accent }}>{parts.slice(1).join(' ') || 'Propiedades'}</em>
      </Link>
      <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {LINKS.map(l => (
          <Link key={l.key} href={l.href(slug)} style={{ fontFamily: T.fontMono, fontSize: 11, letterSpacing: '.06em', textTransform: 'uppercase', color: active === l.key ? T.accent : T.ink2, textDecoration: 'none', ...(l.key === 'contacto' && active !== 'contacto' ? { color: T.bg, background: T.accent, padding: '9px 18px', borderRadius: 99 } : {}) }}>{l.label}</Link>
        ))}
      </nav>
    </header>
  )
}
