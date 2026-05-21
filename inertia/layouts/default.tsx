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
  const { props, url } = usePage<Data.SharedProps>()
  const { flash, errors } = props

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (flash.error) {
      toast.error(flash.error)
    }
    if (flash.success) {
      toast.success(flash.success)
    }
  }, [flash])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      toast.error('Il y a des erreurs sur le formulaire. Veuillez les corriger.')
    }
  }, [errors])

  return (
    <>
      <AppHead />
      <Header />

      <main className="flex-1 min-w-0">{children}</main>

      <Footer />
    </>
  )
}
