import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import {
  emptyToNull,
  looseObjectSchema,
  optionalEnumSchema,
  optionalShortTextSchema,
} from '#shared/schemas/utils.schema.ts'

describe('looseObjectSchema', () => {
  it('accepts any object shape', () => {
    expect(looseObjectSchema.parse({ foo: 'bar', n: 42 })).toEqual({ foo: 'bar', n: 42 })
  })
})

describe('emptyToNull', () => {
  const schema = emptyToNull(z.string())

  it('keeps non-empty values', () => {
    expect(schema.parse('value')).toBe('value')
  })

  it('turns empty strings into null', () => {
    expect(schema.parse('')).toBeNull()
  })

  it('turns missing values into null', () => {
    expect(schema.parse(undefined)).toBeNull()
  })

  it('keeps null as null', () => {
    expect(schema.parse(null)).toBeNull()
  })
})

describe('optionalEnumSchema', () => {
  const values = ['a', 'b', 'c'] as const
  const schema = optionalEnumSchema(values)

  it('keeps a valid enum value', () => {
    expect(schema.parse('a')).toBe('a')
  })

  it('normalizes an empty string to undefined', () => {
    expect(schema.parse('')).toBeUndefined()
  })

  it('normalizes a missing value to undefined', () => {
    expect(schema.parse(undefined)).toBeUndefined()
  })

  it('rejects an unknown value', () => {
    expect(() => schema.parse('z')).toThrow('Réponse invalide.')
  })

  it('supports a custom error message', () => {
    const custom = optionalEnumSchema(values, { errorMessage: 'Choix invalide.' })
    expect(() => custom.parse('z')).toThrow('Choix invalide.')
  })

  it('accepts null as the empty value when configured', () => {
    const nullEmpty = optionalEnumSchema(values, { emptyValue: null })
    expect(nullEmpty.parse(null)).toBeUndefined()
    expect(() => nullEmpty.parse('')).toThrow()
  })
})

describe('optionalShortTextSchema', () => {
  const schema = optionalShortTextSchema(5)

  it('trims and keeps a valid text', () => {
    expect(schema.parse('  abc  ')).toBe('abc')
  })

  it('normalizes an empty string to undefined', () => {
    expect(schema.parse('')).toBeUndefined()
  })

  it('normalizes a missing value to undefined', () => {
    expect(schema.parse(undefined)).toBeUndefined()
  })

  it('rejects text exceeding the maximum', () => {
    expect(() => schema.parse('abcdef')).toThrow('Ne doit pas dépasser 5 caractères.')
  })
})
