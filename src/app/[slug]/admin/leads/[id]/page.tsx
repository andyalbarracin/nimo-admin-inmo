import Link from 'next/link'
import { notFound } from 'next/navigation'
import { LEADS, PROPERTIES } from '@/lib/dummy'
import { guardAgencyAccess } from '@/lib/auth/require-tenant'

const ZR = {
  black: '#111111', cream: '#F5F5F0', cream2: '#FFFFFF',
  creamBorder: '#DEDED4', ink2: '#4A4A47', ink3: '#8A8A83',
  orange: '#FF6A00',
}

const STAGE_OPTIONS = [
  { id: 'new',        label: 'Nuevo',      color: '#FF6A00' },
  { id: 'contacted',  label: 'Contactado', color: '#4A90E2' },
  { id: 'interested', label: 'Interesado', color: '#D4A017' },
  { id: 'visit',      label: 'Visita',     color: '#E8804A' },
  { id: 'proposal',   label: 'Propuesta',  color: '#8B5CF6' },
  { id: 'won',        label: 'Cerrado',    color: '#2D7D5F' },
  { id: 'lost',       label: 'Perdido',    color: '#8A8A83' },
]

const DUMMY_NOTES = [
  { date: '2026-06-05', author: 'Sistema', text: 'Lead creado desde portal inmobiliario.' },
  { date: '2026-06-05', author: 'Carla Méndez', text: 'Contacté por WhatsApp. Mostró interés inmediato. Pidió información sobre el precio y disponibilidad.' },
  { date: '2026-06-04', author: 'Federico Ruiz', text: 'Llamada de seguimiento. Se acordó visita para el jueves a las 17hs.' },
  { date: '2026-06-03', author: 'Carla Méndez', text: 'Enviamos fotos adicionales del departamento y descripción completa por email.' },
]

const inputStyle = {
  width: '100%', background: ZR.cream, border: `1px solid ${ZR.creamBorder}`,
  borderRadius: 4, padding: '10px 12px', color: ZR.black, fontSize: 14,
  outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Archivo', sans-serif",
}

const labelStyle = {
  display: 'block' as const, fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
  color: ZR.ink3, marginBottom: 7, textTransform: 'uppercase' as const, letterSpacing: '.12em',
}

