import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

type OverlayColor = 'black' | 'blue' | 'purple' | 'gray'
type OverlayOpacity = '10' | '20' | '30' | '40' | '50' | '60' | '70'

interface Props {
  className?: HTMLAttributes<HTMLElement>['className']
  bgImage?: string
  bgColor?: string
  height?: string
  py?: '16' | '20' | '24'
  pt?: '32' | '40' | '45'
  align?: 'text-left' | 'text-center' | 'text-right'
  maxWidth?: 'max-w-2xl' | 'max-w-4xl' | 'max-w-6xl' | 'max-w-full'
  textColor?: 'text-white' | 'text-black' | 'text-gray-800'
  showOverlay?: boolean
  overlayColor?: OverlayColor
  overlayOpacity?: OverlayOpacity
  children?: React.ReactNode
  corner?: React.ReactNode
}

const PY_MAP: Record<string, string> = {
  '16': 'py-16',
  '20': 'py-20',
  '24': 'py-24',
}

const PT_MAP: Record<string, string> = {
  '32': 'pt-32',
  '40': 'pt-40',
  '45': 'pt-45',
}

export default function HeroSection({
  className,
  bgImage,
  bgColor = 'bg-linear-to-r from-catholic-purple to-catholic-red',
  height,
  py = '24',
  pt = '45',
  align = 'text-center',
  maxWidth = 'max-w-4xl',
  textColor = 'text-white',
  showOverlay = true,
  overlayColor = 'black',
  overlayOpacity = '30',
  children,
  corner,
}: Props) {
  const paddingClasses = [PY_MAP[py], PT_MAP[pt]].filter(Boolean)
  const overlayClass = `bg-${overlayColor}/${overlayOpacity}`

  return (
    <section
      className={cn(
        'flex flex-col gap-7 items-center laptop:items-stretch laptop:flex-row laptop:gap-0 relative z-1',
        ...paddingClasses,
        height,
        textColor,
        bgImage ? 'bg-cover bg-center bg-no-repeat' : bgColor,
        className
      )}
      style={bgImage ? { backgroundImage: `url(${bgImage})` } : undefined}
    >
      {bgImage && showOverlay && <div className={cn('absolute inset-0', overlayClass)} />}

      <div className={cn('container mx-auto px-4 relative z-10', align, maxWidth)}>{children}</div>

      {corner && (
        <div className="block laptop:absolute laptop:bottom-8 laptop:right-8 bg-white/10 backdrop-blur-sm rounded-lg p-4 text-sm">
          {corner}
        </div>
      )}
    </section>
  )
}
