'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { TeamMember } from '@/lib/dummy'
import { inviteAgencyMember, removeAgencyMember, updateMemberRole } from '@/lib/agencies/members-actions'

/* Admin · Equipo — funcional en sesión, themed con --admin-accent. */

const LA = {
  bg: '#FAF7F2', cream: '#F4F0E8', white: '#FFFFFF', border: '#E8E2D8',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590', danger: '#C0392B',
  accent: 'var(--admin-accent, #FF6B6B)',
  sans: 'var(--font-sans), system-ui, sans-serif',
  mono: "var(--font-mono), ui-monospace, monospace",
}

type Role = 'owner' | 'admin' | 'agent' | 'viewer'
const ROLES: { id: Role; label: string; color: string; desc: string }[] = [
  { id: 'owner', label: 'Propietario', color: '#C0392B', desc: 'Control total, facturación' },
  { id: 'admin', label: 'Admin', color: '#8B5CF6', desc: 'Gestiona equipo y configuración' },
  { id: 'agent', label: 'Agente', color: '#4A90E2', desc: 'Carga propiedades y leads' },
  { id: 'viewer', label: 'Visor', color: '#8A8A83', desc: 'Solo lectura' },
]
const roleMeta = (r: string) => ROLES.find(x => x.id === r) ?? ROLES[3]!

interface Member extends TeamMember { status?: 'active' | 'invited' }

