import { CHURCH_SERVICE } from '#shared/constants/service.ts'
import type { ChurchService } from '#shared/types/service.types.ts'

export const services: ChurchService[] = [
  {
    id: CHURCH_SERVICE.INITIATION,
    slug: 'christian-initiation',
    title: "Sacrements de l'initiation chrétienne",
    description:
      'Devenir chrétien. Baptême, première communion et confirmation.',
    category: 'sacrements',
    content: [
      {
        type: 'paragraph',
        text: "L'initiation chrétienne est un parcours en trois sacrements :",
      },
      {
        type: 'list',
        items: [
          'Le **baptême**, par lequel on devient chrétien et accède aux sacrements.',
          'La **première communion**, par laquelle on reçoit le Corps et le Sang du Christ pour la première fois.',
          "La **confirmation**, par laquelle, l'âge de la raison atteint, on reçoit l'Esprit Saint par l'imposition des mains de l'Archevêque.",
        ],
      },
      {
        type: 'note',
        text: "L'Église catholique recommande très fortement de baptiser son enfant le plus tôt possible après sa naissance.",
      },
      {
        type: 'heading',
        text: 'Le baptême',
      },
      {
        type: 'list',
        items: [
          "Tout le monde peut se faire baptiser, enfant ou adulte. Il n'y a aucun âge minimum ou maximum.",
          "Au-delà de 7 ans, début de l'âge de la raison, il est nécessaire de consentir et de désirer le baptême.",
          "En dessous de 7 ans, ce sont les parents qui demandent le baptême pour leur enfant. Ils doivent s'engager à l'éduquer dans la foi catholique.",
          'Choisissez un parrain ou une marraine baptisée et de foi catholique. Le parrain ou la marraine doit être âgé(e) d\u2019au moins 16 ans, excepté dérogation.',
        ],
      },
      {
        type: 'paragraph',
        text: 'Les personnes âgées de 12 ans et plus reçoivent le baptême, la confirmation et la première communion au cours de la même célébration.',
      },
      {
        type: 'paragraph',
        text: "Pour demander le baptême pour votre enfant ou pour vous-même, contactez l'archidiocèse.",
      },
      {
        type: 'heading',
        text: 'La première communion',
      },
      {
        type: 'list',
        items: [
          'Être baptisé et ne pas déjà avoir célébré sa première communion.',
          "Être âgé d'au moins 8 ans.",
        ],
      },
      {
        type: 'paragraph',
        text: "Si l'enfant ou l'adulte est âgé de plus de 12 ans, il peut recevoir la confirmation en même temps que la première communion.",
      },
      {
        type: 'paragraph',
        text: "Pour célébrer votre première communion au Corps et au Sang du Christ, contactez l'archidiocèse.",
      },
      {
        type: 'heading',
        text: 'La confirmation',
      },
      {
        type: 'list',
        items: [
          'Vous devez être baptisé, n\u2019avoir jamais reçu la confirmation et avoir reçu votre première communion.',
          "Vous devez être âgé d'au moins 12 ans.",
          "La confirmation nécessite un consentement : elle n'est pas du ressort des parents. Vous devez désirer confirmer votre foi catholique.",
          'Désignez un parrain ou une marraine de confirmation, baptisé(e) et confirmé(e), de foi catholique. Le parrain ou la marraine doit être âgé(e) d\u2019au moins 16 ans, sauf dérogation.',
        ],
      },
      {
        type: 'paragraph',
        text: "Pour demander à recevoir le sacrement de la confirmation, contactez l'archidiocèse.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.MASS_INTENTION,
    slug: 'offer-a-mass',
    title: 'Demander une messe à une intention particulière',
    description:
      "Les fidèles peuvent demander à l'Église de célébrer une messe pour une intention particulière (un proche malade, la mémoire d'un défunt, un anniversaire de mariage, pour dire merci à Dieu à la suite d'un heureux événement, etc.).",
    category: 'sacramentaux',
    content: [
      {
        type: 'paragraph',
        text: "Les fidèles peuvent demander à l'Église de célébrer une messe pour une intention particulière : un proche malade, la mémoire d'un défunt, un anniversaire de mariage, ou pour dire merci à Dieu à la suite d'un heureux événement.",
      },
      {
        type: 'heading',
        text: 'Conditions pour demander une messe à une intention particulière',
      },
      {
        type: 'list',
        items: [
          "Il est recommandé d'être baptisé, ou au moins d'avoir la foi.",
          'Déposer une offrande égale ou supérieure au prix fixé sur la grille tarifaire.',
        ],
      },
      {
        type: 'heading',
        text: 'Comment demander une messe à une intention particulière ?',
      },
      {
        type: 'paragraph',
        text: "Déposez votre offrande et indiquez votre intention particulière à l'archidiocèse. Un prêtre vous informera ultérieurement quand et où cette messe sera célébrée.",
      },
      {
        type: 'paragraph',
        text: "Au début de la liturgie, le prêtre annoncera à quelle intention la messe est dite.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.CONFESSION,
    slug: 'confession',
    title: 'Se confesser',
    description:
      "Célébrer le sacrement de la pénitence et de la réconciliation et recevoir l'absolution de ses péchés.",
    category: 'sacrements',
    content: [
      {
        type: 'paragraph',
        text: "La confession est une étape répétée et indispensable de la vie du chrétien, qui, en toute humilité, confesse ses fautes puis demande et reçoit l'absolution de ses péchés et le pardon de Dieu.",
      },
      {
        type: 'heading',
        text: 'Conditions pour se confesser',
      },
      {
        type: 'list',
        items: [
          'Le pénitent doit être baptisé.',
          'Le pénitent doit regretter ses péchés.',
        ],
      },
      {
        type: 'paragraph',
        text: "La confession étant un sacrement, le non-baptisé ne peut pas recevoir l'absolution des péchés. Il peut néanmoins demander à rencontrer un prêtre pour trouver en lui une oreille attentive et des conseils.",
      },
      {
        type: 'heading',
        text: 'Le secret de la confession',
      },
      {
        type: 'paragraph',
        text: "Le secret sacramentel de la confession est inviolable, quel qu'en soit le motif. Le prêtre est tenu à ce secret, même devant les autorités publiques, sous peine d'excommunication.",
      },
      {
        type: 'heading',
        text: "Déroulement d'une confession",
      },
      {
        type: 'list',
        items: [
          "Vous pouvez commencer par dire : *« Bénissez-moi mon père, parce que j'ai péché »*.",
          "Le prêtre vous bénit et dit une phrase d'accueil.",
          "Vous pouvez, facultativement, dire depuis combien de temps vous ne vous êtes pas confessé.",
          "Listez tous vos péchés, même les plus petits, contre Dieu, contre vous-même et contre votre prochain. Le prêtre n'a pas besoin de tous les détails, simplement ce qu'il faut pour comprendre la nature du péché.",
          'Le prêtre peut vous poser des questions, amorcer un dialogue et donner des conseils.',
          'Le prêtre vous propose un acte de pénitence à réaliser après la confession, pour assurer la réparation du péché et prouver votre bonne volonté.',
          "Le prêtre récite enfin les paroles d'absolution : le pardon de Dieu et la remise de tous vos péchés.",
        ],
      },
      {
        type: 'heading',
        text: 'Comment se confesser ?',
      },
      {
        type: 'paragraph',
        text: "Contactez l'archidiocèse ou demandez directement à un prêtre.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.SICK,
    slug: 'anointing-of-the-sick',
    title: 'Derniers sacrements, urgences et prières des malades',
    description:
      "À l'image du Christ, l'Église accompagne chaque malade dans ses souffrances et chaque mourant dans l'attente de son retour à Dieu.",
    category: 'sacrements',
    content: [
      {
        type: 'paragraph',
        text: 'Les derniers sacrements — ou « extrême onction », « onction des malades », « sacrement des malades » — sont un sacrement de l\u2019Église catholique.',
      },
      {
        type: 'paragraph',
        text: "À l'image du Christ, l'Église accompagne chaque malade dans ses souffrances et chaque mourant dans l'attente de son retour à Dieu.",
      },
      {
        type: 'heading',
        text: 'Conditions pour recevoir le sacrement',
      },
      {
        type: 'list',
        items: [
          "Étant un sacrement, il est nécessaire d'être baptisé. En cas de mort imminente et d'urgence absolue, le prêtre peut baptiser le mourant sur place par une formule courte, avant de lui délivrer les derniers sacrements.",
        ],
      },
      {
        type: 'heading',
        text: "Demander les derniers sacrements / l'onction des malades",
      },
      {
        type: 'paragraph',
        text: "En cas de danger de mort imminent, contactez immédiatement l'archidiocèse : un prêtre se déplacera en urgence sur les lieux où se trouve la personne.",
      },
      {
        type: 'paragraph',
        text: "Pour les malades ou les personnes en fin de vie, vous pouvez contacter l'archidiocèse pour fixer une date avec un prêtre.",
      },
      {
        type: 'paragraph',
        text: "À l'hôpital, au nom du premier amendement garantissant la liberté d'exercer sa religion, vous pouvez demander au personnel de contacter un prêtre.",
      },
      {
        type: 'info',
        text: "Afin d'informer toute personne que vous êtes catholique et désirez l'intervention d'un prêtre en cas d'urgence, portez systématiquement sur vous une « carte d'identité catholique ». Contactez l'archidiocèse ou le curé de votre paroisse pour en recevoir une.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.MARRIAGE,
    slug: 'marriage',
    title: "Se marier à l'Église",
    description:
      "Par le mariage et en fondant une nouvelle famille, les époux témoignent de l'amour de Dieu par l'amour qu'ils se portent l'un pour l'autre.",
    category: 'sacrements',
    content: [
      {
        type: 'paragraph',
        text: "Se marier à l'Église est un moment fort de la vie du chrétien. Par le mariage et en fondant une nouvelle famille, les époux témoignent de l'amour de Dieu par l'amour qu'ils se portent l'un pour l'autre.",
      },
      {
        type: 'heading',
        text: 'Les 4 piliers du mariage chrétien',
      },
      {
        type: 'list',
        items: [
          "**La liberté** : l'homme et la femme doivent être libres et consentir à l'union.",
          "**La fidélité** : les époux s'engagent à être fidèles l'un envers l'autre, à se soutenir et à traverser les épreuves ensemble, et à s'accorder l'exclusivité.",
          "**L'indissolubilité** : un mariage scellé devant Dieu est pour la vie.",
          "**La fécondité** : les époux acceptent de fonder une famille et de recevoir l'enfant qui pourrait naître du fruit de leur amour, de le baptiser et de lui donner une éducation chrétienne.",
        ],
      },
      {
        type: 'heading',
        text: "Conditions pour se marier à l'Église",
      },
      {
        type: 'list',
        items: [
          "Le mariage chrétien est uniquement **entre un homme et une femme**.",
          'Les deux futurs époux doivent avoir au moins **18 ans**.',
          "Au moins **un** des futurs époux doit être **baptisé**.",
          "Ne pas avoir déjà été marié(e) à l'Église et ne pas être marié(e) civilement à une autre personne que son ou sa futur(e) époux(se). (1)",
          'Les futurs époux doivent être en accord avec les **4 piliers du mariage chrétien**.',
        ],
      },
      {
        type: 'note',
        text: "(1) Puisque le sacrement du mariage est seulement pour la vie terrestre, un veuf ou une veuve peut se remarier à l'Église.",
      },
      {
        type: 'heading',
        text: 'Demander le mariage',
      },
      {
        type: 'paragraph',
        text: "La préparation d'un mariage demande de s'y prendre avec beaucoup d'avance. Contactez l'archidiocèse au moins **2 semaines** avant les dates que vous comptez proposer.",
      },
      {
        type: 'paragraph',
        text: "Une réunion de préparation sera planifiée avec l'officiant pour apprendre à connaître les futurs époux, vérifier qu'ils répondent aux conditions du mariage et préparer avec eux ce moment important de leur vie terrestre.",
      },
      {
        type: 'paragraph',
        text: "Il est **très recommandé** de réfléchir à ces éléments **avant la réunion de préparation** :",
      },
      {
        type: 'list',
        items: [
          "Plusieurs dates et heures pour la célébration (l'officiant peut les refuser s'il n'est pas disponible).",
          "Plusieurs choix de musiques d'entrée : l'officiant procédera par élimination dans votre ordre de préférence, en s'assurant que la musique est acceptable dans une église. La musique doit obligatoirement évoquer l'amour.",
          "Les noms des témoins de chaque futur époux (au moins 1 par époux, et au moins 1 pour chacun doit être baptisé). *(( En cas de carence de joueurs, ces témoins peuvent être des PNJ. ))*",
        ],
      },
    ],
  },

  {
    id: CHURCH_SERVICE.FUNERALS,
    slug: 'funerals',
    title: 'Obsèques chrétiennes',
    description:
      "Les obsèques chrétiennes sont le moment de prier pour celui qui a terminé sa vie terrestre, de faire le deuil et d'avancer dans l'espérance.",
    category: 'sacramentaux',
    content: [
      {
        type: 'paragraph',
        text: "Les obsèques chrétiennes sont le moment de prier pour celui qui a terminé sa vie terrestre, de faire le deuil et d'avancer dans l'espérance.",
      },
      {
        type: 'heading',
        text: 'Conditions pour recevoir des obsèques chrétiennes',
      },
      {
        type: 'list',
        items: [
          "Si le défunt n'est pas baptisé, il ne doit pas avoir exprimé de son vivant le refus d'une célébration catholique. De même, l'Église accepte de célébrer les funérailles d'un non-baptisé si son entourage est composé d'un nombre raisonnable de chrétiens.",
          "Le défunt ne doit pas avoir été privé d'obsèques chrétiennes (décision judiciaire de l'Église, excommunication, ...).",
        ],
      },
      {
        type: 'heading',
        text: 'Demander des obsèques chrétiennes pour son proche défunt',
      },
      {
        type: 'paragraph',
        text: "Pour demander des obsèques chrétiennes, contactez l'archidiocèse afin de planifier une réunion de préparation avec un prêtre ou un diacre.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.EXORCISM,
    slug: 'exorcism',
    title: "Service de l'Exorcisme",
    description:
      "Le Service Archidiocésain de l'Exorcisme, de la Délivrance et de la Compassion accueille et accompagne toute personne en souffrance ou se pensant sous l'influence ou l'emprise des forces du Mal.",
    category: 'accompagnement',
    content: [
      {
        type: 'paragraph',
        text: "Le Service Archidiocésain de l'Exorcisme, de la Délivrance et de la Compassion accueille et accompagne toute personne en souffrance ou se pensant sous l'influence ou l'emprise des forces du Mal.",
      },
      {
        type: 'paragraph',
        text: "Un rendez-vous avec le prêtre exorciste permet de discerner, d'écarter la question de l'emprise démoniaque et de prier avec compassion.",
      },
      {
        type: 'heading',
        text: 'Conditions pour être reçu par un prêtre exorciste',
      },
      {
        type: 'list',
        items: [
          'Toute personne, baptisée ou non, peut être entendue et reçue par le prêtre exorciste.',
        ],
      },
      {
        type: 'heading',
        text: 'Un non-baptisé peut-il être exorcisé ?',
      },
      {
        type: 'paragraph',
        text: "Le rite du grand exorcisme n'est pratiqué que sur des personnes baptisées, car le baptême est le premier de tous les exorcismes. Le non-baptisé sera d'abord invité à se convertir et à se faire baptiser ; ensuite, seulement si le baptême ne guérit pas l'emprise, le rite d'exorcisme sera pratiqué.",
      },
      {
        type: 'ooc',
        text: "La pratique IRL du grand exorcisme est d'une **extrême rareté**, et encore moins si la maladie mentale ou physique n'a pas **d'abord** été écartée par des professionnels de la santé. La plupart des cas reçus par les exorcistes sont des personnes en souffrance qui viennent écarter la question démoniaque, ou des personnes avec des problèmes de santé mentale qui seront tout le temps redirigées vers des professionnels de santé.\n\n**Tout troll, toute exagération et toute action surnaturelle (léviter, changer sa voix, etc.) sera refusée et ignorée en jeu.**\n\nNous testons de proposer ce service car il peut potentiellement apporter des scènes intéressantes, mais s'il y a trop d'abus, nous le fermerons et ne le jouerons plus.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.BENEDICTION,
    slug: 'benediction',
    title: "Bénédiction de lieux, d'outils ou d'objets",
    description:
      "Pour fortifier la foi des croyants et faire obstacle aux mauvais esprits, l'Église bénit les maisons, les lieux de travail, les commerces, les outils de travail, les véhicules et tout ce qui entoure les activités humaines.",
    category: 'sacramentaux',
    content: [
      {
        type: 'paragraph',
        text: "Pour fortifier la foi des croyants et faire obstacle aux mauvais esprits, l'Église bénit les maisons, les lieux de travail, les commerces, les outils de travail, les véhicules et tout ce qui entoure les activités humaines.",
      },
      {
        type: 'blockquote',
        text: "Béni soit Dieu, le Père de notre Seigneur Jésus Christ ! Il nous a bénis et comblés des bénédictions de l'Esprit, au ciel, dans le Christ. *(Éphésiens 1:3)*",
      },
      {
        type: 'blockquote',
        text: "Dans toute maison où vous entrerez, dites d'abord : « Paix à cette maison ». *(Luc 10:5)*",
      },
      {
        type: 'heading',
        text: 'Conditions pour les bénédictions',
      },
      {
        type: 'list',
        items: [
          "Non obligatoire, mais il est recommandé d'être baptisé ou en parcours vers le baptême.",
          "Avoir une autorité sur le lieu ou l'objet béni (ex. : le propriétaire).",
          "Ne pas être excommunié ou empêché par le droit de l'Église.",
        ],
      },
      {
        type: 'heading',
        text: 'Demander des bénédictions',
      },
      {
        type: 'paragraph',
        text: "Contactez l'archidiocèse pour fixer une date avec un prêtre ou un diacre.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.CONFERENCE,
    slug: 'conference-predication',
    title: 'Demander une conférence ou une prédication',
    description:
      "L'Église se donne pour rôle d'éveiller les consciences et de donner des pistes de réflexion sur notre société, sur la morale, sur nos relations entre humains, et exerce son rôle d'enseignement de la foi.",
    category: 'accompagnement',
    content: [
      {
        type: 'paragraph',
        text: "L'Église se donne pour rôle d'éveiller les consciences et de donner des pistes de réflexion sur notre société, sur la morale, sur nos relations entre humains, et exerce son rôle d'enseignement de la foi.",
      },
      {
        type: 'paragraph',
        text: "Vous pouvez inviter l'Archevêque, un prêtre, un diacre ou un religieux à venir tenir une conférence ou une prédication sur un thème.",
      },
      {
        type: 'heading',
        text: 'Conditions',
      },
      {
        type: 'list',
        items: [
          "Il n'y a aucune condition, sauf celle de couvrir les frais associés (déplacement, repas, hébergement, ...). Voir aussi la grille tarifaire.",
          "Ces demandes nécessitent un traitement préalable et, si acceptée, une préparation. Envisagez de soumettre votre demande au moins deux semaines avant la date envisagée.",
        ],
      },
    ],
  },

  {
    id: CHURCH_SERVICE.MEDIATION,
    slug: 'mediation',
    title: "Demander la médiation de l'Église",
    description:
      "L'Église se tient toujours prête à être un médiateur discret et neutre, que ce soit entre des groupes d'individus, entre des institutions ou entre des individus et des institutions.",
    category: 'accompagnement',
    content: [
      {
        type: 'paragraph',
        text: "Dans sa mission de promotion de la paix et de la justice, l'Église catholique s'est toujours donné un rôle dans la résolution pacifique des conflits et le dialogue entre les individus — que ce soit les **conflits internationaux entre États** à travers ses importants réseaux diplomatiques, ou **local** par l'action des évêques et des autres membres du clergé.",
      },
      {
        type: 'paragraph',
        text: "L'Église se tient toujours prête à être un **médiateur discret** et **neutre**, que ce soit **entre des groupes d'individus**, **entre des institutions** ou **entre des individus et des institutions**. Par le dialogue, nous pouvons trouver le chemin de la paix.",
      },
      {
        type: 'paragraph',
        text: "Pour demander l'intervention de l'Église catholique comme médiateur entre deux groupes, contactez l'archidiocèse de Los Santos ou un membre du clergé.",
      },
    ],
  },

  {
    id: CHURCH_SERVICE.QUINCEANERA,
    slug: 'quinceanera',
    title: 'Quinceañera',
    description:
      "La Quinceañera est une célébration traditionnelle et une action de grâce à l'occasion du 15e anniversaire d'une jeune femme hispanique.",
    category: 'accompagnement',
    content: [
      {
        type: 'paragraph',
        text: "La **Quinceañera** est une célébration traditionnelle et une action de grâce à l'occasion du 15e anniversaire d'une jeune femme hispanique. À la demande de la famille, une messe ou un rite de bénédiction est célébré pour souligner son passage à la vie adulte.",
      },
      {
        type: 'heading',
        text: 'Conditions',
      },
      {
        type: 'list',
        items: [
          "La jeune fille doit avoir atteint l'âge de **15 ans**.",
          "La jeune fille doit avoir **reçu tous ses sacrements de l'initiation chrétienne** : baptême, première communion et confirmation.",
          "La famille doit être **enregistrée comme paroissienne**. Nous ne célébrons pas les Quinceañera des non-paroissiens.",
          'La famille doit avoir versé son offrande avant la célébration (voir grille tarifaire).',
        ],
      },
      {
        type: 'heading',
        text: 'Escorte de la Quinceañera',
      },
      {
        type: 'list',
        items: [
          'Les parents accompagnent la Quinceañera au début de la célébration.',
          'Les *damas y chambelanes* (accompagnateurs).',
          "Les *padrinos/madrinas* (parrains/marraines) ont la charge d'apporter les cadeaux (religieux) qui seront remis à la jeune fille.",
          'Les grands-parents.',
          'Les *compañeros de fe* (compagnons de foi).',
        ],
      },
      {
        type: 'heading',
        text: 'Langue',
      },
      {
        type: 'paragraph',
        text: 'La Quinceañera peut être célébrée en anglais ou en espagnol.',
      },
    ],
  },
]
