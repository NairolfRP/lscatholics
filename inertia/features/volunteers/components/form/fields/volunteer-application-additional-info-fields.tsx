import { withForm } from '@/lib/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { ETHNIC_GROUPS, EthnicGroupId } from '#shared/constants/ethnicity.constants'

export const VolunteerApplicationAdditionalInfoFields = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => (
    <>
      <form.AppField name="ethnicity">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Ethnie</FieldLabel>
              </FieldContent>
              <Select
                name={field.name}
                value={field.state.value ?? 'none'}
                onValueChange={(v) => {
                  if (!v || v === 'none') {
                    field.handleChange(undefined)
                  } else {
                    field.handleChange(v as EthnicGroupId)
                  }
                }}
              >
                <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                  <SelectValue placeholder="Sélectionnez une ethnie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="none" disabled={!field.state.value}>
                      N/A
                    </SelectItem>
                    <SelectSeparator />
                    {ETHNIC_GROUPS.map((ethnicGroup) => (
                      <SelectItem key={ethnicGroup.id} value={ethnicGroup.id}>
                        {ethnicGroup.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>
    </>
  ),
})
