import { withForm } from '@/shared/hooks/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import {
  INDIVIDUAL_SACRAMENTS,
  IndividualSacrament,
  type IndividualSacramentProps,
} from '#shared/constants/person.constants'
import { Textarea } from '@/shared/components/ui/textarea'
import { Typography } from '@/shared/components/ui/typography'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from '@/shared/components/ui/multi-select'

export const ParishionerOOCFields = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
  }),
  render: ({ form }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">(( Partie OOC ))</h3>
      <p className="text-sm text-gray-600">
        Cette partie est avant tout pour nous, pour avoir des informations sur vos personnages qu'en
        tant qu'Église nous sommes censés posséder.
      </p>

      <FieldGroup>
        <form.AppField name="characterSacraments">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            const isDisabled = (sacrament: IndividualSacramentProps) => {
              const selected = field.state.value || []
              const missingRequired =
                sacrament.required.length > 0 &&
                !sacrament.required.every((req) => selected.includes(req))
              const isRequiredByOther = selected.some((selectedId) => {
                const selectedSacrament = INDIVIDUAL_SACRAMENTS.find((s) => s.id === selectedId)
                return selectedSacrament?.required.includes(sacrament.id)
              })
              return (
                (!selected.includes(sacrament.id as IndividualSacrament) && missingRequired) ||
                isRequiredByOther
              )
            }

            return (
              <Field data-invalid={isInvalid}>
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    Votre personnage a reçu les sacrements de...
                  </FieldLabel>
                </FieldContent>
                <MultiSelect values={field.state.value} onValuesChange={field.handleChange}>
                  <MultiSelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                    <MultiSelectValue
                      clickToRemove={false}
                      placeholder="Sélectionnez des sacrements"
                    />
                  </MultiSelectTrigger>
                  <MultiSelectContent>
                    {INDIVIDUAL_SACRAMENTS.map((sacrament) => (
                      <MultiSelectItem
                        key={sacrament.id}
                        value={sacrament.id}
                        disabled={isDisabled(sacrament)}
                      >
                        {sacrament.label}
                      </MultiSelectItem>
                    ))}
                  </MultiSelectContent>
                </MultiSelect>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
                <FieldDescription as="div" className="text-muted-foreground text-xs">
                  <p>
                    Cochez ce que votre personnage a bien reçu dans son histoire passée. Ça nous
                    permet de jouer nos archives et registres !
                  </p>
                  <Typography variant="list" className="mt-0">
                    <li>
                      Baptême : si votre personnage a été baptisé dans son histoire passée (par ex,
                      quand il était enfant)
                    </li>
                    <li>
                      Première communion : si votre personnage baptisé a fait sa première communion
                      dans son histoire passée
                    </li>
                    <li>
                      Confirmation : si votre personnage a reçu le sacrement de la confirmation dans
                      son histoire passée (au début de l'adolescence ou plus tard)
                    </li>
                  </Typography>
                </FieldDescription>
              </Field>
            )
          }}
        </form.AppField>

        <form.AppField name="oocAdditionalInformation">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>
                  Qu'est-ce que le clergé de l'archidiocèse de Los Santos est censé savoir en RP sur
                  votre personnage ?
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  maxLength={700}
                  rows={3}
                  aria-invalid={isInvalid}
                />
                <FieldDescription className="text-muted-foreground text-sm">
                  Laissez vide si rien ou si vous ne souhaitez pas partager d'informations.
                  Soumettez uniquement des informations qui devraient déjà être sues en RP par le
                  clergé de l'archidiocèse de Los Santos.
                </FieldDescription>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.AppField>
      </FieldGroup>
    </div>
  ),
})
