import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getDailyReadings } from '#/features/daily-readings/api/daily-readings.api.ts'

const client = vi.hoisted(() => ({
  get: vi.fn<(path: string) => { json: () => Promise<unknown> }>(),
}))
const httpErrorHolder = vi.hoisted(() => ({ HTTPError: undefined as unknown }))

vi.mock('ky', () => {
  class MockHTTPError extends Error {
    readonly response: { status: number }

    constructor(response: { status: number }) {
      super('Request failed')
      this.response = response
    }
  }
  httpErrorHolder.HTTPError = MockHTTPError
  return {
    default: {
      create: () => client,
    },
    HTTPError: MockHTTPError,
  }
})

const validPayload = {
  informations: {
    date: '2026-08-05',
    zone: 'romain',
    couleur: 'vert',
    annee: 'B',
    temps_liturgique: 'ordinaire',
    semaine: null,
    jour: 'mercredi',
    jour_liturgique_nom: '18ème Semaine du Temps Ordinaire',
    fete: '',
    degre: '',
    ligne1: 'mercredi, 18ème Semaine du Temps Ordinaire',
    ligne2: '',
    ligne3: '',
    couleur2: null,
    couleur3: null,
  },
  messes: [
    {
      nom: 'Messe du matin',
      lectures: [
        {
          type: 'lecture_1',
          refrain_psalmique: '',
          ref_refrain: null,
          titre: null,
          contenu: '<p>Contenu.</p>',
          ref: 'Gn 1, 1-5',
          intro_lue: null,
          verset_evangile: null,
          ref_verset: null,
        },
      ],
    },
  ],
}

function mockHttpError(status: number) {
  const MockHTTPError = httpErrorHolder.HTTPError as new (response: { status: number }) => Error
  return Promise.reject(new MockHTTPError({ status }))
}

beforeEach(() => {
  client.get.mockReset()
})

describe('getDailyReadings', () => {
  it('fetches the AELF endpoint for the given date and validates the payload', async () => {
    client.get.mockReturnValue({ json: () => Promise.resolve(validPayload) })

    const result = await getDailyReadings('2026-08-05')

    expect(client.get).toHaveBeenCalledWith('messes/2026-08-05/france')
    expect(result?.informations.date).toBe('2026-08-05')
    expect(result?.informations.couleur2).toBe('')
  })

  it('returns null when AELF responds with 404', async () => {
    client.get.mockReturnValue({ json: () => mockHttpError(404) })

    await expect(getDailyReadings('2026-08-05')).resolves.toBeNull()
  })

  it('rethrows non-404 HTTP errors', async () => {
    client.get.mockReturnValue({ json: () => mockHttpError(500) })

    await expect(getDailyReadings('2026-08-05')).rejects.toBeInstanceOf(Error)
  })

  it('rethrows when the payload does not match the schema', async () => {
    client.get.mockReturnValue({ json: () => Promise.resolve({ informations: {} }) })

    await expect(getDailyReadings('2026-08-05')).rejects.toThrow()
  })
})
