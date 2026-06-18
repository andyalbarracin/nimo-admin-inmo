/*
 * Archivo : page.tsx
 * Ruta    : src/app/[slug]/admin/perfil/page.tsx
 * Modif.  : 2026-06-17
 * Descripción: Perfil y configuración del usuario del panel de agencia.
 */
import { redirect } from 'next/navigation'
import { guardAgencyAccess } from '@/lib/auth/require-tenant'
import { getAdminUser } from '@/lib/auth/current-user'
import PerfilClient from '@/components/admin/perfil-client'

export const dynamic = 'force-dynamic'

export default async function PerfilPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await guardAgencyAccess(slug)
  const user = await getAdminUser(slug)
  // El superadmin no tiene perfil de agencia → al panel.
  if (!user || user.isSuperadmin) redirect(`/${slug}/admin`)
  return <PerfilClient slug={slug} initialName={user.name} email={user.email} role={user.role} />
}
