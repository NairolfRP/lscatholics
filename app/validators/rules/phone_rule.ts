import vine from '@vinejs/vine'

export const phoneRule = vine.createRule((value, _, field) => {
  if (typeof value !== 'string') {
    field.report('Le numéro de téléphone est requis.', 'phone', field)
    return
  }

  const digitsOnly = value.replace(/\s/g, '')
  if (!/^\d{3,8}$/.test(digitsOnly)) {
    field.report('Le numéro de téléphone doit contenir entre 3 et 8 chiffres.', 'phone', field)
  }
})
