import type { PropsWithChildren } from 'react'

type Props = PropsWithChildren

export function DonateFieldsGrid({ children }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-4 items-start">{children}</div>
  )
}
