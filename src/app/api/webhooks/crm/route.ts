import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, contact, stage, plan_interest, mrr_potential, phone, city, notes, source } = body

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const lead = {
      id: `crm-${Date.now()}`,
      name,
      contact: contact ?? '',
      phone: phone ?? '',
      city: city ?? '',
      stage: stage ?? 'prospect',
      plan_interest: plan_interest ?? 'Profesional',
      mrr_potential: mrr_potential ?? 0,
      notes: notes ?? '',
      source: source ?? 'api',
      created_at: new Date().toISOString(),
    }

    // TODO: persist to Supabase table `crm_leads`
    // const supabase = await createClient()
    // await supabase.from('crm_leads').upsert(lead)

    console.log('[webhook/crm] Lead received:', lead)

    return NextResponse.json({ ok: true, lead }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/webhooks/crm',
    method: 'POST',
    description: 'Create or update a CRM lead. Used by AI agents to automate prospect management.',
    body: {
      name: 'string (required) — Agency or contact name',
      contact: 'string — Contact person',
      phone: 'string — Phone number',
      city: 'string — City',
      stage: 'prospect | contacted | demo | proposal | negotiation | client | churn_risk',
      plan_interest: 'Esencial | Profesional | A medida',
      mrr_potential: 'number — Monthly revenue potential in USD',
      notes: 'string — Internal notes',
      source: 'string — Lead source',
    },
    example: {
      name: 'Inmobiliaria Roca',
      contact: 'Martín Roca',
      stage: 'demo',
      plan_interest: 'Profesional',
      mrr_potential: 59,
      source: 'instagram',
    },
  })
}
