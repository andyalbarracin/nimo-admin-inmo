'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Property, TeamMember } from '@/lib/dummy'
import type { PropertyInput } from '@/lib/properties/server'
import { createProperty, updateProperty, deleteProperty } from '@/lib/properties/actions'
import { uploadPropertyImage } from '@/lib/properties/upload-action'

/* ============================================================
 * Admin · Propiedades — CRUD con persistencia real (Supabase).
 * Lee de la DB (server page) y escribe vía server actions; tras cada
 * mutación hace router.refresh() para re-leer. Las imágenes se suben al bucket
 * 'properties' (Storage) y se persisten en property_images. El agente aún no se
 * persiste (assigned_to uuid).
 * ============================================================ */

function toInput(p: Property): PropertyInput {
  return {
    title: p.title, type: p.type, operation: p.operation, status: p.status,
    price: Number(p.price) || 0, currency: p.currency,
    address: p.address, neighborhood: p.neighborhood, city: p.city,
    rooms: p.rooms, bathrooms: p.bathrooms, covered_area: p.covered_area, total_area: p.total_area,
    description: p.description, features: p.features, lat: p.lat, lng: p.lng,
    is_featured: p.is_featured, is_opportunity: !!p.is_opportunity,
    images: p.images,
  }
}

const LA = {
  bg: '#FAF7F2', cream: '#F4F0E8', white: '#FFFFFF', border: '#E8E2D8',
  ink: '#1A1A1A', ink2: '#4A4845', ink3: '#9A9590',
  coral: '#FF6B6B', coralSoft: '#FFE5DB', green: '#2D7D5F', danger: '#C0392B',
  sans: 'var(--font-sans), system-ui, sans-serif',
  mono: "var(--font-mono), ui-monospace, monospace",
}

// Tipos válidos en la DB (el CHECK no permite 'loft').
const TYPES: Property['type'][] = ['departamento', 'casa', 'ph', 'local', 'terreno']
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80&auto=format&fit=crop'

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  available: { bg: 'rgba(45,125,95,.1)', color: '#2D7D5F', label: 'Disponible' },
  reserved: { bg: 'rgba(212,160,23,.12)', color: '#A07C0A', label: 'Reservada' },
  sold: { bg: 'rgba(154,149,144,.12)', color: '#6A6A64', label: 'Vendida/Alq.' },
}

type Filter = 'todas' | 'venta' | 'alquiler' | 'destacadas' | 'reservadas'
const FILTERS: { id: Filter; label: string }[] = [
  { id: 'todas', label: 'Todas' }, { id: 'venta', label: 'En venta' }, { id: 'alquiler', label: 'En alquiler' },
  { id: 'destacadas', label: 'Destacadas' }, { id: 'reservadas', label: 'Reservadas' },
]

function emptyProperty(): Property {
  return {
    id: `prop-${Date.now()}`, title: '', type: 'departamento', operation: 'venta',
    price: 0, currency: 'USD', address: '', neighborhood: '', city: 'Buenos Aires',
    rooms: null, bathrooms: null, covered_area: null, total_area: null,
    description: '', features: [], images: [DEFAULT_IMG], lat: -34.6037, lng: -58.3816,
    is_featured: false, is_opportunity: false, status: 'available', agent: '',
    created_at: new Date().toISOString().slice(0, 10),
  }
}

interface Props { slug: string; initialProperties: Property[]; team: TeamMember[]; openNew?: boolean }

