const ZR = {
  black: '#1A1A1A', cream: '#FAF7F2', cream2: '#FFFFFF',
  creamBorder: '#EDEBE6', ink2: '#4A4845', ink3: '#9A9590',
  orange: '#FF6B6B',
}

const inputStyle = {
  width: '100%', background: ZR.cream, border: `1px solid ${ZR.creamBorder}`,
  borderRadius: 4, padding: '10px 12px', color: ZR.black, fontSize: 14,
  outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Archivo', sans-serif",
}

const labelStyle = {
  display: 'block' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
  color: ZR.ink3, marginBottom: 7, textTransform: 'uppercase' as const, letterSpacing: '.12em',
}

export default async function ConfiguracionAdmin({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: _ } = await params

  return (
    <div style={{ padding: '36px 44px', minHeight: '100vh', background: ZR.cream, color: ZR.black, fontFamily: "'Archivo', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 740 }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// AJUSTES</div>
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 28, fontWeight: 900, color: ZR.black, margin: '0 0 4px', lineHeight: 0.97, textTransform: 'uppercase', letterSpacing: '-.01em' }}>
            CONFIGURACIÓN
          </h1>
          <p style={{ fontSize: 13, color: ZR.ink2, margin: 0 }}>Información de la inmobiliaria y ajustes del sitio.</p>
        </div>

        {/* Stripe */}
        <div style={{ height: 3, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', borderRadius: 2, marginBottom: 26 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Agency info */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 26 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// DATOS BÁSICOS</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 18 }}>Datos de la inmobiliaria</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={labelStyle}>Nombre de la inmobiliaria</label>
                  <input defaultValue="López & Asociados" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>URL pública (slug)</label>
                  <div style={{ display: 'flex', alignItems: 'center', background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, borderRadius: 4, overflow: 'hidden' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: ZR.ink3, padding: '10px 10px 10px 12px', flexShrink: 0 }}>nimo.com/</span>
                    <input defaultValue="lopez-asociados" style={{ flex: 1, background: 'transparent', border: 'none', padding: '10px 12px 10px 0', color: ZR.black, fontSize: 14, outline: 'none', fontFamily: "'Archivo', sans-serif" }} />
                  </div>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Descripción breve</label>
                <textarea defaultValue="Inmobiliaria con más de 15 años de trayectoria en Buenos Aires. Especialistas en propiedades residenciales y comerciales en los mejores barrios de la ciudad." rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {[
                  { label: 'Teléfono principal', value: '+54 11 4512-3456' },
                  { label: 'WhatsApp de contacto', value: '+54 9 11 4512-3456' },
                  { label: 'Email de contacto', value: 'contacto@lopezasociados.com' },
                  { label: 'Dirección física', value: 'Av. Santa Fe 2034, Piso 2, Palermo' },
                ].map((f) => (
                  <div key={f.label}>
                    <label style={labelStyle}>{f.label}</label>
                    <input defaultValue={f.value} style={inputStyle} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social links */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 26 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// REDES SOCIALES</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 18 }}>Perfiles sociales</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Instagram', placeholder: '@handle', value: '@lopezasociados_ba' },
                { label: 'Facebook', placeholder: 'facebook.com/...', value: 'facebook.com/lopezasociados' },
                { label: 'LinkedIn', placeholder: 'linkedin.com/...', value: '' },
                { label: 'Twitter/X', placeholder: '@handle', value: '' },
              ].map((s) => (
                <div key={s.label}>
                  <label style={labelStyle}>{s.label}</label>
                  <input defaultValue={s.value} placeholder={s.placeholder} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Plan info */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// SUSCRIPCIÓN</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 6 }}>Plan actual</div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 22, color: ZR.orange }}>Pro</span>
                  <span style={{ fontSize: 9, background: 'rgba(45,125,95,.12)', color: '#2D7D5F', padding: '3px 10px', borderRadius: 2, fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', letterSpacing: '.08em' }}>Activo</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 24, color: ZR.black }}>$299<span style={{ fontSize: 12, fontWeight: 400, color: ZR.ink3 }}>/mes</span></div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginTop: 4 }}>Próxima facturación: 15 Jul 2026</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 16 }}>
              {[
                { label: 'Propiedades', used: 12, limit: 50 },
                { label: 'Usuarios', used: 4, limit: 10 },
                { label: 'Leads/mes', used: 6, limit: 100 },
                { label: 'Almacenamiento (GB)', used: 2.4, limit: 20 },
              ].map((r) => (
                <div key={r.label} style={{ background: ZR.cream, borderRadius: 4, padding: 14 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 8 }}>{r.label}</div>
                  <div style={{ height: 3, background: ZR.creamBorder, borderRadius: 9999, marginBottom: 6 }}>
                    <div style={{ height: '100%', width: `${(r.used / r.limit) * 100}%`, background: ZR.orange, borderRadius: 9999 }} />
                  </div>
                  <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: ZR.black }}>{r.used}<span style={{ fontSize: 10, fontWeight: 400, color: ZR.ink3 }}> / {r.limit}</span></div>
                </div>
              ))}
            </div>
            <button style={{ fontFamily: "'Archivo Black', sans-serif", background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, color: ZR.ink2, padding: '9px 20px', borderRadius: 4, fontSize: 11, cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              ACTUALIZAR PLAN →
            </button>
          </div>

          {/* Save */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button style={{ padding: '11px 22px', borderRadius: 4, border: `1px solid ${ZR.creamBorder}`, color: ZR.ink2, fontSize: 13, background: 'transparent', cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
              Descartar
            </button>
            <button style={{ fontFamily: "'Archivo Black', sans-serif", padding: '11px 26px', borderRadius: 4, background: ZR.black, color: ZR.cream, fontWeight: 900, fontSize: 12, border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
              GUARDAR CONFIGURACIÓN
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
