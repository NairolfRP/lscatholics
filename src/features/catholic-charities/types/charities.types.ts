import type { LucideIcon } from 'lucide-react'

export type CharitiesContact = {
  phone: string
  address: string
}

export type Program = {
  icon: LucideIcon
  title: string
  slug: string
  description: string
  tag: string
}

export type ProgramDetail = Program & {
  about: string
  services: string[]
  eligibility: string[]
  contact: CharitiesContact
}

export type ProgramDetailData = Omit<ProgramDetail, 'icon'>

export type HelpCard = {
  icon: LucideIcon
  title: string
  body: string
  cta: string
  to: string
  accent: string
}
