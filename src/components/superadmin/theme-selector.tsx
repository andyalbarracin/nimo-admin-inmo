'use client'

import { useState } from 'react'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF',
  border: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00', green: '#2D7D5F',
}

const THEMES = [
  { id: 'editorial', label: 'Editorial', colors: ['#F7F3EE', '#7B4F3C', '#1E1A16'] },
  { id: 'spatial',   label: 'Spatial',   colors: ['#FFFFFF', '#2B5FE8', '#0B1426'] },
  { id: 'loft',      label: 'Loft',      colors: ['#141412', '#C8A05E', '#EDE9E0'] },
]

interface ThemeSelectorProps {
  agencySlug: string
  currentTheme: string
}

export default function ThemeSelector({ agencySlug, currentTheme }: ThemeSelectorProps) {
  const [selected, setSelected] = useState(currentTheme)
  const [saved, setSaved] = useState(false)

  const handleApply = () => {
    // In production: call API to update agency theme
    // await fetch(`/api/superadmin/agencies/${agencySlug}/theme`, { method: 'PATCH', body: JSON.stringify({ theme: selected }) })
    console.log(`[superadmin] Applying theme "${selected}" to agency "${agencySlug}"`)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
        {THEMES.map((t) => {
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
              <span style={{ fontSize: 12, color: isActive ? ZR.orange : ZR.ink2, fontWeight: isActive ? 700 : 400, fontFamily: "'Archivo', sans-serif", flex: 1 }}>{t.label}</span>
              {t.id === currentTheme && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: ZR.green, textTransform: 'uppercase', letterSpacing: '.08em', background: 'rgba(45,125,95,.1)', padding: '2px 6px', borderRadius: 2 }}>activo</span>
              )}
              {isActive && t.id !== currentTheme && (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.08em' }}>selec.</span>
              )}
            </button>
          )
        })}
      </div>
      <button
        onClick={handleApply}
        disabled={selected === currentTheme}
        style={{ width: '100%', fontFamily: "'Archivo Black', sans-serif", background: selected !== currentTheme ? ZR.orange : ZR.border, color: selected !== currentTheme ? ZR.black : ZR.ink3, padding: '10px', borderRadius: 4, fontWeight: 900, fontSize: 11, border: 'none', cursor: selected !== currentTheme ? 'pointer' : 'not-allowed', letterSpacing: '.04em', textTransform: 'uppercase', transition: 'all .15s' }}
      >
        {saved ? '✓ APLICADO' : 'APLICAR TEMA'}
      </button>
      {selected !== currentTheme && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 6, textAlign: 'center' }}>
          Cambiar: {currentTheme} → {selected}
        </div>
      )}
    </div>
  )
}
