import { renderToBuffer } from '@react-pdf/renderer'
import { AGENCIES } from '@/lib/dummy'
import { getPublicProperties } from '@/lib/properties/public'
import { PropertyDoc } from '@/lib/pdf/property-doc'

export const runtime = 'nodejs'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slug = new URL(req.url).searchParams.get('slug') ?? ''
  const agency = AGENCIES.find(a => a.slug === slug) ?? null
  const props = await getPublicProperties(slug)
  const property = props.find(p => p.id === id)
  if (!property) return new Response('Propiedad no encontrada', { status: 404 })

  const buffer = await renderToBuffer(PropertyDoc({ property, agency }))
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="ficha-${id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
