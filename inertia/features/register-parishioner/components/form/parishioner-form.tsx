import { useAppForm } from '@/shared/hooks/form'
import { registerParishionerFormOpts } from '@/features/register-parishioner/constants/form_opts'
import { urlFor } from '@/client'
import { router } from '@inertiajs/react'
import { toast } from 'sonner'
import { usePageProps } from '@/shared/hooks/use_page_props'
import { serverErrorsFormConvertor } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { LoaderCircle } from 'lucide-react'
import { Separator } from '@/shared/components/ui/separator'
import { ParishionerPersonalInfoFields } from '@/features/register-parishioner/components/form/fields/parishioner-personal-info-fields'
import { ParishionerContactInfoFields } from '@/features/register-parishioner/components/form/fields/parishioner-contact-info-fields'
import { ParishionerAddressFields } from '@/features/register-parishioner/components/form/fields/parishioner-address-fields'
import { ParishionerReligionFields } from '@/features/register-parishioner/components/form/fields/parishioner-religion-fields'
import { ParishionerHouseholdFields } from '@/features/register-parishioner/components/form/fields/parishioner-household-fields'
import { ParishionerOOCFields } from '@/features/register-parishioner/components/form/fields/parishioner-ooc-fields'
import { ParishionerMessageField } from '@/features/register-parishioner/components/form/fields/parishioner-message-field'

export function ParishionerForm() {
  const props = usePageProps<{ errors: { E_REGISTER_PARISHIONER_ERROR?: string } }>()

  const form = useAppForm({
    ...registerParishionerFormOpts(props.user!.currentCharacter!),
    onSubmit: ({ value }) => {
      router.post(urlFor('registerParishioner.submit'), value, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: (page) => {
          if (page.props.success) {
            form.reset()
            return toast.success('Succès !', {
              description: props.success || 'Soumis avec succès !',
            })
          }
          toast.error(props.errors.E_REGISTER_PARISHIONER_ERROR || 'Une erreur est survenue.')
        },
        onError: (err) => {
          form.setErrorMap({
            onSubmit: serverErrorsFormConvertor(err),
          })
        },
      })
    },
  })

  const onSubmit = (e: React.SubmitEvent) => {
    e.preventDefault()
    form.handleSubmit()
  }

  return (
    <form id="register-parishioner-form" onSubmit={onSubmit} className="space-y-8">
      <ParishionerPersonalInfoFields form={form} characterId={props.user!.currentCharacter!.id} />

      <ParishionerContactInfoFields form={form} />

      <ParishionerAddressFields form={form} />

      <ParishionerReligionFields form={form} />

      <ParishionerHouseholdFields form={form} />

      <ParishionerMessageField form={form} />

      <Separator />

      <ParishionerOOCFields form={form} />

      <div className="flex justify-end pt-6 border-t">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting, state.isValidating]}
        >
          {([canSubmit, isSubmitting, isValidating]) => (
            <Button
              type="submit"
              form="register-parishioner-form"
              size="lg"
              disabled={!canSubmit || isValidating}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Soumission...
                </>
              ) : (
                "Soumettre l'enregistrement"
              )}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  )
}
