import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'
import { cn } from '#/shared/lib/utils'

const typographyVariants = cva('', {
  variants: {
    variant: {
      'h1': 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      'h2': 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
      'h3': 'scroll-m-20 text-2xl font-semibold tracking-tight',
      'h4': 'scroll-m-20 text-xl font-semibold tracking-tight',
      'p': 'text-base leading-7 not-first:mt-6',
      'lead': 'text-xl text-muted-foreground',
      'large': 'text-lg font-semibold',
      'muted': 'text-sm text-muted-foreground',
      'blockquote': 'mt-6 border-l-2 pl-6 italic',
      'small': 'text-sm leading-none font-medium',
      'inline-code':
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
    },
  },
  defaultVariants: { variant: 'p' },
})

type TypographyElement =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'span'
  | 'div'
  | 'blockquote'
  | 'small'
  | 'code'

const variantElementMap: Record<
  NonNullable<VariantProps<typeof typographyVariants>['variant']>,
  TypographyElement
> = {
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'p': 'p',
  'lead': 'p',
  'large': 'p',
  'muted': 'p',
  'blockquote': 'blockquote',
  'small': 'small',
  'inline-code': 'code',
}

interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof typographyVariants> {
  as?: TypographyElement
}

export function Typography({ variant = 'p', as, className, ...props }: TypographyProps) {
  const Comp = as ?? variantElementMap[variant ?? 'p']
  return <Comp className={cn(typographyVariants({ variant }), className)} {...props} />
}
