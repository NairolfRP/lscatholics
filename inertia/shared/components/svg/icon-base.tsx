import type { SVGAttributes } from 'react'
import { defaultIconProps, type IconProps } from '@/shared/hooks/use_icon_props'

type Props = IconProps &
  Omit<SVGAttributes<SVGElement>, 'onClick'> & {
    children?: React.ReactNode
    onClick?: (e: MouseEvent) => void
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

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={width}
      height={height}
      aria-labelledby={iconName}
      role="img"
      onClick={handleClick}
      {...rest}
    >
      <g style={{ fill: iconColor }}>{children}</g>
    </svg>
  )
}
