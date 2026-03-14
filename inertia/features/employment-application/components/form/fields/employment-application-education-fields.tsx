import { withForm } from '@/shared/hooks/form'
import { employmentApplicationFormOpts } from '@/features/employment-application/constants/form_opts'
import {
  SCHOOL_LEVELS,
  SchoolLevel,
  SPOKEN_LANGUAGES,
  SpokenLanguage,
} from '#shared/constants/person.constants'
import {
  NONE_SCHOOL_LEVEL,
  schoolLevelsWithoutFieldOfStudy,
} from '@/features/employment-application/constants/employment_application_form.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/shared/components/ui/field'
import { cn } from '@/lib/utils'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/shared/components/ui/multi-select'

export const EmploymentApplicationEducationFields = withForm({
  ...employmentApplicationFormOpts(),
  render: ({ form }) => (
    <>
      <form.Subscribe selector={(state) => state.values.education?.highestLevel}>
        {(highestLevel) => {
          const hideFieldOfStudy = schoolLevelsWithoutFieldOfStudy.includes(
            highestLevel || NONE_SCHOOL_LEVEL
          )
          return (
            <FieldGroup
              className={cn('grid grid-cols-1 md:grid-cols-2 gap-4 items-start', {
                'md:grid-cols-1': hideFieldOfStudy,
              })}
            >
              <form.AppField name="education.highestLevel">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>
                          Quel est votre plus haut niveau d'éducation ? *
                        </FieldLabel>
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.state.value ?? ''}
                        onValueChange={(v: SchoolLevel) =>
                          field.handleChange(!v ? (undefined as unknown as SchoolLevel) : v)
                        }
                      >
                        <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                          <SelectValue id={field.name} placeholder="Sélectionnez un niveau" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {SCHOOL_LEVELS.map((item) => (
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

              {!hideFieldOfStudy && (
                <form.AppField name="education.fieldOfStudy">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Domaine d'études *</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Administration des affaires"
                          aria-invalid={isInvalid}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </form.AppField>
              )}
            </FieldGroup>
          )
        }}
      </form.Subscribe>

      <FieldSeparator className="my-1" />

      <FieldGroup>
        <form.AppField name="spokenLanguages">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>Langues étrangères maîtrisées</FieldLabel>
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
      </FieldGroup>

      <FieldSeparator className="my-1" />
    </>
  ),
})
