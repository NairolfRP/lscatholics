import { parishes } from '#/config/parishes'
import { createEnum } from '#/utils/create-enum'
import type { ParishId } from '../types/parish.types'

export const [PARISH, PARISH_VALUES] = createEnum({
  CATHEDRAL: 'cathedral',
  ROCKFORD_HILLS: 'good_shepherd',
  OLD_MEXICAN_PLAZA: 'old_church',
})

export function getParishInfo(id: ParishId) {
  return parishes.find((parish) => parish.id === id)
}
