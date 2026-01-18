import type { VariantProps } from 'class-variance-authority'
import { cva } from 'class-variance-authority'

export { default as Alert } from '@/shared/components/ui/alert/Alert.vue'
export { default as AlertDescription } from '@/shared/components/ui/alert/AlertDescription.vue'
export { default as AlertTitle } from '@/shared/components/ui/alert/AlertTitle.vue'

export const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'bg-card text-card-foreground',
        destructive:
          'text-destructive-foreground bg-destructive border border-destructive-foreground/10 [&>svg]:text-current *:data-[slot=alert-description]:text-destructive-foreground/90',
        success:
          'text-success-foreground bg-success border border-success/10 [&>svg]:text-current *:data-[slot=alert-description]:text-success-foreground/90',
        warning:
          'text-warning-foreground bg-warning border border-warning-foreground/10 [&>svg]:text-current *:data-[slot=alert-description]:text-warning-foreground/90',
        info: 'text-info-foreground bg-info border border-info-foreground/10 [&>svg]:text-current *:data-[slot=alert-description]:text-info-foreground/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export type AlertVariants = VariantProps<typeof alertVariants>
