import type { SVGAttributes } from 'react'
import { defaultIconProps } from '#/shared/hooks/use-icon-props'
import type { IconProps } from '#/shared/types/icon.types'

type Props = IconProps &
  Omit<SVGAttributes<SVGElement>, 'onClick'> & {
    children?: React.ReactNode
    onClick?: (e: MouseEvent | KeyboardEvent) => void
  }

export default function IconBase({
  clickable,
  iconName = defaultIconProps.iconName,
  viewBox = defaultIconProps.viewBox,
  width = defaultIconProps.width,
  height = defaultIconProps.height,
  iconColor = defaultIconProps.iconColor,
  children,
  onClick,
  ...rest
}: Props) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (clickable && onClick) {
      onClick(e.nativeEvent)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<SVGSVGElement>) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(e.nativeEvent)
    }
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      aria-labelledby={iconName}
      role={clickable ? 'button' : 'img'}
      tabIndex={clickable ? 0 : undefined}
      aria-label={clickable ? iconName : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={{ cursor: clickable ? 'pointer' : undefined }}
      {...rest}
    >
      <g style={{ fill: iconColor }}>{children}</g>
    </svg>
  )
}
