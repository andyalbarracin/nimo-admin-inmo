import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { agency_slug, name, email, phone, message, property_id, source } = body

    if (!agency_slug || !name) {
      return NextResponse.json({ error: 'agency_slug and name are required' }, { status: 400 })
    }

    const lead = {
      id: `lead-${Date.now()}`,
      agency_slug,
      name,
      email: email ?? '',
      phone: phone ?? '',
      message: message ?? '',
      property_id: property_id ?? null,
      source: source ?? 'api',
      stage: 'new',
      created_at: new Date().toISOString(),
    }

    // TODO: persist to Supabase table `leads`
    // const supabase = await createClient()
    // await supabase.from('leads').insert(lead)

    console.log('[webhook/lead] Lead received:', lead)

    return NextResponse.json({ ok: true, lead }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/webhooks/lead',
    method: 'POST',
    description: 'Receive inbound leads for an agency. Triggered by AI agents, contact forms, QR scans.',
    body: {
      agency_slug: 'string (required) — e.g. lopez-asociados',
      name: 'string (required) — Lead name',
      email: 'string — Lead email',
      phone: 'string — Lead phone',
      message: 'string — Lead message or inquiry',
      property_id: 'string | null — Related property ID',
      source: 'string — whatsapp | qr | form | api | ai-agent',
    },
    example: {
      agency_slug: 'lopez-asociados',
      name: 'Juan Pérez',
      email: 'juan@email.com',
      phone: '+54 9 11 1234-5678',
      message: 'Me interesa el departamento en Palermo',
      property_id: 'prop-001',
      source: 'ai-agent',
    },
  })
}
