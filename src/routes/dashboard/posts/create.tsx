import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import type { InferCreatePostSchema } from '#/features/post/schemas/post.schema.ts'
import { createPostSchema } from '#/features/post/schemas/post.schema.ts'
import { createPostFn } from '#/server-fn/post.functions.ts'
import { pageMetadata } from '#/utils/seo.ts'
import { Button, buttonVariants } from '#shared/components/ui/button.tsx'
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
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/posts/create')({
  head: () => ({ meta: pageMetadata('Créer un article') }),
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = Route.useNavigate()
  const form = useAppForm({
    validators: {
      onChange: createPostSchema,
    },
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImageUrl: '',
      status: POST_STATUS.DRAFT,
      publishedAt: null,
    } as InferCreatePostSchema,
    onSubmit: async ({ value, formApi }) => {
      const result = await createPostFn({ data: value })

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

      void navigate({ to: '/dashboard/posts/show/$id', params: { id: result.postId } })
      toast.success('Article créé !')
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Créer un article"
          description="Ajoutez un nouvel article sur l'application"
          backButton={{
            'to': '/dashboard/posts',
            'aria-label': "Retour sur la page d'administration des articles",
            'preload': false,
          }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <form.AppForm>
            <form
              id="create-post-form"
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
                      Renseignez les informations principales de l'article
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FieldGroup>
                      <form.AppField name="title">
                        {(field) => (
                          <field.InputField
                            label="Titre"
                            placeholder="Titre de l'article"
                            required
                          />
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
                              {
                                label: 'Archivé',
                                value: POST_STATUS.ARCHIVED,
                              },
                            ]}
                            onValueChange={(v, handleChange) => {
                              if (v === POST_STATUS.PUBLISHED) {
                                form.setFieldValue('publishedAt', new Date())
                              } else {
                                if (form.state.values.publishedAt) {
                                  form.setFieldValue('publishedAt', null)
                                }
                              }
                              handleChange(v)
                            }}
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
                        <form.Subscribe
                          selector={(state) => ({
                            isSubmitting: state.isSubmitting,
                            status: state.values.status,
                          })}
                        >
                          {({ isSubmitting, status }) => (
                            <Button
                              type="submit"
                              form="create-post-form"
                              disabled={isSubmitting}
                              className="flex-1"
                            >
                              {status === 'published' ? 'Publier' : 'Enregistrer'}
                            </Button>
                          )}
                        </form.Subscribe>
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
        </div>
      </div>
    </div>
  )
}
