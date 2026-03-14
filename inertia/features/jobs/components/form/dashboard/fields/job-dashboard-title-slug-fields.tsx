import { withForm } from '@/shared/hooks/form'
import { createJobFormOpts } from '@/features/jobs/constants/form_opts'
import { Field, FieldDescription, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'

export const JobDashboardTitleSlugFields = withForm({
  ...createJobFormOpts,
  props: {
    autoSlug: true,
  },
  render: ({ form, autoSlug }) => {
    const generateSlug = () => {
      if (!autoSlug || form.state.values.slug || !form.state.values.title) return
      const slug = form.state.values.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      form.setFieldValue('slug', slug)
    }

    return (
      <>
        <form.AppField name="title">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Titre *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={() => {
                    generateSlug()
                    field.handleBlur()
                  }}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Titre de l'emploi"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>

        <form.AppField name="slug">
          {(field) => {
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
                  placeholder="url-de-loffre"
                />
                <FieldDescription>Laissez vide pour générer automatiquement</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>
      </>
    )
  },
})
