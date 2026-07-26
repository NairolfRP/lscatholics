type FormatJobPostingSalaryOptions = {
  min: number | null
  max: number | null
}

export function formatJobPostingSalary({ min, max }: FormatJobPostingSalaryOptions) {
  if (!min && !max) return 'Salaire non spécifié'

  const formatter = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    })
      .formatToParts(value)
      .map((part) => (part.type === 'group' ? '\u202F' : part.value))
      .join('')

  if (min && !max) {
    return formatter(min)
  }

  if (!min && max) {
    return `Jusqu'à ${formatter(max)}`
  }

  return `${formatter(min as number)} - ${formatter(max as number)}`
}
