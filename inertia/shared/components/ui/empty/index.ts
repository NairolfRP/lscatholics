import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Empty } from '@/shared/components/ui/empty/Empty.vue'
export { default as EmptyContent } from '@/shared/components/ui/empty/EmptyContent.vue'
export { default as EmptyDescription } from '@/shared/components/ui/empty/EmptyDescription.vue'
export { default as EmptyHeader } from '@/shared/components/ui/empty/EmptyHeader.vue'
export { default as EmptyMedia } from '@/shared/components/ui/empty/EmptyMedia.vue'
export { default as EmptyTitle } from '@/shared/components/ui/empty/EmptyTitle.vue'

export const emptyMediaVariants = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>
