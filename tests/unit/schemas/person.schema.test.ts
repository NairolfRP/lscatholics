import { describe, expect, it } from 'vitest'
import { ageSchema, nameSchema } from '#shared/schemas/person.schema.ts'

describe('nameSchema', () => {
  it('trims and returns a valid name', () => {
    expect(nameSchema('prénom').parse('  Jean ')).toBe('Jean')
  })

  it('rejects a missing name', () => {
    expect(() => nameSchema('prénom').parse(undefined)).toThrow('Le prénom est requis.')
  })

  it('rejects an empty name', () => {
    expect(() => nameSchema('prénom').parse('')).toThrow(
      'Le prénom doit comporter au moins 2 caractères.'
    )
  })

  it('rejects a name shorter than 2 characters', () => {
    expect(() => nameSchema('prénom').parse('J')).toThrow(
      'Le prénom doit comporter au moins 2 caractères.'
    )
  })

  it('rejects a name longer than 50 characters by default', () => {
    expect(() => nameSchema('prénom').parse('a'.repeat(51))).toThrow(
      'Le prénom ne doit pas dépasser 50 caractères.'
    )
  })

  it('accepts a custom maximum length', () => {
    expect(() => nameSchema('prénom', 3).parse('abcd')).toThrow(
      'Le prénom ne doit pas dépasser 3 caractères.'
    )
  })
})

describe('ageSchema', () => {
  const schema = ageSchema({ requiredMessage: 'Veuillez saisir votre âge.', min: 18 })

  it('parses a valid age into a number', () => {
    expect(schema.parse('30')).toBe(30)
  })

  it('trims whitespace before parsing', () => {
    expect(schema.parse(' 30 ')).toBe(30)
  })

  it('defaults the maximum age to 120', () => {
    expect(schema.parse('120')).toBe(120)
    expect(() => schema.parse('121')).toThrow("L'âge ne peut pas dépasser 120 ans.")
  })

  it('rejects an age below the minimum with the default message for 18', () => {
    expect(() => schema.parse('17')).toThrow("L'âge minimum pour s'enregistrer est de 18 ans.")
  })

  it('uses a generic message when the minimum is not 18', () => {
    const customMin = ageSchema({ requiredMessage: 'Âge requis.', min: 16 })
    expect(() => customMin.parse('15')).toThrow("L'âge ne peut pas être inférieur à 16.")
  })

  it('rejects a non-numeric age', () => {
    expect(() => schema.parse('abc')).toThrow('Veuillez saisir un âge valide.')
  })

  it('rejects a decimal age', () => {
    expect(() => schema.parse('30.5')).toThrow('Veuillez saisir un âge valide.')
  })

  it('rejects a missing age', () => {
    expect(() => schema.parse(undefined)).toThrow('Veuillez saisir votre âge.')
  })

  it('supports custom error messages and range', () => {
    const custom = ageSchema({
      requiredMessage: 'Âge requis.',
      min: 0,
      max: 115,
      minErrorMessage: 'Trop jeune.',
      maxErrorMessage: 'Trop vieux.',
    })
    expect(custom.parse('0')).toBe(0)
    expect(() => custom.parse('116')).toThrow('Trop vieux.')
  })
})
