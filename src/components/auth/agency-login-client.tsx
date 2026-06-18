'use client'

import { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { resolveAgencyHome } from '@/lib/auth/session-actions'
import ZaireCredit from '@/components/zaire-credit'

const ZR = {
  black: '#111111', cream: '#F5F5F0', cream2: '#FFFFFF',
  creamBorder: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00',
}

const SLIDES = [
  {
    tag: '// 01 — PRESENCIA',
    heading: 'Tu sitio web\npremium, listo.',
    bullets: [
      'URL propia con tu marca: nimo.app/tu-agencia',
      '3 temas diseñados por Zaire Studio',
      'Mapa interactivo de propiedades',
      'Adaptado a móvil y optimizado para SEO',
    ],
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400',
  },
  {
    tag: '// 02 — CRM',
    heading: 'Leads que no\nse te escapan.',
    bullets: [
      'Pipeline Kanban en 7 etapas con drag & drop',
      'Historial de contacto, notas y actividad',
      'WhatsApp, email y llamada desde el panel',
      'Asignación de leads a agentes del equipo',
    ],
    image: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=1400',
  },
  {
    tag: '// 03 — CRECIMIENTO',
    heading: 'Métricas y\nherramientas.',
    bullets: [
      'Dashboard con propiedades, leads y visitas',
      'Roles de acceso: owner, admin, agente, visor',
      'Propiedades ilimitadas con galería de fotos',
      'Soporte y nuevas features incluidos en el plan',
    ],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400',
  },
]

const DEMO_CREDS = [
  { label: 'Martín López', role: 'Owner', email: 'owner@lopezasociados.com', password: 'Lopez2024!' },
  { label: 'Carla Méndez', role: 'Agente', email: 'agente@lopezasociados.com', password: 'Lopez2024!' },
]

interface Props {
  slug: string
  agencyName: string
  redirectTo: string
  showDemo: boolean
}

export default function AgencyLoginClient({ slug, agencyName, redirectTo, showDemo }: Props) {
  const [slide, setSlide] = useState(0)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Auto-advance slides every 5s
  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 5000)
    return () => clearInterval(t)
  }, [])

  const fillCredential = (cred: typeof DEMO_CREDS[0]) => {
    setEmail(cred.email)
    setPassword(cred.password)
    setError(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (authError) {
        setError('Email o contraseña incorrectos.')
        return
      }
      // Redirigir SIEMPRE al panel de la agencia del usuario (según su membresía),
      // nunca al slug de la URL → evita caer en el panel de otra agencia.
      const home = await resolveAgencyHome()
      router.refresh()
      router.push(home ?? redirectTo)
    })
  }

  const current = SLIDES[slide]!

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Archivo', system-ui, sans-serif" }}>

      {/* ── LEFT PANEL 60% — slides (oculto en mobile) ── */}
      <div className="rwd-hide-mobile" style={{ width: '60%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Background image with crossfade */}
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: i === slide ? 1 : 0,
            transition: 'opacity .8s ease',
          }} />
        ))}
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(17,17,17,.92) 0%, rgba(17,17,17,.75) 60%, rgba(17,17,17,.55) 100%)' }} />

        {/* Zaire stripe top */}
        <div style={{ position: 'relative', zIndex: 2, height: 4, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', flexShrink: 0 }} />

        <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 60px 40px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'auto' }}>
            <div style={{ width: 34, height: 34, borderRadius: 6, background: ZR.orange, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 18, color: ZR.black }}>N</div>
            <div>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: '#F5F5F0', textTransform: 'uppercase', letterSpacing: '.04em', lineHeight: 1 }}>NIMO</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginTop: 2 }}>// PLATAFORMA</div>
            </div>
          </div>

          {/* Slide content */}
          <div style={{ paddingTop: 80 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 20 }}>
              {current.tag}
            </div>
            <h2 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 'clamp(36px, 3.5vw, 56px)', color: '#F5F5F0', margin: '0 0 32px', lineHeight: 0.93, textTransform: 'uppercase', letterSpacing: '-.02em', whiteSpace: 'pre-line' }}>
              {current.heading}
            </h2>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {current.bullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 5, height: 5, borderRadius: 9999, background: ZR.orange, marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: 'rgba(245,245,240,.8)', lineHeight: 1.5 }}>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Slide dots */}
          <div style={{ display: 'flex', gap: 7, marginTop: 48 }}>
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 24 : 7, height: 7, borderRadius: 4, background: i === slide ? ZR.orange : 'rgba(245,245,240,.25)', border: 'none', cursor: 'pointer', transition: 'all .3s ease', padding: 0 }} />
            ))}
          </div>

          {/* Quote */}
          <div style={{ marginTop: 28, borderTop: '1px solid rgba(245,245,240,.12)', paddingTop: 24 }}>
            <p style={{ fontSize: 13, color: 'rgba(245,245,240,.5)', lineHeight: 1.6, fontStyle: 'italic', margin: '0 0 6px' }}>
              "NIMO nos permitió tener una presencia digital profesional sin contratar un equipo de desarrollo."
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.1em' }}>
              Roberto López · {agencyName}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL 40% — login (full width en mobile) ── */}
      <div className="rwd-full" style={{ width: '40%', background: ZR.cream, display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {/* Stripe top */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', flexShrink: 0 }} />

        {/* Form area — centered */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 52px' }}>
          {/* Agency name */}
          <div style={{ textAlign: 'center', marginBottom: 36, width: '100%' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 8 }}>// ACCESO AL PANEL</div>
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 26, fontWeight: 900, color: ZR.black, margin: 0, lineHeight: 0.95, textTransform: 'uppercase', letterSpacing: '-.01em' }}>
              {agencyName}
            </h1>
            <p style={{ fontSize: 13, color: ZR.ink3, marginTop: 8 }}>Ingresá con tu cuenta de inmobiliaria.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 7 }}>Email</label>
              <input
                type="email" required
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={isPending}
                style={{ width: '100%', background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4, padding: '11px 14px', color: ZR.black, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Archivo', sans-serif" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 7 }}>Contraseña</label>
              <input
                type="password" required
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isPending}
                style={{ width: '100%', background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4, padding: '11px 14px', color: ZR.black, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Archivo', sans-serif" }}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(231,29,10,.06)', border: '1px solid rgba(231,29,10,.2)', borderRadius: 4, padding: '10px 14px', fontSize: 13, color: '#E71D0A', marginBottom: 16 }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !email || !password}
              style={{ width: '100%', fontFamily: "'Archivo Black', sans-serif", background: isPending ? ZR.ink3 : ZR.black, color: ZR.cream, border: 'none', borderRadius: 4, padding: '13px', fontSize: 12, cursor: isPending ? 'not-allowed' : 'pointer', letterSpacing: '.06em', textTransform: 'uppercase', transition: 'background .15s' }}
            >
              {isPending ? 'INGRESANDO...' : 'INGRESAR AL PANEL →'}
            </button>
          </form>

          {/* Demo credentials */}
          {showDemo && (
            <div style={{ width: '100%', marginTop: 28 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <div style={{ flex: 1, height: 1, background: ZR.creamBorder }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', whiteSpace: 'nowrap' }}>// DEMO — CLIC PARA USAR</span>
                <div style={{ flex: 1, height: 1, background: ZR.creamBorder }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {DEMO_CREDS.map((cred) => {
                  const active = email === cred.email
                  return (
                    <button key={cred.email} onClick={() => fillCredential(cred)} type="button" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: active ? 'rgba(255,106,0,.07)' : ZR.cream2, border: `1px solid ${active ? 'rgba(255,106,0,.35)' : ZR.creamBorder}`, borderRadius: 5, cursor: 'pointer', textAlign: 'left', transition: 'all .12s', width: '100%' }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9999, background: active ? 'rgba(255,106,0,.15)' : '#EBEBDF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Archivo Black', sans-serif", fontSize: 11, color: active ? ZR.orange : ZR.ink3, flexShrink: 0 }}>
                        {cred.label.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: ZR.black }}>{cred.label}</span>
                          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: active ? ZR.orange : ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em', background: active ? 'rgba(255,106,0,.1)' : '#EBEBDF', padding: '2px 6px', borderRadius: 2 }}>{cred.role}</span>
                        </div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3 }}>{cred.email}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, marginTop: 1 }}>{cred.password}</div>
                      </div>
                      <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 9, color: active ? ZR.orange : ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em', flexShrink: 0 }}>
                        {active ? '✓ CARGADO' : 'USAR →'}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <Link href={`/${slug}`} style={{ marginTop: 24, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>
            ← VER SITIO PÚBLICO
          </Link>
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 52px', borderTop: `1px solid ${ZR.creamBorder}`, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <a href="#" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>Términos</a>
            <a href="#" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>Privacidad</a>
          </div>
          <ZaireCredit name="NIMO" color={ZR.ink3} accent={ZR.orange} fontFamily="'JetBrains Mono', monospace" />
        </div>
      </div>
    </div>
  )
}
