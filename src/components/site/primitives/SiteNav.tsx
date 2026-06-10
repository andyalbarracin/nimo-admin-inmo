'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Drawer } from 'vaul'

interface NavLink {
  label: string
  href: string
}

interface SiteNavProps {
  slug: string
  agencyName: string
  links: NavLink[]
  ctaLabel?: string
  ctaHref?: string
  accent: string
  accentContrast: string
  bg: string
  ink: string
  ink2: string
  rule: string
  fontDisplay?: string
  sticky?: boolean
}

export default function SiteNav({
  slug,
  agencyName,
  links,
  ctaLabel = 'Consultar',
  ctaHref,
  accent,
  accentContrast,
  bg,
  ink,
  ink2,
  rule,
  fontDisplay,
  sticky = true,
}: SiteNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!sticky) return
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [sticky])

  const navBg = scrolled ? bg + 'F5' : bg
  const cta = ctaHref ?? `/${slug}/contacto`

  return (
    <header
      style={{
        position: sticky ? 'sticky' : 'relative',
        top: 0,
        zIndex: 50,
        background: navBg,
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: `1px solid ${scrolled ? rule : 'transparent'}`,
        transition: 'background .25s, border-color .25s, backdrop-filter .25s',
        padding: '0 48px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Logo */}
      <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: accentContrast, fontSize: 15 }}>
          {agencyName.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontFamily: fontDisplay, fontWeight: 700, fontSize: 16, color: ink, fontStyle: fontDisplay?.includes('Serif') || fontDisplay?.includes('serif') ? 'italic' : 'normal' }}>
          {agencyName}
        </span>
      </Link>

      {/* Desktop nav */}
      <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
        {links.map(({ label, href }) => (
          <Link key={label} href={href} style={{ color: ink2, fontSize: 14, textDecoration: 'none', fontWeight: 500 }}>{label}</Link>
        ))}
        <Link href={cta} style={{ background: accent, color: accentContrast, padding: '9px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          {ctaLabel}
        </Link>
      </nav>

      {/* Mobile hamburger */}
      <Drawer.Root open={open} onOpenChange={setOpen}>
        <Drawer.Trigger asChild>
          <button
            aria-label="Menú"
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: ink }}
            className="site-nav-hamburger"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        </Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', zIndex: 100 }} />
          <Drawer.Content style={{ background: bg, borderRadius: '16px 16px 0 0', position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 101, padding: '24px 24px 40px' }}>
            <div style={{ width: 40, height: 4, background: rule, borderRadius: 999, margin: '0 auto 24px' }} />
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {links.map(({ label, href }) => (
                <Link key={label} href={href} onClick={() => setOpen(false)} style={{ display: 'block', padding: '14px 16px', color: ink, fontSize: 18, fontWeight: 600, textDecoration: 'none', borderBottom: `1px solid ${rule}` }}>
                  {label}
                </Link>
              ))}
              <Link href={cta} onClick={() => setOpen(false)} style={{ display: 'block', textAlign: 'center', background: accent, color: accentContrast, padding: '14px', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none', marginTop: 16 }}>
                {ctaLabel}
              </Link>
            </nav>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </header>
  )
}
