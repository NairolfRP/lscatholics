import { Users } from 'lucide-react'
import { withForm } from '@/shared/hooks/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import { Button } from '@/shared/components/ui/button'
import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from '@/shared/components/ui/field'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/shared/components/ui/empty'
import { HouseholdRole } from '#shared/constants/person.constants'
import { ParishionerHouseholdMemberFields } from '@/features/register-parishioner/components/form/fields/parishioner-household-member-fields'

export const ParishionerHouseholdFields = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
  }),
  render: ({ form }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Informations sur le foyer</h3>

      <form.AppField name="familyMembers" mode="array">
        {(field) => (
          <FieldSet className="gap-4">
            <FieldLegend>Membres du foyer</FieldLegend>
            <FieldDescription>
              Ajoutez les membres de votre foyer qui s'inscriront avec vous (conjoint, enfants,
              etc.)
            </FieldDescription>

            <FieldGroup className="gap-4">
              {field.state.value && field.state.value.length === 0 ? (
                <Empty className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Users />
                    </EmptyMedia>
                    <EmptyTitle>Aucun membre du foyer ajouté</EmptyTitle>
                    <EmptyDescription>
                      Cliquez sur "Ajouter un membre" pour commencer
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <div className="space-y-4">
                  {field.state.value?.map((_, idx) => (
                    <ParishionerHouseholdMemberFields
                      key={`household-member-${idx}`}
                      form={form}
                      index={idx}
                      onRemove={() => field.removeValue(idx)}
                    />
                  ))}
                </div>
              )}

              <Button
                type="button"
                variant="outline"
                size="default"
                disabled={field.state.value && field.state.value.length >= 5}
                onClick={() =>
                  field.pushValue({
                    firstname: '',
                    lastname: '',
                    age: 0,
                    role: undefined as unknown as HouseholdRole,
                    isNpc: false,
                  })
                }
                className="w-full gap-2"
              >
                <Users className="w-4 h-4" />
                Ajouter un membre du foyer
              </Button>
            </FieldGroup>

            {field.state.meta.errors.length > 0 && (
              <p className="text-destructive text-sm">{field.state.meta.errors.join(', ')}</p>
            )}
          </FieldSet>
        )}
      </form.AppField>
    </div>
  ),
})
