import type { CSSProperties, ReactNode } from 'react'

interface SectionProps {
  children: ReactNode
  className?: string
  style?: CSSProperties
  maxW?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  py?: 'sm' | 'md' | 'lg'
  id?: string
}

const maxWidths = {
  sm: 640, md: 960, lg: 1100, xl: 1280, '2xl': 1440, full: undefined,
}
const pyMap = {
  sm: '48px 40px', md: '72px 48px', lg: '96px 64px',
}

export default function Section({ children, style, maxW = 'xl', py = 'md', id }: SectionProps) {
  const mw = maxWidths[maxW]
  return (
    <section id={id} style={{ width: '100%', ...style }}>
      <div style={{ maxWidth: mw, margin: '0 auto', padding: pyMap[py] }}>
        {children}
      </div>
    </section>
  )
}
