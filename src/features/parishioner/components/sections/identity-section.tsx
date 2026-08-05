import {
  civilTitleOptions,
  ethnicCommunityOptions,
  genderOptions,
  maritalStatusOptions,
} from '#/features/parishioner/constants/person.constants.ts'
import {
  getParishionerDefaultValues,
} from '#/features/parishioner/constants/parishioner-defaults.ts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import type { Character } from '#shared/types/character.types.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'
import { Badge } from '#shared/components/ui/badge.tsx'

export const IdentitySection = withForm({
  defaultValues: getParishionerDefaultValues(null),
  props: {} as { currentCharacter: Character | null | undefined },
  render: ({ form, currentCharacter }) => (
    <FieldSet>
      <FieldLegend>Votre identité</FieldLegend>

      <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
        <form.AppField name="civilTitle">
          {(field) => (
            <field.SelectField
              label="Titre de civilité"
              placeholder="Sélectionnez un titre"
              values={civilTitleOptions}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="maritalStatus">
          {(field) => (
            <field.SelectField
              label="État matrimonial"
              placeholder="Sélectionnez un état matrimonial"
              values={maritalStatusOptions}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="firstname">
          {(field) => (
            <field.InputField
              key={`current-character-firstname-${currentCharacter?.id ?? 'unknown'}`}
              label="Prénom"
              placeholder="John"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="lastname">
          {(field) => (
            <field.InputField
              key={`current-character-lastname-${currentCharacter?.id ?? 'unknown'}`}
              label="Nom de famille"
              placeholder="Doe"
              required
              autoComplete="off"
            />
          )}
        </form.AppField>

        <form.AppField name="gender">
          {(field) => (
            <field.SelectField
              label="Sexe"
              placeholder="Sélectionnez un sexe"
              values={genderOptions}
              required
            />
          )}
        </form.AppField>

        <form.AppField name="age">
          {(field) => (
            <field.InputField
              label="Âge"
              placeholder="25"
              inputMode="numeric"
              description="L'âge minimum pour s'enregistrer est de 18 ans."
              required
            />
          )}
        </form.AppField>
      </div>

      <Accordion multiple defaultValue={['identity-extra']}>
        <AccordionItem value="identity-extra">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              Plus d'informations sur vous <Badge variant="secondary">optionnel</Badge>
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
              <form.AppField name="ethnicCommunity">
                {(field) => (
                  <field.SelectField
                    label="Communauté ethnique"
                    description="Indiquez la communauté ethnique à laquelle votre personnage s'identifie."
                    descriptionPos="after"
                    placeholder="Sélectionnez une communauté"
                    values={ethnicCommunityOptions}
                  />
                )}
              </form.AppField>

              <form.AppField name="occupation">
                {(field) => (
                  <field.InputField
                    label="Activité / emploi"
                    placeholder="Ex. mécanicien, étudiant, sans emploi"
                    autoComplete="off"
                  />
                )}
              </form.AppField>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </FieldSet>
  ),
})
