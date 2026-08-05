import { parishes } from '#/config/parishes.ts'
import {
  getParishionerDefaultValues,
} from '#/features/parishioner/constants/parishioner-defaults.ts'
import {
  baptizedOptions,
  religionOptions,
} from '#/features/parishioner/constants/person.constants.ts'
import {
  PARISHIONER_PARISH_UNSURE_VALUE,
} from '#/features/parishioner/schemas/parishioner.schema.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

const parishOptions = [
  { value: PARISHIONER_PARISH_UNSURE_VALUE, label: 'Je ne suis pas sûr' },
  ...parishes.map((parish) => ({ value: parish.id, label: parish.title })),
]

export const FaithSection = withForm({
  defaultValues: getParishionerDefaultValues(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend>Religion, paroisse et engagement</FieldLegend>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="baptized">
          {(field) => (
            <field.SelectField
              label="Êtes-vous baptisé ?"
              placeholder="Sélectionnez une réponse"
              values={baptizedOptions}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="religion">
          {(field) => (
            <field.SelectField
              label="Religion"
              placeholder="Sélectionnez une réponse"
              values={religionOptions}
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name="parish">
        {(field) => (
          <field.SelectField
            label="Paroisse"
            description="Indiquez une paroisse de l'archidiocèse. En général, on choisit la paroisse la plus proche de son domicile."
            values={parishOptions}
          />
        )}
      </form.AppField>

      <form.AppField name="isVolunteer">
        {(field) => (
          <field.CheckboxField
            label="Je souhaite également être contacté(e) pour participer à des missions de bénévolat (actions de charité, organisation d'événement, ...)."
            fieldProps={{ orientation: 'horizontal' }}
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
