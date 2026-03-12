import { router } from '@inertiajs/react'
import { useForm } from '@tanstack/react-form'
import { hasRoute, urlFor } from '@/client'
import { CreatePostSchema, createPostSchema } from '@/features/posts/schemas/dashboard/post.schema'
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
import { MarkdownTextarea } from '@/shared/components/ui/markdown-textarea'
import { Link } from '@adonisjs/inertia/react'
import { serverErrorsFormConvertor } from '@/lib/utils'

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function CreatePostForm() {
  const form = useForm({
    validators: { onChange: createPostSchema },
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      status: 'draft',
      coverImageUrl: '',
    } as CreatePostSchema,
    onSubmit: ({ value }) => {
      if (!hasRoute('dashboard.dashboard_posts.store')) return

      router.post(urlFor('dashboard.dashboard_posts.store'), value, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => form.reset(),
        onError: (err) => {
          form.setErrorMap({ onSubmit: serverErrorsFormConvertor(err) })
        },
      })
    },
  })

  return (
    <form
      id={DASHBOARD_POST_FORMS_ID.CREATE}
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
              <CardDescription>
                Renseignez les informations principales de l'article
              </CardDescription>
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
                          onBlur={() => {
                            if (!form.getFieldValue('slug')) {
                              form.setFieldValue('slug', generateSlug(field.state.value))
                            }
                            field.handleBlur()
                          }}
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
                        <FieldLabel htmlFor={field.name}>Contenu *</FieldLabel>
                        <MarkdownTextarea
                          id={field.name}
                          value={field.state.value}
                          onChange={(v) => field.handleChange(v ?? '')}
                          onBlur={field.handleBlur}
                          placeholder="Contenu de l'article"
                          rows={15}
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
                          onValueChange={(v: CreatePostSchema['status']) => field.handleChange(v)}
                        >
                          <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                            <SelectValue placeholder="Sélectionner un statut" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Brouillon</SelectItem>
                            <SelectItem value="published">Publié</SelectItem>
                          </SelectContent>
                        </Select>
                      </Field>
                    )
                  }}
                />

                <Field orientation="horizontal">
                  <form.Subscribe
                    selector={(state) => ({
                      isSubmitting: state.isSubmitting,
                      status: state.values.status,
                    })}
                    children={({ isSubmitting, status }) => (
                      <Button
                        type="submit"
                        form={DASHBOARD_POST_FORMS_ID.CREATE}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        {status === 'published' ? 'Publier' : 'Enregistrer'}
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
