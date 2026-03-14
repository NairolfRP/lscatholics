import { withForm } from '@/shared/hooks/form'
import { createJobFormOpts } from '@/features/jobs/constants/form_opts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Field, FieldContent, FieldError, FieldLabel } from '@/shared/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Link } from '@adonisjs/inertia/react'
import { JobDashboardDatesFields } from '@/features/jobs/components/form/dashboard/fields/job-dashboard-dates-fields'

export const JobDashboardFormSidebar = withForm({
  ...createJobFormOpts,
  props: {
    variant: 'create' as 'create' | 'edit',
    formId: 'create-job-form',
  },
  render: ({ form, variant, formId }) => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publication</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <form.AppField name="isActive">
                {(field) => {
                  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldContent>
                        <FieldLabel htmlFor={field.name}>Statut</FieldLabel>
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </FieldContent>
                      <Select
                        name={field.name}
                        value={field.state.value ? 'yes' : 'no'}
                        onValueChange={(v) => {
                          if (v === 'yes') {
                            return field.handleChange(true)
                          }
                          field.handleChange(false)
                        }}
                      >
                        <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Actif</SelectItem>
                          <SelectItem value="no">Fermée</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                  )
                }}
              </form.AppField>
            </div>

            <JobDashboardDatesFields form={form} />

            <Field>
              <div className="flex gap-2">
                {variant === 'edit' ? (
                  <Button type="submit" form={formId} className="flex-1">
                    Mettre à jour
                  </Button>
                ) : (
                  <Button type="submit" form={formId} className="flex-1">
                    {form.state.values.isActive ? 'Publier' : 'Enregistrer'}
                  </Button>
                )}
                <Button type="button" variant="outline" asChild>
                  <Link route="dashboard.dashboard_jobs.index">Annuler</Link>
                </Button>
              </div>
            </Field>
          </CardContent>
        </Card>
      </div>
    )
  },
})
