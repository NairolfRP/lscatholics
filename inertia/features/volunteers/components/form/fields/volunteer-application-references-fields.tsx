import { withForm } from '@/shared/hooks/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { APPLICATION_SOURCES, ApplicationSource } from '#shared/constants/employment.constants'
import { Input } from '@/shared/components/ui/input'

export const VolunteerApplicationReferencesFields = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => (
    <FieldGroup>
      <form.AppField name="applicantSource.type">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Comment avez-vous entendu parler du bénévolat dans notre organisation ?
                </FieldLabel>
              </FieldContent>
              <Select
                name={field.name}
                value={field.state.value ?? ''}
                onValueChange={(v: ApplicationSource | 'none') => {
                  console.log(v)
                  if (!v || v === 'none') {
                    field.handleChange(undefined)
                  } else {
                    field.handleChange(v)
                  }
                }}
              >
                <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                  <SelectValue placeholder="Sélectionnez une réponse" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="none" disabled={!field.state.value}>
                    N/A
                  </SelectItem>
                  {APPLICATION_SOURCES.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>

      <form.Subscribe selector={(state) => state.values.applicantSource.type}>
        {(type) =>
          type === 'employeeReferral' && (
            <form.AppField name="applicantSource.employeeReferral">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel required htmlFor={field.name}>
                      Indiquez l'identité de l'employé
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Jane Doe"
                      maxLength={100}
                      aria-invalid={isInvalid}
                      aria-label="Identité de l'employé référent"
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.AppField>
          )
        }
      </form.Subscribe>
    </FieldGroup>
  ),
})
