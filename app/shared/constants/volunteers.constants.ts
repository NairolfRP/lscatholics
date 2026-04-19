export const VOLUNTEER_APPLICATION_REQUIRED_HOURS = [
  {
    id: 'religious-education',
    label: 'Enseignement religieux (ex.: catéchisme) ',
  },
  {
    id: 'court-ordered',
    label: "Travaux d'intérêt général ordonnés par le tribunal",
  },
  {
    id: 'high-school',
    label: 'Conditions requises par le lycée',
  },
  {
    id: 'university',
    label: 'Conditions requises par le College/Université',
  },
  {
    id: 'other',
    label: 'Autre',
  },
] as const

export type VolunteerApplicationRequiredHours =
  (typeof VOLUNTEER_APPLICATION_REQUIRED_HOURS)[number]['id']

export const getVolunteerApplicationRequiredHoursLabelById = (id: string) => {
  return VOLUNTEER_APPLICATION_REQUIRED_HOURS.find((r) => r.id === id)?.label
}
