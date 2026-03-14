import { Typography } from '@/shared/components/ui/typography'
import ServiceLayout from '@/pages/services/service-layout'

export default function FuneralsPage() {
  return (
    <ServiceLayout serviceId="funerals">
      <Typography>
        Les obsèques chrétiennes sont le moment de prier pour celui qui a terminé sa vie terrestre,
        de faire le deuil et d'avancer dans l'espérance.
      </Typography>
      <Typography variant="h2" className="mt-10">
        Conditions pour recevoir des obsèques chrétiennes
      </Typography>
      <Typography variant="list">
        <li>
          Si le défunt n'est pas baptisé, il ne doit pas avoir exprimé de son vivant le refus d'une
          célébration catholique. De-même, l'Église accepte de célébrer les funérailles d'un
          non-baptisé si son entourage est composé d'un nombre raisonnable de chrétiens
        </li>
        <li>
          Le défunt ne doit pas avoir été privé d'obsèques chrétiennes (décision judiciaire de
          l'Église, excommunication, ...)
        </li>
      </Typography>
      <Typography variant="h2" className="mt-10">
        Demander des obsèques chrétiennes pour son proche défunt
      </Typography>
      <Typography>
        Pour demander des obsèques chrétiennes, contactez l'archidiocèse de manière à planifier une
        réunion de préparation avec un prêtre ou un diacre.
      </Typography>
    </ServiceLayout>
  )
}
