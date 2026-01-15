import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import type { $ZodCustomParams } from 'zod/v4/core'

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

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function numberEnum<Num extends number, T extends Readonly<Num[]>>(
  args: T,
  params?: string | $ZodCustomParams | undefined
): z.ZodSchema<T[number]> {
  return z.custom<T[number]>((val: any) => args.includes(val), params)
}
