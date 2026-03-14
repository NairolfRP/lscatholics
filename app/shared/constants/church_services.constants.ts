export type ChurchServiceMeta = {
  id: string
  title: string
  description: string
  slug: string
}

export const CHURCH_SERVICES_META = [
  {
    id: 'christianInitiation',
    title: "Sacrements de l'initiation chrétienne",
    description: 'Devenir chrétien. Baptême, première communion et confirmation',
    slug: 'christian-initiation',
  },
  {
    id: 'requestMass',
    title: 'Demander une messe à une intention particulière',
    description:
      "Les fidèles peuvent demander à l'Église de célébrer une messe pour une intention particulière (un proche malade, la mémoire d'un défunt, un anniversaire de mariage, pour dire merci à Dieu à la suite d'un heureux événement etc...).",
    slug: 'offer-a-mass',
  },
  {
    id: 'confession',
    title: 'Se confesser',
    description:
      "Célébrer le sacrement de la pénitence et de la réconciliation et recevoir l'absolution de ses péchés",
    slug: 'confession',
  },
  {
    id: 'sicks',
    title: 'Derniers sacrements, urgences et prières des malades',
    description:
      "A l'image du Christ, l'Église accompagne chaque malade dans ses souffrances et chaque mourant dans l'attente de son retour à Dieu.",
    slug: 'anointing-of-the-sick',
  },
  {
    id: 'marriage',
    title: "Se marier à l'Église",
    description:
      "Par le mariage et en fondant une nouvelle famille, les époux témoignent de l'amour de Dieu par l'amour qu'ils se portent l'un pour l'autre.",
    slug: 'marriage',
  },
  {
    id: 'funerals',
    title: 'Obsèques chrétiennes',
    description:
      "Les obsèques chrétiennes sont le moment de prier pour celui qui a terminé sa vie terrestre, de faire le deuil et d'avancer dans l'espérance.",
    slug: 'funerals',
  },
  {
    id: 'exorcism',
    title: "Service de l'Exorcisme",
    description:
      "Le Service Archidiocésain de l'Exorcisme, de la Délivrance et de la Compassion accueille et accompagne toute personne en souffrance ou se pensant sous l'influence ou l'emprise des forces du Mal.",
    slug: 'exorcism',
  },
  {
    id: 'benediction',
    title: "Bénédiction de lieux, d'outils ou d'objets",
    description:
      "Pour fortifier la foi des croyants et faire obstacle aux mauvais esprits, l'Église bénit les maisons, les lieux de travail, les commerces, les outils de travail, les véhicules et tout ce qui entoure les lieux, les instruments ou les objets qui entourent les activités humaines.",
    slug: 'benediction',
  },
  {
    id: 'conference',
    title: 'Demander une conférence ou une prédication',
    description:
      "L'Église se donne pour rôle d'éveiller les consciences et de donner des pistes de réflexions sur notre société, sur la morale, sur nos relations entre humains et exerce son rôle d'enseignement de la foi.",
    slug: 'conference-predication',
  },
  {
    id: 'mediation',
    title: "Demander la médiation de l'Église",
    description:
      "L'Église se tient toujours prête à être un médiateur discret et neutre, que ce soit entre des groupes d'individus, entre des institutions ou entre des individus et des institutions.",
    slug: 'mediation',
  },
  {
    id: 'quinceanera',
    title: 'Quinceañera',
    description:
      "La Quinceañera est une célébration traditionnelle et une action de grâce à l'occasion du 15e anniversaire d'une jeune femme hispanique.",
    slug: 'quinceanera',
  },
] as const satisfies ChurchServiceMeta[]
