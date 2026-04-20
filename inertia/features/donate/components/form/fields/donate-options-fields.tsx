import { withForm } from '@/shared/hooks/form'
import { donateFormOpts } from '@/features/donate/constants/form_opts'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/shared/components/ui/field'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { LinkText } from '@/shared/components/link-text'

export const DonateOptionsFields = withForm({
  ...donateFormOpts(),
  render: ({ form }) => {
    return (
      <FieldGroup data-slot="checkbox-group">
        <form.AppField name="anonymous">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') {
                      field.handleChange(false)
                    } else {
                      field.handleChange(checked)
                    }
                  }}
                />
                <FieldLabel htmlFor={field.name} className="font-normal">
                  Je souhaite que ma donation reste privée, ce qui veut dire qu'elle ne sera ni
                  affichée ni communiquée publiquement.
                </FieldLabel>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>

        <FieldSeparator />

        <form.AppField name="fleecaConfirmation">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field orientation="horizontal" data-invalid={isInvalid}>
                <Checkbox
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    if (checked === 'indeterminate') {
                      field.handleChange(false)
                    } else {
                      field.handleChange(checked)
                    }
                  }}
                  required
                />
                <FieldLabel required htmlFor={field.name} className="inline font-normal">
                  (( Je confirme que je suis BIEN CONNECTÉ sur l'
                  <LinkText href="https://fleeca.gta.world" target="_blank">
                    application web Fleeca
                  </LinkText>{' '}
                  de GTA World. Dans le cas contraire, la redirection vers le paiement échouera et
                  tout devra être recommencé. ))
                </FieldLabel>
              </Field>
            )
          }}
        </form.AppField>
      </FieldGroup>
    )
  },
})
