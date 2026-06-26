import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { z } from 'zod'
import type { $ZodCustomParams } from 'zod/v4/core'
import type { ReactNode } from 'react'

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

export function isExternalLink(href: string) {
  const EXTERNAL_RE = /^(https?:\/\/|www\.)/i

  return EXTERNAL_RE.test(href)
}

export function formatCurrency(nb: number, locale: string = 'fr-FR') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
  })
    .format(nb)
    .replace('US', '')
    .trim()
}

export function numberEnum<Num extends number, T extends Readonly<Num[]>>(
  args: T,
  params?: string | $ZodCustomParams | undefined
): z.ZodSchema<T[number]> {
  return z.custom<T[number]>((val: any) => args.includes(val), params)
}

export function getPaginationItems(page: number, lastPage: number): Array<number | 'ellipsis'> {
  if (lastPage <= 7) return Array.from({ length: lastPage }, (_, i) => i + 1)

  const items: Array<number | 'ellipsis'> = [1]

  if (page > 3) items.push('ellipsis')

  for (let p = Math.max(2, page - 1); p <= Math.min(lastPage - 1, page + 1); p++) {
    items.push(p)
  }

  if (page < lastPage - 2) items.push('ellipsis')

  items.push(lastPage)
  return items
}

export function slugify(children: string | ReactNode): string {
  return String(children)
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}

export function serverErrorsFormConvertor(errors: Record<string, string>) {
  const formErrors: Record<string, { message: string }> = {}

  for (const [field, message] of Object.entries(errors)) {
    formErrors[field] = { message }
  }

  return {
    fields: formErrors,
  }
}

export function truncate(text: string, max = 160): string {
  if (text.length <= max) return text
  return text.slice(0, text.lastIndexOf(' ', max)) + '…'
}

export function stripMarkdown(text: string): string {
  return text
    .replace(/(\*{1,3}|_{1,3}|~~)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[@#][!&]?\d+>/g, '')
    .replace(/<a?:\w+:\d+>/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
}

export function toOgDescription(rawDescription: string): string {
  return truncate(stripMarkdown(rawDescription))
}
