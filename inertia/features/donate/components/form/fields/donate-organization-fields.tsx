import { withForm } from '@/lib/form'
import { donateFormOpts } from '@/features/donate/constants/form_opts'
import { Input } from '@/shared/components/ui/input'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Field, FieldError, FieldLabel } from '@/shared/components/ui/field'

export const DonateOrganizationFields = withForm({
  ...donateFormOpts(),
  render: ({ form }) => (
    <div className="flex flex-col space-y-4">
      <form.AppField name="isOrganization">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) =>
                    checked === 'indeterminate'
                      ? field.handleChange(false)
                      : field.handleChange(Boolean(checked))
                  }
                />
                <FieldLabel htmlFor={field.name} className="text-sm">
                  Je fais un don au nom d'une organisation ou d'une société
                </FieldLabel>
              </div>
            </Field>
          )
        }}
      </form.AppField>
      <form.Subscribe selector={(state) => state.values.isOrganization}>
        {(isOrganization) => {
          if (!isOrganization) return
          return (
            <form.AppField name="organizationName">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <div className="space-y-3 pl-6 border-l-2 border-gray-200">
                      <FieldLabel required htmlFor={field.name}>
                        Nom de l'organisation
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        type="text"
                        placeholder="Doe Corporation"
                        aria-invalid={isInvalid}
                        required
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </div>
                  </Field>
                )
              }}
            </form.AppField>
          )
        }}
      </form.Subscribe>
    </div>
  ),
})
