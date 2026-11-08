import { createFileRoute } from '@tanstack/react-router'
import { UserSessionManagement } from '#/features/session/components/user-session-management'
import { Typography } from '#/shared/components/ui/typography'

export const Route = createFileRoute('/_app/account/sessions')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <section className="space-y-5">
      <Typography variant="h2" className="flex items-center justify-between">
        Sessions
      </Typography>
      <Typography variant="p">
        La liste des appareils connectés à votre compte. Par sécurité, déconnectez tous les
        appareils que vous ne connaissez pas.
      </Typography>
      <UserSessionManagement />
    </section>
  )
}
