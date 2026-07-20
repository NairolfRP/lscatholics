import type { ClassValue } from 'clsx'
import type { LucideIcon } from 'lucide-react'
import type { ComponentType } from 'react'
import type { IconProps } from './icon.types'

type SocialWhere = 'footer'

type SocialMeta = {
  isOOC?: boolean
  only?: ReadonlyArray<SocialWhere>
  exclude?: ReadonlyArray<SocialWhere>
}

export type Social = {
  label: string
  href: string
  icon: ComponentType<IconProps> | LucideIcon
  className: ClassValue
  metadata?: SocialMeta
}
