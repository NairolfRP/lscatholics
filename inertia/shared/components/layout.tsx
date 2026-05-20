import type { FC } from 'react'
import { NavItem } from '@/shared/types/breadcrumb'
import DashboardLayout from '@/layouts/dashboard'

type Props<P> = {
  breadcrumb: NavItem[] | ((props: P) => NavItem[])
}

export function withDashboardLayout<P>(comp: FC<P>, props: Props<P>) {
  // @ts-expect-error Method from Inertia
  comp.layout = (page) => (
    <DashboardLayout
      breadcrumb={Array.isArray(props.breadcrumb) ? props.breadcrumb : props.breadcrumb(page.props)}
    >
      {page}
    </DashboardLayout>
  )

  return comp
}
