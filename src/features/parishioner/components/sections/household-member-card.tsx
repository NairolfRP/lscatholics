import { Trash2Icon } from 'lucide-react'
import { getParishionerDefaultValues } from '#/features/parishioner/constants/parishioner-defaults.ts'
import { householdRoleOptions } from '#/features/parishioner/constants/person.constants.ts'
import { Button } from '#shared/components/ui/button.tsx'
import { Card, CardContent } from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const HouseholdMemberCard = withForm({
  defaultValues: getParishionerDefaultValues(null),
  props: {} as { index: number; onRemove: () => void },
  render: ({ form, index, onRemove }) => (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onRemove}
            aria-label={`Supprimer le membre ${index + 1} du foyer`}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        </div>

        <FieldGroup>
          <div className="grid grid-cols-1 items-start gap-7 pr-10 sm:grid-cols-2">
            <form.AppField name={`familyMembers[${index}].firstname`}>
              {(field) => (
                <field.InputField
                  label="Prénom"
                  placeholder="Prénom"
                  required
                  autoComplete="off"
                />
              )}
            </form.AppField>

            <form.AppField name={`familyMembers[${index}].lastname`}>
              {(field) => (
                <field.InputField
                  label="Nom de famille"
                  placeholder="Nom de famille"
                  required
                  autoComplete="off"
                />
              )}
            </form.AppField>

            <form.AppField name={`familyMembers[${index}].age`}>
              {(field) => (
                <field.InputField
                  label="Âge"
                  placeholder="25"
                  inputMode="numeric"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name={`familyMembers[${index}].role`}>
              {(field) => (
                <field.SelectField
                  label="Rôle dans le foyer"
                  placeholder="Sélectionnez un rôle"
                  values={householdRoleOptions}
                  required
                />
              )}
            </form.AppField>
          </div>

          <form.AppField name={`familyMembers[${index}].isNpc`}>
            {(field) => (
              <field.CheckboxField
                label="(( Ce membre est un personnage non-joueur (PNJ) ))"
                fieldProps={{ orientation: 'horizontal' }}
              />
            )}
          </form.AppField>
        </FieldGroup>
      </CardContent>
    </Card>
  ),
})
