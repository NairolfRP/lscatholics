import { createFileRoute, Link, Outlet, redirect } from '@tanstack/react-router'
import { SETTINGS_TABS } from '#/features/settings/constants/settings-tabs'
import { getSessionFn } from '#/server-fn/auth.functions'
import { Avatar, AvatarFallback, AvatarImage } from '#/shared/components/ui/avatar'
import { Badge } from '#/shared/components/ui/badge'
import { buttonVariants } from '#/shared/components/ui/button'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Typography } from '#/shared/components/ui/typography'
import { authClient } from '#/shared/integrations/auth/auth-client'
import { cn } from '#/shared/lib/utils'
import { pageMetadata } from '#/utils/seo'
import { parseCsvString } from '#/utils/string'

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
  const { data: session, isPending } = authClient.useSession()

  const displayName = isPending ? user.name : (session?.user.name ?? user.name)
  const displayImage = isPending ? user.image : (session?.user.image ?? user.image)
  const role = isPending ? user.role : (session?.user.role ?? user.role)

  return (
    <main className="mx-auto max-w-5xl pt-40 pb-12 sm:px-4 ">
      <Typography variant="h1" className="pb-6">
        Paramètres
      </Typography>

      <div className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-4 sm:p-6">
        {isPending ? (
          <Skeleton className="size-14 rounded-full" />
        ) : (
          <Avatar className="size-14">
            {displayImage ? <AvatarImage src={displayImage} alt={displayName} /> : null}
            <AvatarFallback className="text-lg font-semibold">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
        <div className="min-w-0 flex-1">
          {isPending ? (
            <Skeleton className="mb-2 h-5 w-40" />
          ) : (
            <p className="truncate text-lg font-semibold">{displayName}</p>
          )}
        </div>
        {role ? (
          <div className="flex flex-wrap justify-end gap-1.5">
            {parseCsvString(String(role)).map((r) => (
              <Badge key={r} variant="secondary" className="capitalize">
                {r}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <div className="grid w-full grid-cols-1 gap-7 sm:grid-cols-10 sm:gap-4 md:grid-cols-12">
        <div className="sm:col-span-2 sm:border-r">
          <SettingsNav />
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
    <nav
      aria-label="Paramètres du compte"
      className="grid grid-cols-2 gap-1 border-y py-2 sm:flex sm:flex-col sm:gap-1 sm:border-none sm:py-0"
    >
      {SETTINGS_TABS.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'w-full justify-start gap-2 rounded-none px-2 py-3 text-left'
            )}
            activeProps={{
              'className': 'bg-muted font-medium border-l-2 border-primary',
              'aria-current': 'page',
            }}
          >
            <Icon className="size-4 shrink-0" />
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
