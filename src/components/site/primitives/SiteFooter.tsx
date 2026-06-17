import Link from 'next/link'
import type { Agency } from '@/lib/dummy'

interface SiteFooterProps {
  slug: string
  agency: Agency
  bg: string
  rule: string
  ink: string
  ink2: string
  ink3: string
  accent: string
  fontDisplay?: string
}

export default function SiteFooter({ slug, agency, bg, rule, ink, ink2, ink3, accent, fontDisplay }: SiteFooterProps) {
  return (
    <footer style={{ background: bg, borderTop: `1px solid ${rule}`, padding: '48px 64px 32px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 48 }}>
          {/* Brand */}
          <div>
            <div style={{ fontFamily: fontDisplay, fontSize: 20, fontWeight: 700, color: ink, marginBottom: 12 }}>
              {agency.name}
            </div>
            <p style={{ fontSize: 13, color: ink3, lineHeight: 1.65, maxWidth: 280, margin: '0 0 20px' }}>
              {agency.tagline ?? 'Inmobiliaria especializada en propiedades en Buenos Aires.'}
            </p>
            {agency.instagram && (
              <a href={`https://instagram.com/${agency.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: accent, textDecoration: 'none', fontWeight: 600 }}>
                {agency.instagram}
              </a>
            )}
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>Navegación</div>
            {([['Inicio', `/${slug}`], ['Propiedades', `/${slug}/propiedades`], ['Contacto', `/${slug}/contacto`]] as [string, string][]).map(([label, href]) => (
              <div key={label} style={{ marginBottom: 10 }}>
                <Link href={href} style={{ fontSize: 13, color: ink2, textDecoration: 'none' }}>{label}</Link>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>Contacto</div>
            {agency.address && <p style={{ fontSize: 12, color: ink3, marginBottom: 8, lineHeight: 1.5 }}>{agency.address}</p>}
            {agency.phone && <p style={{ fontSize: 12, color: ink3, marginBottom: 8 }}>{agency.phone}</p>}
            {agency.email && <p style={{ fontSize: 12, color: ink3 }}>{agency.email}</p>}
          </div>

          {/* Horarios */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 16 }}>Horarios</div>
            <p style={{ fontSize: 12, color: ink3, lineHeight: 1.7, margin: 0 }}>
              Lun – Vie: 9 – 18hs<br />
              Sábados: 10 – 13hs<br />
              Domingos: Cerrado
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: `1px solid ${rule}`, paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, color: ink3 }}>© 2026 {agency.name}. Todos los derechos reservados.</span>
          <span style={{ fontSize: 11, color: ink3 }}>
            Sitio web por{' '}
            <a
              href={process.env.NEXT_PUBLIC_NIMO_URL || process.env.NEXT_PUBLIC_APP_URL || '/'}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: accent, fontWeight: 700, textDecoration: 'none' }}
            >
              NIMO
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
