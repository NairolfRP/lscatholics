import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { TrafficConeIcon } from 'lucide-react'
import {
  BANK_TRANSFER_FORM_MAX_LENGTH,
  BANK_TRANSFER_FORM_MIN_LENGTH,
} from '#/features/banking/constants/banking.constants.ts'
import { transferFormOptions } from '#/features/banking/form/transfer-form-options.ts'
import { bankAccountBalanceQueryOptions } from '#/features/banking/queries.ts'
import { bankTransferSchema } from '#/features/banking/schema/banking.schema.ts'
import { bankTransferFn } from '#/features/banking/server-fn/banking.functions.ts'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { formatCurrency } from '#/utils/number.ts'
import { Alert, AlertDescription, AlertTitle } from '#shared/components/ui/alert.tsx'
import { Card, CardContent } from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'
import { hasPermission } from '#shared/utils/permissions.ts'

export const Route = createFileRoute('/dashboard/finances/transfer')({
  beforeLoad: ({ context }) => {
    if (!hasPermission(context.gameContext.permissions, 'finances', 'transaction')) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: import.meta.env.DEV ? WIPComponent : RouteComponent,
})

function WIPComponent() {
  const queryClient = useQueryClient()
  const navigate = Route.useNavigate()

  const form = useAppForm({
    ...transferFormOptions,
    validators: {
      onChange: bankTransferSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await bankTransferFn({ data: value })

      if (!result.success) {
        if (result.validationErrors) {
          return formApi.setErrorMap({
            onServer: {
              fields: result.validationErrors,
            },
          } as unknown as Parameters<typeof formApi.setErrorMap>[0])
        }

        return toast.error(result.error)
      }

      queryClient.setQueryData(bankAccountBalanceQueryOptions.queryKey, result.data!.newBalance)

      await navigate({ to: '/dashboard/finances' })
      toast.add({
        type: 'success',
        title: 'Transaction effectuée',
        description: (
          <ul>
            <li>
              <strong>ID</strong> : #{result.data!.transferId}
            </li>
            <li>
              <strong>Destinataire</strong> : {result.data!.recipient}
            </li>
            <li>
              <strong>Montant</strong> : {formatCurrency(result.data!.amount)}
            </li>
          </ul>
        ),
      })
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Effectuer une transaction"
          description="Effectuer une transaction bancaire depuis les comptes de l'Archidiocèse"
          backButton={{
            'to': '/dashboard/finances',
            'aria-label': 'Retour sur la page des finances',
            'preload': false,
          }}
        />
        <Card>
          <CardContent>
            <form.AppForm>
              <form
                id={form.formId}
                onSubmit={(e) => {
                  e.preventDefault()
                  void form.handleSubmit()
                }}
                className="max-w-xl"
              >
                <FieldGroup>
                  <form.AppField name="iban">
                    {(field) => <field.IbanField label="IBAN du destinataire" required />}
                  </form.AppField>
                  <form.AppField name="amount">
                    {(field) => (
                      <field.CurrencyField
                        type="number"
                        label="Montant de la transaction"
                        required
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="description">
                    {(field) => (
                      <field.InputField
                        label="Libellé"
                        minLength={BANK_TRANSFER_FORM_MIN_LENGTH.DESCRIPTION}
                        maxLength={BANK_TRANSFER_FORM_MAX_LENGTH.DESCRIPTION}
                        required
                      />
                    )}
                  </form.AppField>
                  <form.AppField name="comment">
                    {(field) => (
                      <field.TextareaField
                        label="Commentaire (interne)"
                        description="Visible uniquement en interne de l'Archidiocèse de Los Santos"
                        maxLength={BANK_TRANSFER_FORM_MAX_LENGTH.COMMENT}
                      />
                    )}
                  </form.AppField>

                  <form.SubmitButton label="Opérer" submittingLabel="Transaction en cours..." />
                </FieldGroup>
              </form>
            </form.AppForm>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RouteComponent() {
  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Effectuer une transaction"
          description="Effectuer une transaction bancaire depuis les comptes de l'Archidiocèse"
          backButton={{
            'to': '/dashboard/finances',
            'aria-label': 'Retour sur la page des finances',
            'preload': false,
          }}
        />
        <div className="mx-auto max-w-2xl">
          <Alert variant="info">
            <TrafficConeIcon />
            <AlertTitle>Bientôt disponible</AlertTitle>
            <AlertDescription>
              Cette fonctionnalité n'est pas encore disponible. J'attends que le serveur soit ouvert
              pour effectuer des tests.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    </div>
  )
}
