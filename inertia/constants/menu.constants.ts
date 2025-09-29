export interface MenuItem {
  id: string
  label: string
  route?: string
  routeParams?: Record<string, any>
  href?: string
  target?: '_blank' | '_self'
  children?: MenuItem[]
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'our-community',
    label: 'Notre communauté',
    children: [
      {
        id: 'about-us',
        label: "A propos de l'Archidiocèse",
        route: 'about-us',
      },
      {
        id: 'archbishop',
        label: 'Cardinal Ronan Callahan',
        route: 'archbishop.index',
      },
      {
        id: 'departments',
        label: 'Départements',
        route: 'departments.index',
      },
      /*{
        id: 'administrative-handbook',
        label: 'Manuel administratif',
        href: '#',
      },*/
      {
        id: 'privacy-policy',
        label: 'Politique de confidentialité',
        route: 'privacy',
      },
      {
        id: 'contact-us',
        label: 'Nous contacter',
        route: 'contact',
      },
    ],
  },
  {
    id: 'find',
    label: 'Trouver',
    children: [
      {
        id: 'parishes',
        label: 'Liste des paroisses',
        route: 'find.parishes',
      },
      {
        id: 'events',
        label: 'Liste des événements',
        route: 'find.events',
      },
      {
        id: 'daily-readings',
        label: 'Lectures du jour',
        route: 'dailyReadings',
      },
    ],
  },

  {
    id: 'get-involved',
    label: "S'impliquer",
    children: [
      {
        id: 'catholic-charities',
        label: 'Catholic Charities',
        route: 'charities.index',
      },
      {
        id: 'donate',
        label: 'Faire un don',
        route: 'donate.index',
      },
      {
        id: 'vocations',
        label: 'Vocations',
        route: 'vocations',
      },
      {
        id: 'work-for-archdiocese',
        label: "Travailler pour l'Archidiocèse",
        route: 'jobs.index',
      },
    ],
  },

  {
    id: 'services',
    label: 'Services',
    route: 'services.index',
  },

  {
    id: 'newsroom',
    label: 'Actualités',
    route: 'news.index',
  },
]

export const FOOTER_MENU_ITEMS: MenuItem[] = [
  {
    id: 'archdiocese',
    label: "L'Archidiocèse",
    children: [
      {
        id: 'about-us',
        label: 'Qui sommes-nous ?',
        route: 'about-us',
      },
      {
        id: 'archbishop',
        label: 'Cardinal Ronan Callahan',
        route: 'archbishop.index',
      },
      {
        id: 'departments',
        label: 'Départements',
        route: 'departments.index',
      },
      {
        id: 'catholic-charities',
        label: 'Catholic Charities',
        route: 'charities.index',
      },
      {
        id: 'contact-us',
        label: 'Nous contacter',
        route: 'contact',
      },
    ],
  },
  {
    id: 'parishes',
    label: 'Vie paroissiale',
    children: [
      {
        id: 'parishes',
        label: 'Liste des paroisses',
        route: 'find.parishes',
      },
      {
        id: 'services',
        label: 'Services',
        route: 'services.index',
      },
      {
        id: 'events',
        label: 'Événements',
        route: 'find.events',
      },
    ],
  },
  {
    id: 'careers',
    label: 'Carrières',
    children: [
      {
        id: 'vocations',
        label: 'Vocations',
        route: 'vocations',
      },
      {
        id: 'work-for-archdiocese',
        label: "Travailler pour l'Archidiocèse",
        route: 'jobs.index',
      },
    ],
  },
]
