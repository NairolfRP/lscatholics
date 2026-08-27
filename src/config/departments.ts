import { DEPARTMENT } from '#shared/constants/department.ts'
import type { Department } from '#shared/types/department.types.ts'

export const departments: Department[] = [
  {
    id: DEPARTMENT.ARCHBISHOP,
    slug: 'office-of-the-archbishop',
    title: "Bureau de l'Archevêque",
    description:
      "Sert de liaison entre les paroisses, les départements et l'Archevêque. Le bureau assure le secrétariat et le soutien administratif de Son Éminence.",
    category: 'curia',
    page: {
      director: {
        name: 'Cardinal Edmund Hennessy',
        position: 'Archevêque de Los Santos',
        phone: '700',
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
      content: [
        "Le Bureau de l'Archevêque sert de lien entre les paroisses, les départements et l'Archevêque. Il assure le secrétariat et le soutien administratif de Son Éminence le Cardinal Edmund Hennessy, 6e archevêque de Los Santos, et coordonne son agenda pastoral, ses audiences et sa correspondance.",
        "Les fidèles souhaitant écrire à l'Archevêque, solliciter une bénédiction spéciale ou demander une rencontre sont invités à contacter le bureau par téléphone ou par écrit.",
      ],
    },
  },

  {
    id: DEPARTMENT.MODERATOR,
    slug: 'office-of-the-vicar-general',
    title: 'Vicaire général',
    description:
      "Le Vicaire général seconde l'Archevêque dans le gouvernement de l'Archidiocèse, tant sur le plan spirituel que sur les plans administratif et exécutif. Modérateur de la Curie, il exerce une responsabilité de gouvernement pastoral et administratif sur le clergé.",
    category: 'curia',
    page: {
      director: {
        name: 'P. Julián Mateo Villaseñor, O.F.M.',
        position: 'Vicaire général',
        phone: '700',
      },
      content: [
        "Le Vicaire général est le principal collaborateur de l'Archevêque dans le gouvernement de l'Archidiocèse. Il le seconde dans l'exercice de ses responsabilités spirituelles, administratives et exécutives et traite, en son absence, les affaires courantes de l'Archidiocèse. En cas de vacance du siège, ses pouvoirs s'éteignent avec le siège vacant, sauf dispositions du droit canonique.",
        "Modérateur de la Curie, il exerce, selon les délégations reçues de l'Archevêque, une responsabilité de gouvernement pastoral et administratif sur les prêtres et les diacres. Il traite ainsi en premier ressort les questions relatives au clergé, telles que les différends mineurs ou les difficultés rencontrées dans l'exercice du ministère.",
      ],
    },
  },

  {
    id: DEPARTMENT.CHANCELLOR,
    slug: 'chancellery',
    title: 'Chancelier',
    description:
      "Le Chancelier est garde des sceaux de l'Archidiocèse et responsable des archives et des actes officiels. Il dirige l'administration temporelle de l'Archidiocèse et coordonne les départements de la Curie.",
    category: 'curia',
    page: {
      banner: { color: 'bg-catholic-blue' },
      director: {
        position: 'Chancelier',
      },
      content: [
        "Officier majeur de la Curie, le Chancelier est garde des sceaux de l'Archidiocèse et notaire de la Chancellerie. Il est responsable des archives et veille à l'authenticité des actes officiels ainsi qu'à la régularité des décrets, qu'il contresigne.",
        "Le Chancelier assure également la direction de l'administration temporelle de l'Archidiocèse. Il coordonne les départements et les services de la Curie ainsi que l'administration des paroisses, à l'exception des affaires réservées à l'Archevêque.",
      ],
    },
  },

  {
    id: DEPARTMENT.SAFETY,
    slug: 'office-of-safety',
    shortTitle: 'Sécurité',
    title: 'Bureau de la Sécurité',
    description:
      "Le Bureau de la Sécurité est responsable de la sécurité personnelle de l'Archevêque et des hauts dignitaires. Il garantit notamment un environnement sûr et accueillant dans les lieux sacrés et les propriétés de l'Archidiocèse.",
    category: 'services',
    page: {
      banner: { color: 'bg-zinc-900' },
      director: {
        position: 'Directeur de la Sécurité',
      },
      content: [
        "Le Bureau de la Sécurité assure la protection personnelle de l'Archevêque et des hauts dignitaires de l'archidiocèse, ainsi que des lieux sacrés et des propriétés archidiocésaines.",
        "Il veille également à garantir un environnement sûr et accueillant lors des grandes célébrations, des ordinations et des événements publics de l'archidiocèse.",
      ],
    },
  },

  {
    id: DEPARTMENT.COM,
    slug: 'communications',
    shortTitle: 'Communications',
    title: 'Département des Communications',
    description:
      "Le Département des Communications est chargé de la communication de l'archidiocèse ainsi que des relations avec les médias.",
    category: 'curia',
    page: {
      banner: { color: 'bg-catholic-blue' },
      director: {
        position: 'Vice-Chancelier',
      },
      content: [
        "Le Département des Communications met les outils et technologies au service de la mission de l'archidiocèse : engager les fidèles, promouvoir la vie des paroisses et faire connaître les actions de l'archidiocèse auprès des médias.",
        "Il soutient les paroisses dans leur communication, relaie les messages de l'Archevêque et accompagne chacun dans la découverte de sa vocation à travers l'évangélisation, l'éducation et le service.",
      ],
    },
  },

  {
    id: DEPARTMENT.GENERAL_SERVICES,
    slug: 'general-services',
    shortTitle: 'Services généraux',
    title: 'Département des Services Généraux',
    description:
      'Le Département des Services Généraux fournit un soutien administratif et des services divers aux départements et aux paroisses (maintenance, entretien, technologie appliquée, ...).',
    category: 'services',
    page: {
      director: {
        sameAs: DEPARTMENT.CHANCELLOR,
      },
      content: [
        "Le Département des Services Généraux fournit un soutien administratif et des services divers aux départements et aux paroisses de l'archidiocèse : maintenance, entretien, technologie appliquée, logistique.",
        'Les services de la Chancellerie et les paroisses peuvent y recourir pour toute demande technique, matérielle ou organisationnelle.',
      ],
    },
  },

  {
    id: DEPARTMENT.HR,
    slug: 'human-resources',
    shortTitle: 'Ressources Humaines',
    title: 'Département des Ressources Humaines',
    description:
      "Le Département des Ressources Humaines mène le processus de recrutement, de sélection et d'embauche dans l'archidiocèse, et met en oeuvre les politiques relatives au personnel.",
    category: 'services',
    page: {
      director: {
        position: 'Directeur des Ressources Humaines',
      },
      content: [
        "Le Département des Ressources Humaines conseille le personnel archidiocésain sur les politiques en vigueur, mène le processus de recrutement, de sélection et d'embauche, et tient les dossiers du personnel.",
        "Les offres d'emploi de l'archidiocèse sont publiées régulièrement ; consultez la page Carrières pour découvrir les postes à pourvoir.",
      ],
    },
  },

  {
    id: DEPARTMENT.FINANCIAL,
    slug: 'financial-services',
    shortTitle: 'Services Financiers et Immobiliers',
    title: 'Département des Services Financiers et Immobiliers',
    description:
      'Le Département des Services Financiers et Immobiliers supervise les collectes de fonds et la comptabilité. Il soutient et conseille sur la gestion financière et immobilière.',
    category: 'services',
    page: {
      director: {
        position: 'Directeur financier',
      },
      content: [
        "Le Département des Services Financiers et Immobiliers supervise les collectes de fonds et la comptabilité de l'archidiocèse. Il apporte conseil et soutien aux paroisses en matière de gestion financière et immobilière.",
        "Il veille à la bonne gestion des biens de l'archidiocèse et accompagne les paroisses dans leur développement.",
        "Le Directeur financier relève de l'Archevêque, qu'il conseille en matière économique et immobilière, et du Chancelier pour la gestion administrative de l'Archidiocèse.",
      ],
    },
  },

  {
    id: DEPARTMENT.COUNSEL,
    slug: 'office-of-general-counsel',
    shortTitle: 'Conseiller juridique',
    title: 'Bureau du Conseiller juridique',
    description:
      "Le Bureau du Conseiller juridique répond aux questions légales des paroisses et départements, et supervise les affaires juridiques de l'archidiocèse.",
    category: 'curia',
    page: {
      banner: { color: 'bg-catholic-blue' },
      director: {
        position: 'Conseiller juridique',
      },
      content: [
        "Le Bureau du Conseiller juridique répond aux questions légales des paroisses et des institutions de l'archidiocèse, notamment en matière de contrats avec les fournisseurs.",
        "À un niveau plus large, il supervise l'ensemble des affaires juridiques impliquant les paroisses et protège les intérêts de l'archidiocèse.",
      ],
    },
  },

  {
    id: DEPARTMENT.CHARITIES,
    slug: 'catholic-charities',
    shortTitle: 'Catholic Charities',
    title: 'Catholic Charities',
    description:
      "Catholic Charities, en tant que bras social de l'Archidiocèse, offre des services aux personnes dans le besoin, promeut la dignité humaine et défend la justice sociale, la liberté religieuse et les droits humains.",
    category: 'charities',
    page: {
      banner: { color: 'bg-catholic-red' },
      director: {
        position: 'Directeur général',
      },
      content: [
        "Catholic Charities agit comme le bras social de l'archidiocèse. En lien avec les paroisses et la communauté, il offre des services humains aux personnes en crise, aux familles dans la pauvreté, aux sans-abri, aux personnes âgées, aux enfants et jeunes à risque, ainsi qu'aux réfugiés et immigrants.",
        'Il promeut la dignité humaine et défend la justice sociale, la liberté religieuse et les droits humains.',
      ],
    },
  },
]
