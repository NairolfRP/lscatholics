export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const localeOptions: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hourCycle: 'h23',
    hour: '2-digit',
    minute: '2-digit',
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
