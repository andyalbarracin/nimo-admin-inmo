/* Crédito reutilizable: © año · Desarrollado por Zaire → zairetech.com */

interface ZaireCreditProps {
  name?: string
  color?: string
  accent?: string
  fontFamily?: string
  align?: 'left' | 'center' | 'right'
  style?: React.CSSProperties
}

export default function ZaireCredit({
  name = 'NIMO',
  color = '#9A9590',
  accent = '#FF6A00',
  fontFamily = 'var(--font-mono), ui-monospace, monospace',
  align = 'center',
  style,
}: ZaireCreditProps) {
  return (
    <div style={{ fontFamily, fontSize: 11, color, textAlign: align, letterSpacing: '.02em', ...style }}>
      © {new Date().getFullYear()} {name} · Desarrollado por{' '}
      <a href="https://www.zairetech.com" target="_blank" rel="noreferrer" style={{ color: accent, textDecoration: 'none', fontWeight: 600 }}>
        Zaire
      </a>
    </div>
  )
}
