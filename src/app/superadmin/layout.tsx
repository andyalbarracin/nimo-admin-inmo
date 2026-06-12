'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const MONO = "var(--font-mono), 'JetBrains Mono', monospace"
const DISPLAY = "var(--font-archivo-black), 'Archivo Black', sans-serif"
const BODY = "var(--font-archivo), 'Archivo', system-ui, sans-serif"

type NavItem = { href: string; label: string; icon: string; exact?: boolean }
const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: '// CORE',
    items: [
      { href: '/superadmin',          label: 'Dashboard', icon: 'grid', exact: true },
      { href: '/superadmin/agencias', label: 'Agencias',  icon: 'building' },
      { href: '/superadmin/crm',      label: 'CRM',       icon: 'crm' },
    ],
  },
  {
    title: '// PLATAFORMA',
    items: [
      { href: '/superadmin/planes',        label: 'Planes',        icon: 'layers' },
      { href: '/superadmin/configuracion', label: 'Configuración', icon: 'settings' },
    ],
  },
]

// Tab bar inferior (mobile)
const TABS: NavItem[] = [
  { href: '/superadmin',               label: 'Inicio',   icon: 'grid', exact: true },
  { href: '/superadmin/agencias',      label: 'Agencias', icon: 'building' },
  { href: '/superadmin/crm',           label: 'CRM',      icon: 'crm' },
  { href: '/superadmin/planes',        label: 'Planes',   icon: 'layers' },
  { href: '/superadmin/configuracion', label: 'Config',   icon: 'settings' },
]

function Icon({ name }: { name: string }) {
  const d: Record<string, React.ReactNode> = {
    grid: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    building: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
    layers: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    settings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    crm: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    external: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    logout: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    chevron: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  }
  return <span style={{ display: 'flex', color: 'currentColor', flexShrink: 0 }}>{d[name]}</span>
}

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  if (pathname === '/superadmin/login') return <>{children}</>

  const W = collapsed ? 68 : 240

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F0', fontFamily: BODY }}>
      <aside className="admin-sidebar" style={{ width: W, minWidth: W, background: '#111111', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', transition: 'width .2s cubic-bezier(.2,.7,.2,1)' }}>
        <div style={{ height: 4, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', flexShrink: 0 }} />

        {/* Wordmark */}
        <div style={{ padding: collapsed ? '20px 0' : '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,.07)', display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: '#FF6A00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: DISPLAY, fontSize: 18, color: '#111111', flexShrink: 0 }}>N</div>
            {!collapsed && (
              <div>
                <div style={{ fontFamily: DISPLAY, fontSize: 14, color: '#F5F5F0', textTransform: 'uppercase', letterSpacing: '.02em', lineHeight: 1 }}>NIMO</div>
                <div style={{ fontFamily: MONO, fontSize: 9, color: '#FF6A00', textTransform: 'uppercase', letterSpacing: '.16em', marginTop: 3 }}>// SUPERADMIN</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav con secciones + divisores */}
        <nav style={{ flex: 1, padding: collapsed ? '12px 8px' : '12px 12px' }}>
          {SECTIONS.map((section, si) => (
            <div key={section.title} style={{ marginBottom: 8 }}>
              {collapsed
                ? si > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,.09)', margin: '8px 6px' }} />
                : <div style={{ fontFamily: MONO, fontSize: 9, color: '#76766f', textTransform: 'uppercase', letterSpacing: '.14em', padding: '8px 10px 6px' }}>{section.title}</div>}
              {section.items.map(item => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
                return (
                  <Link key={item.href} href={item.href} title={collapsed ? item.label : undefined} style={{
                    display: 'flex', alignItems: 'center', gap: 11,
                    padding: collapsed ? '10px 0' : '9px 10px', borderRadius: 6, marginBottom: 1,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    textDecoration: 'none', fontSize: 13,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#FF6A00' : '#b6b6ad',
                    background: active ? 'rgba(255,106,0,.12)' : 'transparent',
                    transition: 'all .12s',
                  }}>
                    <Icon name={item.icon} />
                    {!collapsed && item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: collapsed ? '14px 8px' : '16px 24px', borderTop: '1px solid rgba(255,255,255,.07)', display: 'flex', flexDirection: 'column', gap: 10, alignItems: collapsed ? 'center' : 'stretch' }}>
          {!collapsed && (
            <div style={{ marginBottom: 4 }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: '#76766f', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// ZAIRE TECH</div>
              <div style={{ fontSize: 11, color: '#76766f', lineHeight: 1.4 }}>Sistemas para ventas, operación y crecimiento.</div>
            </div>
          )}
          <Link href="/lopez-asociados/admin" target="_blank" title="Ver agencia demo" style={{ display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 6, fontSize: 11, color: '#8A8A83', textDecoration: 'none' }}>
            <Icon name="external" />{!collapsed && 'Ver agencia demo'}
          </Link>
          <form action="/api/auth/signout" method="POST" style={{ display: 'flex', justifyContent: collapsed ? 'center' : 'flex-start' }}>
            <button type="submit" title="Cerrar sesión" style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#76766f', padding: 0, fontFamily: 'inherit' }}>
              <Icon name="logout" />{!collapsed && 'Cerrar sesión'}
            </button>
          </form>
          <button onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expandir' : 'Colapsar'} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 6, cursor: 'pointer', color: '#b6b6ad', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', fontSize: 12, marginTop: 4 }}>
            <span style={{ display: 'flex', transform: collapsed ? 'rotate(180deg)' : 'none' }}><Icon name="chevron" /></span>
            {!collapsed && 'Colapsar'}
          </button>
        </div>
      </aside>

      <main className="admin-main" style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {children}
      </main>

      {/* Tab bar inferior — solo mobile (modo app) */}
      <nav className="admin-tabbar" style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 200, height: 60, background: '#111111', borderTop: '1px solid rgba(255,255,255,.08)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {TABS.map(item => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link key={item.href} href={item.href} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, textDecoration: 'none', color: active ? '#FF6A00' : '#8A8A83', fontSize: 10, fontFamily: MONO, fontWeight: active ? 700 : 500 }}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
