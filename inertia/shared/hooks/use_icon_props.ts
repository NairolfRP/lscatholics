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

export const defaultIconProps: Partial<IconProps> = {
  iconName: 'box',
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  iconColor: 'currentColor',
}

export function createIconProps(customDefaults: Partial<IconProps> = {}) {
  return {
    ...defaultIconProps,
    ...customDefaults,
  }
}
