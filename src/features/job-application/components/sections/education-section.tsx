import {
  SCHOOL_LEVELS_WITHOUT_FIELD_OF_STUDY,
  schoolLevelOptions,
  spokenLanguageOptions,
} from '#/features/job-application/constants/employment-application.constants.tsx'
import {
  getEmploymentApplicationDefaults,
} from '#/features/job-application/utils/employment-application-defaults.ts'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const EducationSection = withForm({
  defaultValues: getEmploymentApplicationDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">Éducation</FieldLegend>
      <FieldDescription>
        Indiquez votre plus haut niveau d'éducation ainsi que, le cas échéant, le domaine d'études
        correspondant.
      </FieldDescription>

      <form.AppField name="education.highestLevel">
        {(field) => (
          <field.SelectField
            label="Quel est votre plus haut niveau d'éducation ?"
            placeholder="Sélectionnez une réponse"
            values={schoolLevelOptions}
            required
          />
        )}
      </form.AppField>

      <form.Subscribe
        selector={(state) => {
          return !SCHOOL_LEVELS_WITHOUT_FIELD_OF_STUDY.includes(state.values.education.highestLevel)
        }}
      >
        {(requiresFieldOfStudy) =>
          requiresFieldOfStudy && (
            <form.AppField name="education.fieldOfStudy">
              {(field) => (
                <field.InputField
                  label="Quel est le domaine de vos études ?"
                  placeholder="Ex. Théologie, Administration, Droit..."
                  maxLength={100}
                  required
                  autoComplete="off"
                />
              )}
            </form.AppField>
          )
        }
      </form.Subscribe>

      <form.AppField name="spokenLanguages">
        {(field) => (
          <field.MultiSelectField
            label="Quelles langues parlez-vous ?"
            description="Renseignez uniquement les langues que vous maîtrisez suffisamment pour travailler."
            descriptionPos="after"
            errorsPos="after"
            placeholder="Sélectionnez une ou plusieurs langues"
            values={spokenLanguageOptions}
            selectTriggerProps={{ className: 'w-full' }}
            selectValueProps={{ overflowBehavior: 'wrap' }}
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
