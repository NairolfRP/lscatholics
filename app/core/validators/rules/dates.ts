import vine from '@vinejs/vine'

/**
 * Validates the YYYY-MM format and year limits (1950 to next year)
 */
export const validateYearMonth = vine.createRule((value: unknown, _, field) => {
  if (typeof value !== 'string') return
  const [year, month] = value.split('-').map(Number)
  const maxYear = new Date().getFullYear() + 1

  if (year < 1950 || year > maxYear || month < 1 || month > 12) {
    field.report(
      'Format invalide ou date hors limites (1950 - année courante).',
      'date.bounds',
      field
    )
  }
})
