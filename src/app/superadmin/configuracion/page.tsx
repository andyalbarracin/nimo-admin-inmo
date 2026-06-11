'use client'

import { useState } from 'react'
import { PLATFORM_STATS } from '@/lib/dummy'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF',
  border: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00',
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: ZR.white, border: `1px solid ${ZR.border}`,
  borderRadius: 4, padding: '12px 14px', color: ZR.black, fontSize: 14,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: "var(--font-mono), 'JetBrains Mono', monospace",
  fontSize: 9, color: ZR.ink3, textTransform: 'uppercase',
  letterSpacing: '.12em', marginBottom: 8,
}

const sectionStyle: React.CSSProperties = {
  background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, padding: 28,
}

export default function SuperadminConfiguracion() {
  const [saved, setSaved] = useState(false)
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }
  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: 'var(--font-archivo), system-ui, sans-serif' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16 }}>
          <div>
            <div style={{ fontFamily: "var(--font-mono), var(--font-mono), 'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// SUPERADMIN</div>
            <h1 style={{ fontFamily: "var(--font-archivo-black), var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 28, color: ZR.black, margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>CONFIGURACIÓN GLOBAL</h1>
            <p style={{ fontSize: 13, color: ZR.ink3, margin: '4px 0 0' }}>Ajustes globales de la plataforma NIMO.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {saved && <span style={{ fontSize: 13, color: '#2D7D5F', fontWeight: 600 }}>✓ Guardado</span>}
            <button onClick={save} className="z-btn-bk is-orange">[ GUARDAR CAMBIOS ]</button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Platform identity */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 20 }}>// IDENTIDAD DE LA PLATAFORMA</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Nombre de la plataforma</label>
                  <input defaultValue="NIMO" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Dominio principal</label>
                  <input defaultValue="nimo.com.ar" style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Tagline</label>
                <input defaultValue="La plataforma para inmobiliarias modernas" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email de soporte</label>
                <input defaultValue="soporte@nimo.com.ar" style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Platform stats snapshot */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 20 }}>// MÉTRICAS DE LA PLATAFORMA</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {[
                { label: 'Total agencias',  value: PLATFORM_STATS.total_agencies,  accent: ZR.orange },
                { label: 'Activas',         value: PLATFORM_STATS.active_agencies,  accent: '#2D7D5F' },
                { label: 'En trial',        value: PLATFORM_STATS.trial_agencies,   accent: '#A07C0A' },
                { label: 'Propiedades',     value: PLATFORM_STATS.total_properties, accent: '#4A90E2' },
              ].map((s) => (
                <div key={s.label} style={{ background: ZR.cream, border: `1px solid ${ZR.border}`, borderRadius: 4, padding: 16, textAlign: 'center' }}>
                  <div style={{ fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 28, color: s.accent, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature flags */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 20 }}>// FEATURE FLAGS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { label: 'Registro de nuevas agencias', desc: 'Permite que nuevas inmobiliarias se registren en la plataforma.', enabled: true },
                { label: 'Trial gratuito 15 días', desc: 'Nuevas agencias tienen 15 días de prueba sin tarjeta de crédito.', enabled: true },
                { label: 'Editor de tema avanzado', desc: 'Permite a agencias personalizar colores y fuentes (solo superadmin asigna).', enabled: true },
                { label: 'API pública', desc: 'Acceso a la API REST para planes Business+.', enabled: false },
                { label: 'Modo mantenimiento', desc: 'Muestra una página de mantenimiento a todos los visitantes.', enabled: false },
              ].map((flag, i, arr) => (
                <div key={flag.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: i < arr.length - 1 ? `1px solid ${ZR.border}` : 'none' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: ZR.black }}>{flag.label}</div>
                    <div style={{ fontSize: 12, color: ZR.ink3, marginTop: 2 }}>{flag.desc}</div>
                  </div>
                  <div style={{ width: 44, height: 24, borderRadius: 999, background: flag.enabled ? ZR.orange : ZR.border, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 3, left: flag.enabled ? 22 : 3, width: 18, height: 18, borderRadius: 9999, background: ZR.white }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Webhooks & API */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 20 }}>// WEBHOOKS & INTEGRACIONES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Webhook — Nuevo lead CRM', endpoint: '/api/webhooks/crm', method: 'POST' },
                { label: 'Webhook — Lead de agencia', endpoint: '/api/webhooks/lead', method: 'POST' },
                { label: 'Webhook — Alta de agencia', endpoint: '/api/webhooks/agency/signup', method: 'POST' },
              ].map((wh) => (
                <div key={wh.endpoint} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: ZR.cream, border: `1px solid ${ZR.border}`, borderRadius: 4 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: ZR.black }}>{wh.label}</div>
                    <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, marginTop: 3 }}>{wh.method} {wh.endpoint}</div>
                  </div>
                  <span style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 9, background: 'rgba(45,125,95,.1)', color: '#2D7D5F', padding: '3px 10px', borderRadius: 2, textTransform: 'uppercase', letterSpacing: '.08em' }}>ACTIVO</span>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div style={{ background: ZR.white, border: '1px solid rgba(231,29,10,.2)', borderRadius: 4, padding: 28 }}>
            <div style={{ fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 10, color: '#E71D0A', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 8 }}>// ZONA DE RIESGO</div>
            <p style={{ fontSize: 12, color: ZR.ink3, marginBottom: 20 }}>Estas acciones son irreversibles. Proceder con extremo cuidado.</p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(231,29,10,.3)', borderRadius: 3, color: '#E71D0A', fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                Vaciar datos demo
              </button>
              <button style={{ padding: '10px 18px', background: 'transparent', border: '1px solid rgba(231,29,10,.3)', borderRadius: 3, color: '#E71D0A', fontFamily: "var(--font-mono), 'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '.08em' }}>
                Exportar backup completo
              </button>
            </div>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button style={{ padding: '12px 22px', borderRadius: 3, border: `1px solid ${ZR.border}`, color: ZR.ink3, fontSize: 13, background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
              Cancelar
            </button>
            <button style={{ padding: '12px 28px', borderRadius: 3, background: ZR.black, color: ZR.cream, fontFamily: "var(--font-archivo-black), 'Archivo Black', sans-serif", fontSize: 11, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              GUARDAR CONFIGURACIÓN →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
