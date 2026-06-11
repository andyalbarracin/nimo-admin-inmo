import { renderToBuffer } from '@react-pdf/renderer'
import { AGENCIES } from '@/lib/dummy'
import { listLeadsForAgency } from '@/lib/leads/server'
import { LeadDoc } from '@/lib/pdf/lead-doc'

export const runtime = 'nodejs'

// NOTA: el lead tiene PII. En producción gatear con requireTenantMember(slug).
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const slug = new URL(req.url).searchParams.get('slug') ?? ''
  const agency = AGENCIES.find(a => a.slug === slug) ?? null
  const leads = await listLeadsForAgency(slug)
  const lead = leads.find(l => l.id === id)
  if (!lead) return new Response('Lead no encontrado', { status: 404 })

  const buffer = await renderToBuffer(LeadDoc({ lead, agency }))
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="lead-${id}.pdf"`,
      'Cache-Control': 'no-store',
    },
  })
}
