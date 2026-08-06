import {
  APPLICANT_STATEMENTS,
} from '#/features/job-application/constants/employment-application.constants.tsx'
import {
  getEmploymentApplicationDefaults,
} from '#/features/job-application/utils/employment-application-defaults.ts'
import { FieldDescription, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { ScrollArea } from '#shared/components/ui/scroll-area.tsx'
import { withForm } from '#shared/integrations/form/form-hook.ts'

export const DeclarationSection = withForm({
  defaultValues: getEmploymentApplicationDefaults(null),
  render: ({ form }) => (
    <FieldSet>
      <FieldLegend className="mb-5 w-full border-b pb-2 font-extrabold">
        Déclaration du candidat
      </FieldLegend>
      <FieldDescription>
        Prenez connaissance de l'ensemble des clauses ci-dessous, puis cochez la case finale pour
        confirmer que vous les avez comprises et que vous les acceptez.
      </FieldDescription>

      <ScrollArea
        aria-label="Clauses de la déclaration du candidat"
        className="h-72 rounded-lg border bg-muted/40"
      >
        <div className="space-y-6 p-4 sm:p-5">
          {APPLICANT_STATEMENTS.map((statement, index) => (
            <div key={statement.id} className="flex items-start gap-3">
              <span
                aria-hidden
                className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
              >
                {index + 1}
              </span>
              <p className="text-sm/relaxed text-foreground/90">{statement.label}</p>
            </div>
          ))}
        </div>
      </ScrollArea>

      <form.AppField name="applicantDeclarationAccepted">
        {(field) => (
          <field.CheckboxField
            label="Je comprends et j'accepte l'ensemble des clauses de la déclaration du candidat."
            fieldProps={{ orientation: 'horizontal' }}
            required
          />
        )}
      </form.AppField>
    </FieldSet>
  ),
})
