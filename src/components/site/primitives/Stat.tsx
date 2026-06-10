interface StatProps {
  value: string | number
  label: string
  accent?: string
  ink?: string
  ink3?: string
  mono?: boolean
}

export default function Stat({ value, label, accent = '#B25431', ink = '#1A1614', ink3 = '#9E9389', mono }: StatProps) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 800, color: accent, lineHeight: 1, letterSpacing: '-.03em', fontFamily: mono ? 'var(--font-mono)' : undefined }}>
        {value}
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, color: ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 8 }}>
        {label}
      </div>
    </div>
  )
}
