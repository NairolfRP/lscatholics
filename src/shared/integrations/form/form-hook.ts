import { createFormHook, createFormHookContexts } from '@tanstack/react-form'
import { DateTimePickerField } from '#/shared/components/form/date-time-picker-field'
import { InputField } from '#/shared/components/form/input-field'
import { MultiSelectField } from '#/shared/components/form/multi-select-field'
import { SelectField } from '#/shared/components/form/select-field'
import { SubmitButton } from '#/shared/components/form/submit-button'
import { FieldGroup } from '#/shared/components/ui/field'
import { CheckboxField } from '#shared/components/form/checkbox-field.tsx'
import { CurrencyField } from '#shared/components/form/currency-field.tsx'
import { RadioField } from '#shared/components/form/radio-field.tsx'
import { TextareaField } from '#shared/components/form/textarea-field.tsx'
import { YesNoField } from '#shared/components/form/yes-no-field.tsx'

export const { fieldContext, useFieldContext, formContext, useFormContext } =
  createFormHookContexts()

export const { useAppForm, withForm } = createFormHook({
  fieldComponents: {
    InputField,
    TextareaField,
    SelectField,
    MultiSelectField,
    DateTimePickerField,
    CheckboxField,
    CurrencyField,
    YesNoField,
    RadioField,
  },
  formComponents: {
    FieldGroup,
    SubmitButton,
  },
  fieldContext,
  formContext,
})
