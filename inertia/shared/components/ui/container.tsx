import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

interface ContainerProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

const containerVariants = cva('mx-auto w-full px-10 sm:px-8', {
  variants: {
    size: {
      // 65ch — pure reading, articles, legal pages
      prose: 'max-w-prose lg:px-0',

      // 1024px — page with sidebar
      content: 'max-w-5xl lg:px-12',

      // 1280px — general layout (default)
      layout: 'max-w-7xl lg:px-12',

      // 1536px — wide dashboards
      wide: 'max-w-screen-2xl lg:px-12',

      // full width - constrained by the parent
      fluid: 'max-w-full lg:px-12',
    },

    spacing: {
      none: '',
      sm: 'py-8 lg:py-12',
      md: 'py-12 lg:py-16',
      lg: 'py-16 lg:py-24',
    },
  },
  defaultVariants: {
    size: 'layout',
    spacing: 'none',
  },
})

export function Container({
  as: Component = 'div',
  size,
  spacing,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Component className={cn(containerVariants({ size, spacing }), className)} {...props}>
      {children}
    </Component>
  )
}
