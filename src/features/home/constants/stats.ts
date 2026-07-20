import {
  ARCHDIOCESAN_HISTORY_START_DATE,
  ARCHDIOCESAN_NB_OF_FAITHFUL,
} from '#/shared/constants/archdiocese'
import { yearsBetween } from '#/utils/date'
import { formatNumber } from '#/utils/number'

export const stats = [
  { value: 288, label: 'Paroisses', colorClass: 'text-green-700' },
  { value: 42, label: 'Langues différentes', colorClass: 'text-catholic-purple' },
  {
    value: formatNumber(ARCHDIOCESAN_NB_OF_FAITHFUL),
    label: 'Catholiques',
    colorClass: 'text-catholic-red',
  },
  {
    value: yearsBetween(ARCHDIOCESAN_HISTORY_START_DATE, new Date()),
    label: "Ans d'histoire",
    colorClass: 'text-catholic-blue',
  },
]
