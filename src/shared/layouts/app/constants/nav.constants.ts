import type { NavItem } from '#/shared/types/nav.types'

export const navItems: NavItem[] = [
  {
    label: 'Notre communauté',
    children: [
      {
        label: "A propos de l'Archidiocèse",
        to: '/about',
      },
      {
        label: 'Cardinal Edmund Hennessy',
        to: '/archbishop',
      },
      {
        label: 'Départements',
        to: '/departments',
      },
      {
        label: 'Politique de confidentialité',
        to: '/privacy',
      },
      {
        label: "S'enregistrer comme paroissien",
        to: '/register-parishioner',
      },
      {
        label: 'Nous contacter',
        to: '/contact',
      },
    ],
  },

  {
    label: 'Trouver',
    children: [
      {
        label: 'Décrets et lois',
        to: '/decrees',
      },
      {
        label: 'Liste des paroisses',
        to: '/parishes',
      },
      {
        label: 'Liste des événements',
        to: '/events',
      },
      {
        label: 'Lectures du jour',
        to: '/daily-readings',
      },
    ],
  },

  {
    label: "S'impliquer",
    children: [
      {
        label: 'Catholic Charities',
        to: '/charities',
      },
      {
        label: 'Devenir bénévole',
        to: '/volunteers',
      },
      {
        label: 'Faire un don',
        to: '/donate',
      },
      {
        label: "Travailler pour l'Archidiocèse",
        to: '/careers',
      },
      {
        label: 'Vocations',
        to: '/vocations',
      },
    ],
  },

  {
    label: 'Services',
    to: '/services',
  },

  {
    label: 'Actualités',
    to: '/newsroom',
  },

  {
    label: 'Boutique',
    to: '/gift-shop',
  },
] satisfies NavItem[]

export const footerNavItems: NavItem[] = [
  {
    label: "L'Archidiocèse",
    children: [
      {
        label: 'Qui sommes-nous ?',
        to: '/about',
      },
      {
        label: 'Cardinal Edmund Hennessy',
        to: '/archbishop',
      },
      {
        label: 'Départements',
        to: '/departments',
      },
      {
        label: 'Catholic Charities',
        to: '/charities',
      },
      {
        label: 'Nous contacter',
        to: '/contact',
      },
    ],
  },
  {
    label: 'Vie paroissiale',
    children: [
      {
        label: 'Liste des paroisses',
        to: '/parishes',
      },
      {
        label: 'Services',
        to: '/services',
      },
      {
        label: 'Événements',
        to: '/events',
      },
    ],
  },
  {
    label: 'Carrières',
    children: [
      {
        label: 'Vocations',
        to: '/vocations',
      },
      {
        label: "Travailler pour l'Archidiocèse",
        to: '/careers',
      },
    ],
  },
] satisfies NavItem[]
