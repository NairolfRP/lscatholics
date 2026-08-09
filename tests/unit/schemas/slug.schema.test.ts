import { describe, expect, it } from 'vitest'
import { slugSchema } from '#shared/schemas/slug.schema.ts'

describe('slugSchema', () => {
  it('accepts a valid slug', () => {
    expect(slugSchema.parse('my-slug-2026')).toBe('my-slug-2026')
  })

  it('accepts a single word', () => {
    expect(slugSchema.parse('event')).toBe('event')
  })

  it('rejects uppercase letters', () => {
    expect(() => slugSchema.parse('MySlug')).toThrow('Utilisez uniquement des lettres minuscules.')
  })

  it('rejects spaces', () => {
    expect(() => slugSchema.parse('my slug')).toThrow('Les espaces ne sont pas autorisés.')
  })

  it('rejects disallowed characters', () => {
    expect(() => slugSchema.parse('my_slug')).toThrow(
      'Seuls les lettres minuscules, les chiffres et les tirets sont autorisés.'
    )
  })

  it('rejects a leading hyphen', () => {
    expect(() => slugSchema.parse('-my-slug')).toThrow(
      'Le nom ne peut pas commencer ou se terminer par un tiret.'
    )
  })

  it('rejects a trailing hyphen', () => {
    expect(() => slugSchema.parse('my-slug-')).toThrow(
      'Le nom ne peut pas commencer ou se terminer par un tiret.'
    )
  })

  it('rejects consecutive hyphens', () => {
    expect(() => slugSchema.parse('my--slug')).toThrow(
      'Deux tirets consécutifs ne sont pas autorisés.'
    )
  })
})
