import {
  EMPLOYMENT_APPLICATION_MAX_LENGTHS,
} from '#/features/job-application/constants/employment-application.constants.tsx'
import {
  employmentApplicationFormOptions,
} from '#/features/job-application/form/employment-application-form-options.ts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '#shared/components/ui/accordion.tsx'
import { Badge } from '#shared/components/ui/badge.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

const MAX_MOTIVATIONS = EMPLOYMENT_APPLICATION_MAX_LENGTHS.MOTIVATIONS

export const OocSection = withForm({
  ...employmentApplicationFormOptions,
  render: ({ form }) => (
    <Accordion
      multiple
      defaultValue={['ooc']}
      className="rounded-xl border border-dashed bg-muted/40 p-5 py-0"
    >
      <AccordionItem value="ooc">
        <AccordionTrigger>(( Section OOC (HRP) ))</AccordionTrigger>
        <AccordionContent className="pt-5 pb-10">
          <FieldGroup>
            <form.AppField name="discordUsername">
              {(field) => (
                <field.InputField
                  label="Nom d'utilisateur Discord"
                  description="Nous utilisons principalement Discord pour la communication OOC et l'intranet IC. Cette information nous permettra de t'ajouter les rôles si ton personnage rejoint la faction."
                  placeholder="Ex. john.doe"
                  maxLength={32}
                  required
                  autoComplete="off"
                />
              )}
            </form.AppField>

            <form.AppField name="motivationsOOC">
              {(field) => (
                <field.TextareaField
                  label={
                    <span className="flex items-center gap-2">
                      Motivations et ambitions
                      <Badge variant="secondary">optionnel</Badge>
                    </span>
                  }
                  description="De manière facultative, tu peux nous décrire tes mtivations et tes ambitions OOC. C'est une façon comme une autre de nous indiquer vers quel jeu tu souhaites t'orienter avec nous et, aussi, nous donner des idées."
                  placeholder="Écris ici..."
                  rows={5}
                  maxLength={MAX_MOTIVATIONS}
                />
              )}
            </form.AppField>
          </FieldGroup>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
})
