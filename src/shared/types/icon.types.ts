import type { CSSProperties, HTMLAttributes } from 'react'

export type IconProps = {
  clickable?: boolean
  iconName?: string
  viewBox?: string
  width?: number | string
  height?: number | string
  iconColor?: CSSProperties['color']
  className?: HTMLAttributes<SVGElement>['className']
}
