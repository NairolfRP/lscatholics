import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { BanknoteArrowDownIcon, ShieldAlertIcon } from 'lucide-react'
import { bankAccountBalanceQueryOptions } from '#/features/banking/queries.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { formatCurrency } from '#/utils/number.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { Alert, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { ButtonGroup } from '#shared/components/ui/button-group.tsx'
import { Button, buttonVariants } from '#shared/components/ui/button.tsx'
import { Card, CardContent } from '#shared/components/ui/card.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { usePermissions } from '#shared/hooks/use-permissions.ts'
import { cn } from '#shared/lib/utils.ts'
import { hasPermission } from '#shared/utils/permissions.ts'

export const Route = createFileRoute('/dashboard/finances/')({
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'finances', 'read')) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(bankAccountBalanceQueryOptions).catch(() => {})
  },
  head: () => ({
    meta: pageMetadata('Finances'),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const permissions = usePermissions()
  const canDoTransaction = hasPermission(permissions, 'finances', 'transaction')

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Département des Services Financiers et Immobiliers"
          description="Aperçu financier de l'Archidiocèse de Los Santos. Actualisé toutes les 5 minutes."
        />

        <Separator />

        <Card className="mx-auto max-w-3xl bg-[#249046]/20">
          <CardContent className="mx-auto text-center">
            <BankBalance />
            <p className="font-semibold text-muted-foreground">Solde disponible</p>
          </CardContent>
        </Card>

        <ButtonGroup orientation="vertical" className="mx-auto h-fit w-full max-w-2xl space-y-2">
          {canDoTransaction && (
            <Link
              to="/dashboard/finances/transfer"
              className={cn(
                buttonVariants({ variant: 'info', size: 'lg' }),
                'py-6 text-xl font-bold'
              )}
            >
              <BanknoteArrowDownIcon className="size-6" /> Effectuer une transaction
            </Link>
          )}
        </ButtonGroup>
      </div>
    </div>
  )
}

function BankBalance() {
  const { data, isError, refetch } = useQuery(bankAccountBalanceQueryOptions)

  if (isError) {
    return (
      <Alert variant="destructive">
        <ShieldAlertIcon />
        <AlertTitle>Une erreur est survenue</AlertTitle>
        <AlertDescription>Échec de l'affichage du solde bancaire</AlertDescription>
        <Button variant="outline" onClick={() => refetch()}>
          Réessayer
        </Button>
      </Alert>
    )
  }

  return (
    <span className="text-4xl font-bold text-[#249046] text-shadow-md">
      {formatCurrency(data ?? 0)}
    </span>
  )
}
