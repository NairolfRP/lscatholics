import { withForm } from '@/shared/hooks/form'
import { employmentApplicationFormOpts } from '@/features/employment-application/constants/form_opts'
import { Input } from '@/shared/components/ui/input'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'

export const EmploymentApplicationOOCFields = withForm({
  ...employmentApplicationFormOpts(),
  render: ({ form }) => (
    <FieldGroup>
      <form.AppField name="discordUsername">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Nom d'utilisateur Discord *</FieldLabel>
              <FieldDescription>
                Nous utilisons principalement Discord pour la communication OOC et l'intranet IC.
                Cette information nous permettra de t'ajouter les accès internes si ton personnage
                est embauché.
              </FieldDescription>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>

      <form.AppField name="motivationsOOC">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Motivations et ambitions</FieldLabel>
                <FieldDescription>
                  Tu peux de manière facultative décrire tes motivations et ambitions OOC ! C'est
                  une façon comme une autre de nous fournir, aussi, des idées et nous montrer ce que
                  tu souhaites développer avec nous.
                </FieldDescription>
              </FieldContent>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                maxLength={1500}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>
    </FieldGroup>
  ),
})
