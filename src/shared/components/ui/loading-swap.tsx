import type { PropsWithChildren } from 'react'
import { Spinner } from '#/shared/components/ui/spinner'

type Props = PropsWithChildren<{
  isLoading?: boolean
  className?: HTMLElement['className']
}>

export function LoadingSwap({ children, className, isLoading = false }: Props) {
  if (!isLoading) {
    return <div className={className}>{children}</div>
  }

  return (
    <div className={className}>
      <Spinner />
    </div>
  )
}
