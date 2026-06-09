'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const NAV = [
  { href: '/superadmin',               label: 'Dashboard',    icon: 'grid',   exact: true },
  { href: '/superadmin/agencias',      label: 'Agencias',     icon: 'building',exact: false },
  { href: '/superadmin/crm',           label: 'CRM',          icon: 'crm',    exact: false },
  { href: '/superadmin/planes',        label: 'Planes',       icon: 'layers', exact: false },
  { href: '/superadmin/configuracion', label: 'Configuración',icon: 'settings',exact: false },
]

function Icon({ name }: { name: string }) {
  const d: Record<string, React.ReactNode> = {
    grid: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    building: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01M16 6h.01M8 10h.01M16 10h.01M8 14h.01M16 14h.01"/></svg>,
    layers: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    settings: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    crm: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    external: <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>,
    logout: <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  }
  return <span style={{ display: 'flex', color: 'currentColor' }}>{d[name]}</span>
}

export default function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/superadmin/login') return <>{children}</>

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F0', fontFamily: "'Archivo', system-ui, sans-serif" }}>
      {/* Sidebar — Zaire negro */}
      <aside style={{
        width: 240,
        minWidth: 240,
        background: '#111111',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
      }}>
        {/* Signature stripe */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', flexShrink: 0 }} />

        {/* Wordmark */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: '#FF6A00',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Archivo Black', sans-serif",
              fontWeight: 900, fontSize: 18, color: '#111111', letterSpacing: '-.02em',
            }}>N</div>
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: '#F5F5F0', textTransform: 'uppercase', letterSpacing: '.02em', lineHeight: 1 }}>
                NIMO
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#FF6A00', textTransform: 'uppercase', letterSpacing: '.16em', marginTop: 3 }}>
                // SUPERADMIN
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#76766f', textTransform: 'uppercase', letterSpacing: '.14em', padding: '8px 10px 6px', marginBottom: 2 }}>
            // PLATAFORMA
          </div>
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 10px', borderRadius: 6, marginBottom: 1,
                textDecoration: 'none', fontSize: 13,
                fontWeight: active ? 600 : 400,
                color: active ? '#FF6A00' : '#b6b6ad',
                background: active ? 'rgba(255,106,0,.12)' : 'transparent',
                transition: 'all .12s',
              }}>
                <Icon name={item.icon} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Platform info */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#76766f', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// ZAIRE TECH</div>
            <div style={{ fontSize: 11, color: '#76766f', lineHeight: 1.4 }}>Sistemas para ventas, operación y crecimiento.</div>
          </div>
          <Link href="/lopez-asociados/admin" target="_blank" style={{
            display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10,
            fontSize: 11, color: '#8A8A83', textDecoration: 'none',
          }}>
            <Icon name="external" />
            Ver agencia demo
          </Link>
          <form action="/api/auth/signout" method="POST">
            <button type="submit" style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 11, color: '#76766f', padding: 0, fontFamily: 'inherit',
            }}>
              <Icon name="logout" />
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
