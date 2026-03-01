import vine from '@vinejs/vine'

type PhoneRuleOptions = {
  required?: boolean
}

export const phoneRule = vine.createRule(
  (value, options: PhoneRuleOptions | undefined = {}, field) => {
    const { required = true } = options

    if (typeof value !== 'string' || value.trim() === '') {
      if (required) {
        field.report('Le numéro de téléphone est requis.', 'phone', field)
      }
      return
    }

    const digits = value.replace(/\s/g, '')
    if (!/^\d{3,8}$/.test(digits)) {
      field.report('Le numéro de téléphone doit contenir entre 3 et 8 chiffres.', 'phone', field)
    }
  }
)
