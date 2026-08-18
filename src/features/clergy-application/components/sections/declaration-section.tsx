import type { ClergyRole } from '#/features/clergy-application/constants/clergy-application.constants.ts'
import { clergyApplicationFormOpts } from '#/features/clergy-application/form/shared-clergy-application-form.ts'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const DeclarationSection = withForm({
  ...clergyApplicationFormOpts(),
  props: {
    step: '' as unknown as ClergyRole,
  },
  render: ({ form, step }) => (
    <FieldSet>
      <FieldLegend className="my-5 w-full border-b pb-2 font-bold data-[variant=legend]:text-xl">
        Déclaration du joueur
      </FieldLegend>
      <FieldDescription>
        Vous acceptez que toute violation de ces engagements justifiera une exclusion immédiate OOC
        de la faction et le CK forcé de votre personnage.
      </FieldDescription>

      <form.AppField name={`${step}.noTrollingDeclaration`}>
        {(field) => (
          <field.CheckboxField
            label="Je m'engage à ne pas intégrer la faction dans le seul but de troller ou de pratiquer le RP religieux à des fins abusives ou exagérées."
            fieldProps={{ orientation: 'horizontal' }}
            required
          />
        )}
      </form.AppField>

      <form.AppField name={`${step}.legalOnlyDeclaration`}>
        {(field) => (
          <field.CheckboxField
            label="Je déclare que mon personnage est uniquement légal et que je m'engage à jouer uniquement légal afin de ne pas dénaturer la faction."
            fieldProps={{ orientation: 'horizontal' }}
            required
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
