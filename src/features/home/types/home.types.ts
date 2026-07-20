import type { LucideIcon } from 'lucide-react'
import type { ComponentType, ReactNode } from 'react'
import type { InternalOrExternalPath } from '#/shared/lib/types/router.ts'
import type { IconProps } from '#/shared/types/icon.types'

export type CTA = {
  icon?: ComponentType<IconProps> | LucideIcon
  title: string
  description?: string | ReactNode
} & InternalOrExternalPath
