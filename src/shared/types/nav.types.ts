import type { LucideIcon } from 'lucide-react'
import type { HTMLAttributeAnchorTarget } from 'react'
import type { InternalOrExternalPath } from '../lib/types/router'

type NavItemBase = {
  label: string
  target?: HTMLAttributeAnchorTarget
  icon?: LucideIcon
  children?: NavItem[]
}

export type NavItem =
  | (NavItemBase & {
      children: NavItem[]
      to?: never
      params?: never
      href?: never
    })
  | (NavItemBase & InternalOrExternalPath)