export default function PropiedadesAdmin({ slug, initialProperties, team, openNew }: Props) {
  const router = useRouter()
  const [filter, setFilter] = useState<Filter>('todas')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Property | null>(() => openNew ? emptyProperty() : null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => initialProperties.filter(p => {
    if (filter === 'venta' && p.operation !== 'venta') return false
    if (filter === 'alquiler' && p.operation !== 'alquiler') return false
    if (filter === 'destacadas' && !p.is_featured) return false
    if (filter === 'reservadas' && p.status !== 'reserved') return false
    if (query && !`${p.title} ${p.neighborhood} ${p.city}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [initialProperties, filter, query])

  const upsert = async (p: Property) => {
    setSaving(true)
    const isNew = !initialProperties.some(x => x.id === p.id)
    const res = isNew ? await createProperty(slug, toInput(p)) : await updateProperty(slug, p.id, toInput(p))
    setSaving(false)
    if (!res.ok) { alert('No se pudo guardar: ' + (res.error ?? 'error')); return }
    setEditing(null)
    router.refresh()
  }
  const remove = async (id: string) => {
    const res = await deleteProperty(slug, id)
    if (!res.ok) { alert('No se pudo eliminar: ' + (res.error ?? 'error')); return }
    setEditing(null)
    router.refresh()
  }

  return (
    <div style={{ padding: '0 0 40px', minHeight: '100vh', background: LA.bg, fontFamily: LA.sans, color: LA.ink }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', borderBottom: `1px solid ${LA.border}`, gap: 24, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: LA.mono, fontSize: 11, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 6 }}>Panel · {slug}</div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.02em', margin: 0 }}>Propiedades</h1>
          <p style={{ fontSize: 13, color: LA.ink2, margin: '4px 0 0' }}>{initialProperties.length} en total · {initialProperties.filter(p => p.status === 'available').length} disponibles</p>
        </div>
        <button onClick={() => setEditing(emptyProperty())} style={{ background: 'var(--admin-accent, #FF6B6B)', color: LA.white, padding: '11px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer' }}>+ Nueva propiedad</button>
      </header>

      <div style={{ padding: '24px 40px' }}>
        {/* Filters + search */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 600, background: filter === f.id ? 'var(--admin-accent, #FF6B6B)' : LA.white, color: filter === f.id ? LA.white : LA.ink2, border: `1px solid ${filter === f.id ? 'var(--admin-accent, #FF6B6B)' : LA.border}`, cursor: 'pointer', fontFamily: 'inherit' }}>{f.label}</button>
          ))}
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar propiedad…" style={{ marginLeft: 'auto', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: '8px 14px', color: LA.ink, fontSize: 13, outline: 'none', width: 220, fontFamily: 'inherit' }} />
        </div>

        {/* Table */}
        <div style={{ background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.1fr 110px 120px 96px', padding: '12px 20px', borderBottom: `1px solid ${LA.border}`, fontFamily: LA.mono, fontSize: 10, fontWeight: 600, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            <div>Propiedad</div><div>Precio</div><div>Ubicación</div><div>Operación</div><div>Estado</div><div>Acciones</div>
          </div>
          {filtered.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: LA.ink3, fontSize: 13 }}>No hay propiedades con ese filtro.</div>}
          {filtered.map((prop, i) => {
            const st = STATUS_STYLES[prop.status] ?? STATUS_STYLES.available!
            return (
              <div key={prop.id} style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.1fr 110px 120px 96px', padding: '14px 20px', borderTop: i > 0 ? `1px solid ${LA.border}` : 'none', alignItems: 'center' }}>
                <button onClick={() => setEditing(prop)} className="coral-row" style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '4px', borderRadius: 10, minWidth: 0 }}>
                  <img src={prop.images[0] ?? DEFAULT_IMG} alt={prop.title} style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: LA.ink, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prop.title || 'Sin título'}</span>
                      {prop.is_featured && <span title="Destacada" style={{ color: 'var(--admin-accent, #FF6B6B)', fontSize: 11 }}>★</span>}
                      {prop.is_opportunity && <span style={{ fontFamily: LA.mono, fontSize: 8, background: '#1F4DD6', color: '#fff', padding: '1px 5px', borderRadius: 3 }}>OPORT.</span>}
                    </div>
                    <div style={{ fontFamily: LA.mono, fontSize: 9.5, fontWeight: 500, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.06em', marginTop: 3 }}>{prop.type} · {prop.rooms ? `${prop.rooms} amb.` : `${prop.total_area ?? '—'}m²`}</div>
                  </div>
                </button>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--admin-accent, #FF6B6B)', letterSpacing: '-.01em' }}>{prop.currency} {prop.price.toLocaleString('es-AR')}{prop.operation === 'alquiler' && <span style={{ fontSize: 10, color: LA.ink3, fontWeight: 400 }}>/mes</span>}</div>
                <div><div style={{ fontSize: 12.5, color: LA.ink }}>{prop.neighborhood || '—'}</div><div style={{ fontSize: 11, color: LA.ink3 }}>{prop.city}</div></div>
                <span style={{ fontSize: 11, fontWeight: 600, background: prop.operation === 'venta' ? 'rgba(26,26,26,.07)' : 'color-mix(in srgb, var(--admin-accent, #FF6B6B) 16%, transparent)', color: prop.operation === 'venta' ? LA.ink2 : 'var(--admin-accent, #FF6B6B)', padding: '4px 10px', borderRadius: 999, display: 'inline-block', textTransform: 'capitalize' }}>{prop.operation}</span>
                <span style={{ fontSize: 11, fontWeight: 600, background: st.bg, color: st.color, padding: '4px 10px', borderRadius: 999, display: 'inline-block' }}>{st.label}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setEditing(prop)} style={{ fontSize: 12, color: LA.ink2, padding: '6px 10px', background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Editar</button>
                  <Link href={`/${slug}/propiedades/${prop.id}`} target="_blank" style={{ fontSize: 12, color: LA.ink3, textDecoration: 'none', padding: '6px 10px', background: LA.bg, border: `1px solid ${LA.border}`, borderRadius: 8 }}>Ver</Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {editing && (
        <PropertyDrawer property={editing} team={team} slug={slug} isNew={!initialProperties.some(p => p.id === editing.id)} saving={saving} onSave={upsert} onDelete={remove} onClose={() => setEditing(null)} />
      )}
    </div>
  )
}

/* ─── Drawer alta/edición ───────────────────────────────── */
function PropertyDrawer({ property, team, slug, isNew, saving, onSave, onDelete, onClose }: {
  property: Property; team: TeamMember[]; slug: string; isNew: boolean; saving: boolean
  onSave: (p: Property) => void; onDelete: (id: string) => void; onClose: () => void
}) {
  const [form, setForm] = useState<Property>(property)
  const [featuresText, setFeaturesText] = useState(property.features.join(', '))
  const [uploading, setUploading] = useState(false)
  const [uploadErr, setUploadErr] = useState('')
  const set = <K extends keyof Property>(k: K, v: Property[K]) => setForm(f => ({ ...f, [k]: v }))
  const num = (v: string): number | null => v === '' ? null : Number(v)

  // La galería arranca sin la imagen unsplash de demo: solo lo que suba el usuario.
  const gallery = form.images.filter(u => u && u !== DEFAULT_IMG)

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return
    setUploading(true); setUploadErr('')
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const fd = new FormData(); fd.append('file', file)
      const res = await uploadPropertyImage(slug, fd)
      if (res.ok && res.url) urls.push(res.url)
      else setUploadErr(res.error ?? 'No se pudo subir una imagen')
    }
    if (urls.length) setForm(f => ({ ...f, images: [...f.images.filter(u => u && u !== DEFAULT_IMG), ...urls] }))
    setUploading(false)
  }
  const removeImage = (url: string) => setForm(f => ({ ...f, images: f.images.filter(u => u !== url) }))
  const makeCover = (url: string) => setForm(f => ({ ...f, images: [url, ...f.images.filter(u => u !== url)] }))

  const field: React.CSSProperties = { width: '100%', background: LA.white, border: `1px solid ${LA.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 13.5, color: LA.ink, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }
  const label: React.CSSProperties = { fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 6, display: 'block' }

  const save = () => onSave({ ...form, price: Number(form.price) || 0, features: featuresText.split(',').map(s => s.trim()).filter(Boolean), images: gallery })

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(26,26,26,.3)', zIndex: 300 }} />
      <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, width: 'min(500px, 100vw)', background: LA.bg, borderLeft: `1px solid ${LA.border}`, zIndex: 301, display: 'flex', flexDirection: 'column', fontFamily: LA.sans }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${LA.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: LA.white }}>
          <div>
            <div style={{ fontFamily: LA.mono, fontSize: 10, color: 'var(--admin-accent, #FF6B6B)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{isNew ? 'Nueva propiedad' : 'Editar propiedad'}</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0 0', letterSpacing: '-.01em' }}>{form.title || 'Sin título'}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: LA.ink3, fontSize: 24, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Galería — Supabase Storage (bucket 'properties') */}
          <div>
            <label style={label}>Fotos</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {gallery.map((url, i) => (
                <div key={url} style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 10, overflow: 'hidden', border: `1px solid ${LA.border}` }}>
                  <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {i === 0 && <span style={{ position: 'absolute', top: 6, left: 6, fontFamily: LA.mono, fontSize: 8, fontWeight: 700, background: 'var(--admin-accent, #FF6B6B)', color: '#fff', padding: '2px 6px', borderRadius: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>Portada</span>}
                  {i !== 0 && <button type="button" onClick={() => makeCover(url)} title="Usar como portada" style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,.55)', color: '#fff', border: 'none', borderRadius: 5, fontSize: 9, padding: '2px 6px', cursor: 'pointer', fontFamily: LA.mono }}>★ portada</button>}
                  <button type="button" onClick={() => removeImage(url)} title="Quitar" style={{ position: 'absolute', top: 6, right: 6, width: 20, height: 20, borderRadius: 99, background: 'rgba(0,0,0,.6)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13, lineHeight: 1, display: 'grid', placeItems: 'center' }}>×</button>
                </div>
              ))}
              <label style={{ aspectRatio: '4/3', borderRadius: 10, border: `1px dashed ${LA.border}`, background: LA.white, display: 'grid', placeItems: 'center', cursor: uploading ? 'wait' : 'pointer', textAlign: 'center', padding: 8 }}>
                <input type="file" accept="image/*" multiple disabled={uploading} onChange={e => { addFiles(e.target.files); e.target.value = '' }} style={{ display: 'none' }} />
                <span style={{ fontSize: 11, color: LA.ink3, fontWeight: 600, lineHeight: 1.4 }}>{uploading ? 'Subiendo…' : (gallery.length ? '+ Agregar' : '+ Subir fotos')}</span>
              </label>
            </div>
            {uploadErr && <div style={{ fontSize: 11, color: LA.danger, marginTop: 6 }}>{uploadErr}</div>}
            {gallery.length === 0 && !uploadErr && <div style={{ fontSize: 11, color: LA.ink3, marginTop: 6 }}>Sin fotos propias — se muestra una imagen de muestra en el sitio.</div>}
          </div>

          <div><label style={label}>Título</label><input style={field} value={form.title} onChange={e => set('title', e.target.value)} placeholder="Ej: Depto 2 amb con balcón" /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={label}>Tipo</label><select style={field} value={form.type} onChange={e => set('type', e.target.value as Property['type'])}>{TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select></div>
            <div><label style={label}>Operación</label><select style={field} value={form.operation} onChange={e => set('operation', e.target.value as Property['operation'])}><option value="venta">Venta</option><option value="alquiler">Alquiler</option></select></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 12 }}>
            <div><label style={label}>Precio</label><input style={field} type="number" value={form.price || ''} onChange={e => set('price', Number(e.target.value))} /></div>
            <div><label style={label}>Moneda</label><select style={field} value={form.currency} onChange={e => set('currency', e.target.value as 'USD' | 'ARS')}><option value="USD">USD</option><option value="ARS">ARS</option></select></div>
            <div><label style={label}>Estado</label><select style={field} value={form.status} onChange={e => set('status', e.target.value as Property['status'])}><option value="available">Disponible</option><option value="reserved">Reservada</option><option value="sold">Vendida/Alq.</option></select></div>
          </div>

          <div style={{ borderTop: `1px solid ${LA.border}`, paddingTop: 16 }}>
            <div style={{ fontFamily: LA.mono, fontSize: 9.5, color: LA.ink3, textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 12 }}>// Ubicación</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div><label style={label}>Dirección</label><input style={field} value={form.address} onChange={e => set('address', e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={label}>Barrio</label><input style={field} value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} /></div>
                <div><label style={label}>Ciudad</label><input style={field} value={form.city} onChange={e => set('city', e.target.value)} /></div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, borderTop: `1px solid ${LA.border}`, paddingTop: 16 }}>
            <div><label style={label}>Amb.</label><input style={field} type="number" value={form.rooms ?? ''} onChange={e => set('rooms', num(e.target.value))} /></div>
            <div><label style={label}>Baños</label><input style={field} type="number" value={form.bathrooms ?? ''} onChange={e => set('bathrooms', num(e.target.value))} /></div>
            <div><label style={label}>Cub. m²</label><input style={field} type="number" value={form.covered_area ?? ''} onChange={e => set('covered_area', num(e.target.value))} /></div>
            <div><label style={label}>Tot. m²</label><input style={field} type="number" value={form.total_area ?? ''} onChange={e => set('total_area', num(e.target.value))} /></div>
          </div>

          <div><label style={label}>Descripción</label><textarea style={{ ...field, resize: 'vertical', minHeight: 90 }} value={form.description} onChange={e => set('description', e.target.value)} /></div>
          <div><label style={label}>Características (separadas por coma)</label><input style={field} value={featuresText} onChange={e => setFeaturesText(e.target.value)} placeholder="Balcón, Cocina equipada, Luminoso" /></div>

          <div><label style={label}>Agente asignado</label><select style={field} value={form.agent} onChange={e => set('agent', e.target.value)}><option value="">Sin asignar</option>{team.map(m => <option key={m.id} value={m.name}>{m.name}</option>)}</select></div>

          <div style={{ display: 'flex', gap: 20, borderTop: `1px solid ${LA.border}`, paddingTop: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: LA.ink2, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} /> ★ Destacada
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: LA.ink2, cursor: 'pointer' }}>
              <input type="checkbox" checked={!!form.is_opportunity} onChange={e => set('is_opportunity', e.target.checked)} /> Oportunidad
            </label>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${LA.border}`, background: LA.white, display: 'flex', gap: 10, alignItems: 'center' }}>
          {!isNew && <button onClick={() => onDelete(form.id)} style={{ background: 'none', border: `1px solid ${LA.border}`, color: LA.danger, padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Eliminar</button>}
          {!isNew && <a href={`/api/pdf/propiedad/${form.id}?slug=${slug}`} target="_blank" rel="noreferrer" style={{ background: LA.white, border: `1px solid ${LA.border}`, color: LA.ink2, padding: '11px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Ficha PDF ↓</a>}
          <button onClick={onClose} style={{ marginLeft: 'auto', background: LA.white, border: `1px solid ${LA.border}`, color: LA.ink2, padding: '11px 18px', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Cancelar</button>
          <button onClick={save} disabled={!form.title.trim() || saving} style={{ background: form.title.trim() && !saving ? 'var(--admin-accent, #FF6B6B)' : LA.border, color: form.title.trim() && !saving ? LA.white : LA.ink3, border: 'none', padding: '11px 22px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: form.title.trim() && !saving ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>{saving ? 'Guardando…' : isNew ? 'Crear propiedad' : 'Guardar cambios'}</button>
        </div>
      </div>
    </>
  )
}
