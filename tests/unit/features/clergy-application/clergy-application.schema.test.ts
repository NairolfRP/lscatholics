import { describe, expect, it } from 'vitest'
import {
  clergyApplicationSchema,
  submitClergyApplicationFnSchema,
} from '#/features/clergy-application/schemas/clergy-application.schema.ts'

const validInput = {
  discordUsername: 'john.doe',
  sanctions: 'https://ucp-fr.gta.world/view/record/qqmNX',
  firstname: 'Jean-Marie',
  lastname: 'Vianney',
  age: '32',
  characterStory: 'A'.repeat(200),
  motivations: 'B'.repeat(150),
  noTrollingDeclaration: true,
  legalOnlyDeclaration: true,
}

describe('clergyApplicationSchema', () => {
  it('parses a valid application and normalizes the output', () => {
    const result = clergyApplicationSchema('priest').parse(validInput)

    expect(result).toEqual({
      discordUsername: 'john.doe',
      sanctions: 'https://ucp-fr.gta.world/view/record/qqmNX',
      firstname: 'Jean-Marie',
      lastname: 'Vianney',
      age: 32,
      maritalStatus: undefined,
      characterStory: 'A'.repeat(200),
      motivations: 'B'.repeat(150),
      noTrollingDeclaration: true,
      legalOnlyDeclaration: true,
    })
  })

  it('rejects an invalid Discord username', () => {
    expect(() =>
      clergyApplicationSchema('priest').parse({ ...validInput, discordUsername: 'a' })
    ).toThrow("Un nom d'utilisateur Discord doit contenir au moins 2 caractères.")
    expect(() =>
      clergyApplicationSchema('priest').parse({ ...validInput, discordUsername: 'Jean Doe' })
    ).toThrow(
      "Ce n'est pas un nom d'utilisateur valide. Vérifiez que vous indiquez bien le nom d'utilisateur, et non le nom d'affichage."
    )
  })

  it('rejects an invalid sanctions share link', () => {
    expect(() =>
      clergyApplicationSchema('priest').parse({
        ...validInput,
        sanctions: 'https://example.com/record/abc',
      })
    ).toThrow('Lien de partage de dossier serveur invalide')
    expect(() =>
      clergyApplicationSchema('priest').parse({ ...validInput, sanctions: '' })
    ).toThrow('Lien de partage de dossier serveur invalide')
    expect(() =>
      clergyApplicationSchema('priest').parse({ ...validInput, sanctions: undefined })
    ).toThrow('Le lien vers votre dossier serveur est requis.')
  })

  it('rejects a priest age below the minimum', () => {
    expect(() => clergyApplicationSchema('priest').parse({ ...validInput, age: '24' })).toThrow(
      'L’âge minimum pour être ordonné prêtre est de 25 ans.'
    )
  })

  it('rejects a priest age above the maximum', () => {
    expect(() => clergyApplicationSchema('priest').parse({ ...validInput, age: '56' })).toThrow(
      'L’âge d’un prêtre ne peut pas dépasser 55 ans.'
    )
  })

  it('rejects a temporary deacon age below the minimum', () => {
    expect(() =>
      clergyApplicationSchema('deacon-temporary').parse({ ...validInput, age: '22' })
    ).toThrow('L’âge minimum pour devenir diacre temporaire est de 23 ans.')
  })

  it('rejects a temporary deacon age above the maximum', () => {
    expect(() =>
      clergyApplicationSchema('deacon-temporary').parse({ ...validInput, age: '56' })
    ).toThrow('L’âge d’un diacre temporaire ne peut pas dépasser 55 ans.')
  })

  it('rejects a permanent deacon without a marital status', () => {
    expect(() => clergyApplicationSchema('deacon-permanent').parse(validInput)).toThrow(
      'Veuillez indiquer votre situation matrimoniale.'
    )
  })

  it('rejects an unmarried permanent deacon below the minimum age', () => {
    expect(() =>
      clergyApplicationSchema('deacon-permanent').parse({
        ...validInput,
        maritalStatus: 'single',
        age: '24',
      })
    ).toThrow('L’âge minimum pour devenir diacre permanent célibataire est de 25 ans.')
  })

  it('rejects a married permanent deacon below the minimum age', () => {
    expect(() =>
      clergyApplicationSchema('deacon-permanent').parse({
        ...validInput,
        maritalStatus: 'married',
        age: '34',
      })
    ).toThrow('L’âge minimum pour devenir diacre permanent marié est de 35 ans.')
  })

  it('accepts a married permanent deacon of at least 35 years old', () => {
    expect(() =>
      clergyApplicationSchema('deacon-permanent').parse({
        ...validInput,
        maritalStatus: 'married',
        age: '35',
      })
    ).not.toThrow()
  })

  it('rejects a missing role', () => {
    expect(() =>
      submitClergyApplicationFnSchema.parse({ role: undefined, values: validInput })
    ).toThrow()
  })

  it('rejects an unknown role', () => {
    expect(() =>
      submitClergyApplicationFnSchema.parse({ role: 'cardinal', values: validInput })
    ).toThrow()
  })

  it('rejects a character story that is too short', () => {
    expect(() =>
      clergyApplicationSchema('priest').parse({ ...validInput, characterStory: 'B'.repeat(50) })
    ).toThrow('L’histoire de votre personnage doit comporter au moins 150 caractères.')
  })

  it('rejects unchecked declarations', () => {
    expect(() =>
      clergyApplicationSchema('priest').parse({ ...validInput, noTrollingDeclaration: false })
    ).toThrow(
      'Vous devez accepter l’engagement de ne pas troller et de ne pas pratiquer le RP religieux à des fins abusives ou exagérées.'
    )
    expect(() =>
      clergyApplicationSchema('priest').parse({ ...validInput, legalOnlyDeclaration: false })
    ).toThrow('Vous devez déclarer que votre personnage est uniquement légal.')
  })
})
