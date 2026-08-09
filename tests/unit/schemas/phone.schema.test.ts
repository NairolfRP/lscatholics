import { describe, expect, it } from 'vitest'
import { optionalPhoneSchema, phoneSchema } from '#shared/schemas/phone.schema.ts'

describe('phoneSchema', () => {
  it('accepts a valid phone number', () => {
    expect(phoneSchema.parse('12345678')).toBe('12345678')
  })

  it('trims surrounding whitespace', () => {
    expect(phoneSchema.parse(' 1234567 ')).toBe('1234567')
  })

  it('rejects a missing phone number', () => {
    expect(() => phoneSchema.parse(undefined)).toThrow('Le numéro de téléphone est requis.')
  })

  it('rejects a phone number with fewer than 3 digits', () => {
    expect(() => phoneSchema.parse('12')).toThrow(
      'Le numéro doit contenir entre 3 et 8 chiffres.'
    )
  })

  it('rejects a phone number with more than 8 digits', () => {
    expect(() => phoneSchema.parse('123456789')).toThrow(
      'Le numéro doit contenir entre 3 et 8 chiffres.'
    )
  })

  it('rejects a phone number containing spaces or non-digits', () => {
    expect(() => phoneSchema.parse('123 456')).toThrow(
      'Le numéro doit contenir entre 3 et 8 chiffres.'
    )
  })
})

describe('optionalPhoneSchema', () => {
  it('normalizes an empty string to undefined', () => {
    expect(optionalPhoneSchema.parse('')).toBeUndefined()
  })

  it('normalizes a missing value to undefined', () => {
    expect(optionalPhoneSchema.parse(undefined)).toBeUndefined()
  })

  it('keeps a valid phone number', () => {
    expect(optionalPhoneSchema.parse('12345678')).toBe('12345678')
  })

  it('still rejects an invalid phone number', () => {
    expect(() => optionalPhoneSchema.parse('12')).toThrow(
      'Le numéro doit contenir entre 3 et 8 chiffres.'
    )
  })
})
