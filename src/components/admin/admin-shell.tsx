'use client'

import { useState } from 'react'
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#EDEBE6',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  coral: '#FF6B6B',
}

type NavItem = { href: string; label: string; icon: string }
const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Operación',
    items: [
      { href: '',             label: 'Dashboard',     icon: 'grid' },
      { href: '/propiedades', label: 'Propiedades',   icon: 'home' },
      { href: '/leads',       label: 'CRM / Leads',   icon: 'users' },
      { href: '/equipo',      label: 'Equipo',        icon: 'user-plus' },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { href: '/configuracion', label: 'Configuración',  icon: 'settings' },
      { href: '/tema',          label: 'Tema del sitio', icon: 'palette' },
    ],
  },
]

// Tab bar inferior (mobile): las 5 secciones más usadas (Tema queda en escritorio).
const TABS: NavItem[] = [
  { href: '',               label: 'Inicio',  icon: 'grid' },
  { href: '/propiedades',   label: 'Props',   icon: 'home' },
  { href: '/leads',         label: 'Leads',   icon: 'users' },
  { href: '/equipo',        label: 'Equipo',  icon: 'user-plus' },
  { href: '/configuracion', label: 'Ajustes', icon: 'settings' },
]

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    'user-plus': <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    palette: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  }
  return <span style={{ display: 'flex', flexShrink: 0 }}>{icons[name]}</span>
}

export default function AdminShell({ children, agencyName, accent }: { children: React.ReactNode; agencyName: string; accent: string }) {
  const pathname = usePathname()
  const params = useParams()
  const slug = params?.slug as string ?? ''
  const [collapsed, setCollapsed] = useState(false)

  if (pathname.endsWith('/login')) return <>{children}</>

  // El nombre y el acento llegan resueltos desde el layout server (agencia real o demo).
  const accentSoft = accent + '14'
  const W = collapsed ? 68 : 224

  return (
    <div style={{ '--admin-accent': accent, display: 'flex', minHeight: '100vh', background: LA.bg, fontFamily: 'var(--font-sans)' } as React.CSSProperties}>
      {/* Sidebar (oculto en mobile → tab bar inferior) */}
      <aside className="admin-sidebar" style={{ width: W, minWidth: W, background: LA.white, borderRight: `1px solid ${LA.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', transition: 'width .2s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ height: 3, background: accent, flexShrink: 0 }} />

        {/* Logo */}
        <div style={{ padding: collapsed ? '16px 0' : '18px 18px 14px', borderBottom: `1px solid ${LA.border}`, display: 'flex', justifyContent: 'center' }}>
          <Link href={`/${slug}/admin`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: LA.white, flexShrink: 0 }}>
              {agencyName.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: LA.ink, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{agencyName}</div>
                <div style={{ fontSize: 10, color: LA.ink3, marginTop: 1 }}>Panel de Control</div>
              </div>
            )}
          </Link>
        </div>

        {/* Nav con secciones + divisores */}
        <nav style={{ flex: 1, padding: collapsed ? '10px 8px' : '10px 10px' }}>
          {SECTIONS.map((section, si) => (
            <div key={section.title} style={{ marginBottom: 6 }}>
              {collapsed
                ? si > 0 && <div style={{ height: 1, background: LA.border, margin: '8px 6px' }} />
                : <div style={{ fontSize: 9, fontWeight: 700, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', padding: '10px 10px 4px' }}>{section.title}</div>}
              {section.items.map(item => {
                const href = `/${slug}/admin${item.href}`
                const exact = item.href === ''
                const active = exact ? pathname === href : pathname.startsWith(href)
                return (
                  <Link
                    key={item.href}
                    href={href}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 11,
                      padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 8, marginBottom: 1,
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      textDecoration: 'none', fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: active ? accent : LA.ink2,
                      background: active ? accentSoft : 'transparent',
                    }}
                  >
                    <Icon name={item.icon} />
                    {!collapsed && item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: collapsed ? '12px 8px' : '14px 18px', borderTop: `1px solid ${LA.border}`, display: 'flex', flexDirection: 'column', gap: 10, alignItems: collapsed ? 'center' : 'stretch' }}>
          <Link href={`/${slug}`} target="_blank" title="Ver sitio web" style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 6, fontSize: 12, color: LA.ink3, textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {!collapsed && 'Ver sitio web'}
          </Link>
          <form action="/api/auth/signout" method="POST" style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <button type="submit" title="Cerrar sesión" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: LA.ink3, padding: 0, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {!collapsed && 'Cerrar sesión'}
            </button>
          </form>
          {/* Toggle colapsar */}
          <button
            onClick={() => setCollapsed(c => !c)}
            title={collapsed ? 'Expandir' : 'Colapsar'}
            style={{ background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 8, cursor: 'pointer', color: LA.ink2, padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', fontSize: 12, marginTop: 4 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }}><polyline points="15 18 9 12 15 6"/></svg>
            {!collapsed && 'Colapsar'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin-main" style={{ flex: 1, minWidth: 0, overflowY: 'auto', background: LA.bg }}>
        {children}
      </main>

      {/* Tab bar inferior — solo mobile (modo app) */}
      <nav className="admin-tabbar" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 200, height: 60, background: LA.white, borderTop: `1px solid ${LA.border}`, boxShadow: '0 -2px 16px rgba(0,0,0,.05)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(item => {
          const href = `/${slug}/admin${item.href}`
          const active = item.href === '' ? pathname === href : pathname.startsWith(href)
          return (
            <Link key={item.href} href={href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, textDecoration: 'none', color: active ? accent : LA.ink3, fontSize: 10, fontWeight: active ? 700 : 500 }}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
