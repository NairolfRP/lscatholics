import type { ParishInfo } from '#/shared/types/parish.types'

export const parishes: Array<ParishInfo> = [
  {
    id: 'cathedral',
    title: 'Cathédrale Notre-Dame-des-Saints',
    description:
      "Église-mère de l'archidiocèse de Los Santos et chef-lieu du Doyenné, la Cathédrale Notre-Dame-des-Saints accueille les plus grandes célébrations de l'année, présidées par le cardinal-archevêque de Los Santos.",
    address: 'Ginger street, Little Seoul, Los Santos, SA 90010',
    pastorOffice: 'Curé-archiprêtre',
    pastor: 'Don Giuseppe Benedetti',
    coords: [-709.148, -759.794],
  },
  {
    id: 'good_shepherd',
    title: 'Église du Bon Pasteur',
    address: 'Boulevard Del Perro, Rockford Hills, Los Santos, SA 90210-3298',
    pastorOffice: 'Doyen',
    pastor: 'Don Giuseppe Benedetti',
    coords: [-23.6121, -766.689],
  },
  {
    id: 'old_church',
    title: 'Eglise Nuestra Señora Reina de Los Santos',
    description:
      "L'Iglesia Nuestra Señora Reina de Los Santos se trouve sur la place historique de la fondation de Los Santos. Plus vieille église de la Ville, elle demeure une trace précieuse des premiers pas chrétiens sur cette nouvelle terre, consacrée à Notre-Dame, la Reine des Saints.",
    address: 'Old Mexican Plaza, Alta, Los Santos, SA 90012',
    pastorOffice: 'Doyen',
    pastor: 'Don Giuseppe Benedetti',
    coords: [-338.861, 402.143],
  },
]
