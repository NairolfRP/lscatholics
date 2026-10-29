import { createFileRoute, redirect } from '@tanstack/react-router'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { IncidentReportForm } from '#/features/incident-report/components/incident-report-form.tsx'
import { hasPermission } from '#/shared/utils/permissions'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/dashboard/personnel/incident-reports')({
  head: () => ({ meta: pageMetadata("Rapport d'incident") }),
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'incident', 'create')) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading title="Rapport d’incident" description="Signalez un incident" />
        <div className="max-w-3xl">
          <IncidentReportForm />
        </div>
      </div>
    </div>
  )
}
