import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PROPERTIES } from '@/lib/dummy'
import PropertyMap from '@/components/properties/map-view'

export default async function PropertyDetail({
  params,
}: {
  params: Promise<{ slug: string; id: string }>
}) {
  const { slug, id } = await params
  const prop = PROPERTIES.find(p => p.id === id)
  if (!prop) notFound()

  const related = PROPERTIES.filter(p => p.id !== id && (p.neighborhood === prop.neighborhood || p.type === prop.type)).slice(0, 3)

  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      {/* NAV */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.07)', padding: '0 40px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href={`/${slug}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#FF6B6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'white' }}>L</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: 'white' }}>López & Asociados</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href={`/${slug}/propiedades`} style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, textDecoration: 'none' }}>← Volver</Link>
          <Link href={`/${slug}/contacto?prop=${prop.id}`} style={{ background: '#FF6B6B', color: 'white', padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Consultar</Link>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 40, alignItems: 'start' }}>
          {/* LEFT */}
          <div>
            {/* Breadcrumb */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, fontSize: 12, color: 'rgba(255,255,255,.35)' }}>
              <Link href={`/${slug}`} style={{ color: 'rgba(255,255,255,.35)', textDecoration: 'none' }}>Inicio</Link>
              <span>/</span>
              <Link href={`/${slug}/propiedades`} style={{ color: 'rgba(255,255,255,.35)', textDecoration: 'none' }}>Propiedades</Link>
              <span>/</span>
              <span style={{ color: 'rgba(255,255,255,.6)' }}>{prop.neighborhood}</span>
            </div>

            {/* Gallery */}
            <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 32 }}>
              <div style={{ height: 420, background: '#1A1A1A' }}>
                <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {prop.images.length > 1 && (
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${prop.images.length - 1}, 1fr)`, gap: 4, marginTop: 4 }}>
                  {prop.images.slice(1).map((img, i) => (
                    <div key={i} style={{ height: 140, background: '#1A1A1A' }}>
                      <img src={img} alt={`Foto ${i + 2}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Title + Price */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span style={{ background: prop.operation === 'venta' ? '#FF6B6B' : '#4ECDC4', color: '#000', padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{prop.operation}</span>
                <span style={{ background: '#1A1A1A', color: 'rgba(255,255,255,.6)', padding: '4px 12px', borderRadius: 999, fontSize: 12, border: '1px solid rgba(255,255,255,.1)' }}>{prop.type.charAt(0).toUpperCase() + prop.type.slice(1)}</span>
              </div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: 'white', margin: '0 0 8px', letterSpacing: '-.02em' }}>{prop.title}</h1>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,.4)' }}>📍 {prop.address} · {prop.neighborhood}, {prop.city}</div>
            </div>

            {/* Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
              {[
                prop.rooms && { label: 'Ambientes', value: prop.rooms },
                prop.covered_area && { label: 'Sup. cubierta', value: `${prop.covered_area}m²` },
                prop.total_area && { label: 'Sup. total', value: `${prop.total_area}m²` },
                prop.bathrooms && { label: 'Baños', value: prop.bathrooms },
              ].filter(Boolean).map((spec: any) => (
                <div key={spec.label} style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 4 }}>{spec.value}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,.4)' }}>{spec.label}</div>
                </div>
              ))}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 12 }}>Descripción</h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,.6)', lineHeight: 1.7 }}>{prop.description}</p>
            </div>

            {/* Features */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 16 }}>Características</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {prop.features.map((f) => (
                  <span key={f} style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,.1)', color: 'rgba(255,255,255,.7)', padding: '8px 16px', borderRadius: 999, fontSize: 13 }}>
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>

            {/* Map */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 16 }}>Ubicación</h2>
              <div style={{ borderRadius: 16, overflow: 'hidden', height: 360, border: '1px solid rgba(255,255,255,.1)' }}>
                <PropertyMap lat={prop.lat} lng={prop.lng} title={prop.title} />
              </div>
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 20 }}>Propiedades similares</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                  {related.map((r) => (
                    <Link key={r.id} href={`/${slug}/propiedades/${r.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ background: '#1A1A1A', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,.07)' }}>
                        <img src={r.images[0]} alt={r.title} style={{ width: '100%', height: 130, objectFit: 'cover' }} />
                        <div style={{ padding: 14 }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: '#FF6B6B', marginBottom: 4 }}>{r.currency} {r.price.toLocaleString('es-AR')}</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.6)', lineHeight: 1.3 }}>{r.title}</div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Sticky contact card */}
          <div style={{ position: 'sticky', top: 80 }}>
            <div style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,.1)', borderRadius: 20, padding: 28 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#FF6B6B', marginBottom: 4 }}>
                {prop.currency} {prop.price.toLocaleString('es-AR')}
                {prop.operation === 'alquiler' && <span style={{ fontSize: 16, fontWeight: 400, color: 'rgba(255,255,255,.4)' }}>/mes</span>}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 24 }}>
                {prop.operation === 'venta' ? 'Precio de venta' : 'Precio de alquiler mensual'}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                <Link href={`/${slug}/contacto?prop=${prop.id}`} style={{ display: 'block', background: '#FF6B6B', color: 'white', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
                  Consultar por esta propiedad
                </Link>
                <a href={`https://wa.me/5491145123456?text=Hola, me interesa la propiedad: ${prop.title}`} target="_blank" rel="noopener noreferrer" style={{ display: 'block', background: '#25D366', color: 'white', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: 'none', textAlign: 'center' }}>
                  WhatsApp
                </a>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 20 }}>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.08em' }}>Asesor a cargo</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 9999, background: '#FF6B6B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: 14 }}>
                    {prop.agent.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>{prop.agent}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)' }}>López & Asociados</div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 20, borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 16 }}>
                {[
                  { label: 'ID de propiedad', value: prop.id.replace('prop-', '#') },
                  { label: 'Publicado', value: new Date(prop.created_at).toLocaleDateString('es-AR') },
                  { label: 'Estado', value: prop.status === 'available' ? '✅ Disponible' : '🟡 Reservado' },
                ].map((item) => (
                  <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.35)' }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
