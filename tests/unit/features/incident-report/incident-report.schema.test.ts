import { describe, expect, it } from 'vitest'
import { incidentReportSchema } from '#/features/incident-report/schemas/incident-report.schema.ts'

const validInput = {
  identity: 'Jean Valjean',
  position: 'Superviseur',
  incidentAt: new Date('2020-01-15T10:30:00Z'),
  location: 'Mission Row',
  nature: 'Vol à main armée',
  witnesses: 'Cosette',
  details: 'Un individu masqué a dérobé la caisse avant de prendre la fuite vers le sud.',
}

describe('incidentReportSchema', () => {
  it('parses a valid incident report and trims the text fields', () => {
    const result = incidentReportSchema.parse({
      ...validInput,
      identity: '  Jean Valjean  ',
      position: '  Superviseur  ',
    })

    expect(result).toEqual(
      expect.objectContaining({
        identity: 'Jean Valjean',
        position: 'Superviseur',
        location: 'Mission Row',
        nature: 'Vol à main armée',
        witnesses: 'Cosette',
      })
    )
  })

  it('treats empty witnesses as absent', () => {
    const result = incidentReportSchema.parse({ ...validInput, witnesses: '   ' })

    expect(result.witnesses).toBeUndefined()
  })

  it('requires an incident date', () => {
    const withoutDate: Partial<typeof validInput> = { ...validInput }
    delete withoutDate.incidentAt

    expect(() => incidentReportSchema.parse(withoutDate)).toThrow(
      'La date et l’heure de l’incident sont requises.'
    )
  })

  it('rejects a date in the future', () => {
    expect(() =>
      incidentReportSchema.parse({ ...validInput, incidentAt: new Date(Date.now() + 60_000) })
    ).toThrow('La date et l’heure de l’incident ne peuvent pas être dans le futur.')
  })

  it('rejects a detail shorter than 20 characters', () => {
    expect(() => incidentReportSchema.parse({ ...validInput, details: 'Trop court' })).toThrow(
      'Le détail doit comporter au moins 20 caractères.'
    )
  })

  it('rejects a detail longer than 4000 characters', () => {
    expect(() => incidentReportSchema.parse({ ...validInput, details: 'x'.repeat(4001) })).toThrow(
      'Le détail ne doit pas dépasser 4000 caractères.'
    )
  })

  it('rejects missing required fields', () => {
    expect(() =>
      incidentReportSchema.parse({
        ...validInput,
        identity: ' ',
        location: '',
        nature: '',
      })
    ).toThrow()
  })
})
