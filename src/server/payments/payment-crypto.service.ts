import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto'
import { env } from '#/config/env.server.ts'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

/**
 * Dedicated key for payment metadata encryption, so that rotating the auth
 * secret (or its compromise) does not expose donor PII. Falls back to the
 * auth secret outside of production.
 *
 * The key is derived once at module load. Rotating `PAYMENT_ENCRYPTION_KEY`
 * (or the `BETTER_AUTH_SECRET` fallback) makes every previously encrypted row
 * undecryptable: the donation handler would fail and the payment would be left
 * stuck retrying. Only rotate during a planned maintenance window, after
 * re-encrypting existing rows with the new key.
 */
const encryptionKey = createHash('sha256')
  .update(env.PAYMENT_ENCRYPTION_KEY ?? env.BETTER_AUTH_SECRET)
  .digest()

/**
 * Encrypt a JSON-serializable value with AES-256-GCM so personal donor data
 * never rests in the database in plaintext.
 */
export function encryptMetadata<T>(value: T): string {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, encryptionKey, iv)
  const encrypted = Buffer.concat([
    cipher.update(JSON.stringify(value), 'utf8'),
    cipher.final(),
  ])

  return JSON.stringify({
    iv: iv.toString('base64'),
    tag: cipher.getAuthTag().toString('base64'),
    data: encrypted.toString('base64'),
  })
}

export function decryptMetadata<T>(payload: string): T {
  const { iv, tag, data } = JSON.parse(payload) as { iv: string; tag: string; data: string }

  const decipher = createDecipheriv(ALGORITHM, encryptionKey, Buffer.from(iv, 'base64'))
  decipher.setAuthTag(Buffer.from(tag, 'base64'))

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'base64')),
    decipher.final(),
  ])

  return JSON.parse(decrypted.toString('utf8')) as T
}
