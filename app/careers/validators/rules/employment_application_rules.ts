import vine from '@vinejs/vine'

type EmploymentExperienceParent = {
  isCurrentPosition?: boolean
  startDate?: string
}

export const validateEndDateWithContext = vine.createRule((value: unknown, _options, field) => {
  const data = field.parent as EmploymentExperienceParent

  const isCurrentPosition = data.isCurrentPosition
  const startDateStr = data.startDate
  const endDateStr = typeof value === 'string' ? value : undefined

  if (isCurrentPosition === false && startDateStr && endDateStr) {
    const start = new Date(`${startDateStr}-01`)
    const end = new Date(`${endDateStr}-01`)

    if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
      field.report('La date de fin doit être postérieure à la date de début', 'after', field)
    }
  }
})

export const validateAllStatements = vine.createRule(
  (value: unknown, requiredIds: string[], field) => {
    if (!Array.isArray(value)) return
    const isValid =
      value.length === requiredIds.length && requiredIds.every((id) => value.includes(id))

    if (!isValid) {
      field.report(
        'Vous devez comprendre et accepter toutes les clauses.',
        'declaration.incomplete',
        field
      )
    }
  }
)
