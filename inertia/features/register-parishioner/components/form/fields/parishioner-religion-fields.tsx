import { Church } from 'lucide-react'
import { withForm } from '@/shared/hooks/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import {
  BAPTIZED_OPTIONS,
  type BaptizedOption,
  CATHOLIC_OR_OTHER,
  CatholicOrOther,
} from '#shared/constants/person.constants'
import { parishes, ParishId } from '@/shared/constants/parishes.constants'

export const ParishionerReligionFields = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
  }),
  render: ({ form }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        <Church className="w-5 h-5" />
        Paroisse et religion
      </h3>

      <FieldGroup>
        <div className="grid md:grid-cols-2 items-start gap-4">
          <form.AppField name="baptized">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Êtes-vous baptisé ? *</FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(v: BaptizedOption) => {
                      field.handleChange(v)
                    }}
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionnez une réponse" />
                    </SelectTrigger>
                    <SelectContent>
                      {BAPTIZED_OPTIONS.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name="religion">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Religion *</FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(v: CatholicOrOther) => {
                      field.handleChange(v)
                    }}
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionnez une réponse" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATHOLIC_OR_OTHER.map((religion) => (
                        <SelectItem key={religion.id} value={religion.id}>
                          {religion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name="parish">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>Paroisse *</FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value ? String(field.state.value) : undefined}
                    onValueChange={(v) => {
                      field.handleChange(Number(v) as ParishId)
                    }}
                  >
                    <SelectTrigger className="w-full" aria-invalid={isInvalid}>
                      <SelectValue id={field.name} placeholder="Sélectionnez une paroisse" />
                    </SelectTrigger>
                    <SelectContent>
                      {parishes.map((parish) => (
                        <SelectItem key={`parish-${parish.id}`} value={String(parish.id)}>
                          {parish.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <FieldDescription>
                    Indiquez une paroisse de l'archidiocèse. En général, on indique la paroisse la
                    plus proche de son domicile.
                  </FieldDescription>
                </Field>
              )
            }}
          </form.AppField>
        </div>
      </FieldGroup>
    </div>
  ),
})
