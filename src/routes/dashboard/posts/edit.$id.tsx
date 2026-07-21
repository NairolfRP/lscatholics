import { createFileRoute, Link, redirect, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { DashboardHeading } from '#/features/dashboard/components/dashboard-heading.tsx'
import { getDashboardPostFn, updatePostFn } from '#/features/post/functions/post.functions.ts'
import type { InferEditPostSchema } from '#/features/post/schemas/post.schema.ts'
import { editPostSchema } from '#/features/post/schemas/post.schema.ts'
import { canEditPost } from '#/features/post/utils/post.utils.ts'
import { pageMetadata } from '#/utils/seo.ts'
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
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export const Route = createFileRoute('/dashboard/posts/edit/$id')({
  beforeLoad: async ({ params, context }) => {
    const post = await getDashboardPostFn({ data: params.id })
    const isAuthorized = canEditPost({ user: context.gameContext.user, authorId: post.authorId })

    if (!isAuthorized) {
      throw redirect({ to: '/dashboard/posts', replace: true })
    }

    return { post }
  },
  loader: ({ context }) => ({ post: context.post }),
  head: () => ({ meta: pageMetadata("Modifier l'article") }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { post } = Route.useLoaderData()

  const form = useAppForm({
    validators: {
      onChange: editPostSchema,
    },
    // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
    defaultValues: {
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt ?? undefined,
      content: post.content,
      coverImageUrl: post.coverImageUrl,
      publishedAt: post.publishedAt,
      status: post.status,
    } as InferEditPostSchema,
    onSubmit: async ({ value, formApi }) => {
      const result = await updatePostFn({ data: { postId: post.id, ...value } })

      if (!result.success) {
        if (result.validationErrors) {
          return formApi.setErrorMap({
            onServer: {
              fields: result.validationErrors,
            },
          } as unknown as Parameters<typeof formApi.setErrorMap>[0])
        }

        return toast.error('Une erreur est survenue')
      }

      toast.success('Article mis à jour !')
      await router.invalidate()
      formApi.reset()
    },
  })

  return (
    <div className="container mx-auto pt-5">
      <div className="space-y-6">
        <DashboardHeading
          title="Modifier l'article"
          description={post.title}
          backButton={{ to: '/dashboard/posts', preload: false }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <form.AppForm>
            <form
              id="edit-post-form"
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
                    <CardDescription>Modifiez les informations de l'article</CardDescription>
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
                        <form.SubmitButton
                          label="Mettre à jour"
                          submittingLabel="Mise à jour..."
                          form="edit-post-form"
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
        </div>
      </div>
    </div>
  )
}
