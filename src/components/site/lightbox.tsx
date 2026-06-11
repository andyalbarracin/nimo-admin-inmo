'use client'

/*
 * Lightbox / modo teatro compartido por los 3 themes públicos.
 * Controles: flechas ‹ ›, teclado (← → Esc), contador y dots.
 * Cierra al hacer click en el fondo. El acento se pasa por theme.
 */
import { useEffect } from 'react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  index: number | null
  onClose: () => void
  onChange: (i: number) => void
  accent: string
  mono?: string
}

export default function Lightbox({ images, index, onClose, onChange, accent, mono = 'ui-monospace, monospace' }: LightboxProps) {
  const open = index !== null && images.length > 0

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') onChange((index! + 1) % images.length)
      else if (e.key === 'ArrowLeft') onChange((index! - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow }
  }, [open, index, images.length, onChange, onClose])

  if (!open) return null
  const i = index!
  const many = images.length > 1
  const go = (n: number) => onChange((n + images.length) % images.length)

  const arrow: React.CSSProperties = {
    position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 52, height: 52, borderRadius: 999,
    display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.08)',
    color: '#fff', fontSize: 30, lineHeight: 1, cursor: 'pointer', backdropFilter: 'blur(4px)', userSelect: 'none',
  }

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(14,11,9,.95)', zIndex: 300, display: 'grid', placeItems: 'center', padding: 'clamp(16px,5vw,56px)', cursor: 'zoom-out', ['--lb-accent' as string]: accent, animation: 'nimo-lb-in .22s ease-out' }}
    >
      <style>{`
        @keyframes nimo-lb-in { from { opacity: 0 } to { opacity: 1 } }
        @keyframes nimo-lb-img { from { opacity: 0; transform: scale(.985) } to { opacity: 1; transform: none } }
        .nimo-lb-ctl:hover { background: var(--lb-accent) !important; border-color: var(--lb-accent) !important; color: #fff !important }
      `}</style>

      {/* Cerrar */}
      <button onClick={onClose} aria-label="Cerrar" className="nimo-lb-ctl" style={{ position: 'absolute', top: 'clamp(16px,3vw,28px)', right: 'clamp(16px,3vw,32px)', width: 44, height: 44, borderRadius: 999, display: 'grid', placeItems: 'center', border: '1px solid rgba(255,255,255,.25)', background: 'rgba(255,255,255,.08)', color: '#fff', fontSize: 26, lineHeight: 1, cursor: 'pointer' }}>×</button>

      {/* Contador */}
      {many && (
        <div style={{ position: 'absolute', top: 'clamp(20px,3vw,32px)', left: '50%', transform: 'translateX(-50%)', fontFamily: mono, fontSize: 13, letterSpacing: '.14em', color: 'rgba(255,255,255,.85)' }}>
          {String(i + 1).padStart(2, '0')} <span style={{ color: 'rgba(255,255,255,.4)' }}>/ {String(images.length).padStart(2, '0')}</span>
        </div>
      )}

      {/* Anterior */}
      {many && (
        <button onClick={(e) => { e.stopPropagation(); go(i - 1) }} aria-label="Anterior" className="nimo-lb-ctl" style={{ ...arrow, left: 'clamp(8px,3vw,32px)' }}>‹</button>
      )}

      {/* Imagen */}
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative', width: 'min(1200px, 92vw)', height: '80vh', cursor: 'default' }}>
        <Image key={i} src={images[i] ?? ''} alt={`Foto ${i + 1}`} fill style={{ objectFit: 'contain', animation: 'nimo-lb-img .25s ease-out' }} sizes="92vw" priority />
      </div>

      {/* Siguiente */}
      {many && (
        <button onClick={(e) => { e.stopPropagation(); go(i + 1) }} aria-label="Siguiente" className="nimo-lb-ctl" style={{ ...arrow, right: 'clamp(8px,3vw,32px)' }}>›</button>
      )}

      {/* Dots */}
      {many && (
        <div style={{ position: 'absolute', bottom: 'clamp(18px,3vw,28px)', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
          {images.map((_, d) => (
            <button key={d} onClick={(e) => { e.stopPropagation(); onChange(d) }} aria-label={`Ir a la foto ${d + 1}`} style={{ width: d === i ? 22 : 8, height: 8, borderRadius: 99, border: 'none', cursor: 'pointer', transition: 'width .2s', background: d === i ? accent : 'rgba(255,255,255,.4)' }} />
          ))}
        </div>
      )}
    </div>
  )
}
