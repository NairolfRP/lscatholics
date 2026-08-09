import { describe, expect, it } from 'vitest'
import { addressSchema, districtSchema } from '#shared/schemas/location.schema.ts'

describe('addressSchema', () => {
  it('trims and returns a valid address', () => {
    expect(addressSchema().parse('  12 Ginger Street  ')).toBe('12 Ginger Street')
  })

  it('rejects a missing address', () => {
    expect(() => addressSchema().parse(undefined)).toThrow("L'adresse est requise.")
  })

  it('rejects an address shorter than 10 characters', () => {
    expect(() => addressSchema().parse('Ginger St')).toThrow(
      "L'adresse doit contenir au minimum 10 caractères."
    )
  })

  it('rejects an address longer than the default maximum', () => {
    expect(() => addressSchema().parse('a'.repeat(61))).toThrow(
      "L'adresse ne peut pas dépasser 60 caractères."
    )
  })

  it('accepts a custom maximum length', () => {
    expect(() => addressSchema(20).parse('a'.repeat(21))).toThrow(
      "L'adresse ne peut pas dépasser 20 caractères."
    )
  })
})

describe('districtSchema', () => {
  const schema = districtSchema(['little_seoul', 'downtown_los_santos'], 'quartier')

  it('accepts a known district', () => {
    expect(schema.parse('little_seoul')).toBe('little_seoul')
  })

  it('rejects a missing district', () => {
    expect(() => schema.parse(undefined)).toThrow('Le quartier est requis.')
  })

  it('rejects an unknown district', () => {
    expect(() => schema.parse('atlantis')).toThrow('Sélectionnez un quartier valide.')
  })

  it('uses the provided label in the required message', () => {
    const custom = districtSchema(['downtown_los_santos'], 'district')
    expect(() => custom.parse(undefined)).toThrow('Le district est requis.')
  })
})
