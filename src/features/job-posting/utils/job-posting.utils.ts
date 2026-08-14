import { formatCurrency } from '#/utils/number.ts'

type FormatJobPostingSalaryOptions = {
  min: number | null
  max: number | null
}

export function formatJobPostingSalary({ min, max }: FormatJobPostingSalaryOptions) {
  if (!min && !max) return 'Salaire non spécifié'

  if (min && !max) {
    return formatCurrency(min)
  }

  if (!min && max) {
    return `Jusqu'à ${formatCurrency(max)}`
  }

  return `${formatCurrency(min as number)} - ${formatCurrency(max as number)}`
}
