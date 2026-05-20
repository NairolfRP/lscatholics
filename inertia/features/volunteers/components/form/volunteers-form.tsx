import { useAppForm } from '@/lib/form'
import { volunteersFormOpts } from '@/features/volunteers/constants/form_opts'
import { useCurrentCharacter } from '@/shared/hooks/use_current_character'
import { FieldGroup, FieldSeparator } from '@/shared/components/ui/field'
import { router } from '@inertiajs/react'
import { urlFor } from '@/lib/client'
import { serverErrorsFormConvertor } from '@/lib/utils'
import { InertiaProps } from '@/shared/types/pages'
import { VolunteerApplicationIdentityFields } from '@/features/volunteers/components/form/fields/volunteer-application-identity-fields'
import { VolunteerApplicationContactInfoFields } from '@/features/volunteers/components/form/fields/volunteer-application-contact-info-fields'
import { VolunteerApplicationAgeField } from '@/features/volunteers/components/form/fields/volunteer-application-age-field'
import { VolunteerApplicationInterestsSkillsFields } from '@/features/volunteers/components/form/fields/volunteer-application-interests-skills-fields'
import { VolunteerApplicationAdditionalInfoFields } from '@/features/volunteers/components/form/fields/volunteer-application-additional-info-fields'
import { VolunteerApplicationReferencesFields } from '@/features/volunteers/components/form/fields/volunteer-application-references-fields'
import { VolunteerApplicationAvailabilityField } from '@/features/volunteers/components/form/fields/volunteer-application-availability-field'
import { VolunteerApplicationRequiredHoursFields } from '@/features/volunteers/components/form/fields/volunteer-application-required-hours-fields'
import { VolunteerApplicationButtons } from '@/features/volunteers/components/form/fields/volunteer-application-buttons'

export function VolunteersForm() {
  const currentCharacter = useCurrentCharacter()!

  const form = useAppForm({
    ...volunteersFormOpts(currentCharacter.firstname, currentCharacter.lastname),
    onSubmit: ({ value }) => {
      router.post(urlFor('volunteers.submit'), value, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          if ((page.props as unknown as InertiaProps)?.flash?.success) {
            form.reset()
          }
        },
        onError: (err) => {
          form.setErrorMap({ onSubmit: serverErrorsFormConvertor(err) })
        },
      })
    },
  })

  return (
    <form
      id="volunteer-application-form"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="flex flex-col gap-7"
    >
      <VolunteerApplicationIdentityFields form={form} />

      <FieldGroup className="grid items-start grid-cols-1 sm:grid-cols-2">
        <VolunteerApplicationContactInfoFields form={form} />

        <VolunteerApplicationAgeField form={form} />
      </FieldGroup>

      <FieldSeparator />

      <FieldGroup>
        <VolunteerApplicationInterestsSkillsFields form={form} />

        <FieldSeparator />

        <VolunteerApplicationAdditionalInfoFields form={form} />
      </FieldGroup>

      <FieldSeparator />

      <VolunteerApplicationReferencesFields form={form} />

      <FieldSeparator />

      <VolunteerApplicationAvailabilityField form={form} />

      <FieldSeparator />

      <VolunteerApplicationRequiredHoursFields form={form} />

      <FieldSeparator />

      <VolunteerApplicationButtons form={form} />
    </form>
  )
}
