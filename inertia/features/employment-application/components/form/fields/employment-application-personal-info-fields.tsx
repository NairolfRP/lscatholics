import { withForm } from '@/lib/form'
import { employmentApplicationFormOpts } from '@/features/employment-application/constants/form_opts'
import { Gender, GENDERS } from '#shared/constants/person.constants'
import { yesNo } from '#shared/constants/common.constants'
import { APPLICATION_SOURCES, ApplicationSource } from '#shared/constants/employment.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/shared/components/ui/radio-group'
import { Input } from '@/shared/components/ui/input'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/shared/components/ui/field'
import { DistrictSelectGroups } from '@/shared/components/fields/district-select/district-select-groups'
import type { GTA5DistrictId } from '#shared/constants/districts.constants'
import { useCurrentCharacter } from '@/shared/hooks/use_current_character'

const YES_NO_FIELDS = [
  {
    name: 'isPracticingCatholic',
    label: 'Êtes-vous catholique pratiquant ?',
    description: `La réponse a cette question n'est pas éliminatoire. L'archidiocèse peut préférer des candidats catholiques pour certains postes.`,
  },
  {
    name: 'isLegalUSWorker',
    label: `Si vous êtes embauché, pourrez-vous prouver votre droit à travailler aux États-Unis ?`,
    description: `Conformément aux lois fédérales sur l'immigration, les citoyens américains peuvent prouver leur droit à travailler aux U.S avec leur carte d'identité fédérale. Les étrangers doivent présenter une carte de résident permanent (green card) ou un permis de travail délivré par le Département de la Sécurité Interieure des États-Unis.`,
  },
  {
    name: 'hasDriverLicense',
    label: 'Possédez-vous un permis de conduire valide ?',
  },
] as const

const NAME_FIELDS = [
  { name: 'firstname', label: 'Prénom', placeholder: 'John', required: true },
  { name: 'middleName', label: 'Deuxième prénom', placeholder: 'Michael', required: false },
  { name: 'lastname', label: 'Nom de famille', placeholder: 'Doe', required: true },
] as const

