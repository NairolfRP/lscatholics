import { cva, type VariantProps } from 'class-variance-authority'

export { default as Typography } from '@/shared/components/ui/typography/Typography.vue'

export const typographyVariants = cva('', {
  variants: {
    variant: {
      p: 'leading-7 [&:not(:first-child)]:mt-6',
      h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      h2: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
      h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
      h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
      blockquote: 'mt-6 border-l-2 pl-6 italic',
      list: 'my-6 ml-6 list-disc [&>li]:mt-2',
      code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

export const typographyTags = {
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

export type TypographyVariants = VariantProps<typeof typographyVariants>
