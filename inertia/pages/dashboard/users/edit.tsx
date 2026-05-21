import Head from '@/shared/components/app-head'
import { Link } from '@adonisjs/inertia/react'
import { ArrowLeft } from 'lucide-react'
import { urlFor } from '@/lib/client'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import type { Data } from '@generated/data'
import { InertiaProps } from '@/shared/types/pages'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/shared/components/ui/multi-select'
import { useForm } from '@tanstack/react-form'
import { router } from '@inertiajs/react'
import { serverErrorsFormConvertor } from '@/lib/utils'
import { withDashboardLayout } from '@/shared/components/layout'

type PageProps = InertiaProps<{
  itemUser: Data.Users.User.Variants['withRoles']
  rolesList: Data.Roles.Role.Variants['minimalDetails'][]
  editorHighestRole: Data.Roles.Role.Variants['minimalDetails'] | undefined
}>

export default withDashboardLayout<PageProps>(
  ({ itemUser, rolesList, editorHighestRole }) => {
    const form = useForm({
      defaultValues: {
        roles: itemUser.roles.map((r) => r.id),
      },
      onSubmit: ({ value }) => {
        router.put(urlFor('dashboard.dashboard_users.update', { id: itemUser.id }), value, {
          onError: (err) => {
            form.setErrorMap({
              onSubmit: serverErrorsFormConvertor(err),
            })
          },
        })
      },
    })

    const onSubmit = (e: React.SubmitEvent) => {
      e.preventDefault()
      form.handleSubmit()
    }

    return (
      <>
        <Head title={`Modifier l'utilisateur ${itemUser.name}`} />

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Retour sur la page d'administration des utilisateurs"
              asChild
            >
              <Link route="dashboard.dashboard_users.index">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Modifier l'utilisateur</h1>
              <p className="text-gray-500 dark:text-gray-400">{itemUser.name}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Détails</CardTitle>
                  <CardDescription>Modifiez les paramètres de l'utilisateur</CardDescription>
                </CardHeader>
                <CardContent>
                  <form id="dashboard-edit-user-form" onSubmit={onSubmit}>
                    <FieldGroup>
                      <Field>
                        <FieldLabel>Nom d'utilisateur GTAW</FieldLabel>
                        <FieldDescription>{itemUser.name}</FieldDescription>
                      </Field>
                      <form.Field name="roles">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldContent>
                                <FieldLabel htmlFor="roles">Rôles</FieldLabel>
                                <FieldDescription>
                                  Assigner des rôles ou en retirer à l'utilisateur. Vous ne pouvez
                                  sélectionner que ceux qui sont inférieurs à vos rôles.
                                </FieldDescription>
                                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                              </FieldContent>
                              <MultiSelect
                                values={field.state.value.map((v) => String(v))}
                                onValuesChange={(v) => {
                                  if (!Array.isArray(v)) return
                                  field.handleChange(v.map((r) => Number(r)))
                                }}
                              >
                                <MultiSelectTrigger id={field.name} aria-invalid={isInvalid}>
                                  <MultiSelectValue
                                    clickToRemove={false}
                                    placeholder="Assigner des rôles"
                                  />
                                </MultiSelectTrigger>
                                <MultiSelectContent>
                                  <MultiSelectGroup>
                                    {rolesList.map((role) => (
                                      <MultiSelectItem
                                        key={role.id}
                                        value={String(role.id)}
                                        disabled={
                                          !editorHighestRole ||
                                          role.hierarchyOrder <= editorHighestRole.hierarchyOrder
                                        }
                                      >
                                        {role.name}
                                      </MultiSelectItem>
                                    ))}
                                  </MultiSelectGroup>
                                </MultiSelectContent>
                              </MultiSelect>
                            </Field>
                          )
                        }}
                      </form.Field>
                    </FieldGroup>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
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
                    <Button type="button" variant="outline" asChild>
                      <Link route="dashboard.dashboard_users.index">Annuler</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    breadcrumb: (props) => [
      { label: 'Utilisateurs', href: urlFor('dashboard.dashboard_users.index') },
      { label: props.itemUser.name },
    ],
  }
)
