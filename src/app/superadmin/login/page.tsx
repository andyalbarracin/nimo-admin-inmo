import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SuperadminLoginClient from '@/components/auth/superadmin-login-client'

export default async function SuperAdminLoginPage() {
  // Try Supabase — graceful fallback if not connected
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) redirect('/superadmin')
  } catch {
    // Demo mode — continue to show login
  }

  return <SuperadminLoginClient />
}
