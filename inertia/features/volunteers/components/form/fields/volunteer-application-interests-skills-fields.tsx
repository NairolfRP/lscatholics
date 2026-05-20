import { withForm } from '@/lib/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/shared/components/ui/multi-select'
import { SPOKEN_LANGUAGES, SpokenLanguage } from '#shared/constants/person.constants'

export const VolunteerApplicationInterestsSkillsFields = withForm({
  ...volunteersFormOpts(),
  render: ({ form }) => (
    <>
      <form.AppField name="interestedActivities">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name} className="flex items-center gap-2">
                Quels types de tâches ou d'activités vous intéresseraient ?
              </FieldLabel>
              <Textarea
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Écrire ici..."
                aria-label="Quels types de tâches ou d'activités vous intéresseraient ?"
                aria-invalid={isInvalid}
                maxLength={250}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>

      <form.AppField name="otherLanguages">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>
                  Quelles autres langues maîtrisez-vous ?
                </FieldLabel>
              </FieldContent>
              <MultiSelect
                values={field.state.value}
                onValuesChange={(v) => field.handleChange((v as SpokenLanguage[]) ?? [])}
              >
                <MultiSelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                  <MultiSelectValue placeholder="Sélectionner une ou plusieurs langues" />
                </MultiSelectTrigger>
                <MultiSelectContent>
                  {SPOKEN_LANGUAGES.map((item) => (
                    <MultiSelectItem key={item.id} value={item.id}>
                      {item.label}
                    </MultiSelectItem>
                  ))}
                </MultiSelectContent>
              </MultiSelect>
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          )
        }}
      </form.AppField>
    </>
  ),
})
