export const CONTACT_SUBJECTS: Array<{ id: string; label: string }> = [
  {
    id: 'archbishop',
    label: 'Cardinal Ronan Callahan',
  },
  {
    id: 'chancelor',
    label: 'Chancellerie',
  },
  {
    id: 'press',
    label: 'Presse/Médias',
  },
  {
    id: 'sacraments',
    label: 'Sacrements',
  },
  {
    id: 'parishes',
    label: 'Paroisses',
  },
  {
    id: 'exorcism',
    label: "Service de l'Exorcisme",
  },
  {
    id: 'tribunal',
    label: 'Tribunal ecclésiastique',
  },
  {
    id: 'other',
    label: 'Autre',
  },
]

export const contactSubjectsIds = CONTACT_SUBJECTS.map((sub) => sub.id)
