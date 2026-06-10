'use client'

import { useState } from 'react'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF',
  border: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00', green: '#2D7D5F',
  display: "var(--font-archivo-black), 'Archivo Black', sans-serif",
  body: "var(--font-archivo), 'Archivo', sans-serif",
  mono: "var(--font-mono), 'JetBrains Mono', monospace",
}

const SITE_THEMES = [
  { id: 'editorial', label: 'Editorial', colors: ['#FAF7F0', '#B25431', '#1A1614'] },
  { id: 'spatial',   label: 'Spatial',   colors: ['#FFFFFF', '#1F4DD6', '#0A0A0A'] },
  { id: 'atelier',   label: 'Atelier',   colors: ['#F5F1EC', '#7A8264', '#2E2620'] },
]

interface ThemeSelectorProps {
  agencySlug: string
  currentTheme: string
}

export default function ThemeSelector({ agencySlug, currentTheme }: ThemeSelectorProps) {
  const [selected, setSelected] = useState(currentTheme)
  const [saved, setSaved] = useState(false)

  const handleApply = () => {
    // TODO(persistencia): UPDATE agencies SET theme = selected WHERE slug = agencySlug (server action + RLS superadmin).
    console.log(`[superadmin] Aplicar tema "${selected}" a la agencia "${agencySlug}"`)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const changed = selected !== currentTheme

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {SITE_THEMES.map((t) => {
          const isActive = t.id === selected
          return (
            <button
              key={t.id}
              onClick={() => setSelected(t.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 4, background: isActive ? 'rgba(255,106,0,.1)' : ZR.cream, border: `1px solid ${isActive ? 'rgba(255,106,0,.4)' : ZR.border}`, cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                {t.colors.map((c, ci) => (
                  <div key={ci} style={{ width: 10, height: 10, borderRadius: 2, background: c, border: `1px solid ${ZR.border}` }} />
                ))}
              </div>
              <span style={{ fontSize: 12, color: isActive ? ZR.orange : ZR.ink2, fontWeight: isActive ? 700 : 400, fontFamily: ZR.body, flex: 1 }}>{t.label}</span>
              {t.id === currentTheme && (
                <span style={{ fontFamily: ZR.mono, fontSize: 7, color: ZR.green, textTransform: 'uppercase', letterSpacing: '.08em', background: 'rgba(45,125,95,.1)', padding: '2px 6px', borderRadius: 2 }}>activo</span>
              )}
              {isActive && t.id !== currentTheme && (
                <span style={{ fontFamily: ZR.mono, fontSize: 7, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.08em' }}>selec.</span>
              )}
            </button>
          )
        })}
      </div>

      {/* Preview: ver el sitio con el tema seleccionado, antes de aplicarlo */}
      <a
        href={`/${agencySlug}?preview=${selected}`}
        target="_blank"
        rel="noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%', fontFamily: ZR.mono, fontSize: 10.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: ZR.black, background: ZR.white, border: `1px solid ${ZR.black}`, padding: '9px', borderRadius: 4, textDecoration: 'none', marginBottom: 8 }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        [ PREVIEW EN VIVO → ]
      </a>

      <button
        onClick={handleApply}
        disabled={!changed}
        style={{ width: '100%', fontFamily: ZR.display, background: changed ? ZR.orange : ZR.border, color: changed ? ZR.black : ZR.ink3, padding: '10px', borderRadius: 4, fontWeight: 900, fontSize: 11, border: 'none', cursor: changed ? 'pointer' : 'not-allowed', letterSpacing: '.04em', textTransform: 'uppercase', transition: 'all .15s' }}
      >
        {saved ? '✓ APLICADO' : 'APLICAR TEMA'}
      </button>
      {changed && (
        <div style={{ fontFamily: ZR.mono, fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 6, textAlign: 'center' }}>
          Cambiar: {currentTheme} → {selected}
        </div>
      )}
    </div>
  )
}
