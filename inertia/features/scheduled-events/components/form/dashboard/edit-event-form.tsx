import { router } from '@inertiajs/react'
import { useForm } from '@tanstack/react-form'
import { hasRoute, urlFor } from '@/client'
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
import { MarkdownTextarea } from '@/shared/components/ui/markdown'
import { Link } from '@adonisjs/inertia/react'
import { serverErrorsFormConvertor } from '@/lib/utils'
import { DASHBOARD_EVENT_FORMS_ID } from '@/features/scheduled-events/constants/dashboard_events.constants'
import { parishes } from '@/shared/constants/parishes.constants'
import DateTimePicker from '@/shared/components/ui/datetime-picker'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Separator } from '@/shared/components/ui/separator'
import type { Data } from '@generated/data'

type Props = {
  event: Data.ScheduledEvents.ScheduledEvent.Variants['allFields']
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function EditEventForm({ event }: Props) {
  const form = useForm({
    defaultValues: {
      title: event.title,
      slug: event.slug,
      description: event.description,
      content: event.content,
      location: event.location || '',
      parishId: event.parishId ?? undefined,
      coverImageUrl: event.coverImageUrl || '',
      flyerUrl: event.flyerUrl || '',
      registrationRequired: event.registrationRequired,
      maxParticipants: event.maxParticipants || undefined,
      startDate: event.startDate ? new Date(event.startDate) : undefined,
      endDate: event.endDate ? new Date(event.endDate) : undefined,
    },
    onSubmit: ({ value }) => {
      if (!hasRoute('dashboard.dashboard_events.update')) return

      router.put(urlFor('dashboard.dashboard_events.update', { id: event.id }), value, {
        preserveScroll: true,
        preserveState: true,
        onError: (err) => {
          form.setErrorMap({ onSubmit: serverErrorsFormConvertor(err) })
        },
      })
    },
  })

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <form id={DASHBOARD_EVENT_FORMS_ID.EDIT} onSubmit={handleSubmit}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations principales</CardTitle>
              <CardDescription> Modifiez les détails de l'événement </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                          placeholder="Titre de l'événement"
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
                          placeholder="url-de-levenement"
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
                  name="description"
                  children={(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Description *</FieldLabel>
                        <Textarea
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          placeholder="Résumé de l'événement"
                          rows={3}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                />

                <div className="space-y-2">
                  <form.Field
                    name="parishId"
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldContent>
                            <FieldLabel htmlFor={field.name}>Paroisse</FieldLabel>
                            {isInvalid && <FieldError errors={field.state.meta.errors} />}
                          </FieldContent>
                          <Select
                            name={field.name}
                            value={String(field.state.value)}
                            onValueChange={(v) => {
                              if (v === 'none') {
                                return field.handleChange(undefined as unknown as number)
                              }

                              field.handleChange(Number(v))
                            }}
                          >
                            <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                              <SelectValue placeholder="Aucune" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Aucune</SelectItem>
                              {parishes.map((parish) => (
                                <SelectItem key={parish.id} value={String(parish.id)}>
                                  {parish.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </Field>
                      )
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <form.Field
                    name="location"
                    children={(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Lieu</FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            aria-invalid={isInvalid}
                            placeholder="Adrese ou lieu de l'événement"
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  />
                </div>

                <div className="space-y-2">
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
                            placeholder="Description de l'événement"
                            rows={12}
                            preview="live"
                            aria-invalid={isInvalid}
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  />
                </div>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dates et horaires</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <form.Field name="startDate">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Date de début *</FieldLabel>
                          <DateTimePicker
                            id={field.name}
                            value={field.state.value}
                            onChange={(v) => {
                              if (!v) {
                                return field.handleChange(undefined as unknown as Date)
                              }
                              field.handleChange(v)
                            }}
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  </form.Field>
                </div>

                <div className="space-y-2">
                  <form.Field name="endDate">
                    {(field) => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name}>Date de fin</FieldLabel>
                          <DateTimePicker
                            id={field.name}
                            value={field.state.value}
                            onChange={(v) => {
                              if (!v) {
                                return field.handleChange(undefined as unknown as Date)
                              }
                              field.handleChange(v)
                            }}
                          />
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      )
                    }}
                  </form.Field>
                </div>
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
              <div className="flex gap-2 items-center">
                <form.Field name="registrationRequired">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field orientation="horizontal" data-invalid={isInvalid}>
                        <Checkbox
                          id={field.name}
                          name={field.name}
                          aria-invalid={isInvalid}
                          checked={Boolean(field.state.value)}
                          onCheckedChange={(checked) => {
                            if (typeof checked !== 'boolean') return
                            field.handleChange(checked)
                          }}
                          onBlur={field.handleBlur}
                        />
                        <FieldLabel htmlFor={field.name}>Inscription requise</FieldLabel>
                      </Field>
                    )
                  }}
                </form.Field>
              </div>

              <div className="space-y-2">
                <form.Subscribe selector={(state) => state.values.registrationRequired}>
                  {(isRegistrationRequired) => {
                    if (!isRegistrationRequired) return

                    return (
                      <form.Field name="maxParticipants">
                        {(field) => {
                          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                          return (
                            <Field data-invalid={isInvalid}>
                              <FieldLabel htmlFor={field.name}>
                                Nombre max de participants
                              </FieldLabel>
                              <Input
                                type="number"
                                id={field.name}
                                name={field.name}
                                value={field.state.value}
                                onBlur={field.handleBlur}
                                onChange={(e) =>
                                  field.handleChange(
                                    e.target.value ? Number(e.target.value) : undefined
                                  )
                                }
                                aria-invalid={isInvalid}
                                placeholder="Entrez une quantité"
                              />
                              <FieldDescription>
                                Laissez vide pour un nombre illimité
                              </FieldDescription>
                              {isInvalid && <FieldError errors={field.state.meta.errors} />}
                            </Field>
                          )
                        }}
                      </form.Field>
                    )
                  }}
                </form.Subscribe>
              </div>

              <Separator />

              <FieldGroup>
                <Field orientation="horizontal">
                  <form.Subscribe
                    selector={(state) => ({
                      isSubmitting: state.isSubmitting,
                    })}
                    children={({ isSubmitting }) => (
                      <Button
                        type="submit"
                        form={DASHBOARD_EVENT_FORMS_ID.EDIT}
                        disabled={isSubmitting}
                        className="flex-1"
                      >
                        Modifier l'événement
                      </Button>
                    )}
                  />
                  <Button type="button" variant="outline" asChild>
                    <Link route="dashboard.dashboard_events.index">Annuler</Link>
                  </Button>
                </Field>
              </FieldGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Image de couverture</CardTitle>
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

          <Card>
            <CardHeader>
              <CardTitle>Flyer</CardTitle>
            </CardHeader>
            <CardContent>
              <form.Field name="flyerUrl">
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
      </div>
    </form>
  )
}
