import { renderToBuffer } from '@react-pdf/renderer'
import { AGENCIES } from '@/lib/dummy'
import { getPublicProperties } from '@/lib/properties/public'
import { PropertyDoc } from '@/lib/pdf/property-doc'

export const runtime = 'nodejs'

/** Baja una imagen y la convierte a data-URI. Devuelve null si falla (no rompe el PDF). */
async function toDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const ct = res.headers.get('content-type') || 'image/jpeg'
    if (!ct.startsWith('image/')) return null
    const buf = Buffer.from(await res.arrayBuffer())
    if (buf.length > 4_000_000) return null // evita PDFs enormes
    return `data:${ct};base64,${buf.toString('base64')}`
  } catch {
    return null
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slug = new URL(req.url).searchParams.get('slug') ?? ''
  const agency = AGENCIES.find(a => a.slug === slug) ?? null
  const props = await getPublicProperties(slug)
  const property = props.find(p => p.id === id)
  if (!property) return new Response('Propiedad no encontrada', { status: 404 })

  // Hasta 3 fotos embebidas (igual que el detalle público muestra algunas).
  const candidates = (property.images ?? []).filter(u => /^https?:\/\//.test(u)).slice(0, 3)
  const photos = (await Promise.all(candidates.map(toDataUri))).filter((x): x is string => !!x)

  const buffer = await renderToBuffer(PropertyDoc({ property, agency, photos }))
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="ficha-${id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
