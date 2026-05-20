import type { LucideIcon } from 'lucide-react'
import type { RouteName } from '@/shared/types/routes'

export type Program = {
  icon: LucideIcon
  title: string
  slug: string
  description: string
  tag: string
  route: RouteName
  routeParams?: Record<string, unknown>
}

export interface ProgramDetail extends Program {
  about: string
  services: string[]
  eligibility: string[]
  contact: {
    phone: string
    address: string
  }
}

export type Stat = {
  value: string
  label: string
}

export type HelpCardBase = {
  title: string
  body: string
  cta: string
  accent: string
}

export type HelpCardWithExternalLink = HelpCardBase & {
  href: string
  route?: undefined
  routeParams?: undefined
}

export type HelpCardWithInternalLink = HelpCardBase & {
  route: RouteName
  routeParams?: Record<string, unknown>
  href?: undefined
}

export type HelpCard = HelpCardWithInternalLink | HelpCardWithExternalLink
