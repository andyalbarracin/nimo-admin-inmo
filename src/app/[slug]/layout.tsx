import Link from 'next/link'

export default function AgencyPublicLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: 'white', fontFamily: 'var(--font-sans)' }}>
      {children}
    </div>
  )
}
