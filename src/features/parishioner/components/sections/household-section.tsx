import { UsersRoundIcon } from 'lucide-react'
import {
  HouseholdMemberCard,
} from '#/features/parishioner/components/sections/household-member-card.tsx'
import {
  getParishionerDefaultValues,
} from '#/features/parishioner/constants/parishioner-defaults.ts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '#shared/components/ui/empty.tsx'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const HouseholdSection = withForm({
  defaultValues: getParishionerDefaultValues(null),
  render: ({ form }) => (
    <Accordion multiple defaultValue={['household']}>
      <AccordionItem value="household">
        <AccordionTrigger>
          <span className="flex items-center gap-2">
            Votre foyer
            <Badge variant="secondary">optionnel</Badge>
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <FieldSet className="gap-4">
            <FieldLegend>Membres du foyer</FieldLegend>
            <FieldDescription>
              Ajoutez les membres de votre foyer qui s'inscriront avec vous (conjoint, enfants, amis
              proches, etc.).
            </FieldDescription>

            <form.AppField name="familyMembers" mode="array">
              {(field) => (
                <>
                  {field.state.value?.length === 0 ? (
                    <Empty>
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <UsersRoundIcon />
                        </EmptyMedia>
                        <EmptyTitle>Aucun membre du foyer ajouté</EmptyTitle>
                        <EmptyDescription>
                          Cliquez sur « Ajouter un membre du foyer » pour commencer.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  ) : (
                    <div className="space-y-4">
                      {field.state.value?.map((_, index) => (
                        <HouseholdMemberCard
                          key={`household-member-${index}`}
                          form={form}
                          index={index}
                          onRemove={() => field.removeValue(index)}
                        />
                      ))}
                    </div>
                  )}

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2"
                    disabled={field.state.value && field.state.value.length >= 5}
                    onClick={() =>
                      field.pushValue({
                        firstname: '',
                        lastname: '',
                        age: '',
                        role: '' as never,
                        isNpc: false,
                      })
                    }
                  >
                    <UsersRoundIcon />
                    Ajouter un membre du foyer
                  </Button>
                </>
              )}
            </form.AppField>

            <form.AppField name="message">
              {(field) => (
                <div className="flex flex-col gap-1">
                  <field.TextareaField
                    label="Informations complémentaires"
                    placeholder="Précisez tout détail utile (mode de vie, disponibilités, demande particulière...) dans la limite de 300 caractères."
                    rows={5}
                    maxLength={300}
                  />
                  <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
                    <span className="tabular-nums">{field.state.value?.length}/300</span>
                  </div>
                </div>
              )}
            </form.AppField>
          </FieldSet>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
})
