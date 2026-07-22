import { useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { BanIcon, CircleOffIcon, ShieldXIcon } from 'lucide-react'
import { toast } from 'sonner'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { BanUserDialog } from '#/features/user/components/admin/ban-user-dialog.tsx'
import { useUserAdminMutations } from '#/features/user/hooks/use-user-admin-mutations.tsx'
import { updateUserFormSchema } from '#/features/user/schemas/user.schema.ts'
import { getTargetUserFn, updateTargetUserFn } from '#/features/user/server-fn/user.functions.ts'
import { getSessionFn } from '#/server-fn/auth.functions.ts'
import { ActionButton } from '#/shared/components/action-button.tsx'
import { ButtonGroup } from '#/shared/components/ui/button-group.tsx'
import { Button, buttonVariants } from '#/shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#/shared/components/ui/card.tsx'
import { Field, FieldGroup, FieldLabel } from '#/shared/components/ui/field'
import { Tooltip, TooltipContent, TooltipTrigger } from '#/shared/components/ui/tooltip.tsx'
import { allRoles, getRoleLevel, getUserRoleMaxLevel } from '#/shared/constants/roles.ts'
import { useAppForm } from '#/shared/integrations/form/form-hook.ts'
import type { User } from '#/shared/lib/types/auth.ts'
import type { UserRole } from '#/shared/types/role.types.ts'
import { formatDateTime } from '#/utils/date.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { parseCsvString } from '#/utils/string.ts'

export const Route = createFileRoute('/dashboard/users/edit/$id')({
  loader: async ({ params }) => {
    const targetUser = (await getTargetUserFn({ data: { userId: params.id } })) as User

    const session = await getSessionFn()
    const userHighestRole = session!.user.role
      ? getUserRoleMaxLevel(parseCsvString<Array<UserRole>>(session!.user.role))
      : 0

    const assignableRoles = allRoles
      .sort((a, b) => getRoleLevel(b) - getRoleLevel(a))
      .map((role) => ({
        name: role,
        disabled: getRoleLevel(role) >= userHighestRole,
      }))

    return { isSelf: targetUser.id === session!.user.id, targetUser, assignableRoles }
  },
  head: ({ loaderData }) => ({
    meta: pageMetadata(
      loaderData?.targetUser
        ? `Modifier l'utilisateur ${loaderData.targetUser.name}`
        : 'Utilisateur introuvable'
    ),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  const queryClient = useQueryClient()
  const { isSelf, targetUser, assignableRoles } = Route.useLoaderData()
  const { unbanUserMutation, handleBanSuccess } = useUserAdminMutations()

  const form = useAppForm({
    defaultValues: {
      roles: targetUser.role ? parseCsvString<Array<UserRole>>(targetUser.role) : [],
    },
    validators: {
      onChange: updateUserFormSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const result = await updateTargetUserFn({
        data: {
          ...value,
          targetId: targetUser.id,
        },
      })

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

      void queryClient.invalidateQueries({ queryKey: ['admin', 'list-users'] })
      toast.success('Utilisateur mis à jour')
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Modifier l'utilisateur"
          backButton={{ to: '/dashboard/users', preload: false }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Détails</CardTitle>
                <CardDescription>Modifiez les paramètres de l'utilisateur</CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  id="dashboard-edit-user-form"
                  onSubmit={(e) => {
                    e.preventDefault()
                    void form.handleSubmit()
                  }}
                >
                  <FieldGroup>
                    <Field>
                      <FieldLabel>Nom d'utilisateur GTAW</FieldLabel>
                      {targetUser.name}
                    </Field>
                    <form.AppField name="roles">
                      {(field) => (
                        <field.MultiSelectField
                          label="Rôles"
                          description="Assigner des rôles ou en retirer à l'utilisateur. Vous ne pouvez sélectionner que ceux qui sont inférieurs à vos rôles."
                          placeholder="Assigner des rôles"
                          values={assignableRoles.map((role) => ({
                            label: role.name,
                            value: role.name,
                            disabled: role.disabled,
                          }))}
                          selectValueProps={{
                            clickToRemove: false,
                          }}
                          errorsPos="after"
                        />
                      )}
                    </form.AppField>
                  </FieldGroup>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ButtonGroup>
                  {targetUser.banned ? (
                    <ActionButton
                      variant="info"
                      areYouSureTitle="Débannir ?"
                      title={`Débannir ${targetUser.name}`}
                      areYouSureDescription={
                        <>
                          Êtes-vous sûr de vouloir lever le bannissement de{' '}
                          <strong>{targetUser.name}</strong> ?
                          {/* oxlint-disable-next-line typescript/no-unnecessary-condition */}
                          {targetUser.banExpires ? (
                            <>
                              {' '}
                              Il est temporairement banni jusqu'au{' '}
                              {formatDateTime(targetUser.banExpires)}
                            </>
                          ) : null}
                        </>
                      }
                      aria-label={`Débannir ${targetUser.name}`}
                      action={() => unbanUserMutation.mutateAsync(targetUser.id)}
                      requireAreYouSure
                    >
                      <CircleOffIcon /> Débannir
                    </ActionButton>
                  ) : isSelf ? (
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <span className="inline-block w-fit">
                            <Button
                              variant="warning"
                              aria-label={`Bannir ${targetUser.name}`}
                              disabled
                            >
                              <BanIcon /> Bannir
                            </Button>
                          </span>
                        }
                      />
                      <TooltipContent>
                        <ShieldXIcon /> <p>Vous ne pouvez pas vous bannir vous-même.</p>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <BanUserDialog user={targetUser} onSuccess={handleBanSuccess}>
                      <Button
                        variant="warning"
                        title={`Bannir ${targetUser.name}`}
                        aria-label={`Bannir ${targetUser.name}`}
                      >
                        <BanIcon /> Bannir
                      </Button>
                    </BanUserDialog>
                  )}
                </ButtonGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enregistrer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <form.Subscribe selector={(state) => [state.isSubmitting]}>
                    {([isSubmitting]) => (
                      <Button
                        form="dashboard-edit-user-form"
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Mettre à jour
                      </Button>
                    )}
                  </form.Subscribe>
                  <Link
                    type="button"
                    className={buttonVariants({ variant: 'outline' })}
                    to="/dashboard/users"
                  >
                    Annuler
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
