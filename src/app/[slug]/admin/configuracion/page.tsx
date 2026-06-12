import { notFound } from 'next/navigation'
import { AGENCIES } from '@/lib/dummy'
import { createAdminClient } from '@/lib/supabase/admin'
import ConfiguracionAdmin from '@/components/admin/configuracion-admin'

export const dynamic = 'force-dynamic'

export default async function ConfiguracionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const agency = AGENCIES.find(a => a.slug === slug)
  if (!agency) notFound()

  // Logo persistido en la DB (si la agencia existe ahí)
  let initialLogo = ''
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sb = createAdminClient() as any
    const { data } = await sb.from('agencies').select('logo_url').eq('slug', slug).maybeSingle()
    initialLogo = data?.logo_url ?? ''
  } catch {
    // sin DB → sin logo persistido
  }

  return <ConfiguracionAdmin agency={agency} initialLogo={initialLogo} />
}
