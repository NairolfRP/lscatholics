import { Loader2, Send } from 'lucide-react'
import { router, usePage } from '@inertiajs/react'
import { useForm } from '@tanstack/react-form'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { Button } from '@/shared/components/ui/button'
import { Textarea } from '@/shared/components/ui/textarea'
import { Input } from '@/shared/components/ui/input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/components/ui/field'
import { contactSchema } from '@/features/contact/schemas/contact.schema'
import { useCurrentCharacter } from '@/shared/hooks/use_current_character'
import type { CONTACT_SUBJECTS } from '#shared/constants/contact_subjects'
import { urlFor } from '@/client'
import { serverErrorsFormConvertor } from '@/lib/utils'

type Props = {
  subjects: typeof CONTACT_SUBJECTS
}

export default function ContactForm() {
  const { subjects } = usePage<Props>().props
  const currentCharacter = useCurrentCharacter()

  const form = useForm({
    validators: { onChange: contactSchema },
    defaultValues: {
      firstname: currentCharacter?.firstname ?? '',
      lastname: currentCharacter?.lastname ?? '',
      phone: '',
      subject: '',
      message: '',
    },
    onSubmit: ({ value }) => {
      router.post(urlFor('contact.submit'), value, {
        preserveScroll: true,
        onSuccess: () => {
          form.reset()
        },
        onError: (err) => {
          form.setErrorMap({ onSubmit: serverErrorsFormConvertor(err) })
        },
      })
    },
  })

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
    >
      <FieldGroup>
        <div
          key={`current-character-${currentCharacter?.id}`}
          className="grid md:grid-cols-2 gap-4"
        >
          {(
            [
              { name: 'firstname', label: 'Prénom', placeholder: 'John' },
              { name: 'lastname', label: 'Nom de famille', placeholder: 'Doe' },
            ] as const
          ).map((item) => (
            <form.Field
              key={item.name}
              name={item.name}
              children={(field) => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700"
                    >
                      {item.label} *
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
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />
          ))}
        </div>

        <form.Field
          name="phone"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Téléphone *
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="tel"
                  placeholder="1234"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="subject"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Sujet *
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Choisissez un sujet" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {subjects.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />

        <form.Field
          name="message"
          children={(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="block text-sm font-medium text-gray-700"
                >
                  Message *
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={6}
                  maxLength={2000}
                  placeholder="Décrivez votre demande en détail..."
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        />
      </FieldGroup>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            size="lg"
            className="w-full bg-catholic-gold hover:bg-yellow-600 transition-all duration-200"
            disabled={!canSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" /> Envoi en cours...
              </>
            ) : (
              <>
                <Send className="size-5 mr-2" /> Envoyer le message
              </>
            )}
          </Button>
        )}
      />

      <p className="text-sm text-gray-500">* Champs obligatoires</p>
    </form>
  )
}
