import { cookies } from 'next/headers'

export type DemoRole = 'superadmin' | 'owner' | 'agent' | null

export async function getDemoRole(): Promise<DemoRole> {
  const store = await cookies()
  const role = store.get('nimo_demo_role')?.value
  if (role === 'superadmin' || role === 'owner' || role === 'agent') return role
  return null
}

export async function isDemoMode(): Promise<boolean> {
  return (await getDemoRole()) !== null
}
