import type { IconProps } from '../types/icon.types'

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
