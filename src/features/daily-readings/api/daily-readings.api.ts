import ky, { HTTPError } from 'ky'
import { aelfReadingsResponseSchema } from '#/features/daily-readings/schemas/daily-readings.schema.ts'
import type { AELFReadingsResponse } from '#/features/daily-readings/types/aelf.types.ts'

const aelfClient = ky.create({
  prefix: 'https://api.aelf.org/v1',
  timeout: 10_000,
  retry: 0,
  headers: { Accept: 'application/json' },
})

export async function getDailyReadings(date: string): Promise<AELFReadingsResponse | null> {
  try {
    const payload: unknown = await aelfClient.get(`messes/${date}/france`).json()
    return aelfReadingsResponseSchema.parse(payload)
  } catch (error) {
    if (error instanceof HTTPError && error.response.status === 404) return null
    throw error
  }
}
