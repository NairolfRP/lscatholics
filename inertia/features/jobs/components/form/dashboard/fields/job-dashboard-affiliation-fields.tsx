import { createJobFormOpts } from '@/features/jobs/constants/form_opts'
import { withForm } from '@/lib/form'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { DEPARTMENTS } from '@/shared/constants/departments.constants'
import { Input } from '@/shared/components/ui/input'

export const JobDashboardAffiliationFields = withForm({
  ...createJobFormOpts,
  render: ({ form }) => {
    return (
      <>
        <form.AppField name="department">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="responsive" data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Département *</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldContent>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                    <SelectValue placeholder="Sélectionner un département" />
                  </SelectTrigger>
                  <SelectContent position="item-aligned">
                    {DEPARTMENTS.sort((a, b) => {
                      const textA = a.title.toUpperCase()
                      const textB = b.title.toUpperCase()
                      return textA < textB ? -1 : textA > textB ? 1 : 0
                    }).map((dep) => (
                      <SelectItem key={dep.id} value={dep.id}>
                        {dep.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )
          }}
        </form.AppField>

        <form.AppField name="reportsTo">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Relève de *</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  placeholder="Directeur des Ressources Humaines"
                />
                <FieldDescription>Nom de la fonction du responsable direct</FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>
      </>
    )
  },
})
