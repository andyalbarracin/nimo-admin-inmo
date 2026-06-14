'use server'

/*
 * Archivo : documents.ts
 * Ruta    : src/lib/agencies/documents.ts
 * Modif.  : 2026-06-13
 * Descripción: Documentos de la agencia (PDF de pagos, propuestas, presupuestos,
 *              contratos) en el bucket PRIVADO 'agency-docs'. Descargas vía signed
 *              URLs generadas con service_role. Solo superadmin. Solo server.
 */
import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { nanoid } from 'nanoid'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sb(): any { return createAdminClient() }
const rev = () => revalidatePath('/superadmin/agencias', 'layout')

export interface AgencyDocument {
  id: string
  kind: string
  title: string
  file_path: string
  amount: number | null
  currency: string | null
  created_at: string
}

export async function listDocuments(agencyId: string): Promise<AgencyDocument[]> {
  try {
    const { data } = await sb().from('agency_documents').select('*').eq('agency_id', agencyId).order('created_at', { ascending: false })
    return (data ?? []) as AgencyDocument[]
  } catch { return [] }
}

export async function uploadDocument(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  try {
    const agencyId = String(formData.get('agency_id') || '')
    const title = String(formData.get('title') || '').trim()
    const kind = String(formData.get('kind') || 'other')
    const amountRaw = String(formData.get('amount') || '')
    const currency = String(formData.get('currency') || '') || null
    const file = formData.get('file') as File | null
    if (!agencyId || !title || !file || file.size === 0) return { ok: false, error: 'Faltan datos (título y archivo).' }

    const admin = sb()
    const ext = (file.name.split('.').pop() || 'bin').toLowerCase()
    const path = `${agencyId}/${nanoid(10)}.${ext}`
    const buf = Buffer.from(await file.arrayBuffer())
    const { error: upErr } = await admin.storage.from('agency-docs').upload(path, buf, { contentType: file.type || undefined, upsert: false })
    if (upErr) return { ok: false, error: upErr.message }

    const { error } = await admin.from('agency_documents').insert({
      agency_id: agencyId, kind, title, file_path: path,
      amount: amountRaw ? Number(amountRaw) : null, currency,
    })
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

/** Signed URL temporal (5 min) para descargar/ver un documento. */
export async function getDocumentUrl(filePath: string): Promise<string | null> {
  try {
    const { data } = await sb().storage.from('agency-docs').createSignedUrl(filePath, 60 * 5)
    return data?.signedUrl ?? null
  } catch { return null }
}

export async function deleteDocument(id: string, filePath: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const admin = sb()
    await admin.storage.from('agency-docs').remove([filePath]).catch(() => {})
    const { error } = await admin.from('agency_documents').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    rev(); return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
