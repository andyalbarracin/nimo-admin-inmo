import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROPERTIES } from '@/lib/dummy'

const ZR = {
  black: '#1A1A1A', cream: '#FAF7F2', white: '#FFFFFF',
  border: '#EDEBE6', ink2: '#4A4845', ink3: '#9A9590',
  orange: '#FF6B6B',
}

const inputStyle: React.CSSProperties = {
  width: '100%', background: ZR.white, border: `1px solid ${ZR.border}`,
  borderRadius: 4, padding: '12px 14px', color: ZR.black, fontSize: 14,
  outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace",
  fontSize: 9, color: ZR.ink3, textTransform: 'uppercase',
  letterSpacing: '.12em', marginBottom: 8,
}

const sectionStyle: React.CSSProperties = {
  background: ZR.white, border: `1px solid ${ZR.border}`, borderRadius: 4, padding: 28,
}

export default async function EditProperty({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  const prop = PROPERTIES.find(p => p.id === id)
  if (!prop) notFound()

  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href={`/${slug}/admin/propiedades`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.ink3, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>← PROPIEDADES</Link>
            <span style={{ color: ZR.border }}>/</span>
            <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 16, color: ZR.black, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 340, textTransform: 'uppercase' }}>{prop.title}</h1>
          </div>
          <Link href={`/${slug}/propiedades/${prop.id}`} target="_blank" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.ink3, textDecoration: 'none', padding: '8px 14px', background: ZR.white, borderRadius: 3, border: `1px solid ${ZR.border}`, textTransform: 'uppercase', letterSpacing: '.1em' }}>
            → VER PUBLICACIÓN
          </Link>
        </div>

        {/* Image strip */}
        <div style={{ display: 'grid', gridTemplateColumns: `2fr repeat(${Math.min(prop.images.length - 1, 2)}, 1fr)`, gap: 4, marginBottom: 24, borderRadius: 4, overflow: 'hidden', height: 240 }}>
          <img src={prop.images[0]} alt="Principal" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {prop.images.slice(1, 3).map((img, i) => (
            <img key={i} src={img} alt={`Foto ${i+2}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Info principal */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>// INFORMACIÓN PRINCIPAL</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Título</label>
                <input defaultValue={prop.title} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea defaultValue={prop.description} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Precio</label>
                  <input type="number" defaultValue={prop.price} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Moneda</label>
                  <select defaultValue={prop.currency} style={inputStyle}>
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Estado</label>
                  <select defaultValue={prop.status} style={inputStyle}>
                    <option value="available">Disponible</option>
                    <option value="reserved">Reservado</option>
                    <option value="sold">Vendido/Alquilado</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>// UBICACIÓN</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Dirección</label>
                <input defaultValue={prop.address} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Barrio</label>
                <input defaultValue={prop.neighborhood} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Ciudad</label>
                <input defaultValue={prop.city} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Video link */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>// MULTIMEDIA</div>
            <div>
              <label style={labelStyle}>Link de video (YouTube, Vimeo, etc.)</label>
              <input
                type="url"
                defaultValue={(prop as { video_url?: string }).video_url ?? ''}
                placeholder="https://youtube.com/watch?v=..."
                style={inputStyle}
              />
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, marginTop: 6 }}>
                Pegá el link del video de la propiedad — YouTube, Vimeo, Instagram Reels, etc.
              </div>
            </div>
          </div>

          {/* Destacado toggle */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: ZR.black, textTransform: 'uppercase', letterSpacing: '-.01em' }}>Propiedad destacada</div>
                <div style={{ fontSize: 12, color: ZR.ink3, marginTop: 4 }}>Las propiedades destacadas aparecen primero en el sitio.</div>
              </div>
              <div style={{ width: 44, height: 24, borderRadius: 999, background: prop.is_featured ? ZR.orange : ZR.border, cursor: 'pointer', position: 'relative', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: 3, left: prop.is_featured ? 22 : 3, width: 18, height: 18, borderRadius: 9999, background: ZR.white, transition: 'left .15s' }} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            <button style={{ padding: '11px 18px', borderRadius: 3, background: 'transparent', border: '1px solid rgba(231,29,10,.3)', color: '#E71D0A', fontSize: 12, cursor: 'pointer', fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Eliminar propiedad
            </button>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href={`/${slug}/admin/propiedades`} style={{ padding: '12px 22px', borderRadius: 3, border: `1px solid ${ZR.border}`, color: ZR.ink3, fontSize: 13, textDecoration: 'none', fontFamily: 'inherit' }}>
                Cancelar
              </Link>
              <button style={{ padding: '12px 28px', borderRadius: 3, background: ZR.black, color: ZR.cream, fontFamily: "'Archivo Black', sans-serif", fontSize: 12, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase' }}>
                GUARDAR CAMBIOS →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
