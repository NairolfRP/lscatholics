import { withForm } from '@/lib/form'
import { createJobFormOpts } from '@/features/jobs/constants/form_opts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import { EMPLOYMENT_TYPE } from '#shared/constants/employment.constants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Textarea } from '@/shared/components/ui/textarea'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/shared/components/ui/number-field'
import { JobDashboardTitleSlugFields } from '@/features/jobs/components/form/dashboard/fields/job-dashboard-title-slug-fields'
import { JobDashboardResponsibilitiesField } from '@/features/jobs/components/form/dashboard/fields/job-dashboard-responsibilities-field'
import { JobDashboardRequirementsField } from '@/features/jobs/components/form/dashboard/fields/job-dashboard-requirements-field'
import { JobDashboardSkillsField } from '@/features/jobs/components/form/dashboard/fields/job-dashboard-skills-field'
import { JobDashboardFormSidebar } from '@/features/jobs/components/form/dashboard/job-dashboard-form-sidebar'
import { JobDashboardAffiliationFields } from '@/features/jobs/components/form/dashboard/fields/job-dashboard-affiliation-fields'

type Props = { id?: string; autoSlug?: boolean; variant?: 'create' | 'edit' }

export const JobDashboardForm = withForm({
  ...createJobFormOpts,
  props: {
    id: 'create-job-offer-form',
    autoSlug: true,
    variant: 'create' as 'create' | 'edit',
  } as Props,
  render: ({ form, id = 'create-job-offer-form', autoSlug = true, variant = 'create' }) => {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contenu</CardTitle>
              <CardDescription>
                Renseignez les informations principales de l'offre d'emploi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form.AppField name="employmentType">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Type d'emploi *</FieldLabel>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger id={field.name} className="w-full" aria-invalid={isInvalid}>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          {Object.entries(EMPLOYMENT_TYPE).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )
                }}
              </form.AppField>

              <JobDashboardTitleSlugFields form={form} autoSlug={autoSlug} />

              <form.AppField name="summary">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        placeholder="Courte description de l'emploi..."
                        rows={3}
                      />
                      {isInvalid && <FieldError errors={field.state.meta.errors} />}
                    </Field>
                  )
                }}
              </form.AppField>

              <JobDashboardAffiliationFields form={form} />

              <form.AppField name="salary">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Salaire hebdomadaire *</FieldLabel>
                      <NumberField
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(v) => {
                          if (v) {
                            field.handleChange(v)
                          } else {
                            field.handleChange(undefined as unknown as number)
                          }
                        }}
                        aria-invalid={isInvalid}
                        min={0}
                        formatOptions={{
                          style: 'currency',
                          currency: 'USD',
                          currencyDisplay: 'symbol',
                          currencySign: 'accounting',
                        }}
                        className="gap-2"
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

              <JobDashboardResponsibilitiesField form={form} />

              <JobDashboardRequirementsField form={form} />

              <JobDashboardSkillsField form={form} />
            </CardContent>
          </Card>
        </div>

        <JobDashboardFormSidebar form={form} variant={variant} formId={id} />
      </div>
    )
  },
})
