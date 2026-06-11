'use client'

/*
 * Botón para descargar un QR (PNG) con leyenda: nombre de la inmobiliaria + URL.
 * Usa qrcode.react (QRCodeCanvas oculto) y compone QR + texto en un canvas.
 * El estilo del botón lo decide cada theme vía `buttonStyle`.
 */
import { useRef } from 'react'
import { QRCodeCanvas } from 'qrcode.react'

interface QrDownloadProps {
  url: string
  agencyName: string
  fileBase: string
  fg?: string
  buttonStyle: React.CSSProperties
  children: React.ReactNode
}

export default function QrDownload({ url, agencyName, fileBase, fg = '#1A1A1A', buttonStyle, children }: QrDownloadProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  const download = () => {
    const qr = wrapRef.current?.querySelector('canvas')
    if (!qr) return
    const Q = qr.width                       // tamaño del QR renderizado (px reales)
    const pad = Math.round(Q * 0.12)
    const legend = Math.round(Q * 0.28)
    const out = document.createElement('canvas')
    out.width = Q + pad * 2
    out.height = Q + pad * 2 + legend
    const ctx = out.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, out.width, out.height)
    ctx.drawImage(qr, pad, pad)

    const cx = out.width / 2
    ctx.textAlign = 'center'
    ctx.fillStyle = fg
    ctx.font = `600 ${Math.round(Q * 0.085)}px system-ui, -apple-system, sans-serif`
    ctx.fillText(agencyName, cx, Q + pad + Math.round(legend * 0.42), out.width - pad)
    ctx.fillStyle = '#7A7A78'
    ctx.font = `${Math.round(Q * 0.052)}px ui-monospace, monospace`
    ctx.fillText(url.replace(/^https?:\/\//, ''), cx, Q + pad + Math.round(legend * 0.74), out.width - pad)

    const a = document.createElement('a')
    a.href = out.toDataURL('image/png')
    a.download = `qr-${fileBase}.png`
    a.click()
  }

  return (
    <>
      <button type="button" onClick={download} style={buttonStyle}>{children}</button>
      {/* QR oculto en alta resolución (fuente para el canvas compuesto) */}
      <div ref={wrapRef} style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }} aria-hidden>
        <QRCodeCanvas value={url} size={640} bgColor="#FFFFFF" fgColor={fg} level="M" marginSize={2} />
      </div>
    </>
  )
}
