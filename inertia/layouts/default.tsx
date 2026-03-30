import '@/assets/css/default-layout.css'
import { type ReactElement, useEffect } from 'react'
import { toast } from 'sonner'
import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'
import AppHead from '@/shared/components/app-head'
import Header from '@/shared/components/layout/default/header'
import Footer from '@/shared/components/layout/default/footer'
import ScrollToTopButton from '@/shared/components/scroll-to-top-button'
import { Toaster } from '@/shared/components/ui/sonner'

export default function Layout({ children }: { children: ReactElement<Data.SharedProps> }) {
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
      <div className="flex flex-col min-h-screen bg-background font-sans antialiased">
        <Header />

        <main className="flex-1 min-w-0">{children}</main>

        <Footer />

        <ScrollToTopButton />

        <Toaster
          position="top-right"
          offset={{ top: 140, right: 16 }}
          mobileOffset={{ top: 100 }}
          richColors
          closeButton
        />
      </div>
    </>
  )
}
