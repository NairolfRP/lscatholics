import { Container } from '@/shared/components/ui/container'
import { formatNumber, yearsBetween } from '@/lib/utils'
import {
  ARCHDIOCESAN_HISTORY_START_DATE,
  NB_FAITHFUL,
} from '@/shared/constants/archdiocese.constants'
import { StatItem } from '@/features/home/types/home.types'

export function HomeKeyFigures() {
  const stats: StatItem[] = [
    { value: 288, label: 'Paroisses', colorClass: 'text-green-700' },
    { value: 42, label: 'Langues différentes', colorClass: 'text-catholic-purple' },
    { value: formatNumber(NB_FAITHFUL), label: 'Catholiques', colorClass: 'text-catholic-red' },
    {
      value: yearsBetween(ARCHDIOCESAN_HISTORY_START_DATE, new Date()),
      label: "Ans d'histoire",
      colorClass: 'text-catholic-blue',
    },
  ]

  return (
    <section className="py-16 bg-catholic-gold text-white">
      <Container>
        <div className="grid md:grid-cols-4 gap-12 md:gap-8 text-center">
          {stats.map(({ value, label, colorClass }) => (
            <div key={label} className="space-y-2">
              <div className={`text-4xl font-bold ${colorClass}`}>{value}</div>
              <div className="text-sm text-gray-900 font-medium uppercase tracking-wide">
                {label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
