import {
  getParishionerDefaultValues,
} from '#/features/parishioner/constants/parishioner-defaults.ts'
import {
  getSacramentPrerequisites,
  individualSacramentOptions,
} from '#/features/parishioner/constants/person.constants.ts'
import type { IndividualSacrament } from '#/features/parishioner/types/parishioner.types.ts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const OocSection = withForm({
  defaultValues: getParishionerDefaultValues(null),
  render: ({ form }) => (
    <Accordion multiple defaultValue={['ooc']}>
      <AccordionItem value="ooc">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            (( Informations OOC ))
            <Badge variant="secondary">optionnel</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <FieldGroup className="rounded-xl border border-dashed bg-muted/40 p-5">
            <form.AppField name="characterSacraments">
              {(field) => (
                <field.MultiSelectField
                  label="Sacrements reçus"
                  description="Indiquez les sacrements que votre personnage a reçus afin que nous puissions jouer les registres catholiques IC. Certains sacrements supposent d'avoir reçu les précédents."
                  placeholder="Sélectionnez un ou plusieurs sacrements"
                  values={individualSacramentOptions.map((option) => ({
                    ...option,
                    disabled: getSacramentPrerequisites(option.value).some(
                      (prerequisite) =>
                        !field.state.value?.includes(prerequisite as IndividualSacrament)
                    ),
                  }))}
                />
              )}
            </form.AppField>

            <form.AppField name="oocAdditionalInformation">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <field.TextareaField
                    label="Informations OOC supplémentaires"
                    placeholder="Optionnellement, vous pouvez décrire ici ce que le clergé est déjà censé savoir IC sur votre personnage. Limité à 700 caractères."
                    rows={5}
                    maxLength={700}
                  />
                  <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums">{field.state.value?.length ?? '0'}/700</span>
                  </div>
                </div>
              )}
            </form.AppField>
          </FieldGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
})
