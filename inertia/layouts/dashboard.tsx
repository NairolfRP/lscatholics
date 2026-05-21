import { Fragment, type ReactNode, useEffect } from 'react'
import { toast } from 'sonner'
import type { Data } from '@generated/data'
import { usePage } from '@inertiajs/react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/shared/components/ui/sidebar'
import DashboardSidebar from '@/shared/components/layout/dashboard/sidebar'
import { Separator } from '@/shared/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb'
import { Link } from '@adonisjs/inertia/react'
import type { NavItem } from '@/shared/types/breadcrumb'
import { client } from '@/lib/client'

type Props = {
  breadcrumb: NavItem[]
  children: ReactNode
}

export default function DashboardLayout({ breadcrumb, children }: Props) {
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
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <DashboardHeader breadcrumb={breadcrumb} />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function DashboardHeader({ breadcrumb }: { breadcrumb: NavItem[] }) {
  const { url } = usePage()
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem className="hidden md:block">
            {client.current('dashboard.index') ? (
              <BreadcrumbPage>Tableau de bord</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link route="dashboard.index">Tableau de bord</Link>
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {breadcrumb.length > 0 && <BreadcrumbSeparator className="hidden md:block" />}
          {breadcrumb.map((item, index) => {
            const isLast = index === breadcrumb.length - 1
            return (
              <Fragment key={index}>
                <BreadcrumbItem>
                  {item.href && url !== item.href ? (
                    <BreadcrumbLink asChild>
                      <Link href={item.href}>{item.label}</Link>
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator className="hidden md:block" />}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
