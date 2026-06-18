'use client'

/*
 * Archivo : admin-shell.tsx
 * Ruta    : src/components/admin/admin-shell.tsx
 * Modif.  : 2026-06-18
 * Descripción: Shell del panel de agencia con el SIDEBAR de shadcn (collapsible
 *              icon-rail, tooltips, persistencia por cookie, sheet en mobile) +
 *              header con SidebarTrigger y menú de usuario. El acento de la agencia
 *              se inyecta vía CSS vars del sidebar.
 */
import { useState } from 'react'
import { usePathname, useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarProvider, SidebarRail, SidebarTrigger,
} from '@/components/ui/sidebar'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#EDEBE6',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590', danger: '#C0392B',
}
// Header oscuro (top bar del panel)
const HD = { bg: '#1A1714', border: '#2E2A26', text: '#F5F1EC', muted: '#A39C92' }

type NavItem = { href: string; label: string; icon: string; admin?: boolean }
const SECTIONS: { title: string; items: NavItem[] }[] = [
  {
    title: 'Operación',
    items: [
      { href: '',             label: 'Dashboard',     icon: 'grid' },
      { href: '/propiedades', label: 'Propiedades',   icon: 'home' },
      { href: '/leads',       label: 'CRM / Leads',   icon: 'users' },
      { href: '/equipo',      label: 'Equipo',        icon: 'user-plus', admin: true },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { href: '/configuracion', label: 'Configuración',  icon: 'settings', admin: true },
      { href: '/tema',          label: 'Tema del sitio', icon: 'palette', admin: true },
    ],
  },
]

const ROLE_LABEL: Record<string, string> = { owner: 'Propietario', admin: 'Admin', agent: 'Agente', viewer: 'Visor', superadmin: 'Super Admin' }

function Icon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    grid: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
    home: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    'user-plus': <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
    palette: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  }
  return icons[name] ?? null
}

export default function AdminShell({ children, agencyName, accent, user }: { children: React.ReactNode; agencyName: string; accent: string; user: { name: string; email: string; role: string; isSuperadmin: boolean } | null }) {
  const pathname = usePathname()
  const params = useParams()
  const slug = (params?.slug as string) ?? ''
  const [menuOpen, setMenuOpen] = useState(false)

  if (pathname.endsWith('/login')) return <>{children}</>

  const initials = (user?.name ?? '?').trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
  // Solo owner/admin (o superadmin) ven Configuración / Tema / Equipo.
  const canManage = !!user && (user.isSuperadmin || user.role === 'owner' || user.role === 'admin')
  const sections = SECTIONS.map(s => ({ ...s, items: s.items.filter(i => !i.admin || canManage) })).filter(s => s.items.length > 0)

  // Acento de la agencia inyectado en las CSS vars del sidebar de shadcn.
  const themeVars = {
    '--sidebar-primary': accent,
    '--sidebar-primary-foreground': '#ffffff',
    '--sidebar-accent': accent + '1f',
    '--sidebar-accent-foreground': accent,
    '--sidebar-ring': accent,
  } as React.CSSProperties

  return (
    <SidebarProvider style={themeVars}>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg" tooltip={agencyName}>
                <Link href={`/${slug}/admin`}>
                  <div style={{ background: accent, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 15, borderRadius: 8 }} className="aspect-square size-8 shrink-0">
                    {agencyName.charAt(0).toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-semibold">{agencyName}</span>
                    <span className="truncate text-xs text-muted-foreground">Panel de Control</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {sections.map(section => (
            <SidebarGroup key={section.title}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarMenu>
                {section.items.map(item => {
                  const href = `/${slug}/admin${item.href}`
                  const active = item.href === '' ? pathname === href : pathname.startsWith(href)
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={active} tooltip={item.label}>
                        <Link href={href}>
                          <Icon name={item.icon} />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Ver sitio web">
                <Link href={`/${slug}`} target="_blank">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                  <span>Ver sitio web</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0">
        {/* Header con trigger del sidebar + menú de usuario (oscuro) */}
        <header style={{ position: 'sticky', top: 0, zIndex: 100, height: 56, background: HD.bg, borderBottom: `1px solid ${HD.border}`, display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', color: HD.text }}>
          <SidebarTrigger className="text-[#F5F5F0] hover:bg-white/10 hover:text-white" />
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: 10, fontFamily: 'inherit' }}>
              <div style={{ width: 34, height: 34, borderRadius: 99, background: accent, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{initials}</div>
              <div style={{ textAlign: 'left', lineHeight: 1.2 }} className="rwd-hide-mobile">
                <div style={{ fontSize: 13, fontWeight: 700, color: HD.text, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name ?? 'Usuario'}</div>
                <div style={{ fontSize: 11, color: HD.muted }}>{ROLE_LABEL[user?.role ?? 'viewer'] ?? user?.role}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={HD.muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: menuOpen ? 'rotate(180deg)' : 'none' }}><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {menuOpen && (
              <>
                <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 90 }} />
                <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', zIndex: 100, background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 12, boxShadow: '0 8px 28px rgba(0,0,0,.12)', minWidth: 220, overflow: 'hidden' }}>
                  <div style={{ padding: '12px 14px', borderBottom: `1px solid ${LA.border}` }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: LA.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name ?? 'Usuario'}</div>
                    <div style={{ fontSize: 11.5, color: LA.ink3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
                  </div>
                  {!user?.isSuperadmin && (
                    <Link href={`/${slug}/admin/perfil`} onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', fontSize: 13, color: LA.ink2, textDecoration: 'none' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V12a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
                      Mi perfil y configuración
                    </Link>
                  )}
                  <form action="/api/auth/signout" method="POST">
                    <button type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', fontSize: 13, color: LA.danger, background: 'none', border: 'none', borderTop: `1px solid ${LA.border}`, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </header>

        <div style={{ minWidth: 0, maxWidth: '100%', overflowX: 'auto', minHeight: 'calc(100vh - 56px)', background: LA.bg }}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
