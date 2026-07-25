import { Link } from '@tanstack/react-router'
import { parishes } from '#/config/parishes.ts'
import type {
  CreateChurchEventFormInput,
  EditChurchEventFormInput,
} from '#/features/church-event/schemas/church-event.schema.ts'
import { buttonVariants } from '#shared/components/ui/button.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Field, FieldError, FieldGroup } from '#shared/components/ui/field.tsx'
import { Input } from '#shared/components/ui/input.tsx'
import { Separator } from '#shared/components/ui/separator.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const DashboardChurchEventForm = withForm({
  defaultValues: {} as CreateChurchEventFormInput | EditChurchEventFormInput,
  props: {
    variant: 'create' as 'create' | 'edit',
  },
  render: function Render({ form, variant }) {
    const formId = variant === 'edit' ? 'edit-church-event-form' : 'create-church-event-form'

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
                    ? "Modifiez les détails de l'événement"
                    : "Indiquez les détails de l'événement"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FieldGroup>
                  <form.AppField name="title">
                    {(field) => (
                      <field.InputField label="Titre" placeholder="Titre de l'événement" required />
                    )}
                  </form.AppField>

                  <form.AppField name="slug">
                    {(field) => (
                      <field.InputField
                        label="Slug"
                        description="Laissez vide pour générer automatiquement"
                        placeholder="url-de-levenement"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="description">
                    {(field) => (
                      <field.TextareaField
                        label="Description"
                        placeholder="Description de l'événement"
                        rows={3}
                        required
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="parish">
                    {(field) => (
                      <field.SelectField
                        label="Paroisse"
                        errorsPos="after"
                        values={[
                          { label: 'Sélectionner une paroisse', value: null },
                          ...parishes.map((parish) => ({
                            label: parish.title,
                            value: parish.id,
                          })),
                        ]}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="location">
                    {(field) => (
                      <field.InputField
                        label="Lieu"
                        placeholder="Adresse ou lieu de l'événement"
                        required
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="content">
                    {(field) => (
                      <field.TextareaField
                        label="Contenu"
                        placeholder="Plus de détails sur l'événement..."
                        rows={12}
                        markdown
                        required
                      />
                    )}
                  </form.AppField>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dates et horaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <form.AppField
                    name="startDate"
                    validators={{
                      onChangeListenTo: ['endDate'],
                    }}
                  >
                    {(field) => <field.DateTimePickerField label="Date de début" required />}
                  </form.AppField>

                  <form.AppField
                    name="endDate"
                    validators={{
                      onChangeListenTo: ['startDate'],
                      onChange: ({ value, fieldApi }) => {
                        const startDate = fieldApi.form.getFieldValue('startDate')

                        // oxlint-disable-next-line typescript/no-unnecessary-condition
                        if (value && startDate && value <= startDate) {
                          return { message: 'La date de fin doit être après la date de début.' }
                        }
                        return undefined
                      },
                    }}
                  >
                    {(field) => <field.DateTimePickerField label="Date de fin" />}
                  </form.AppField>
                </div>
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
                  <form.AppField name="registrationRequired">
                    {(field) => (
                      <field.CheckboxField
                        label="Inscription requise"
                        fieldProps={{ orientation: 'horizontal' }}
                      />
                    )}
                  </form.AppField>
                  <form.Subscribe selector={(state) => state.values.registrationRequired}>
                    {(isRegistrationRequired) => {
                      if (!isRegistrationRequired) return null

                      return (
                        <form.AppField name="maxParticipants">
                          {(field) => (
                            <field.InputField
                              type="number"
                              label="Nombre max. de participants"
                              placeholder="Illimité"
                              description="Laissez vide pour un nombre illimité"
                            />
                          )}
                        </form.AppField>
                      )
                    }}
                  </form.Subscribe>
                </FieldGroup>

                <Separator />

                <Field orientation="horizontal">
                  <form.SubmitButton
                    label={variant === 'edit' ? 'Mettre à jour' : "Créer l'événement"}
                    submittingLabel={variant === 'edit' ? 'Mise à jour...' : 'Création...'}
                    form={formId}
                    disabled={(state) => !state.canSubmit || !state.isDirty}
                    className="flex-1"
                  />

                  <Link
                    type="button"
                    to="/dashboard/events"
                    className={buttonVariants({ variant: 'outline' })}
                  >
                    Annuler
                  </Link>
                </Field>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image de couverture *</CardTitle>
              </CardHeader>
              <CardContent>
                <form.AppField name="coverImageUrl">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="URL de l'image"
                          type="url"
                          required
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        {field.state.value && !isInvalid && (
                          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border">
                            <img
                              src={field.state.value}
                              alt="Aperçu"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </Field>
                    )
                  }}
                </form.AppField>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Affiche / Flyer</CardTitle>
              </CardHeader>
              <CardContent>
                <form.AppField name="flyerUrl">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value ?? ''}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="URL de l'image"
                          type="url"
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        {field.state.value && !isInvalid && (
                          <div className="mt-4 aspect-video w-full overflow-hidden rounded-lg border">
                            <img
                              src={field.state.value}
                              alt="Aperçu"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </Field>
                    )
                  }}
                </form.AppField>
              </CardContent>
            </Card>
          </div>
        </form>
      </form.AppForm>
    )
  },
})
