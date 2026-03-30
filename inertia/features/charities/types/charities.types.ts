import type { LucideIcon } from 'lucide-react'

export type Program = {
  icon: LucideIcon
  title: string
  slug: string
  description: string
  tag: string
  route: string
  routeParams?: Record<string, any>
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
  route: string
  routeParams?: Record<string, any>
  href?: undefined
}

export type HelpCard = HelpCardWithInternalLink | HelpCardWithExternalLink
