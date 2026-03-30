import { Briefcase, Globe, Home, HouseHeart, ShieldAlert, Utensils, WineOff } from 'lucide-react'
import type { ProgramDetail } from '@/features/charities/types/charities.types'

const BASE_CONTACT = {
  phone: '700',
  address: 'Refuge du Sacré-Coeur, Little Bighorn Avenue, Mission Row, Los Santos',
} as const

export const PROGRAMS: ProgramDetail[] = [
  {
    icon: Utensils,
    title: 'Aide alimentaire',
    slug: 'food-aid',
    description:
      'Banques et bons alimentaires, soupes populaires, repas chauds et paniers de denrées pour les familles en situation de précarité.',
    tag: 'Nourriture',
    route: 'charities.program',
    routeParams: { slug: 'food-aid' },
    about:
      "La faim n'a aucune frontière. Tous les groupes sociaux, sans distinction de niveau d'éducation, de situation professionnelle ou d'ethnie, peuvent, un jour ou l'autre, être touchés par l'insécurité alimentaire. Les statistiques de Feeding America révèlent qu'au moins 1,4 millions de personnes et 563 100 enfants sont en insécurité alimentaire dans le comté de Los Santos.",
    services: [
      'Distribution régulière de colis alimentaires aux familles à faibles revenus',
      'Bons alimentaires échangeables dans les établissements partenaires (à venir)',
      'Soupes populaires et distributions alimentaires mobiles',
      'Interventions humanitaires lors des catastrophes et des situations de crise',
    ],
    eligibility: [
      'Personnes avec de faibles revenus ou en insécurité alimentaire (y compris les prisonniers)',
    ],
    contact: { ...BASE_CONTACT },
  },
  {
    icon: ShieldAlert,
    title: "Aide d'urgence",
    slug: 'emergency-relief',
    description:
      'Aide financière pour payer les factures ou répondre à une situation critique et parcours personnalisé pour répondre spécifiquement aux problèmes rencontrés.',
    tag: 'Familles',
    route: 'charities.program',
    routeParams: { slug: 'emergency-relief' },
    about:
      "Une crise peut survenir à tout moment : perte d'emploi soudaine, sinistre, maladie, accident. Notre programme d'aide d'urgence offre un filet de sécurité immédiat, avec une réponse rapide et un accompagnement personnalisé pour retrouver la stabilité.",
    services: [
      'Aide financière pour le loyer',
      "Une aide financière pour les factures d'électricité, d'eau, de gaz, ...",
      "Une aide financière pour acheter ou réparer un véhicule (par exemple, lorsque ce véhicule est nécessaire au maintien d'un emploi)",
      'Une aide financière pour les produits pour les enfants (couches, lait maternel, ...)',
      "Un accompagnement pour accéder aux aides accordées par l'État (aide médicale, ...)",
      'Toute autre aide urgente pour éviter de tomber dans le sans-abrisme',
    ],
    eligibility: ['Familles dans une situation difficile et urgente'],
    contact: { ...BASE_CONTACT },
  },
  {
    icon: Home,
    title: 'Logement & hébergement',
    slug: 'housing-assistance',
    description:
      "Hébergement d'urgence (foyers, refuges), aide au loyer, programme de logements à faibles revenus et accompagnement vers un logement stable et digne.",
    tag: 'Logement / Hébergement',
    route: 'charities.program',
    routeParams: { slug: 'housing-assistance' },
    about:
      "L'accès à un logement sûr et stable est une condition fondamentale de la dignité humaine. Catholic Charities accompagne les personnes sans-abri, les familles expulsées et les ménages à faibles revenus à chaque étape — de l'hébergement d'urgence jusqu'au retour à l'autonomie.",
    services: [
      "Places en hébergement d'urgence",
      'Aide au paiement du loyer et des dépôts de garantie',
      "Accès au programme de logement à faibles revenus de l'archidiocèse",
      'Médiation avec les propriétaires en cas de litige',
    ],
    eligibility: [
      "Personnes sans domicile fixe ou en situation d'expulsion imminente",
      'Ménages à faibles revenus',
      'Personnes en difficulté et ne pouvant pas être hébergé par autrui (violences conjugales, maltraitances, mineur isolé, ...)',
    ],
    contact: { ...BASE_CONTACT },
  },
  {
    icon: HouseHeart,
    title: "Services d'adoption",
    slug: 'adoption-services',
    description:
      "Prise en charge de mineurs placés en famille d'accueil, recherche de familles aimantes et accompagnement juridique pour l'adoption.",
    tag: 'Jeunesse',
    route: 'charities.program',
    routeParams: { slug: 'adoption-services' },
    about:
      "Catholic Charities prend en charge les mineurs placés en famille d'accueil et offre des services d'adoption. Nous nous efforçons de trouver des familles stables pour les enfants en difficulté.",
    services: [
      'Accueil et hébergement des mineurs en situation difficile (orphelins, maltraitances, sans tuteur légal)',
      'Suivi éducatif et psychologique des enfants',
      'Recherche de familles adoptives responsables',
      "Soutien juridique pour les démarches d'adoption",
    ],
    eligibility: [
      "Familles souhaitant devenir famille d'accueil ou adoptive",
      'Enfants confiés par les autorités compétentes',
    ],
    contact: { ...BASE_CONTACT },
  },
  {
    icon: Globe,
    title: 'Immigration & réfugiés',
    slug: 'immigration-support',
    description:
      'Accueil, intégration et soutien juridique pour les nouveaux arrivants et les familles immigrantes.',
    tag: 'Accueil',
    route: 'charities.program',
    routeParams: { slug: 'immigration-support' },
    about:
      "L'Église a toujours été maison d'accueil pour ceux qui fuient la violence, la pauvreté ou la persécution. Nous accompagnons les nouveaux arrivants — réfugiés, demandeurs d'asile ou immigrants — dans leurs premières démarches et leur intégration durable dans la communauté.",
    services: [
      "Accueil à l'arrivée et orientation initiale",
      "Cours d'anglais et d'intégration culturelle",
      'Information sur leurs droits et sur les ressources disponibles',
      'Assistance et protection juridique',
      "Aide à l'insertion socio-professionnelle",
      "Un accompagnement vers l'acquisition de la citoyenneté des États-Unis et/ou d'une carte de résident permanent et/ou du statut de réfugié politique\n",
      "Assistance aux victimes de la traite d'êtres humains",
      'Accompagnement et la prise en charge des mineurs isolés étrangers',
    ],
    eligibility: ["Réfugiés, demandeurs d'asile et immigrants récents"],
    contact: { ...BASE_CONTACT },
  },
  {
    icon: WineOff,
    title: 'Alcoolisme et toxicomanie',
    slug: 'addiction-treatment',
    description:
      "Catholic Charities propose des thérapies et des accompagnements pour lutter contre l'alcoolisme, la toxicomanie et les dépendances.",
    tag: 'Santé',
    route: 'charities.program',
    routeParams: { slug: 'addiction-treatment' },
    about:
      "La dépendance est une maladie et toute personne qui désire en guérir le peut. Notre programme offre un espace bienveillant, confidentiel et professionnel pour ceux qui souhaitent entreprendre un chemin vers la sobriété — à leur rythme, avec l'appui de professionnels qualifiés et de la communauté.",
    services: [
      'Interventions de thérapeutes, psychiatres et personnels habilités',
      "Thérapies de groupes basées sur la reconnaissance de son trouble, l'écoute mutuelle et la parole",
      'Consultation psychiatrique sur référence',
      "Accompagnement pour favoriser la sobriété (organisation d'activités sportives, retour vers une hygiène de vie correcte, recherche d'emploi, ...)",
    ],
    eligibility: [
      "Personnes qui souffre d'alcoolisme ou de toxicomanie",
      'Personnes condamnées par un tribunal à une obligation de soin',
      'Tout bénéficiaire doit être volontaire et avoir envie de se soigner',
    ],
    contact: { ...BASE_CONTACT },
  },
  {
    icon: Briefcase,
    title: 'Éducation et réinsertion socio-professionnelle',
    slug: 'education-support',
    description:
      "Formations professionnelles, programmes éducatifs et services d'orientation professionnelle pour les jeunes et les adultes des quartiers défavorisés.",
    tag: 'Travail / Éducation / Jeunesse',
    route: 'charities.program',
    routeParams: { slug: 'education-support' },
    about:
      "L'éducation et le travail sont des vecteurs essentiels de dignité et d'inclusion. Nous offrons des parcours concrets et personnalisés pour aider jeunes et adultes à acquérir des compétences, reprendre confiance et trouver leur place dans la société.",
    services: [
      'Stages rémunérés dans des entreprises et organisations partenaires',
      'Formations professionnelles en partenariat avec les collèges communautaires et les écoles professionnelles',
      "Programmes de rattrapage et d'alphabétisation pour les jeunes ou les adultes sans éducation",
      'Activités éducatives, sportives, artistiques ou culturelles destinées aux jeunes en difficulté',
    ],
    eligibility: [
      'Jeune de 14 à 25 ans en difficulté ou adulte issu des quartiers défavorisés',
      'Personnes en échec scolaire et/ou sans emploi',
    ],
    contact: { ...BASE_CONTACT },
  },
]

export const getProgramBySlug = (slug: string): ProgramDetail | undefined =>
  PROGRAMS.find((p) => p.slug === slug)
