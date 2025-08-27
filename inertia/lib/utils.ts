import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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

export function formatNumber(nb: string | number, locale: string = 'fr-FR') {
  return new Intl.NumberFormat(locale).format(Number(nb))
}
