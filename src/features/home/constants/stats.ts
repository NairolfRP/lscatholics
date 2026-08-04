import { ChurchIcon, HistoryIcon, LanguagesIcon, UsersRoundIcon } from 'lucide-react'
import {
  ARCHDIOCESAN_HISTORY_START_DATE,
  ARCHDIOCESAN_NB_OF_FAITHFUL,
} from '#/shared/constants/archdiocese'
import { yearsBetween } from '#/utils/date'
import { formatNumber } from '#/utils/number'

export const stats = [
  {
    icon: ChurchIcon,
    value: 288,
    label: 'Paroisses',
    colorClass: 'text-green-700 dark:text-green-400',
  },
  {
    icon: LanguagesIcon,
    value: 42,
    label: 'Langues différentes',
    colorClass: 'text-catholic-purple dark:text-catholic-purple-light',
  },
  {
    icon: UsersRoundIcon,
    value: formatNumber(ARCHDIOCESAN_NB_OF_FAITHFUL),
    label: 'Catholiques',
    colorClass: 'text-catholic-red dark:text-catholic-red',
  },
  {
    icon: HistoryIcon,
    value: yearsBetween(ARCHDIOCESAN_HISTORY_START_DATE, new Date()),
    label: "ans d'histoire",
    colorClass: 'text-catholic-blue dark:text-catholic-blue',
  },
]