export default async function LeadDetail({ params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  await guardAgencyAccess(slug)
  const lead = LEADS.find(l => l.id === id)
  if (!lead) notFound()

  const stageData = STAGE_OPTIONS.find(s => s.id === lead.stage) ?? { id: lead.stage, label: lead.stage, color: ZR.ink3 }
  const relatedProp = PROPERTIES.find(p => p.title.includes(lead.property_interest.split(' ').slice(-2).join(' ')))

  return (
    <div style={{ padding: '36px 44px', minHeight: '100vh', background: ZR.cream, color: ZR.black, fontFamily: "'Archivo', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <Link href={`/${slug}/admin/leads`} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.orange, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.1em' }}>← LEADS</Link>
        <span style={{ color: ZR.creamBorder }}>/</span>
        <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 20, fontWeight: 900, color: ZR.black, margin: 0, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-.01em' }}>{lead.name}</h1>
        <span style={{ fontSize: 9, background: stageData.color + '18', color: stageData.color, padding: '4px 10px', borderRadius: 2, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em', border: `1px solid ${stageData.color}44` }}>
          {stageData.label}
        </span>
      </div>

      {/* Stripe */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, #E71D0A 0%, #E71D0A 33.3%, #FF6A00 33.3%, #FF6A00 66.6%, #FFC107 66.6%, #FFC107 100%)', borderRadius: 2, marginBottom: 24 }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 310px', gap: 18 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Contact info */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// CONTACTO</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 16 }}>Información del contacto</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[
                { label: 'Nombre completo', value: lead.name, editable: true },
                { label: 'Email', value: lead.email, editable: true },
                { label: 'Teléfono', value: lead.phone, editable: true },
                { label: 'Fuente', value: lead.source, editable: false },
                { label: 'Agente asignado', value: lead.agent, editable: false },
                { label: 'Fecha de ingreso', value: lead.created_at, editable: false },
              ].map((f) => (
                <div key={f.label}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.editable ? (
                    <input defaultValue={f.value} style={inputStyle} />
                  ) : (
                    <div style={{ fontFamily: "'Archivo', sans-serif", fontSize: 14, color: ZR.ink2, padding: '10px 0' }}>{f.value}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Interest */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 24 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// INTERÉS</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: ZR.black, marginBottom: 16 }}>Búsqueda del cliente</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Propiedad de interés</label>
                <input defaultValue={lead.property_interest} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Presupuesto</label>
                <input defaultValue={lead.budget} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Último contacto</label>
                <div style={{ fontSize: 14, color: ZR.ink2, padding: '10px 0' }}>{lead.last_contact}</div>
              </div>
            </div>
            <div style={{ marginTop: 14 }}>
              <label style={labelStyle}>Notas internas</label>
              <textarea defaultValue={lead.notes} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
              <button style={{ fontFamily: "'Archivo Black', sans-serif", background: ZR.black, color: ZR.cream, padding: '10px 22px', borderRadius: 4, fontWeight: 900, fontSize: 11, border: 'none', cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                GUARDAR CAMBIOS
              </button>
            </div>
          </div>

          {/* Activity timeline */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// HISTORIAL</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: ZR.black }}>Actividad</div>
              </div>
              <button style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 10, color: ZR.orange, background: 'rgba(255,106,0,.08)', border: '1px solid rgba(255,106,0,.2)', padding: '6px 14px', borderRadius: 3, cursor: 'pointer', letterSpacing: '.04em', textTransform: 'uppercase' }}>
                + NOTA
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {DUMMY_NOTES.map((note, i) => (
                <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 18, position: 'relative' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 9999, background: ZR.orange, border: `2px solid ${ZR.cream2}`, zIndex: 1 }} />
                    {i < DUMMY_NOTES.length - 1 && <div style={{ width: 1.5, flex: 1, background: ZR.creamBorder, marginTop: 3 }} />}
                  </div>
                  <div style={{ flex: 1, paddingBottom: 4 }}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 5 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: ZR.black }}>{note.author}</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>{note.date}</span>
                    </div>
                    <div style={{ fontSize: 13, color: ZR.ink2, lineHeight: 1.5 }}>{note.text}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <input placeholder="Escribir una nota..." style={{ ...inputStyle, flex: 1 }} />
              <button style={{ background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, color: ZR.ink2, padding: '10px 16px', borderRadius: 4, fontSize: 13, cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
                Enviar
              </button>
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Stage */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 18 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// PIPELINE</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: ZR.black, marginBottom: 12 }}>Estado del lead</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {STAGE_OPTIONS.map((s) => (
                <button key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 12px', borderRadius: 4, background: s.id === lead.stage ? s.color + '12' : 'transparent', border: `1px solid ${s.id === lead.stage ? s.color + '55' : 'transparent'}`, cursor: 'pointer', textAlign: 'left' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 9999, background: s.id === lead.stage ? s.color : ZR.creamBorder, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: s.id === lead.stage ? s.color : ZR.ink3, fontWeight: s.id === lead.stage ? 700 : 400, fontFamily: "'Archivo', sans-serif" }}>{s.label}</span>
                  {s.id === lead.stage && <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: s.color, textTransform: 'uppercase', letterSpacing: '.08em' }}>actual</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, padding: 18 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 4 }}>// ACCIONES</div>
            <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 13, color: ZR.black, marginBottom: 12 }}>Contactar</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <a href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 4, background: 'rgba(37,211,102,.08)', border: '1px solid rgba(37,211,102,.2)', textDecoration: 'none' }}>
                <span style={{ fontSize: 14 }}>💬</span>
                <span style={{ fontSize: 12, color: '#25D366', fontWeight: 600, fontFamily: "'Archivo', sans-serif" }}>WhatsApp</span>
              </a>
              <a href={`tel:${lead.phone}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 4, background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, textDecoration: 'none' }}>
                <span style={{ fontSize: 14 }}>📞</span>
                <span style={{ fontSize: 12, color: ZR.ink2, fontFamily: "'Archivo', sans-serif" }}>Llamar</span>
              </a>
              <a href={`mailto:${lead.email}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 12px', borderRadius: 4, background: ZR.cream, border: `1px solid ${ZR.creamBorder}`, textDecoration: 'none' }}>
                <span style={{ fontSize: 14 }}>✉️</span>
                <span style={{ fontSize: 12, color: ZR.ink2, fontFamily: "'Archivo', sans-serif" }}>Email</span>
              </a>
            </div>
          </div>

          {/* Related property */}
          {relatedProp && (
            <div style={{ background: ZR.cream2, border: `1px solid ${ZR.creamBorder}`, borderRadius: 8, overflow: 'hidden' }}>
              <img src={relatedProp.images[0]} alt={relatedProp.title} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              <div style={{ padding: 16 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: ZR.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>// PROPIEDAD RELACIONADA</div>
                <div style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 14, color: ZR.orange, marginBottom: 3 }}>{relatedProp.currency} {relatedProp.price.toLocaleString('es-AR')}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: ZR.black, marginBottom: 8 }}>{relatedProp.title}</div>
                <Link href={`/${slug}/admin/propiedades/${relatedProp.id}`} style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: 10, color: ZR.orange, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  VER PROPIEDAD →
                </Link>
              </div>
            </div>
          )}

          {/* Danger zone */}
          <div style={{ background: ZR.cream2, border: '1px solid rgba(231,29,10,.15)', borderRadius: 8, padding: 16 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#E71D0A', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>// ZONA DE RIESGO</div>
            <button style={{ width: '100%', background: 'transparent', border: '1px solid rgba(231,29,10,.3)', color: '#E71D0A', padding: '9px', borderRadius: 4, fontSize: 12, cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
              Eliminar lead
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