export default function EquipoAdmin({ initialTeam, planLimit = 10, slug = '', isReal = false }: { initialTeam: TeamMember[]; planLimit?: number; slug?: string; isReal?: boolean }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [members, setMembers] = useState<Member[]>(initialTeam.map(m => ({ ...m, status: 'active' })))
  const [inviting, setInviting] = useState(false)
  const [invite, setInvite] = useState({ name: '', email: '', role: 'agent' as Role, password: '' })
  const [err, setErr] = useState<string | null>(null)

  const atLimit = members.length >= planLimit

  const setRole = (id: string, role: Role) => {
    if (isReal) { start(async () => { const r = await updateMemberRole(slug, id, role); if (r.ok) router.refresh(); else setErr(r.error ?? 'Error') }); return }
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m))
  }
  const remove = (id: string) => {
    if (isReal) { if (!confirm('¿Quitar este usuario?')) return; start(async () => { const r = await removeAgencyMember(slug, id); if (r.ok) router.refresh(); else setErr(r.error ?? 'Error') }); return }
    setMembers(prev => prev.filter(m => m.id !== id))
  }
  const genPassword = () => setInvite(v => ({ ...v, password: Array.from({ length: 12 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$'[Math.floor(Math.random() * 58)]).join('') }))
  const sendInvite = () => {
    setErr(null)
    if (!invite.name.trim() || !invite.email.trim()) return
    if (isReal) {
      start(async () => {
        const r = await inviteAgencyMember(slug, { name: invite.name.trim(), email: invite.email.trim(), role: invite.role, password: invite.password })
        if (!r.ok) { setErr(r.error ?? 'Error'); return }
        setInvite({ name: '', email: '', role: 'agent', password: '' }); setInviting(false); router.refresh()
      })
      return
    }
    setMembers(prev => [...prev, {
      id: `member-${Date.now()}`, name: invite.name.trim(), email: invite.email.trim(), role: invite.role,
      avatar: invite.name.trim().split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase(), phone: '',
      properties_count: 0, leads_count: 0, status: 'invited',
    }])
    setInvite({ name: '', email: '', role: 'agent', password: '' })
    setInviting(false)
  }

  const field: React.CSSProperties = { width: '100%', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 13.5, color: LA.ink, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: '0 0 40px', minHeight: '100vh', background: LA.bg, fontFamily: LA.sans, color: LA.ink }}>
      <header className="rwd-pad" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderBottom: `1px solid ${LA.border}`, gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: LA.mono, fontSize: 11, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Gestión</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>Equipo</h1>
          <p style={{ fontSize: 13, color: LA.ink2, margin: '4px 0 0' }}>{members.length} / {planLimit} usuarios del plan</p>
        </div>
        <button onClick={() => { setErr(null); setInviting(true) }} disabled={atLimit} title={atLimit ? 'Llegaste al límite de usuarios del plan' : undefined} style={{ background: atLimit ? LA.border : LA.accent, color: atLimit ? LA.ink3 : LA.white, padding: '11px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: atLimit ? 'not-allowed' : 'pointer' }}>+ Invitar miembro</button>
      </header>

      <div className="rwd-pad" style={{ padding: '24px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {members.map(m => {
          const rm = roleMeta(m.role)
          return (
            <div key={m.id} className="coral-card" style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 18, padding: 20 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 48, height: 48, borderRadius: 99, background: rm.color + '1A', color: rm.color, display: 'grid', placeItems: 'center', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{m.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</span>
                    {m.status === 'invited' && <span style={{ fontFamily: LA.mono, fontSize: 8, background: '#D4A017', color: '#fff', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>Invitado</span>}
                  </div>
                  <div style={{ fontSize: 12.5, color: LA.ink3, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.email}</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 16, margin: '16px 0', fontSize: 12, color: LA.ink2 }}>
                <span><b style={{ color: LA.ink }}>{m.properties_count}</b> props</span>
                <span><b style={{ color: LA.ink }}>{m.leads_count}</b> leads</span>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', borderTop: `1px solid ${LA.border}`, paddingTop: 14 }}>
                <select
                  value={m.role}
                  disabled={m.role === 'owner'}
                  onChange={e => setRole(m.id, e.target.value as Role)}
                  style={{ ...field, flex: 1, padding: '8px 10px', fontSize: 12.5, opacity: m.role === 'owner' ? .7 : 1 }}
                >
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
                {m.role !== 'owner' && (
                  <button onClick={() => remove(m.id)} title="Quitar" style={{ background: LA.bg, border: `1px solid ${LA.border}`, color: LA.danger, padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Quitar</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Roles legend */}
      <div style={{ padding: '0 40px' }}>
        <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 18, padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          {ROLES.map(r => (
            <div key={r.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ width: 10, height: 10, borderRadius: 99, background: r.color, marginTop: 4, flexShrink: 0 }} />
              <div><div style={{ fontSize: 13, fontWeight: 700 }}>{r.label}</div><div style={{ fontSize: 12, color: LA.ink3 }}>{r.desc}</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite drawer */}
      {inviting && (
        <>
          <div onClick={() => setInviting(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.3)', zIndex: 300 }} />
          <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(420px, 100vw)', background: LA.bg, borderLeft: `1px solid ${LA.border}`, zIndex: 301, display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${LA.border}`, background: LA.white, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Invitar miembro</h2>
              <button onClick={() => setInviting(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: LA.ink3, fontSize: 24, lineHeight: 1 }}>×</button>
            </div>
            <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Nombre</label><input style={field} value={invite.name} onChange={e => setInvite({ ...invite, name: e.target.value })} placeholder="Nombre y apellido" /></div>
              <div><label style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Email</label><input style={field} value={invite.email} onChange={e => setInvite({ ...invite, email: e.target.value })} placeholder="email@inmobiliaria.com" /></div>
              <div><label style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Rol</label>
                <select style={field} value={invite.role} onChange={e => setInvite({ ...invite, role: e.target.value as Role })}>
                  {ROLES.filter(r => r.id !== 'owner').map(r => <option key={r.id} value={r.id}>{r.label} — {r.desc}</option>)}
                </select>
              </div>
              {isReal && (
                <div>
                  <label style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', display: 'block', marginBottom: 6 }}>Contraseña inicial</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input style={field} value={invite.password} onChange={e => setInvite({ ...invite, password: e.target.value })} placeholder="mín. 8 caracteres" />
                    <button type="button" onClick={genPassword} style={{ flexShrink: 0, background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: '0 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', color: LA.ink2 }}>Generar</button>
                  </div>
                  <div style={{ fontSize: 11, color: LA.ink3, marginTop: 4 }}>Se la pasás al usuario (todavía no hay invitación por email).</div>
                </div>
              )}
              {err && <div style={{ background: '#FBEAE8', border: `1px solid ${LA.danger}`, color: LA.danger, borderRadius: 8, padding: '9px 11px', fontSize: 12.5 }}>{err}</div>}
            </div>
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${LA.border}`, background: LA.white, display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              {(() => {
                const canSend = !!invite.name.trim() && !!invite.email.trim() && (!isReal || invite.password.length >= 8) && !pending
                return (
                  <>
                    <button onClick={() => setInviting(false)} style={{ background: LA.white, border: `1px solid ${LA.border}`, color: LA.ink2, padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
                    <button onClick={sendInvite} disabled={!canSend} style={{ background: canSend ? LA.accent : LA.border, color: canSend ? LA.white : LA.ink3, border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: canSend ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>{pending ? 'Creando…' : isReal ? 'Crear usuario' : 'Enviar invitación'}</button>
                  </>
                )
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
