import { cva, type VariantProps } from 'class-variance-authority'
import { createElement, type HTMLAttributes, type PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'

export type TypographyVariants = VariantProps<typeof typographyVariants>

type Props = PropsWithChildren<{
  variant?: TypographyVariants['variant']
  id?: string
  className?: HTMLAttributes<HTMLElement>['className']
  as?: string
}>

const typographyVariants = cva('', {
  variants: {
    variant: {
      p: 'text-base lg:text-lg leading-relaxed text-foreground [&:not(:first-child)]:mt-6',
      h1: ' scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight text-foreground transition-colors first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight text-foreground',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-foreground',
      blockquote: 'font-serif mt-6 border-l-2 pl-6 italic',
      list: 'text-base lg:text-lg my-6 ml-6 list-disc [&>li]:mt-2',
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'font-serif text-lg lg:text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

const typographyTags = {
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  blockquote: 'blockquote',
  list: 'ul',
  code: 'code',
  lead: 'p',
  large: 'div',
  small: 'small',
  muted: 'p',
} as const

export function Typography({ children, variant = 'p', className, as, ...props }: Props) {
  const tag = as ?? (variant ? typographyTags[variant] : 'p')

  return createElement(
    tag,
    { className: cn(typographyVariants({ variant }), className), ...props },
    children
  )
}
