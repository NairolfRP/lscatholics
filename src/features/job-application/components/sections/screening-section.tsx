import {
  APPLICATION_SOURCE,
  applicationSourceOptions,
} from '#/features/job-application/constants/employment-application.constants.tsx'
import {
  getEmploymentApplicationDefaults,
} from '#/features/job-application/utils/employment-application-defaults.ts'
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

const YES_NO_QUESTIONS: readonly {
  name: 'isPracticingCatholic' | 'hasDriverLicense'
  label: string
  description?: string
}[] = [
  {
    name: 'isPracticingCatholic',
    label: 'Êtes-vous catholique pratiquant ?',
    description:
      "La réponse à cette question n'est pas éliminatoire. L'Archidiocèse peut préférer des candidats catholiques pour certains postes.",
  },
  {
    name: 'hasDriverLicense',
    label: 'Possédez-vous un permis de conduire valide ?',
  },
]

export const ScreeningSection = withForm({
  defaultValues: getEmploymentApplicationDefaults(null),
  render: ({ form }) => (
    <>
      <FieldSet>
        <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">
          Questions préalables
        </FieldLegend>

        <FieldGroup>
          {YES_NO_QUESTIONS.map((question) => (
            <form.AppField key={question.name} name={question.name}>
              {(field) => (
                <field.YesNoField
                  label={question.label}
                  description={question.description}
                  required
                />
              )}
            </form.AppField>
          ))}
        </FieldGroup>
      </FieldSet>

      <FieldSet>
        <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">
          Comment nous avez-vous connu ?
        </FieldLegend>
        <FieldDescription>
          Ces informations nous aident à mieux faire connaître nos offres d'emploi.
        </FieldDescription>

        <form.AppField name="applicationSource.type">
          {(field) => (
            <field.SelectField
              label="Comment avez-vous entendu parler de cette offre d'emploi ?"
              placeholder="Sélectionnez une réponse"
              values={[
                { label: 'Sélectionnez une réponse', value: null },
                ...applicationSourceOptions,
              ]}
            />
          )}
        </form.AppField>

        <form.Subscribe selector={(state) => state.values.applicationSource.type}>
          {(type) =>
            type === APPLICATION_SOURCE.EMPLOYEE_REFERRAL && (
              <form.AppField name="applicationSource.employeeReferral">
                {(field) => (
                  <field.InputField
                    label="Indiquez l'identité de l'employé"
                    placeholder="Jane Doe"
                    maxLength={100}
                    required
                    autoComplete="off"
                  />
                )}
              </form.AppField>
            )
          }
        </form.Subscribe>
      </FieldSet>
    </>
  ),
})
