import { describe, expect, it } from 'vitest'
import { decryptMetadata, encryptMetadata } from '#server/payments/payment-crypto.service.ts'

interface SamplePayload {
  amount: number
  firstname: string
  lastname: string
  age?: number
}

describe('payment-crypto.service', () => {
  it('round-trips an encrypted value through decryptMetadata', () => {
    const payload: SamplePayload = {
      amount: 500,
      firstname: 'Jean',
      lastname: 'Valjean',
      age: 46,
    }

    const encrypted = encryptMetadata(payload)
    const decrypted = decryptMetadata<SamplePayload>(encrypted)

    expect(decrypted).toEqual(payload)
  })

  it('produces a different ciphertext for the same value (random IV)', () => {
    const payload = { firstname: 'Jean', lastname: 'Valjean' }

    const first = encryptMetadata(payload)
    const second = encryptMetadata(payload)

    expect(first).not.toBe(second)
  })

  it('does not store the plaintext in the encrypted payload', () => {
    const encrypted = encryptMetadata({ firstname: 'Jean', amount: 500 })

    expect(encrypted).not.toContain('Jean')
    expect(encrypted).not.toContain('500')
  })

  it('throws when the payload has been tampered with', () => {
    const encrypted = encryptMetadata({ firstname: 'Jean', amount: 500 })
    const payload = JSON.parse(encrypted) as { iv: string; tag: string; data: string }
    const tampered = JSON.stringify({
      ...payload,
      data: Buffer.from('tampered').toString('base64'),
    })

    expect(() => decryptMetadata(tampered)).toThrow()
  })

  it('throws on an invalid payload', () => {
    expect(() => decryptMetadata('not-json')).toThrow()
    expect(() => decryptMetadata(JSON.stringify({ iv: 'x' }))).toThrow()
  })
})
