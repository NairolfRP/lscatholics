import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { SETTINGS_TABS } from '#/features/settings/constants/settings-tabs'
import { getSessionFn } from '#/server-fn/auth.functions'
import { buttonVariants } from '#/shared/components/ui/button'
import { ScrollArea, ScrollBar } from '#/shared/components/ui/scroll-area'
import { Typography } from '#/shared/components/ui/typography'
import { cn } from '#/shared/lib/utils'
import { pageMetadata } from '#/utils/seo'

export const Route = createFileRoute('/_app/account')({
  beforeLoad: async () => {
    const session = await getSessionFn()
    if (!session) {
      throw redirect({ to: '/', replace: true })
    }

    return { user: session.user }
  },
  loader: ({ context }) => {
    return { user: context.user }
  },
  head: () => ({
    meta: pageMetadata('Paramètres'),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = Route.useLoaderData()

  return (
    <main className="mx-auto max-w-5xl pt-40 pb-12 sm:px-4 ">
      <Typography variant="h1" className="pb-15">
        Paramètres - {user.name}
      </Typography>

      <div className="grid w-full grid-cols-1 gap-7 sm:grid-cols-10 sm:gap-4 md:grid-cols-12">
        <div className="sm:col-span-2 sm:border-r">
          <ScrollArea className="w-full sm:h-auto">
            <SettingsNav />
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>
        </div>
        <div className="container mx-auto max-w-5xl px-4 sm:col-span-8 md:col-span-10">
          <Outlet />
        </div>
      </div>
    </main>
  )
}

function SettingsNav() {
  return (
    <nav className="flex flex-row gap-1 border-y py-2 sm:flex-col sm:border-none sm:py-0">
      {SETTINGS_TABS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'w-full justify-start rounded-none px-2 py-4'
          )}
          activeProps={{ 'className': 'bg-muted font-medium', 'aria-current': 'page' }}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
