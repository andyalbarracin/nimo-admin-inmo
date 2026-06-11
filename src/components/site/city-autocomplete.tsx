'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { searchLocal } from '@/lib/constants/ar-cities'
import { searchLocalities, type Locality } from '@/lib/geo/search'

interface Props {
  value: string
  onSelect: (loc: { city: string; province: string; cp: string }) => void
  placeholder?: string
  inputStyle: React.CSSProperties
  accent: string
  surface: string
  ink: string
  ink3: string
  rule: string
  fontMono: string
  radius?: number | string
}

export default function CityAutocomplete({ value, onSelect, placeholder, inputStyle, accent, surface, ink, ink3, rule, fontMono, radius = 0 }: Props) {
  const [q, setQ] = useState(value)
  const [results, setResults] = useState<Locality[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const popRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setQ(value) }, [value])

  const place = () => {
    const r = inputRef.current?.getBoundingClientRect()
    if (r) setPos({ top: r.bottom + 6, left: r.left, width: r.width })
  }

  // Reposiciona el dropdown (portal) al hacer scroll/resize mientras está abierto.
  useEffect(() => {
    if (!open) return
    place()
    const onMove = () => place()
    window.addEventListener('scroll', onMove, true)
    window.addEventListener('resize', onMove)
    return () => { window.removeEventListener('scroll', onMove, true); window.removeEventListener('resize', onMove) }
  }, [open])

  // Cierra al click afuera (input + popup portalizado).
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node
      if (inputRef.current?.contains(t) || popRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const onChange = (text: string) => {
    setQ(text)
    onSelect({ city: text, province: '', cp: '' })
    setOpen(true); place()
    setResults(searchLocal(text, 6).map(c => ({ ...c, source: 'local' as const })))
    if (timer.current) clearTimeout(timer.current)
    if (text.trim().length >= 3) {
      setLoading(true)
      timer.current = setTimeout(async () => {
        const r = await searchLocalities(text, 6)
        setResults(r); setLoading(false)
      }, 280)
    } else { setLoading(false) }
  }

  const pick = (loc: Locality) => {
    setQ(loc.city)
    onSelect({ city: loc.city, province: loc.province, cp: loc.cp })
    setOpen(false)
  }

  const dropdown = open && pos && (results.length > 0 || loading) && typeof document !== 'undefined'
    ? createPortal(
      <div ref={popRef} style={{ position: 'fixed', top: pos.top, left: pos.left, width: pos.width, background: surface, border: `1px solid ${rule}`, borderRadius: radius, boxShadow: '0 18px 50px -18px rgba(20,14,8,.3)', zIndex: 9999, overflow: 'hidden', maxHeight: 280, overflowY: 'auto' }}>
        {results.map((r, i) => (
          <button key={`${r.city}-${r.province}-${i}`} type="button" onMouseDown={(e) => { e.preventDefault(); pick(r) }}
            style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 10, width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', borderBottom: i < results.length - 1 ? `1px solid ${rule}` : 'none', cursor: 'pointer' }}>
            <span style={{ fontSize: 14, color: ink }}>{r.city}{r.province && <span style={{ color: ink3 }}>, {r.province}</span>}</span>
            <span style={{ fontFamily: fontMono, fontSize: 10.5, color: r.cp ? accent : ink3, letterSpacing: '.04em', whiteSpace: 'nowrap' }}>{r.cp ? `CP ${r.cp}` : r.source === 'georef' ? 'georef' : ''}</span>
          </button>
        ))}
        {loading && results.length === 0 && <div style={{ padding: '10px 14px', fontFamily: fontMono, fontSize: 11, color: ink3 }}>Buscando…</div>}
      </div>,
      document.body,
    )
    : null

  return (
    <>
      <input ref={inputRef} value={q} onChange={e => onChange(e.target.value)} onFocus={() => { if (q) { setOpen(true); place() } }} placeholder={placeholder ?? 'Ciudad, barrio o CP…'} style={inputStyle} autoComplete="off" />
      {dropdown}
    </>
  )
}
