import { Typography } from '@/shared/components/ui/typography'
import ServiceLayout from '@/pages/services/service-layout'

export default function MarriagePage() {
  return (
    <ServiceLayout serviceId="marriage">
      <Typography>
        Se marier à l'Église est un moment fort de la vie du chrétien. Par le mariage et en fondant
        une nouvelle famille, les époux témoignent de l'amour de Dieu par l'amour qu'ils se portent
        l'un pour l'autre.
      </Typography>
      <Typography variant="h2" className="mt-10">
        4 piliers du mariage chrétien
      </Typography>
      <Typography variant="list">
        <li>
          <strong>La liberté</strong> : L'homme et la femme doivent être libres et consentir à
          l'union.
        </li>
        <li>
          <strong>La fidélité</strong> : Les époux s'engagent à être fidèles l'un envers l'autre, à
          se soutenir et traverser les épreuves ensemble, et à s'accorder l'exclusivité.
        </li>
        <li>
          <strong>L'Indissolubilité</strong> : Un mariage scellé devant Dieu est pour la vie.
        </li>
        <li>
          <strong>La fécondité</strong> : Les époux acceptent de fonder une famille et de recevoir
          l'enfant qui pourrait naître du fruit de leur amour, de le baptiser et de lui donner une
          éducation chrétienne.
        </li>
      </Typography>
      <Typography variant="h2" className="mt-10">
        Conditions pour se marier à l'Église
      </Typography>
      <Typography variant="list">
        <li>
          Le mariage chrétien est uniquement <strong>entre un homme et une femme</strong>
        </li>
        <li>
          Les deux futurs époux doivent avoir au moins <strong>18 ans</strong>
        </li>
        <li>
          Au moins l'<strong>un</strong> des futurs époux doit être <strong>baptisé</strong>
        </li>
        <li>
          Ne pas avoir déjà été marié à l'église et ne pas être marié civilement à une autre
          personne que son ou sa futur époux(se) <em className="text-sm">(1)</em>
        </li>
        <li>
          Les futurs époux doivent être en accord avec les{' '}
          <strong>4 piliers du mariage chrétien</strong>
        </li>
      </Typography>
      <Typography className="italic text-sm">
        (1) Puisque le sacrement du mariage est seulement pour la vie terrestre, un veuf ou une
        veuve peut se remarier à l'Église.
      </Typography>
      <Typography variant="h2" className="mt-10">
        Demander le mariage
      </Typography>
      <Typography>
        La préparation d'un mariage demande de s'y prendre avec beaucoup d'avance. Contactez
        l'archidiocèse au moins <strong>2 semaines</strong> avant les dates que vous comptez
        proposer.
      </Typography>
      <Typography>
        Une réunion de préparation sera planifiée avec l'officiant pour apprendre à connaître les
        futurs époux, vérifier qu'ils répondent aux conditions du mariage et préparer avec eux ce
        moment important de leur vie terrestre.
      </Typography>
      <Typography>
        Il est <strong>très recommandé</strong> de réfléchir à ces éléments{' '}
        <strong>avant la réunion de préparation</strong> :
      </Typography>
      <Typography variant="list">
        <li>
          Plusieurs dates et heures pour la célébration (l'officiant peut les refuser s'il n'est pas
          disponible)
        </li>
        <li>
          Plusieurs choix de musiques d'entrée (l'officiant procédera par élimination dans votre
          ordre de préférence. Il s'assurera que la musique est acceptable dans une église. La
          musique doit obligatoirement évoquer l'amour.)
        </li>
        <li>
          Les noms des témoins de chaque futur époux (au moins 1 par époux et au moins 1 pour chacun
          doit être baptisé){' '}
          <em>(( En cas de carence de joueurs, ces témoins peuvent être des PNJ. ))</em>
        </li>
      </Typography>
    </ServiceLayout>
  )
}
