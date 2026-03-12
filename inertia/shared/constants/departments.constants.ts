import ArchbishopPortrait from '@/assets/images/cardinal_callahan_officiel_portrait.webp'
import VicarGeneralPortrait from '@/assets/images/don-benedetti.webp'

export type DepartmentStaff = {
  id: string
  name?: string
  position: string
  phone?: string
  image?: string
}

export type Director = {
  position?: string
  sameAs?: (typeof DEPARTMENTS)[number]['id']
} & Omit<DepartmentStaff, 'id' | 'position'>

export type DepartmentStaffTeam = {
  title: string
  members: DepartmentStaff[]
}

export type DepartmentPage = {
  bannerImg?: string
  bannerColor?: string
  content?: string
  director: Director
  teams?: DepartmentStaffTeam[]
}

export type Department = {
  id: string
  shortTitle: string
  title: string
  slug: string
  description: string
  page: DepartmentPage
}

export const DEPARTMENTS: Department[] = [
  {
    id: 'archbishop-office',
    shortTitle: "Bureau de l'Archevêque",
    title: "Bureau de l'Archevêque",
    slug: 'office-of-the-archbishop',
    description:
      "Fait le lien entre les paroisses/départements et l'archevêque. Le bureau comprend le soutien administratif de l'archevêque.",
    page: {
      director: {
        name: 'Card. Ronan Callahan',
        position: 'Archevêque de Los Santos',
        phone: '700',
        image: ArchbishopPortrait,
      },
      teams: [
        {
          title: "Équipe du Bureau de l'Archevêque",
          members: [
            {
              id: 'private-secretary',
              position: 'Secrétaire particulier',
            },
          ],
        },
      ],
    },
  },
  {
    id: 'moderator-of-the-curia',
    shortTitle: 'Modérateur de la Curie / Vicaire général',
    title: 'Modérateur de la Curie / Vicaire général',
    slug: 'moderator-of-the-curia',
    description:
      "Assiste l'archevêque dans l'administration de l'archidiocèse et coordonne les départements.",
    page: {
      director: {
        name: 'Don Giuseppe Benedetti',
        position: 'Modérateur de la Curie et Vicaire Général',
        phone: '700',
        image: VicarGeneralPortrait,
      },
    },
  },
  {
    id: 'chancellor',
    shortTitle: 'Chancelier',
    title: 'Chancelier',
    slug: 'chancellor',
    description:
      "Assiste le Modérateur de la Curie dans la coordination des départements de l'archidiocèse.",
    page: {
      director: {
        position: 'Chancelier',
      },
    },
  },
  {
    id: 'safety',
    shortTitle: 'Sécurité',
    title: 'Bureau de la Sécurité',
    slug: 'safety',
    description:
      "Assure la protection de l'Archevêque et garantit un environnement sûr et accueillant dans les lieux sacrés et les propriétés de l'archidiocèse.",
    page: {
      director: {
        position: 'Chef de la sécurité',
      },
    },
  },
  {
    id: 'communications',
    shortTitle: 'Communications',
    title: 'Département des Communications',
    slug: 'communications',
    description:
      "Utilise outils et technologies pour engager le public et promouvoir l'action. Soutient les paroisses, relie les fidèles aux sacrements et accompagne chacun dans sa vocation et l'appel de Dieu à aimer à travers l'évangélisation, l'éducation et le service.",
    page: {
      director: {
        position: 'Vice-Chancelier',
      },
    },
  },
  {
    id: 'general-services',
    shortTitle: 'Services généraux',
    title: 'Département des services généraux',
    slug: 'general-services',
    description:
      'Fournit un soutien administratif et des services divers, tels que la technologie appliquée, et la maintenance, aux départements et aux paroisses.',
    page: {
      director: {
        sameAs: 'chancellor',
      },
    },
  },
  {
    id: 'human-resources',
    shortTitle: 'Ressources Humaines',
    title: 'Département des Ressources Humaines',
    slug: 'human-resources',
    description:
      'Conseil sur les politiques du personnel, recrutement, gestion des employés et tenue des dossiers.',
    page: {
      director: {
        position: 'Directeur des Ressources Humaines',
      },
    },
  },
  {
    id: 'financial-services',
    shortTitle: 'Services financiers et immobiliers',
    title: "Département des Services Financiers et de l'Immobilier",
    slug: 'financial-services',
    description:
      'Soutient et conseille les paroisses sur la gestion financière et immobilière ainsi que les collectes de fonds.',
    page: {
      director: {
        position: 'Directeur financier',
      },
    },
  },
  {
    id: 'general-counsel',
    shortTitle: 'Conseiller juridique',
    title: 'Bureau du Conseiller juridique',
    slug: 'general-counsel',
    description:
      'Répond aux questions légales des paroisses et institutions et supervise les affaires juridiques archidiocésaines.',
    page: {
      director: {
        position: 'Conseiller juridique',
      },
    },
  },
  {
    id: 'catholic-charities',
    shortTitle: 'Catholic Charities',
    title: 'Catholic Charities',
    slug: 'catholic-charities',
    description:
      "Agit comme bras social de l'archidiocèse et offre des services humains aux personnes en difficulté, aux familles pauvres, aux sans-abri, aux personnes âgées, aux enfants et jeunes à risque, aux adultes avec des besoins spéciaux, aux réfugiés ainsi qu'aux immigrants.",
    page: {
      director: {
        position: 'Directeur général',
      },
    },
  },
]

export const getDepartmentBySlug = (slug: string) => {
  const dep = DEPARTMENTS.find((d) => d.slug === slug)

  if (!dep) return null

  if (dep.page.director?.sameAs) {
    const directorSource = dep.page.director.sameAs
    let director = DEPARTMENTS.find((d) => d.id === directorSource)?.page?.director
    if (!director) {
      director = {
        name: 'INCONNU',
        position: 'INCONNU',
      }
    }
    return {
      ...dep,
      page: {
        ...dep.page,
        director,
      },
    }
  }

  return dep
}

export const getDepartmentTitleById = (id: string) => {
  const result = DEPARTMENTS.find((d) => d.id === id)

  if (!result) return null

  return {
    long: result.title,
    short: result.shortTitle,
  }
}

export const getAllDepartmentsIDs = () => DEPARTMENTS.map((d) => d.id)
