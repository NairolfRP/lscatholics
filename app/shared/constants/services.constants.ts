import {
  Cake,
  Calendar,
  Church,
  Cross,
  Ear,
  Hand,
  Handshake,
  Heart,
  type LucideIcon,
  Mic,
  Shield,
  Skull,
} from 'lucide-react'
import type { JSX } from 'react'

export type Service = {
  id: string
  title: string
  description: string
  slug: string
  icon?: SVGElement | JSX.Element | LucideIcon
  iconClasses?: string
}

export const SERVICES = [
  {
    id: 'christianInitiation',
    title: "Sacrements de l'initiation chrétienne",
    description: 'Devenir chrétien. Baptême, première communion et confirmation',
    slug: 'christian-initiation',
    icon: Church,
    iconClasses: 'bg-indigo-600',
  },
  {
    id: 'requestMass',
    title: 'Demander une messe à une intention particulière',
    description:
      "Les fidèles peuvent demander à l'Église de célébrer une messe pour une intention particulière (un proche malade, la mémoire d'un défunt, un anniversaire de mariage, pour dire merci à Dieu à la suite d'un heureux événement etc...).",
    slug: 'offer-a-mass',
    icon: Calendar,
    iconClasses: 'bg-yellow-600',
  },
  {
    id: 'confession',
    title: 'Se confesser',
    description:
      "Célébrer le sacrement de la pénitence et de la réconciliation et recevoir l'absolution de ses péchés",
    slug: 'confession',
    icon: Ear,
    iconClasses: 'bg-purple-500',
  },
  {
    id: 'sicks',
    title: 'Derniers sacrements, urgences et prières des malades',
    description:
      "A l'image du Christ, l'Église accompagne chaque malade dans ses souffrances et chaque mourant dans l'attente de son retour à Dieu.",
    slug: 'anointing-of-the-sick',
    icon: Cross,
    iconClasses: 'bg-rose-700',
  },
  {
    id: 'marriage',
    title: "Se marier à l'Église",
    description:
      "Par le mariage et en fondant une nouvelle famille, les époux témoignent de l'amour de Dieu par l'amour qu'ils se portent l'un pour l'autre.",
    slug: 'marriage',
    icon: Heart,
    iconClasses: 'bg-pink-500',
  },
  {
    id: 'funerals',
    title: 'Obsèques chrétiennes',
    description:
      "Les obsèques chrétiennes sont le moment de prier pour celui qui a terminé sa vie terrestre, de faire le deuil et d'avancer dans l'espérance.",
    slug: 'funerals',
    icon: Skull,
    iconClasses: 'bg-gray-700',
  },
  {
    id: 'exorcism',
    title: "Service de l'Exorcisme",
    description:
      "Le Service Archidiocésain de l'Exorcisme, de la Délivrance et de la Compassion accueille et accompagne toute personne en souffrance ou se pensant sous l'influence ou l'emprise des forces du Mal.",
    slug: 'exorcism',
    icon: Shield,
    iconClasses: 'bg-indigo-800',
  },
  {
    id: 'benediction',
    title: "Bénédiction de lieux, d'outils ou d'objets",
    description:
      "Pour fortifier la foi des croyants et faire obstacle aux mauvais esprits, l'Église bénit les maisons, les lieux de travail, les commerces, les outils de travail, les véhicules et tout ce qui entoure les lieux, les instruments ou les objets qui entourent les activités humaines.",
    slug: 'benediction',
    icon: Hand,
    iconClasses: 'bg-green-600',
  },
  {
    id: 'conference',
    title: 'Demander une conférence ou une prédication',
    description:
      "L'Église se donne pour rôle d'éveiller les consciences et de donner des pistes de réflexions sur notre société, sur la morale, sur nos relations entre humains et exerce son rôle d'enseignement de la foi.",
    slug: 'conference-predication',
    icon: Mic,
    iconClasses: 'bg-cyan-500',
  },
  {
    id: 'mediation',
    title: "Demander la médiation de l'Église",
    description:
      "L'Église se tient toujours prête à être un médiateur discret et neutre, que ce soit entre des groupes d'individus, entre des institutions ou entre des individus et des institutions.",
    slug: 'mediation',
    icon: Handshake,
    iconClasses: 'bg-indigo-500',
  },
  {
    id: 'quinceanera',
    title: 'Quinceañera',
    description:
      "La Quinceañera est une célébration traditionnelle et une action de grâce à l'occasion du 15e anniversaire d'une jeune femme hispanique.",
    slug: 'quinceanera',
    icon: Cake,
    iconClasses: 'bg-pink-400',
  },
] as const satisfies Service[]
