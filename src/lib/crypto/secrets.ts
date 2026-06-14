/*
 * Archivo : secrets.ts
 * Ruta    : src/lib/crypto/secrets.ts
 * Modif.  : 2026-06-13
 * Descripción: Cifrado/descifrado simétrico (AES-256-GCM) para secretos de
 *              credenciales de agencias. La key vive en la env
 *              CREDENTIALS_ENCRYPTION_KEY (32 bytes / 64 hex) — NUNCA en la DB.
 *              La base de datos solo almacena el ciphertext "iv:tag:data" (base64).
 *              SOLO server-side.
 */
import crypto from 'node:crypto'

const ALGO = 'aes-256-gcm'

function getKey(): Buffer {
  const raw = process.env.CREDENTIALS_ENCRYPTION_KEY
  if (!raw) {
    throw new Error(
      'CREDENTIALS_ENCRYPTION_KEY no está configurada. Generala con: openssl rand -hex 32',
    )
  }
  // Acepta 64 hex (32 bytes) o base64.
  const key = raw.length === 64 ? Buffer.from(raw, 'hex') : Buffer.from(raw, 'base64')
  if (key.length !== 32) {
    throw new Error('CREDENTIALS_ENCRYPTION_KEY debe ser de 32 bytes (64 caracteres hex).')
  }
  return key
}

/** Cifra un texto plano. Devuelve "iv:tag:data" en base64. */
export function encryptSecret(plain: string): string {
  const iv = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv)
  const enc = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return [iv.toString('base64'), tag.toString('base64'), enc.toString('base64')].join(':')
}

/** Descifra un payload "iv:tag:data" producido por encryptSecret. */
export function decryptSecret(payload: string): string {
  const [ivb, tagb, datab] = payload.split(':')
  if (!ivb || !tagb || !datab) throw new Error('Ciphertext inválido.')
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivb, 'base64'))
  decipher.setAuthTag(Buffer.from(tagb, 'base64'))
  return Buffer.concat([decipher.update(Buffer.from(datab, 'base64')), decipher.final()]).toString('utf8')
}
