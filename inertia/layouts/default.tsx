import '@/assets/css/default-layout.css'
import { type ReactElement, useEffect } from 'react'
import { toast } from 'sonner'
import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'
import AppHead from '@/shared/components/app-head'
import Header from '@/shared/components/layout/default/header'
import Footer from '@/shared/components/layout/default/footer'
import type { NavItem } from '@/shared/types/breadcrumb'

type Props = {
  breadcrumb: NavItem[]
  children: ReactElement<Data.SharedProps>
}

export default function Layout({ children }: Props) {
  const page = usePage()

  useEffect(() => {
    toast.dismiss()
  }, [page.url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  return (
    <>
      <AppHead />
      <Header />

      <main className="flex-1 min-w-0">{children}</main>

      <Footer />
    </>
  )
}
