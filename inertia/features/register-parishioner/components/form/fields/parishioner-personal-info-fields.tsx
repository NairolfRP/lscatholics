import { Users } from 'lucide-react'
import {
  CIVIL_TITLES,
  type CivilTitle,
  Gender,
  GENDERS,
  MARITAL_STATUS,
  type MaritalStatus,
} from '#shared/constants/person.constants'
import { LOCAL_ETHNICS_COMMUNITIES } from '#shared/constants/ethnicity.constants'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Input } from '@/shared/components/ui/input'
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/shared/components/ui/field'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import { withForm } from '@/shared/hooks/form'
import { Fragment } from 'react'

export const ParishionerPersonalInfoFields = withForm({
  ...registerParishionerFormOpts({
    id: 0,
    memberid: 0,
    firstname: '',
    lastname: '',
    bankRoutingNumber: '',
  }),
  props: {
    characterId: 0,
  },
  render: ({ form, characterId }) => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Informations personnelles
        </h3>

        <FieldGroup>
          <form.AppField name="civilTitle">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel required htmlFor={field.name}>
                      Titre de civilité
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(v: CivilTitle) => {
                      field.handleChange(v)
                    }}
                    required
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionnez un titre de civilité" />
                    </SelectTrigger>
                    <SelectContent>
                      {CIVIL_TITLES.map((cTitle) => (
                        <SelectItem key={cTitle.id} value={cTitle.id}>
                          {cTitle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name="maritalStatus">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel required htmlFor={field.name}>
                      État matrimonial
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={(v: MaritalStatus) => {
                      field.handleChange(v)
                    }}
                    required
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionnez un état matrimonial" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {MARITAL_STATUS.map((mStatus) => (
                          <SelectItem key={mStatus.id} value={mStatus.id}>
                            {mStatus.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <div className="grid md:grid-cols-2 items-start gap-4">
            <Fragment key={characterId}>
              {(
                [
                  { name: 'firstname', label: 'Prénom', placeholder: 'John' },
                  { name: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
                ] as const
              ).map((item) => (
                <form.AppField key={item.name} name={item.name}>
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel required htmlFor={field.name}>
                          {item.label}
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder={item.placeholder}
                          aria-invalid={isInvalid}
                          required
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </form.AppField>
              ))}
            </Fragment>

            <form.AppField name="gender">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldContent>
                      <FieldLabel required htmlFor={field.name}>
                        Sexe
                      </FieldLabel>
                    </FieldContent>
                    <Select
                      name={field.name}
                      value={field.state.value}
                      onValueChange={(v: Gender) => {
                        field.handleChange(v)
                      }}
                      required
                    >
                      <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                        <SelectValue placeholder="Sélectionnez un genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {GENDERS.map((gender) => (
                            <SelectItem key={gender.id} value={gender.id}>
                              {gender.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.AppField>

            <form.AppField name="age">
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel required htmlFor={field.name}>
                      Âge
                    </FieldLabel>
                    <NumberField
                      id={field.name}
                      min={16}
                      max={120}
                      value={field.state.value ?? null}
                      onChange={(v) => field.handleChange(v ?? undefined)}
                      required
                    >
                      <NumberFieldContent>
                        <NumberFieldDecrement />
                        <NumberFieldInput id={field.name} aria-invalid={isInvalid} />
                        <NumberFieldIncrement />
                      </NumberFieldContent>
                    </NumberField>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.AppField>
          </div>

          <form.AppField name="ethnicCommunity">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Êtes-vous membre d'une communauté ethnique spécifique ?
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value}
                    onValueChange={field.handleChange}
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionner une communauté" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {LOCAL_ETHNICS_COMMUNITIES.map((community) => (
                          <SelectItem key={community.id} value={community.id}>
                            {community.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name="occupation">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Activité / Emploi</FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="Votre activité ou travail"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>
        </FieldGroup>
      </div>
    )
  },
})
