export function formatDate(date: Date | string, override: Intl.DateTimeFormatOptions = {}): string {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      ...override,
    })
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    ...override,
  })
}

export function formatYearMonth(date: Date | string, override: Intl.DateTimeFormatOptions = {}) {
  const localeOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    year: 'numeric',
    ...override,
  } as const

  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('fr-FR', localeOptions)
  }

  return date.toLocaleDateString('fr-FR', localeOptions)
}

export function formatDateTime(
  date: Date | string,
  override: Intl.DateTimeFormatOptions = {}
): string {
  const localeOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
    ...override,
  } as const

  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('fr-FR', localeOptions)
  }

  return date.toLocaleDateString('fr-FR', localeOptions)
}

export function yearsBetween(date1: Date, date2: Date): number {
  let years = date2.getFullYear() - date1.getFullYear()
  if (
    date2.getMonth() < date1.getMonth() ||
    (date2.getMonth() === date1.getMonth() && date2.getDate() < date1.getDate())
  ) {
    years--
  }
  return years
}

export function getMonthBounds({ year, month }: { year: number; month: number }) {
  const from = new Date(year, month - 1, 1)
  const to = new Date(year, month, 1)

  return { from, to }
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}
