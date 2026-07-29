import { Link } from '@tanstack/react-router'
import { PlusCircleIcon, XIcon } from 'lucide-react'
import { genericDashboardJobPostingFormOptions } from '#/features/job-posting/forms/job-posting-form-options.ts'
import { getDepartmentTitle } from '#/utils/department.ts'
import { Button, buttonVariants } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '#shared/components/ui/field.tsx'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '#shared/components/ui/input-group.tsx'
import { DEPARTMENT_VALUES } from '#shared/constants/department.ts'
import { EMPLOYMENT_TYPE_VALUES, employmentTypeLabel } from '#shared/constants/employment.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const DashboardJobPostingForm = withForm({
  ...genericDashboardJobPostingFormOptions,
  props: {
    variant: 'create' as 'create' | 'edit',
  },
  render: function Render({ form, variant }) {
    const formId = variant === 'edit' ? 'edit-job-posting-form' : 'create-job-posting-form'

    return (
      <form.AppForm>
        <form
          id={formId}
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="contents"
        >
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Informations principales</CardTitle>
                <CardDescription>
                  {variant === 'edit'
                    ? "Modifiez les détails de l'offre d'emploi"
                    : "Renseignez les informations principales de l'offre d'emploi"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <form.AppField name="employmentType">
                    {(field) => (
                      <field.SelectField
                        label="Type d'emploi"
                        placeholder="Sélectionnez un type d'emploi"
                        values={Object.values(EMPLOYMENT_TYPE_VALUES).map((employmentType) => ({
                          label: employmentTypeLabel[employmentType],
                          value: employmentType,
                        }))}
                        required
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="title">
                    {(field) => (
                      <field.InputField label="Titre" placeholder="Titre de l'emploi" required />
                    )}
                  </form.AppField>

                  <form.AppField name="slug">
                    {(field) => (
                      <field.InputField
                        label="Slug"
                        description="Laissez vide pour générer automatiquement"
                        placeholder="url-de-loffre"
                      />
                    )}
                  </form.AppField>

                  <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-2">
                    <form.AppField name="department">
                      {(field) => (
                        <field.SelectField
                          label="Département"
                          placeholder="Sélectionnez un département"
                          values={Object.values(DEPARTMENT_VALUES)
                            .map((departmentId) => {
                              const departmentLabel = getDepartmentTitle(departmentId, true)
                              if (!departmentLabel) return
                              return {
                                label: departmentLabel,
                                value: departmentId,
                              }
                            })
                            .filter((dep) => dep !== undefined)}
                          required
                        />
                      )}
                    </form.AppField>

                    <form.AppField name="reportsTo">
                      {(field) => (
                        <field.InputField
                          label="Relève de"
                          placeholder="Intitulé de la fonction du supérieur direct"
                        />
                      )}
                    </form.AppField>
                  </div>

                  <div className="grid grid-cols-1 items-start gap-7 xl:grid-cols-2">
                    <form.AppField name="salary.min">
                      {(field) => (
                        <field.CurrencyField
                          label="Salaire min."
                          description="Indiquez uniquement le salaire minimum si vous n'avez pas besoin de spécifier une fourchette salariale."
                          placeholder="0"
                          required
                        />
                      )}
                    </form.AppField>
                    <form.AppField name="salary.max">
                      {(field) => <field.CurrencyField label="Salaire max." placeholder="0" />}
                    </form.AppField>
                  </div>

                  <form.AppField name="description">
                    {(field) => <field.TextareaField label="Description" rows={10} markdown />}
                  </form.AppField>

                  <form.AppField name="responsibilities" mode="array">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <FieldSet>
                          <FieldLegend variant="label" required>
                            Fonctions essentielles
                          </FieldLegend>
                          <FieldGroup>
                            {field.state.value?.map((_, i) => (
                              <form.AppField key={i} name={`responsibilities[${i}]`}>
                                {(subField) => {
                                  const isSubFieldInvalid =
                                    subField.state.meta.isTouched && !subField.state.meta.isValid
                                  return (
                                    <Field
                                      orientation="horizontal"
                                      data-invalid={isSubFieldInvalid}
                                    >
                                      <FieldContent>
                                        <InputGroup>
                                          <InputGroupInput
                                            type="text"
                                            name={subField.name}
                                            value={subField.state.value}
                                            onBlur={subField.handleBlur}
                                            onChange={(e) => subField.handleChange(e.target.value)}
                                            aria-invalid={isSubFieldInvalid}
                                            placeholder="Rédiger des offres d'emplois"
                                            autoComplete="off"
                                          />
                                          {field.state.value && field.state.value.length > 1 && (
                                            <InputGroupAddon align="inline-end">
                                              <InputGroupButton
                                                type="button"
                                                variant="ghost"
                                                size="icon-xs"
                                                aria-label="Supprimer la ligne"
                                                onClick={() => field.removeValue(i)}
                                              >
                                                <XIcon />
                                              </InputGroupButton>
                                            </InputGroupAddon>
                                          )}
                                        </InputGroup>
                                        {isSubFieldInvalid && (
                                          <FieldError errors={subField.state.meta.errors} />
                                        )}
                                      </FieldContent>
                                    </Field>
                                  )
                                }}
                              </form.AppField>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.pushValue('')}
                            >
                              <PlusCircleIcon /> Ajouter
                            </Button>
                          </FieldGroup>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </FieldSet>
                      )
                    }}
                  </form.AppField>

                  <form.AppField name="requirements" mode="array">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <FieldSet>
                          <FieldLegend variant="label">Conditions requises</FieldLegend>
                          <FieldGroup>
                            {field.state.value?.map((_, i) => (
                              <form.AppField key={i} name={`requirements[${i}]`}>
                                {(subField) => {
                                  const isSubFieldInvalid =
                                    subField.state.meta.isTouched && !subField.state.meta.isValid
                                  return (
                                    <Field
                                      orientation="horizontal"
                                      data-invalid={isSubFieldInvalid}
                                    >
                                      <FieldContent>
                                        <InputGroup>
                                          <InputGroupInput
                                            type="text"
                                            name={subField.name}
                                            value={subField.state.value}
                                            onBlur={subField.handleBlur}
                                            onChange={(e) => subField.handleChange(e.target.value)}
                                            aria-invalid={isSubFieldInvalid}
                                            placeholder="Être titulaire du permis de conduire"
                                            autoComplete="off"
                                          />
                                          <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                              type="button"
                                              variant="ghost"
                                              size="icon-xs"
                                              aria-label="Supprimer la ligne"
                                              onClick={() => field.removeValue(i)}
                                            >
                                              <XIcon />
                                            </InputGroupButton>
                                          </InputGroupAddon>
                                        </InputGroup>
                                        {isSubFieldInvalid && (
                                          <FieldError errors={subField.state.meta.errors} />
                                        )}
                                      </FieldContent>
                                    </Field>
                                  )
                                }}
                              </form.AppField>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.pushValue('')}
                            >
                              <PlusCircleIcon /> Ajouter
                            </Button>
                          </FieldGroup>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </FieldSet>
                      )
                    }}
                  </form.AppField>

                  <form.AppField name="skills" mode="array">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <FieldSet>
                          <FieldLegend variant="label">Profil recherché</FieldLegend>
                          <FieldGroup>
                            {field.state.value?.map((_, i) => (
                              <form.AppField key={i} name={`skills[${i}]`}>
                                {(subField) => {
                                  const isSubFieldInvalid =
                                    subField.state.meta.isTouched && !subField.state.meta.isValid
                                  return (
                                    <Field
                                      orientation="horizontal"
                                      data-invalid={isSubFieldInvalid}
                                    >
                                      <FieldContent>
                                        <InputGroup>
                                          <InputGroupInput
                                            type="text"
                                            name={subField.name}
                                            value={subField.state.value}
                                            onBlur={subField.handleBlur}
                                            onChange={(e) => subField.handleChange(e.target.value)}
                                            aria-invalid={isSubFieldInvalid}
                                            placeholder="Adhère et respecte l'enseignement social de l'Église catholique"
                                            autoComplete="off"
                                          />
                                          <InputGroupAddon align="inline-end">
                                            <InputGroupButton
                                              type="button"
                                              variant="ghost"
                                              size="icon-xs"
                                              aria-label="Supprimer la ligne"
                                              onClick={() => field.removeValue(i)}
                                            >
                                              <XIcon />
                                            </InputGroupButton>
                                          </InputGroupAddon>
                                        </InputGroup>
                                        {isSubFieldInvalid && (
                                          <FieldError errors={subField.state.meta.errors} />
                                        )}
                                      </FieldContent>
                                    </Field>
                                  )
                                }}
                              </form.AppField>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.pushValue('')}
                            >
                              <PlusCircleIcon /> Ajouter
                            </Button>
                          </FieldGroup>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </FieldSet>
                      )
                    }}
                  </form.AppField>
                </FieldGroup>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <form.AppField name="isActive">
                    {(field) => (
                      <field.CheckboxField
                        label="Recrutement ouvert"
                        fieldProps={{ orientation: 'horizontal' }}
                      />
                    )}
                  </form.AppField>

                  <form.Subscribe selector={(state) => state.values.isActive}>
                    {(isActive) => {
                      if (!isActive) return null

                      return (
                        <>
                          <form.AppField name="postedAt">
                            {(field) => <field.DateTimePickerField label="Date de publication" />}
                          </form.AppField>

                          <form.AppField name="expiresAt">
                            {(field) => <field.DateTimePickerField label="Date d'expiration" />}
                          </form.AppField>
                        </>
                      )
                    }}
                  </form.Subscribe>

                  <Field orientation="horizontal">
                    <form.SubmitButton<typeof form.state.values>
                      label={(state) =>
                        variant === 'edit'
                          ? 'Mettre à jour'
                          : state.values.isActive
                            ? 'Publier'
                            : 'Enregistrer'
                      }
                      submittingLabel={variant === 'edit' ? 'Mise à jour...' : 'Création...'}
                      form={formId}
                      disabled={(state) => !state.canSubmit || !state.isDirty}
                      className="flex-1"
                    />

                    <Link
                      type="button"
                      to="/dashboard/job-openings"
                      className={buttonVariants({ variant: 'outline' })}
                    >
                      Annuler
                    </Link>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </div>
        </form>
      </form.AppForm>
    )
  },
})
