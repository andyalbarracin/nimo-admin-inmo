'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  alt: string
  accent?: string
}

export default function Lightbox({ images, alt, accent = '#B25431' }: LightboxProps) {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(false)

  const prev = useCallback(() => setActive(a => (a === 0 ? images.length - 1 : a - 1)), [images.length])
  const next = useCallback(() => setActive(a => (a === images.length - 1 ? 0 : a + 1)), [images.length])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, prev, next])

  const MAIN = images[0] ?? ''
  const THUMBS = images.slice(1, 5)
  const EXTRA = images.length - 5

  return (
    <>
      {/* Gallery grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, height: 480, borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setOpen(true)}>
        <div style={{ gridRow: '1 / 3', position: 'relative' }}>
          <Image src={MAIN} alt={alt} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 60vw" priority />
        </div>
        {THUMBS.map((img, i) => (
          <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
            <Image src={img} alt={`${alt} ${i + 2}`} fill style={{ objectFit: 'cover' }} sizes="30vw" />
            {i === 3 && EXTRA > 0 && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20 }}>
                +{EXTRA}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox overlay */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setOpen(false)}>
          <button onClick={e => { e.stopPropagation(); prev() }} style={{ position: 'absolute', left: 24, background: 'rgba(255,255,255,.1)', border: 'none', color: 'white', width: 48, height: 48, borderRadius: 9999, cursor: 'pointer', fontSize: 22 }}>←</button>
          <div style={{ position: 'relative', maxWidth: '80vw', maxHeight: '80vh', width: '100%', aspectRatio: '16/9' }} onClick={e => e.stopPropagation()}>
            <Image src={images[active] ?? ''} alt={`${alt} ${active + 1}`} fill style={{ objectFit: 'contain' }} sizes="80vw" />
          </div>
          <button onClick={e => { e.stopPropagation(); next() }} style={{ position: 'absolute', right: 24, background: 'rgba(255,255,255,.1)', border: 'none', color: 'white', width: 48, height: 48, borderRadius: 9999, cursor: 'pointer', fontSize: 22 }}>→</button>
          <button onClick={() => setOpen(false)} style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 'none', color: 'white', fontSize: 28, cursor: 'pointer' }}>✕</button>
          <div style={{ position: 'absolute', bottom: 24, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setActive(i) }} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 999, background: i === active ? accent : 'rgba(255,255,255,.4)', border: 'none', cursor: 'pointer', transition: 'all .2s' }} />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
