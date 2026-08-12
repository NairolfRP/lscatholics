import type {
  ClergyRole,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  CLERGY_APPLICATION_MAX_LENGTHS,
} from '#/features/clergy-application/constants/clergy-application.constants.ts'
import {
  clergyApplicationFormOpts,
} from '#/features/clergy-application/form/shared-clergy-application-form.ts'
import { Field, FieldLabel, FieldLegend, FieldSet } from '#shared/components/ui/field.tsx'
import { authClient } from '#shared/integrations/auth/auth-client.ts'
import { withForm } from '#shared/integrations/form/form-hook.ts'

const MAX = CLERGY_APPLICATION_MAX_LENGTHS

export const OocSection = withForm({
  ...clergyApplicationFormOpts(),
  props: {
    step: '' as unknown as ClergyRole,
  },
  render: ({ form, step }) => {
    const { data: session } = authClient.useSession()

    return (
      <FieldSet>
        <FieldLegend className="my-5 w-full border-b pb-2 font-bold data-[variant=legend]:text-xl">
          Informations sur le joueur
        </FieldLegend>

        <div className="grid grid-cols-1 items-start gap-7 sm:grid-cols-2">
          <Field>
            <FieldLabel>Votre pseudo UCP</FieldLabel>
            <span className="h-9 w-full min-w-0 py-1 text-base select-none md:text-sm">
              {session?.user.name}
            </span>
          </Field>

          <form.AppField name={`${step}.discordUsername`}>
            {(field) => (
              <field.InputField
                label="Votre pseudo Discord"
                placeholder="Ex. john.doe"
                maxLength={MAX.DISCORD_USERNAME}
                required
                autoComplete="off"
              />
            )}
          </form.AppField>
        </div>

        <form.AppField name={`${step}.sanctions`}>
          {(field) => (
            <div className="flex flex-col gap-1">
              <field.InputField
                type="url"
                label="Lien de votre dossier de sanctions GTA World"
                placeholder="Ex. https://ucp-fr.gta.world/view/record/aBcDeFG"
                description={
                  <span>
                    <a
                      href="https://ucp-fr.gta.world/view/user/123456"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary"
                    >
                      Paramètres UCP GTA World
                    </a>{' '}
                    -{'>'} Dossier du serveur -{'>'} Dossier complet -{'>'} SHARE RECORD -{'>'}{' '}
                    Copiez le lien qui apparaît dans la bulle de notification
                  </span>
                }
                maxLength={255}
                required
              />
            </div>
          )}
        </form.AppField>
      </FieldSet>
    )
  },
})
