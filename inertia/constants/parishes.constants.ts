import type { Parish } from '@/types'
import Cathedral from '@/assets/images/olscathedral.webp'
import RockfordHillsChurch from '@/assets/images/rockfordhills_church.png'
import Iglesia from '@/assets/images/iglesia.png'

export const parishes: Parish[] = [
  {
    id: 1,
    image: Cathedral,
    name: 'Cathédrale Notre-Dame-des-Saints',
    address: 'Ginger Street, Little Seoul, Los Santos, SA 90010',
    description:
      "Église-mère de l'archidiocèse de Los Santos et chef-lieu du Doyenné, la Cathédrale Notre-Dame-des-Saints accueille les plus grandes célébrations de l'année, présidées par le cardinal-archevêque de Los Santos.",
    priestOffice: 'Curé-archiprêtre',
    priestName: 'Don Giuseppe Benedetti',
  },
  {
    id: 2,
    image: RockfordHillsChurch,
    name: 'Église du Bon Pasteur',
    address: 'Boulevard Del Perro, Rockford Hills, Los Santos, SA 90210-3298',
    priestOffice: 'Doyen',
    priestName: 'Don Giuseppe Benedetti',
  },
  {
    id: 3,
    image: Iglesia,
    name: 'Eglise Nuestra Señora Reina de Los Santos',
    address: 'Old Mexican Plaza, Alta, Los Santos, SA 90012',
    description:
      "L'Iglesia Nuestra Señora Reina de Los Santos se trouve sur la place historique de la fondation de Los Santos. Plus vieille église de la Ville, elle demeure une trace précieuse des premiers pas chrétiens sur cette nouvelle terre, consacrée à Notre-Dame, la Reine des Saints.",
    priestOffice: 'Doyen',
    priestName: 'Don Giuseppe Benedetti',
  },
] as const
