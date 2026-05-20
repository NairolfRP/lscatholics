import { X } from 'lucide-react'
import { withForm } from '@/lib/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import { HOUSEHOLD_ROLES, HouseholdRole } from '#shared/constants/person.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Input } from '@/shared/components/ui/input'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'

type Props = {
  index: number
  onRemove: () => void
}

export const ParishionerHouseholdMemberFields = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
    bankRoutingNumber: '',
  }),
  props: {} as Props,
  render: ({ form, index, onRemove }) => (
    <Card className="relative">
      <CardContent className="pt-6">
        <div className="absolute top-4 right-4">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <span className="sr-only">Supprimer</span>
            <X width={16} height={16} />
          </Button>
        </div>

        <div className="grid md:grid-cols-2 items-start gap-4 pr-10">
          <form.AppField name={`familyMembers[${index}].firstname`}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel required htmlFor={field.name}>
                    Prénom
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    placeholder="Prénom"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name={`familyMembers[${index}].lastname`}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel required htmlFor={field.name}>
                    Nom de famille
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    required
                    placeholder="Nom de famille"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name={`familyMembers[${index}].age`}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel required htmlFor={field.name}>
                    Âge
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                    type="number"
                    min={0}
                    max={120}
                    placeholder="Âge"
                    required
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name={`familyMembers[${index}].role`}>
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel required htmlFor={field.name}>
                      Rôle dans le foyer
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(v: HouseholdRole) => {
                      field.handleChange(v)
                    }}
                    required
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionner un rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOUSEHOLD_ROLES.map((role) => (
                        <SelectItem key={role.id} value={role.id}>
                          {role.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>
        </div>

        <form.AppField name={`familyMembers[${index}].isNpc`}>
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field
                orientation="horizontal"
                className="flex flex-row items-center gap-x-2 mt-2"
                data-invalid={isInvalid}
              >
                <Checkbox
                  id={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked === true)
                  }}
                  aria-invalid={isInvalid}
                />
                <div className="space-y-1 leading-none">
                  <FieldLabel htmlFor={field.name} className="inline text-sm">
                    (( C'est un personnage non-joueur (PNJ) ))
                  </FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </div>
              </Field>
            )
          }}
        </form.AppField>
      </CardContent>
    </Card>
  ),
})
