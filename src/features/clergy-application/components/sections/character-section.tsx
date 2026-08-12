import type {
  ClergyRole,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  CLERGY_APPLICATION_MAX_LENGTHS,
  CLERGY_ROLE,
  clergyMaritalStatusOptions,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  clergyApplicationFormOpts,
} from '#/features/clergy-application/form/shared-clergy-application-form.ts'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

const MAX = CLERGY_APPLICATION_MAX_LENGTHS

function getAgeDescription(role: ClergyRole | undefined) {
  switch (role) {
    case CLERGY_ROLE.PRIEST:
      return `L'âge minimum pour être ordonné prêtre est de ${MAX.MIN_PRIEST_AGE} ans, et de ${MAX.MAX_PRIEST_AGE} ans maximum.`
    case CLERGY_ROLE.DEACON_TEMPORARY:
      return `L'âge minimum pour devenir diacre temporaire est de ${MAX.MIN_TEMPORARY_DEACON_AGE} ans, et de ${MAX.MAX_TEMPORARY_DEACON_AGE} ans maximum.`
    case CLERGY_ROLE.DEACON_PERMANENT:
      return `L'âge minimum est de ${MAX.MIN_UNMARRIED_PERMANENT_DEACON_AGE} ans pour un diacre permanent célibataire, et de ${MAX.MIN_MARRIED_PERMANENT_DEACON_AGE} ans pour un diacre permanent marié.`
    default:
      return 'L’âge de votre personnage doit être cohérent avec le rôle choisi.'
  }
}

export const CharacterSection = withForm({
  ...clergyApplicationFormOpts(),
  props: {
    step: '' as unknown as ClergyRole,
  },
  render: ({ form, step }) => (
    <FieldSet>
      <FieldLegend className="my-5 w-full border-b pb-2 font-bold data-[variant=legend]:text-xl">
        Votre personnage
      </FieldLegend>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name={`${step}.firstname`}>
          {(field) => (
            <field.InputField
              label="Prénom de votre personnage"
              placeholder="Ex. John"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name={`${step}.lastname`}>
          {(field) => (
            <field.InputField
              label="Nom de votre personnage"
              placeholder="Ex. Doe"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>
      </div>

      <form.AppField name={`${step}.age`}>
        {(field) => (
          <field.InputField
            label="Âge de votre personnage"
            placeholder="25"
            inputMode="numeric"
            description={getAgeDescription(step)}
            required
          />
        )}
      </form.AppField>

      {step === CLERGY_ROLE.DEACON_PERMANENT && (
        <form.AppField name={`${step}.maritalStatus`}>
          {(field) => (
            <field.SelectField
              label="Situation matrimoniale"
              placeholder="Sélectionnez votre situation matrimoniale"
              values={clergyMaritalStatusOptions}
              required
            />
          )}
        </form.AppField>
      )}

      <form.AppField name={`${step}.characterStory`}>
        {(field) => (
          <field.TextareaField
            label="Histoire de votre personnage"
            description="Présentez-nous le personnage que vous comptez incarner !"
            placeholder="Écrivez ici..."
            rows={7}
            maxLength={MAX.CHARACTER_STORY}
            required
          />
        )}
      </form.AppField>

      <form.AppField name={`${step}.motivations`}>
        {(field) => (
          <field.TextareaField
            label="Pourquoi voulez-vous rejoindre la faction ?"
            description="Vous pouvez expliquer de manière concise vos ambitions avec ce personnage et nous présenter vos motivations à intégrer la faction !"
            placeholder="Écrivez ici..."
            rows={7}
            maxLength={MAX.MOTIVATIONS}
            required
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
