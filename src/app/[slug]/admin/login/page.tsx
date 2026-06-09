import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AgencyLoginClient from '@/components/auth/agency-login-client'
import { AGENCIES } from '@/lib/dummy'

interface Params {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ redirect?: string }>
}

export default async function TenantAdminLoginPage({ params, searchParams }: Params) {
  const { slug } = await params
  const { redirect: redirectParam } = await searchParams

  const redirectTo = redirectParam ?? `/${slug}/admin`

  // Try Supabase — if it fails (no connection / demo mode) continue gracefully
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect(redirectTo)
  } catch {
    // Supabase not available — demo mode, continue
  }

  // Agency name: try Supabase, fall back to dummy data
  let agencyName = 'Panel de agencia'
  try {
    const supabase = await createClient()
    const { data: agency } = await supabase
      .from('agencies')
      .select('name')
      .eq('slug', slug)
      .single()
    if (agency?.name) agencyName = agency.name
  } catch {
    // Fall back to dummy
    const dummy = AGENCIES.find(a => a.slug === slug)
    agencyName = dummy?.name ?? slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  const showDemo = slug === 'lopez-asociados'

  return (
    <AgencyLoginClient
      slug={slug}
      agencyName={agencyName}
      redirectTo={redirectTo}
      showDemo={showDemo}
    />
  )
}
