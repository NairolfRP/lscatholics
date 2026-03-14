import { formOptions } from '@tanstack/react-form'
import { donateSchema, type DonateSchema } from '@/features/donate/schemas/donate.schema'

export const donateFormOpts = (firstname: string = '', lastname: string = '') => {
  return formOptions({
    validators: {
      onChange: donateSchema,
    },
    defaultValues: {
      amount: undefined,
      firstname: firstname || '',
      lastname: lastname || '',
      age: undefined,
      ethnicity: undefined,
      phone: '',
      address: '',
      district: undefined,
      isOrganization: false,
      organizationName: '',
      anonymous: false,
      fleecaConfirmation: false,
    } as unknown as DonateSchema,
  })
}
