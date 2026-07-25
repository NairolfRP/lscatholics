import { Link } from '@tanstack/react-router'
import type { CreatePostFormInput, EditPostFormInput } from '#/features/post/schemas/post.schema.ts'
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
import { POST_STATUS } from '#shared/constants/post-status.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const DashboardPostForm = withForm({
  defaultValues: {} as CreatePostFormInput | EditPostFormInput,
  props: {
    variant: 'create' as 'create' | 'edit',
  },
  render: function Render({ form, variant }) {
    const formId = variant === 'edit' ? 'edit-post-form' : 'create-post-form'

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
                <CardTitle>Contenu</CardTitle>
                <CardDescription>
                  {variant === 'edit'
                    ? "Modifiez les informations de l'article"
                    : "Renseignez les informations principales de l'article"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <form.AppField name="title">
                    {(field) => (
                      <field.InputField label="Titre" placeholder="Titre de l'article" required />
                    )}
                  </form.AppField>

                  <form.AppField name="slug">
                    {(field) => (
                      <field.InputField
                        label="Slug"
                        description="Laissez vide pour générer automatiquement"
                        placeholder="url-de-larticle"
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="excerpt">
                    {(field) => (
                      <field.TextareaField
                        label="Extrait"
                        placeholder="Résumé de l'article"
                        description="Laissez vide pour générer automatiquement (sur la base du contenu)"
                        rows={3}
                      />
                    )}
                  </form.AppField>

                  <form.AppField name="content">
                    {(field) => (
                      <field.TextareaField
                        label="Contenu"
                        placeholder="Contenu de l'article"
                        rows={15}
                        markdown
                        required
                      />
                    )}
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
              <CardContent>
                <FieldGroup>
                  <form.AppField name="status">
                    {(field) => (
                      <field.SelectField
                        label="Statut"
                        placeholder="Sélectionnet un statut"
                        errorsPos="after"
                        values={[
                          {
                            label: 'Brouillon',
                            value: POST_STATUS.DRAFT,
                          },
                          {
                            label: 'Publié',
                            value: POST_STATUS.PUBLISHED,
                          },
                          ...(variant === 'edit'
                            ? [
                                {
                                  label: 'Archivé',
                                  value: POST_STATUS.ARCHIVED,
                                },
                              ]
                            : []),
                        ]}
                        onValueChange={
                          variant === 'create'
                            ? (v, handleChange) => {
                                if (v === POST_STATUS.PUBLISHED) {
                                  form.setFieldValue('publishedAt', new Date())
                                } else {
                                  if (form.state.values.publishedAt) {
                                    form.setFieldValue('publishedAt', null)
                                  }
                                }
                                handleChange(v)
                              }
                            : undefined
                        }
                      />
                    )}
                  </form.AppField>

                  <form.Subscribe selector={(state) => state.values.status}>
                    {(status) =>
                      status === 'published' && (
                        <form.AppField name="publishedAt">
                          {(field) => <field.DateTimePickerField label="Date de publication" />}
                        </form.AppField>
                      )
                    }
                  </form.Subscribe>

                  <Field orientation="horizontal">
                    <form.SubmitButton<typeof form.state.values>
                      label={
                        variant === 'edit'
                          ? 'Mettre à jour'
                          : (state) =>
                              state.values.status === POST_STATUS.PUBLISHED
                                ? 'Publier'
                                : 'Enregistrer'
                      }
                      submittingLabel={variant === 'edit' ? 'Mise à jour...' : 'Création...'}
                      form={formId}
                      disabled={(state) => !state.canSubmit || state.isSubmitting || !state.isDirty}
                      className="flex-1"
                    />

                    <Link
                      type="button"
                      to="/dashboard/posts"
                      className={buttonVariants({ variant: 'outline' })}
                    >
                      Annuler
                    </Link>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image à la une *</CardTitle>
              </CardHeader>
              <CardContent>
                <form.Field name="coverImageUrl">
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
                </form.Field>
              </CardContent>
            </Card>
          </div>
        </form>
      </form.AppForm>
    )
  },
})
