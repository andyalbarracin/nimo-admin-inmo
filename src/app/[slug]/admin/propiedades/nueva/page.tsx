import Link from 'next/link'
import AddressAutocomplete from '@/components/forms/address-autocomplete'

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
  background: ZR.white, border: `1px solid ${ZR.border}`,
  borderRadius: 4, padding: 28,
}

export default async function NuevaPropiedad({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return (
    <div style={{ padding: '36px 40px', minHeight: '100vh', background: ZR.cream, fontFamily: 'var(--font-sans)' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 36 }}>
          <Link href={`/${slug}/admin/propiedades`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.ink3, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>← PROPIEDADES</Link>
          <span style={{ color: ZR.border }}>/</span>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 20, color: ZR.black, margin: 0, textTransform: 'uppercase', letterSpacing: '-.01em' }}>NUEVA PROPIEDAD</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Tipo y operación */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>// TIPO DE PUBLICACIÓN</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Operación *</label>
                <select style={inputStyle}>
                  <option value="venta">Venta</option>
                  <option value="alquiler">Alquiler</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Tipo de propiedad *</label>
                <select style={inputStyle}>
                  <option value="departamento">Departamento</option>
                  <option value="casa">Casa</option>
                  <option value="ph">PH</option>
                  <option value="local">Local comercial</option>
                  <option value="terreno">Terreno</option>
                  <option value="loft">Loft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Información principal */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>// INFORMACIÓN PRINCIPAL</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Título *</label>
                <input placeholder="ej: Departamento 2 ambientes en Palermo" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea placeholder="Describí las características principales de la propiedad..." rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div>
                <label style={labelStyle}>Link de video (YouTube, Vimeo, etc.)</label>
                <input
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  style={inputStyle}
                />
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, marginTop: 6 }}>
                  Pegá el link del video de la propiedad — YouTube, Vimeo, Instagram Reels, etc.
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Precio *</label>
                  <input type="number" placeholder="150000" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Moneda</label>
                  <select style={inputStyle}>
                    <option value="USD">USD</option>
                    <option value="ARS">ARS</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Estado</label>
                  <select style={inputStyle}>
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={labelStyle}>Dirección *</label>
                <AddressAutocomplete />
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginTop: 8, padding: '10px 14px', background: 'rgba(255,106,0,.06)', border: '1px solid rgba(255,106,0,.2)', borderRadius: 4 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, marginTop: 1, flexShrink: 0 }}>→</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink2, lineHeight: 1.6 }}>
                    Para mejor precisión en el mapa, ingresá la dirección completa: <strong>Calle + Número, Barrio, Ciudad</strong>. Ejemplo: <em>Av. Santa Fe 2034, Palermo, Buenos Aires</em>. El sistema sugerirá opciones mientras escribís.
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={labelStyle}>Barrio</label>
                  <input placeholder="Palermo" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ciudad</label>
                  <input defaultValue="Buenos Aires" style={inputStyle} />
                </div>
              </div>
            </div>
          </div>

          {/* Características */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 18 }}>// CARACTERÍSTICAS</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { label: 'Ambientes', placeholder: '3' },
                { label: 'Baños', placeholder: '1' },
                { label: 'Sup. cubierta (m²)', placeholder: '75' },
                { label: 'Sup. total (m²)', placeholder: '80' },
              ].map((f) => (
                <div key={f.label}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type="number" placeholder={f.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Fotos */}
          <div style={sectionStyle}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>// FOTOS</div>
            <p style={{ fontSize: 13, color: ZR.ink3, marginBottom: 20 }}>Subí hasta 20 fotos. La primera imagen será la portada.</p>
            <div style={{ border: `2px dashed ${ZR.border}`, borderRadius: 4, padding: '40px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, color: ZR.border, marginBottom: 12 }}>+</div>
              <div style={{ fontSize: 14, color: ZR.ink2, marginBottom: 8 }}>Arrastrá las fotos acá o hacé clic para subir</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em' }}>JPG, PNG, WEBP · Máx. 10MB por imagen</div>
              <button style={{ marginTop: 16, background: ZR.cream, border: `1px solid ${ZR.border}`, color: ZR.ink2, padding: '10px 20px', borderRadius: 3, fontSize: 12, cursor: 'pointer', fontFamily: "'Archivo Black', sans-serif", letterSpacing: '.04em', textTransform: 'uppercase' }}>
                SELECCIONAR ARCHIVOS
              </button>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
            <Link href={`/${slug}/admin/propiedades`} style={{ padding: '13px 24px', borderRadius: 3, border: `1px solid ${ZR.border}`, color: ZR.ink3, fontSize: 13, textDecoration: 'none', fontFamily: 'inherit' }}>
              Cancelar
            </Link>
            <button style={{ padding: '13px 28px', borderRadius: 3, background: ZR.black, color: ZR.cream, fontFamily: "'Archivo Black', sans-serif", fontSize: 12, border: 'none', cursor: 'pointer', letterSpacing: '.06em', textTransform: 'uppercase' }}>
              PUBLICAR PROPIEDAD →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
