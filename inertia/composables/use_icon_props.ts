import type { CSSProperties } from 'vue'

export type IconProps = {
  clickable?: boolean
  iconName?: string
  viewBox?: string
  width?: number | string
  height?: number | string
  iconColor?: CSSProperties['color']
}

export const defaultIconProps: Partial<IconProps> = {
  iconName: 'box',
  viewBox: '0 0 24 24',
  width: 18,
  height: 18,
  iconColor: 'currentColor',
}

export const useIconEvents = () => {
  return {
    click: [] as ((e: MouseEvent) => void)[],
  }
}

export function createIconProps(customDefaults: Partial<IconProps> = {}) {
  return {
    ...defaultIconProps,
    ...customDefaults,
  }
}
