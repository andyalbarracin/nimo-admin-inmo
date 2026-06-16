'use server'

/*
 * Archivo : credentials.ts
 * Ruta    : src/lib/agencies/credentials.ts
 * Modif.  : 2026-06-13
 * Descripción: Credenciales/keys/URLs de la agencia. El secreto se cifra en el
 *              server (AES-256-GCM); la DB solo guarda el ciphertext. Se descifra
 *              on-demand (botón "ojo"). Solo superadmin. Solo server.
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { encryptSecret, decryptSecret } from '@/lib/crypto/secrets'
import { assertSuperAdmin } from '@/lib/auth/require-tenant'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }
const rev = () => revalidatePath('/superadmin/agencias', 'layout')

export interface AgencyCredential {
  id: string
  label: string
  kind: string
  url: string | null
  username: string | null
  has_secret: boolean
  created_at: string
}

export async function listCredentials(agencyId: string): Promise<AgencyCredential[]> {
  try {
    if (!(await assertSuperAdmin())) return []
    const { data } = await sb()
      .from('agency_credentials')
      .select('id,label,kind,url,username,secret_ciphertext,created_at')
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data ?? []).map((c: any) => ({
      id: c.id, label: c.label, kind: c.kind, url: c.url, username: c.username,
      has_secret: !!c.secret_ciphertext, created_at: (c.created_at ?? '').slice(0, 10),
    }))
  } catch { return [] }
}

export async function addCredential(input: {
  agency_id: string; label: string; kind: string; url?: string; username?: string; secret?: string
}): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertSuperAdmin())) return { ok: false, error: 'No autorizado.' }
    if (!input.agency_id || !input.label?.trim()) return { ok: false, error: 'Falta el label.' }
    const row = {
      agency_id: input.agency_id,
      label: input.label.trim(),
      kind: input.kind || 'other',
      url: input.url || null,
      username: input.username || null,
      secret_ciphertext: input.secret ? encryptSecret(input.secret) : null,
    }
    const { error } = await sb().from('agency_credentials').insert(row)
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

/** Descifra y devuelve el secreto (botón "ojo"). */
export async function revealCredential(id: string): Promise<{ ok: boolean; secret?: string; error?: string }> {
  try {
    if (!(await assertSuperAdmin())) return { ok: false, error: 'No autorizado.' }
    const { data } = await sb().from('agency_credentials').select('secret_ciphertext').eq('id', id).maybeSingle()
    if (!data?.secret_ciphertext) return { ok: true, secret: '' }
    return { ok: true, secret: decryptSecret(data.secret_ciphertext) }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function deleteCredential(id: string): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!(await assertSuperAdmin())) return { ok: false, error: 'No autorizado.' }
    const { error } = await sb().from('agency_credentials').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
