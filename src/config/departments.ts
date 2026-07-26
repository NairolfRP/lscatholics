import { DEPARTMENT } from '#shared/constants/department.ts'
import type { Department } from '#shared/types/department.types.ts'

export const departments: Department[] = [
  {
    id: DEPARTMENT.ARCHBISHOP,
    slug: 'office-of-the-archbishop',
    title: "Bureau de l'Archevêque",
    description: "Le Bureau de l'Archevêque soutien l'archevêque dans l'exercice de sa charge.",
    page: {
      director: {
        name: 'Cardinal Ronan Callahan',
        position: 'Archvêque de Los Santos',
        image: '/assets/images/cardinal_callahan_officiel_portrait.webp',
      },
      teams: [
        {
          title: "Équipe du Bureau de l'Archevêque",
          members: [
            {
              position: 'Secrétaire particulier',
            },
          ],
        },
      ],
    },
  },

  {
    id: DEPARTMENT.MODERATOR,
    slug: 'office-of-the-vicar-general',
    title: 'Vicaire général',
    description:
      "Le vicaire général assiste l'archevêque dans l'administration et l'organisation du gouvernement de l'archidiocèse.",
    page: {
      director: {
        position: 'Vicaire Général et Modérateur de la Curie',
      },
    },
  },

  {
    id: DEPARTMENT.CHANCELLOR,
    slug: 'chancellery',
    title: 'Chancelier',
    description:
      'Le Chancelier est garde des sceaux et principal responsable des archives ainsi que des affaires administratives. Il assure les opérations quotidiennes, authentifie les actes officiels et coordonne les départements.',
    page: {
      director: {
        position: 'Chancelier',
      },
    },
  },

  {
    id: DEPARTMENT.SAFETY,
    slug: 'office-of-safety',
    shortTitle: 'Sécurité',
    title: 'Bureau de la Sécurité',
    description:
      "Le Bureau de la Sécurité est responsable de la sécurité personnelle de l'Archevêque et des hauts dignitaires. Il garantit notamment un environnement sûr et accueillant dans les lieux sacrés et les propriétés de l'Archidiocèse.",
    page: {
      director: {
        position: 'Directeur de la Sécurité',
      },
    },
  },

  {
    id: DEPARTMENT.COM,
    slug: 'communications',
    shortTitle: 'Communications',
    title: 'Département des Communications',
    description:
      "Le Département des Communications est chargé de la communication de l'archidiocèse ainsi que des relations avec les médias.",
    page: {
      director: {
        position: 'Vice-Chancelier',
      },
    },
  },

  {
    id: DEPARTMENT.GENERAL_SERVICES,
    slug: 'general-services',
    shortTitle: 'Services généraux',
    title: 'Département des Services Généraux',
    description:
      'Le Département des Services Généraux fournit un soutien administratif et des services divers aux départements et aux paroisses (maintenance, entretien, technologie appliquée, ...).',
    page: {
      director: {
        sameAs: DEPARTMENT.CHANCELLOR,
      },
    },
  },

  {
    id: DEPARTMENT.HR,
    slug: 'human-resources',
    shortTitle: 'Ressources Humaines',
    title: 'Département des Ressources Humaines',
    description:
      "Le Département des Ressources Humaines mène le processus de recrutement, de sélection et d'embauche dans l'archidiocèse, et met en oeuvre les politiques relaives au personnel.",
    page: {
      director: {
        position: 'Directeur des Ressources Humaines',
      },
    },
  },

  {
    id: DEPARTMENT.FINANCIAL,
    slug: 'financial-services',
    shortTitle: 'Services Financiers et Immobiliers',
    title: 'Département des Services Financiers et Immobiliers',
    description:
      'Le Département des Services Financiers et Immobiliers supervise les collectes de fonds et la comptabilité. Il soutien et conseille sur la gestion financière et immobilière.',
    page: {
      director: {
        position: 'Directeur financier',
      },
    },
  },

  {
    id: DEPARTMENT.COUNSEL,
    slug: 'office-of-general-counsel',
    shortTitle: 'Conseiller juridique',
    title: 'Bureau du Conseiller juridique',
    description:
      "Le Bureau du Conseiller juridique répond aux questions légales des paroisses et départements, et supervise les affaires juridiques de l'archidiocèse.",
    page: {
      director: {
        position: 'Conseiller juridique',
      },
    },
  },

  {
    id: DEPARTMENT.CHARITIES,
    slug: 'catholic-charities',
    shortTitle: 'Catholic Charities',
    title: 'Catholic Charities',
    description:
      "Catholic Charities, en tant que bras social de l'Archidiocèse, offre des services aux personnes dans le besoin, promeut la dignité humaine et défend la justice sociale, la liberté religieuse et les droits humains.",
    page: {
      director: {
        position: 'Directeur général',
      },
    },
  },
]
