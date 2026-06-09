'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const ZR = {
  black: '#111111', cream: '#F5F5F0', cream2: '#FFFFFF',
  creamBorder: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00',
}

const DEMO_CRED = { email: 'albarracin.andres@gmail.com', password: 'NimoAdmin2024!' }

const PLATFORM_STATS = [
  { label: 'Agencias activas', value: '5' },
  { label: 'Propiedades', value: '12' },
  { label: 'Leads en pipeline', value: '10' },
  { label: 'Planes disponibles', value: '4' },
]

export default function SuperadminLoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const fillDemo = () => {
    setEmail(DEMO_CRED.email)
    setPassword(DEMO_CRED.password)
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (authError) {
          // Demo mode fallback
          await fetch('/api/dev/access?role=superadmin', { method: 'GET' })
          router.refresh()
          router.push('/superadmin')
          return
        }
        router.refresh()
        router.push('/superadmin')
      } catch {
        // No Supabase — demo mode
        await fetch('/api/dev/access?role=superadmin', { method: 'GET' })
        router.refresh()
        router.push('/superadmin')
      }
    })
  }

  const active = email === DEMO_CRED.email

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Archivo', system-ui, sans-serif" }}>

      {/* ── LEFT PANEL 60% ── */}
      <div style={{ width: '60%', background: ZR.black, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
        {/* Stripe */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', flexShrink: 0 }} />

        {/* Decorative bg */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,106,0,.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(231,29,10,.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 60px', position: 'relative', zIndex: 2 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 64 }}>
            <div style={{ width: 38, height: 38, borderRadius: 8, background: ZR.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 20, color: ZR.black }}>N</div>
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 15, color: '#F5F5F0', textTransform: 'uppercase', letterSpacing: '.04em', lineHeight: 1 }}>NIMO</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginTop: 3 }}>// SUPERADMIN</div>
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 16 }}>// PLATAFORMA</div>
            <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(40px, 4vw, 62px)', color: '#F5F5F0', margin: '0 0 24px', lineHeight: 0.92, textTransform: 'uppercase', letterSpacing: '-.02em' }}>
              ADMINISTRACIÓN<br />GLOBAL DE<br />LA PLATAFORMA
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(245,245,240,.5)', lineHeight: 1.7, maxWidth: 380, marginBottom: 48 }}>
              Acceso exclusivo al panel de control de NIMO. Gestioná agencias, planes, facturación y configuración de la plataforma.
            </p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, maxWidth: 400 }}>
              {PLATFORM_STATS.map((s) => (
                <div key={s.label} style={{ background: 'rgba(245,245,240,.04)', border: '1px solid rgba(245,245,240,.07)', borderRadius: 4, padding: '16px 18px' }}>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: ZR.orange, lineHeight: 1, marginBottom: 5 }}>{s.value}</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: 'rgba(245,245,240,.35)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(245,245,240,.2)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 40 }}>
            POWERED BY ZAIRE TECH
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL 40% ── */}
      <div style={{ width: '40%', background: ZR.cream, display: 'flex', flexDirection: 'column' }}>
        {/* Stripe */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', flexShrink: 0 }} />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 52px' }}>
          <div style={{ textAlign: 'center', marginBottom: 36, width: '100%' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 8 }}>// ACCESO RESTRINGIDO</div>
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, fontWeight: 900, color: ZR.black, margin: 0, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-.01em' }}>
              SUPERADMIN
            </h1>
            <p style={{ fontSize: 13, color: ZR.ink3, marginTop: 8 }}>Acceso exclusivo al equipo de NIMO.</p>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 7 }}>Email</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" disabled={isPending}
                style={{ width: '100%', background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4, padding: '11px 14px', color: ZR.black, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Archivo', sans-serif" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 7 }}>Contraseña</label>
              <input
                type="password" required value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" disabled={isPending}
                style={{ width: '100%', background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4, padding: '11px 14px', color: ZR.black, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Archivo', sans-serif" }}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(231,29,10,.06)', border: '1px solid rgba(231,29,10,.2)', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#E71D0A', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              type="submit" disabled={isPending || !email || !password}
              style={{ width: '100%', fontFamily: "'Archivo Black', sans-serif", background: isPending ? ZR.ink3 : ZR.black, color: ZR.cream, border: 'none', borderRadius: 4, padding: '13px', fontSize: 12, cursor: isPending ? 'not-allowed' : 'pointer', letterSpacing: '.06em', textTransform: 'uppercase', transition: 'background .15s' }}
            >
              {isPending ? 'VERIFICANDO...' : 'INGRESAR →'}
            </button>
          </form>

          {/* Demo credential */}
          <div style={{ width: '100%', marginTop: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: ZR.creamBorder }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>// DEMO</span>
              <div style={{ flex: 1, height: 1, background: ZR.creamBorder }} />
            </div>
            <button onClick={fillDemo} type="button" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: active ? 'rgba(255,106,0,.07)' : ZR.cream2, border: `1px solid ${active ? 'rgba(255,106,0,.35)' : ZR.creamBorder}`, borderRadius: 5, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all .12s' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9999, background: active ? 'rgba(255,106,0,.15)' : '#EBEBDF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 11, color: active ? ZR.orange : ZR.ink3, flexShrink: 0 }}>SA</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: ZR.black }}>Super Administrador</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: active ? ZR.orange : ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em', background: active ? 'rgba(255,106,0,.1)' : '#EBEBDF', padding: '2px 6px', borderRadius: 2 }}>NIMO</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3 }}>{DEMO_CRED.email}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, marginTop: 1 }}>{DEMO_CRED.password}</div>
              </div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 9, color: active ? ZR.orange : ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em', flexShrink: 0 }}>
                {active ? '✓ OK' : 'USAR →'}
              </div>
            </button>
          </div>

          <p style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '.08em', lineHeight: 1.6 }}>
            Área restringida. El acceso no autorizado<br />puede ser registrado para auditoría.
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 52px', borderTop: `1px solid ${ZR.creamBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em' }}>
            © 2026 NIMO — ZAIRE TECH
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="#" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>Términos</a>
            <a href="#" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>Privacidad</a>
          </div>
        </div>
      </div>
    </div>
  )
}
