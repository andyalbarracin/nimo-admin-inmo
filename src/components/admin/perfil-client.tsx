'use client'

/*
 * Archivo : perfil-client.tsx
 * Ruta    : src/components/admin/perfil-client.tsx
 * Modif.  : 2026-06-17
 * Descripción: Perfil y configuración del usuario de la agencia: editar nombre,
 *              ver email/rol, accesos rápidos a propiedades y leads, y exportar un
 *              informe simple (CSV). Email/contraseña: próximamente (con verificación).
 */
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { updateMyDisplayName, exportAgencyReport } from '@/lib/auth/profile-actions'

const LA = {
  bg: '#FAF7F2', white: '#FFFFFF', border: '#E8E2D8', ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  accent: 'var(--admin-accent, #FF6B6B)', green: '#2D7D5F', sans: 'var(--font-sans), system-ui, sans-serif',
}
const ROLE_LABEL: Record<string, string> = { owner: 'Propietario', admin: 'Admin', agent: 'Agente', viewer: 'Visor' }
const field: React.CSSProperties = { width: '100%', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: '11px 13px', fontSize: 14, color: LA.ink, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: LA.ink2, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6, display: 'block' }
const card: React.CSSProperties = { background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 16, padding: 24 }

export default function PerfilClient({ slug, initialName, email, role }: { slug: string; initialName: string; email: string; role: string }) {
  const [name, setName] = useState(initialName)
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  const save = () => { setMsg(null); start(async () => { const r = await updateMyDisplayName(slug, name); setMsg(r.ok ? 'Guardado ✓' : (r.error ?? 'Error')) }) }
  const exportReport = () => { setMsg(null); start(async () => {
    const r = await exportAgencyReport(slug)
    if (!r.ok || !r.csv) { setMsg(r.error ?? 'No se pudo exportar'); return }
    const blob = new Blob([r.csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `informe-${slug}-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }) }

  return (
    <div style={{ padding: '32px 40px', minHeight: '100%', background: LA.bg, fontFamily: LA.sans, color: LA.ink }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: LA.accent, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Mi cuenta</div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: '-.02em' }}>Perfil y configuración</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, maxWidth: 900 }}>
        {/* Datos */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Tus datos</div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Nombre</label>
            <input style={field} value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={lbl}>Email</label>
            <input style={{ ...field, background: LA.bg, color: LA.ink3 }} value={email} disabled />
            <div style={{ fontSize: 11, color: LA.ink3, marginTop: 4 }}>El cambio de email y contraseña estará disponible pronto (con verificación).</div>
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={lbl}>Rol</label>
            <span style={{ display: 'inline-block', fontSize: 12.5, fontWeight: 700, background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 8, padding: '6px 12px' }}>{ROLE_LABEL[role] ?? role}</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={save} disabled={pending} style={{ background: LA.accent, color: LA.white, border: 'none', borderRadius: 10, padding: '11px 22px', fontSize: 13, fontWeight: 700, cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1, fontFamily: 'inherit' }}>{pending ? 'Guardando…' : 'Guardar'}</button>
            {msg && <span style={{ fontSize: 12.5, color: msg.includes('✓') ? LA.green : '#C0392B', fontWeight: 600 }}>{msg}</span>}
          </div>
        </div>

        {/* Accesos rápidos + informe */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Accesos rápidos</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            <Link href={`/${slug}/admin/propiedades`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 10, textDecoration: 'none', color: LA.ink, fontSize: 13.5, fontWeight: 600 }}>Mis propiedades <span style={{ color: LA.accent }}>→</span></Link>
            <Link href={`/${slug}/admin/leads`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 10, textDecoration: 'none', color: LA.ink, fontSize: 13.5, fontWeight: 600 }}>Mis leads <span style={{ color: LA.accent }}>→</span></Link>
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Informe</div>
          <p style={{ fontSize: 12.5, color: LA.ink3, margin: '0 0 12px', lineHeight: 1.5 }}>Descargá un resumen de la agencia (propiedades, leads) en CSV.</p>
          <button onClick={exportReport} disabled={pending} style={{ background: LA.white, color: LA.ink, border: `1.5px solid ${LA.ink}`, borderRadius: 10, padding: '10px 18px', fontSize: 13, fontWeight: 700, cursor: pending ? 'default' : 'pointer', opacity: pending ? .6 : 1, fontFamily: 'inherit' }}>↓ Exportar informe (CSV)</button>
        </div>
      </div>
    </div>
  )
}
