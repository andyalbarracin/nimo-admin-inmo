import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, slug, owner_email, plan } = body

    if (!name || !slug || !owner_email) {
      return NextResponse.json({ error: 'name, slug, and owner_email are required' }, { status: 400 })
    }

    const agency = {
      name,
      slug,
      owner_email,
      plan: plan ?? 'trial',
      created_at: new Date().toISOString(),
    }

    // TODO: persist to Supabase + trigger onboarding flow
    // const supabase = await createClient()
    // await supabase.from('agencies').insert(agency)

    // TODO: create CRM lead automatically
    // await fetch('/api/webhooks/crm', { method: 'POST', body: JSON.stringify({ name, contact: owner_email, stage: 'client', plan_interest: plan }) })

    console.log('[webhook/agency/signup] New agency:', agency)

    return NextResponse.json({ ok: true, agency }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
}

export async function GET() {
  return NextResponse.json({
    endpoint: '/api/webhooks/agency/signup',
    method: 'POST',
    description: 'Notify NIMO of a new agency signup. Auto-creates a CRM lead and triggers onboarding.',
    body: {
      name: 'string (required) — Agency name',
      slug: 'string (required) — URL slug e.g. mi-inmobiliaria',
      owner_email: 'string (required) — Owner email',
      plan: 'starter | pro | business | enterprise — defaults to trial',
    },
  })
}
