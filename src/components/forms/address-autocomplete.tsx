'use client'

import { useState, useRef, useCallback } from 'react'

const ZR = {
  black: '#111111', cream: '#F5F5F0', white: '#FFFFFF',
  border: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00',
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
  address: {
    road?: string
    house_number?: string
    suburb?: string
    city?: string
    state?: string
    country?: string
  }
}

interface Props {
  defaultValue?: string
  onSelect?: (value: string, lat: number, lon: number) => void
  name?: string
}

export default function AddressAutocomplete({ defaultValue = '', onSelect, name = 'address' }: Props) {
  const [value, setValue] = useState(defaultValue)
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const search = useCallback(async (q: string) => {
    if (q.length < 5) { setSuggestions([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&countrycodes=ar&addressdetails=1&limit=5`,
        { headers: { 'Accept-Language': 'es', 'User-Agent': 'NIMO-Inmobiliarias/1.0' } }
      )
      const data: NominatimResult[] = await res.json()
      setSuggestions(data)
      setOpen(data.length > 0)
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    setValue(v)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(v), 500)
  }

  const handleSelect = (item: NominatimResult) => {
    setValue(item.display_name)
    setSuggestions([])
    setOpen(false)
    onSelect?.(item.display_name, parseFloat(item.lat), parseFloat(item.lon))
  }

  return (
    <div style={{ position: 'relative' }}>
      <input
        name={name}
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        placeholder="Av. Corrientes 1234, Buenos Aires"
        autoComplete="off"
        style={{ width: '100%', background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, padding: '12px 14px', color: ZR.black, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />
      {loading && (
        <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3 }}>…</div>
      )}
      {open && suggestions.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, zIndex: 100, marginTop: 2, boxShadow: '0 8px 24px rgba(17,17,17,.08)', overflow: 'hidden' }}>
          {suggestions.map((item, i) => (
            <button
              key={i}
              type="button"
              onMouseDown={() => handleSelect(item)}
              style={{ width: '100%', textAlign: 'left', padding: '10px 14px', background: 'transparent', border: 'none', borderBottom: i < suggestions.length - 1 ? `1px solid ${ZR.border}` : 'none', cursor: 'pointer', fontSize: 13, color: ZR.black, fontFamily: 'inherit' }}
            >
              <div style={{ fontSize: 13, color: ZR.black, marginBottom: 2 }}>
                {item.address.road ? `${item.address.road}${item.address.house_number ? ` ${item.address.house_number}` : ''}` : item.display_name.split(',')[0]}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                {[item.address.suburb, item.address.city].filter(Boolean).join(', ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
