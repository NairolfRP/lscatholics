import { Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { UserConnections } from '#/features/user/components/user-connections'
import { UserDangerZone } from '#/features/user/components/user-danger-zone'
import { Separator } from '#/shared/components/ui/separator'
import { Skeleton } from '#/shared/components/ui/skeleton'
import { Typography } from '#/shared/components/ui/typography'

export const Route = createFileRoute('/_app/account/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="space-y-5">
      <Typography variant="h2">Votre compte</Typography>

      <Suspense fallback={<Skeleton className="h-26 w-full rounded-md" />}>
        <UserConnections />
      </Suspense>
      <Separator />
      <Suspense fallback={<Skeleton className="h-40 w-full rounded-2xl" />}>
        <UserDangerZone />
      </Suspense>
    </section>
  )
}
