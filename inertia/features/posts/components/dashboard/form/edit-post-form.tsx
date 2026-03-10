import { router, usePage } from '@inertiajs/react'
import { useForm } from '@tanstack/react-form'
import { hasRoute, urlFor } from '@/client'
import { type EditPostSchema, editPostSchema } from '@/features/posts/schemas/dashboard/post.schema'
import { DASHBOARD_POST_FORMS_ID } from '@/features/posts/constants/dashboard_posts.constants'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import DateTimePicker from '@/shared/components/ui/datetime-picker'
import { MarkdownTextarea } from '@/shared/components/ui/markdown'
import type { Data } from '@generated/data'
import { serverErrorsFormConvertor } from '@/lib/utils'
import { Link } from '@adonisjs/inertia/react'

type Props = {
  post: Data.Posts.Post.Variants['allFields']
}

export function EditPostForm() {
  const { post } = usePage<Props>().props

  const form = useForm({
    validators: { onChange: editPostSchema },
    defaultValues: {
      title: post.title ?? '',
      slug: post.slug ?? '',
      excerpt: post.excerpt ?? '',
      content: post.content ?? '',
      coverImageUrl: post.coverImageUrl ?? '',
      status: post.status ?? '',
      publishedAt: post.publishedAt ? new Date(post.publishedAt) : (null as Date | null),
    } as EditPostSchema,
    onSubmit: ({ value }) => {
      if (!hasRoute('dashboard.dashboard_posts.update')) return

      router.put(urlFor('dashboard.dashboard_posts.update', { id: post.id }), value, {
        preserveScroll: true,
        preserveState: true,
        onError: (err) => {
          form.setErrorMap({ onSubmit: serverErrorsFormConvertor(err) })
        },
      })
    },
  })

  return (
    <form
      id={DASHBOARD_POST_FORMS_ID.EDIT}
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
              <CardDescription>Modifiez les informations de l'article</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <form.Field
                  name="title"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Titre *</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Titre de l'article"
                          required
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />

                <form.Field
                  name="slug"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Slug</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="url-de-larticle"
                        />
                        <FieldDescription>
                          Laissez vide pour générer automatiquement
                        </FieldDescription>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />

                <form.Field
                  name="excerpt"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Extrait</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Résumé de l'article"
                          rows={3}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />

                <form.Field
                  name="content"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Contenu</FieldLabel>
                        <MarkdownTextarea
                          id={field.name}
                          value={field.state.value}
                          onChange={(v) => field.handleChange(v ?? '')}
                          placeholder="Contenu de l'article"
                          rows={15}
                          preview="live"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />
              </FieldGroup>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <form.Field
                  name="status"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldContent>
                          <FieldLabel htmlFor={field.name}>Statut</FieldLabel>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </FieldContent>
                        <Select
                          name={field.name}
                          value={field.state.value}
                          onValueChange={(value: EditPostSchema['status']) => {
                            field.handleChange(value)
                            if (value === 'published') {
                              form.setFieldValue(
                                'publishedAt',
                                post.publishedAt ? new Date(post.publishedAt) : new Date()
                              )
                            } else {
                              form.setFieldValue('publishedAt', null)
                            }
                          }}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Brouillon</SelectItem>
                            <SelectItem value="published">Publié</SelectItem>
                            <SelectItem value="archived">Archivé</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )
                  }}
                />

                <form.Subscribe
                  selector={(state) => state.values.status}
                  children={(status) =>
                    status === 'published' && (
                      <form.Field
                        name="publishedAt"
                        children={(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>Date de publication</FieldLabel>
                              <DateTimePicker
                                id={field.name}
                                value={field.state.value}
                                onChange={field.handleChange}
                                aria-invalid={isInvalid}
                              />
                              {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                          )
                        }}
                      />
                    )
                  }
                />

                <Field orientation="horizontal">
                  <form.Subscribe
                    selector={(state) => state.isSubmitting}
                    children={(isSubmitting) => (
                      <Button
                        type="submit"
                        form={DASHBOARD_POST_FORMS_ID.EDIT}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Mettre à jour
                      </Button>
                    )}
                  />
                  <Button type="button" variant="outline" asChild>
                    <Link route="dashboard.dashboard_posts.index">Annuler</Link>
                  </Button>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image à la une *</CardTitle>
            </CardHeader>
            <CardContent>
              <form.Field
                name="coverImageUrl"
                children={(field) => {
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
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  )
}
