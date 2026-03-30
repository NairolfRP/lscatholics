import { useEffect } from 'react'
import { toast } from 'sonner'
import ScrollToTopButton from '@/shared/components/scroll-to-top-button'
import type { Data } from '@generated/data'
import { usePage } from '@inertiajs/react'
import { Toaster } from '@/shared/components/ui/sonner'
import DashboardSidebar from '@/shared/components/layout/dashboard/sidebar'

type Props = {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: Props) {
  const { props, url } = usePage<Data.SharedProps>()
  const { flash } = props

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
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardSidebar />

      <main className="lg:pl-64 pb-safe">
        <div className="p-6 lg:p-8">{children}</div>
      </main>

      <ScrollToTopButton />
      <Toaster position="top-center" closeButton richColors />
    </div>
  )
}
