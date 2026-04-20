import { withForm } from '@/shared/hooks/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { Typography } from '@/shared/components/ui/typography'
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
import {
  VOLUNTEER_APPLICATION_REQUIRED_HOURS,
  VolunteerApplicationRequiredHours,
} from '#shared/constants/volunteers.constants'
import { Input } from '@/shared/components/ui/input'

export const VolunteerApplicationRequiredHoursFields = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => (
    <FieldGroup>
      <Typography variant="small" className="italic">
        Veuillez remplir la section ci-dessous uniquement{' '}
        <strong>si vous êtes obligé de réaliser du bénévolat</strong> pour une raison quelconque.
      </Typography>
      <form.AppField name="requiredHours.reason">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Pour quelles raisons êtes-vous tenu de réaliser un service communautaire ou du
                  bénévolat ?
                </FieldLabel>
              </FieldContent>
              <Select
                name={field.name}
                value={field.state.value ?? ''}
                onValueChange={(v: VolunteerApplicationRequiredHours | 'none') => {
                  if (!v || v === 'none') {
                    field.handleChange(undefined)
                    form.setFieldValue('requiredHours.deadline', undefined)
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
                    Aucun
                  </SelectItem>
                  {VOLUNTEER_APPLICATION_REQUIRED_HOURS.map((item) => (
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

      <form.Subscribe selector={(state) => !!state.values.requiredHours?.reason}>
        {(hasRequiredHours) =>
          hasRequiredHours && (
            <form.AppField name="requiredHours.deadline">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel required htmlFor={field.name}>
                      À quelle échéance devez-vous valider vos heures ?
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Indiquez la date limite"
                      maxLength={50}
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