export const EmploymentApplicationPersonalInfoFields = withForm({
  ...employmentApplicationFormOpts(),
  render: ({ form }) => {
    // oxlint-disable-next-line react-hooks-js/rules-of-hooks
    const currentCharacter = useCurrentCharacter()
    return (
      <>
        <FieldGroup
          key={currentCharacter?.id}
          className="grid sm:grid-cols-2 md:grid-cols-3 items-start"
        >
          {NAME_FIELDS.map((item) => (
            <form.AppField key={item.name} name={item.name}>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel required={item.required} htmlFor={field.name}>
                      {item.label}
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="text"
                      placeholder={item.placeholder}
                      aria-invalid={isInvalid}
                      required={item.required}
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            </form.AppField>
          ))}
        </FieldGroup>

        <FieldSeparator className="my-1" />

        <FieldGroup>
          <form.AppField name="age">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid} className="max-w-md">
                  <FieldLabel required htmlFor={field.name}>
                    Âge
                  </FieldLabel>
                  <NumberField
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(v) => field.handleChange(v ?? (undefined as unknown as number))}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    min={16}
                    max={115}
                    required
                  >
                    <NumberFieldContent>
                      <NumberFieldDecrement />
                      <NumberFieldInput />
                      <NumberFieldIncrement />
                    </NumberFieldContent>
                  </NumberField>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name="gender">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <FieldSet>
                  <FieldLegend required variant="label">
                    Je suis un{field.state.value === 'female' ? 'e' : ''}
                  </FieldLegend>
                  <RadioGroup
                    name={field.name}
                    value={field.state.value ?? ''}
                    onValueChange={(v: Gender) => field.handleChange(v)}
                  >
                    {GENDERS.map((item) => (
                      <FieldLabel key={item.id} htmlFor={`${field.name}-${item.id}`}>
                        <Field orientation="horizontal" data-invalid={isInvalid}>
                          <FieldContent>
                            <FieldTitle>{item.label}</FieldTitle>
                          </FieldContent>
                          <RadioGroupItem
                            id={`${field.name}-${item.id}`}
                            value={item.id}
                            aria-invalid={isInvalid}
                            required
                          />
                        </Field>
                      </FieldLabel>
                    ))}
                  </RadioGroup>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </FieldSet>
              )
            }}
          </form.AppField>
        </FieldGroup>

        <FieldSeparator className="my-1" />

        <FieldGroup className="grid sm:grid-cols-2 items-start">
          <form.AppField name="address">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel required htmlFor={field.name}>
                    Adresse
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text"
                    placeholder="123 San Andreas Avenue"
                    aria-invalid={isInvalid}
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.AppField name="district">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel required htmlFor={field.name}>
                      District
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value ?? ''}
                    onValueChange={(v: GTA5DistrictId) => field.handleChange(v)}
                    required
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionnez un district" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <DistrictSelectGroups />
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>
        </FieldGroup>

        <FieldSeparator className="my-1" />

        <FieldGroup>
          <form.AppField name="phone">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel required htmlFor={field.name}>
                    Numéro de téléphone
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="tel"
                    placeholder="12345678"
                    aria-invalid={isInvalid}
                    required
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>
        </FieldGroup>

        <FieldSeparator className="my-1" />

        <FieldGroup>
          {YES_NO_FIELDS.map((item, index) => (
            <form.AppField key={item.name} name={item.name}>
              {(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <FieldSet>
                    <FieldLegend required variant="label">
                      {item.label}
                    </FieldLegend>
                    {'description' in item && item.description && (
                      <FieldDescription>{item.description}</FieldDescription>
                    )}
                    <RadioGroup
                      name={field.name}
                      value={
                        field.state.value === true ? 'yes' : field.state.value === false ? 'no' : ''
                      }
                      onValueChange={(v) => field.handleChange(v === 'yes')}
                    >
                      {yesNo.map((option) => (
                        <FieldLabel key={option.id} htmlFor={`${field.name}-${option.id}`}>
                          <Field orientation="horizontal" data-invalid={isInvalid}>
                            <FieldContent>
                              <FieldTitle>{option.label}</FieldTitle>
                            </FieldContent>
                            <RadioGroupItem
                              id={`${field.name}-${option.id}`}
                              value={option.id}
                              aria-invalid={isInvalid}
                              required
                            />
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    {index === 0 && <FieldSeparator />}
                  </FieldSet>
                )
              }}
            </form.AppField>
          ))}
        </FieldGroup>

        <FieldSeparator className="my-1" />

        <FieldGroup>
          <form.AppField name="applicationSource.type">
            {(field) => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
              return (
                <Field data-invalid={isInvalid}>
                  <FieldContent>
                    <FieldLabel htmlFor={field.name}>
                      Comment avez-vous entendu parler de cette offre d'emploi ?
                    </FieldLabel>
                  </FieldContent>
                  <Select
                    name={field.name}
                    value={field.state.value ?? ''}
                    onValueChange={(v: ApplicationSource | 'none') => {
                      if (!v || v === 'none') {
                        field.handleChange(undefined)
                      } else {
                        field.handleChange(v)
                      }
                    }}
                  >
                    <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                      <SelectValue placeholder="Sélectionnez une réponse" />
                    </SelectTrigger>
                    <SelectContent position="item-aligned">
                      <SelectItem value="none" disabled={!field.state.value}>
                        N/A
                      </SelectItem>
                      {APPLICATION_SOURCES.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              )
            }}
          </form.AppField>

          <form.Subscribe selector={(state) => state.values.applicationSource?.type}>
            {(type) =>
              type === 'employeeReferral' && (
                <form.AppField name="applicationSource.employeeReferral">
                  {(field) => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel required htmlFor={field.name}>
                          Indiquez l'identité de l'employé
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Jane Doe"
                          maxLength={100}
                          aria-invalid={isInvalid}
                          required
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    )
                  }}
                </form.AppField>
              )
            }
          </form.Subscribe>

          <FieldSeparator />
        </FieldGroup>
      </>
    )
  },
})
