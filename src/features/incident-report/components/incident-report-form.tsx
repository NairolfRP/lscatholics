import { SendIcon } from 'lucide-react'
import type {
  IncidentReportFormInput,
} from '#/features/incident-report/schemas/incident-report.schema.ts'
import { incidentReportSchema } from '#/features/incident-report/schemas/incident-report.schema.ts'
import {
  submitIncidentReportFn,
} from '#/features/incident-report/server-fn/incident-report.functions.ts'
import { FormDraftRestoreDialog } from '#shared/components/form/form-draft-restore-dialog.tsx'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { toast } from '#shared/components/ui/toast.tsx'
import { useFormLocalStorage } from '#shared/hooks/use-form-local-storage.ts'
import { useGameContext } from '#shared/hooks/use-game-context.ts'
import { useAppForm } from '#shared/integrations/form/form-hook.ts'

export function IncidentReportForm() {
  const { currentCharacter } = useGameContext()

  const form = useAppForm({
    formId: 'incident-report-form',
    validators: {
      onChange: incidentReportSchema,
      onSubmit: incidentReportSchema,
    },
    defaultValues: {
      identity: currentCharacter
        ? `${currentCharacter.firstname} ${currentCharacter.lastname}`
        : '',
      position: currentCharacter?.faction?.rankName ?? '',
      incidentAt: undefined,
      location: '',
      nature: '',
      witnesses: '',
      details: '',
    } as unknown as IncidentReportFormInput,
    onSubmit: async ({ value, formApi }) => {
      const result = await submitIncidentReportFn({ data: value })

      if (!result.success) {
        if (result.validationErrors) {
          return formApi.setErrorMap({
            onServer: {
              fields: result.validationErrors,
            },
          } as unknown as Parameters<typeof formApi.setErrorMap>[0])
        }

        return toast.add({ type: 'error', title: result.error || 'Une erreur est survenue' })
      }

      toast.add({
        type: 'success',
        title: 'Rapport transmis',
        description: 'Votre rapport d’incident a été transmis.',
      })
      formApi.reset()
      draft.clearDraft()
    },
  })

  const draft = useFormLocalStorage<IncidentReportFormInput>({
    form,
    storageKey: 'incident-report-draft',
    deserialize: (stored) => {
      const values = stored as Omit<IncidentReportFormInput, 'incidentAt'> & {
        incidentAt?: string
      }
      const incidentAt = values.incidentAt ? new Date(values.incidentAt) : undefined
      return {
        ...values,
        incidentAt: incidentAt && !Number.isNaN(incidentAt.getTime()) ? incidentAt : undefined,
      } as IncidentReportFormInput
    },
  })

  return (
    <Card className="rounded-2xl">
      <FormDraftRestoreDialog
        open={draft.hasDraft}
        onRestore={draft.restoreDraft}
        onDiscard={draft.discardDraft}
        title="Reprendre votre rapport d’incident ?"
        description="Un brouillon de votre rapport d’incident a été enregistré. Voulez-vous restaurer son contenu pour continuer où vous en étiez ?"
      />
      <CardHeader>
        <CardTitle className="text-xl font-bold">Rapport d’incident</CardTitle>
        <CardDescription />
      </CardHeader>
      <CardContent>
        <form
          id={form.formId}
          onSubmit={(e) => {
            e.preventDefault()
            void form.handleSubmit()
          }}
          className="contents"
        >
          <FieldGroup>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <form.AppField name="identity">
                {(field) => (
                  <field.InputField
                    label="Identité"
                    placeholder="Prénom et nom"
                    required
                    autoComplete="off"
                  />
                )}
              </form.AppField>

              <form.AppField name="position">
                {(field) => (
                  <field.InputField
                    label="Poste"
                    placeholder="Fonction ou grade au moment des faits"
                    required
                    autoComplete="off"
                  />
                )}
              </form.AppField>
            </div>

            <form.AppField name="incidentAt">
              {(field) => (
                <field.DateTimePickerField label="Date et heure de l’incident" required />
              )}
            </form.AppField>

            <form.AppField name="location">
              {(field) => (
                <field.InputField
                  label="Lieu de l’incident"
                  placeholder="Adresse ou lieu précis"
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="nature">
              {(field) => (
                <field.InputField
                  label="Nature de l’incident"
                  placeholder="Ex. altercation, vol, dégradation..."
                  required
                />
              )}
            </form.AppField>

            <form.AppField name="witnesses">
              {(field) => (
                <field.TextareaField
                  label="Témoins (facultatif)"
                  placeholder="Nom des témoins, un par ligne"
                  rows={4}
                  maxLength={500}
                />
              )}
            </form.AppField>

            <form.AppField name="details">
              {(field) => (
                <field.TextareaField
                  label="Détail de l’incident"
                  placeholder="Décrivez les faits, le déroulement et les personnes impliquées..."
                  rows={12}
                  maxLength={4000}
                  required
                />
              )}
            </form.AppField>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="flex justify-start gap-4">
        <form.AppForm>
          <form.SubmitButton
            variant="secondary"
            label={
              <>
                <SendIcon /> Transmettre le rapport
              </>
            }
            submittingLabel="Transmission en cours..."
            size="lg"
            className="w-full"
          />
        </form.AppForm>
      </CardFooter>
    </Card>
  )
}
