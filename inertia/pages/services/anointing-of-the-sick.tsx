import { Info } from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import ServiceLayout from '@/pages/services/service-layout'

export default function AnointingOfTheSickPage() {
  return (
    <ServiceLayout serviceId="sicks">
      <Typography>
        Les derniers sacrements (ou « extrême onction » ; « onction des malades » ; « sacrement des
        malades ») est un sacrement de l'Église catholique.
      </Typography>
      <Typography>
        A l'image du Christ, l'Église accompagne chaque malade dans ses souffrances et chaque
        mourant dans l'attente de son retour à Dieu.
      </Typography>
      <Typography variant="h2" className="mt-10">
        Conditions pour se recevoir le sacrement
      </Typography>
      <Typography variant="list">
        <li>
          Étant un sacrement, il est nécessaire d'être baptisé. En cas de mort imminente et
          d'urgence absolue, le prêtre peut baptiser le mourant sur place par une formule courte,
          avant de lui délivrer les derniers sacrements.
        </li>
      </Typography>
      <Typography variant="h2" className="mt-10">
        Demander les derniers sacrements / l'onction des malades
      </Typography>
      <Typography>
        En cas de danger de mort imminent, contactez immédiatement l'archidiocèse et un prêtre se
        déplacera en urgence sur les lieux où se trouve la personne.
      </Typography>
      <Typography>
        Pour les malades ou les personnes en fin de vie, vous pouvez contacter l'archidiocèse pour
        fixer une date avec un prêtre.
      </Typography>
      <Typography>
        A l'hôpital, au nom du premier amendement garantissant la liberté d'exercer sa religion,
        vous pouvez demander au personnel de contacter un prêtre.
      </Typography>
      <Alert
        variant="info"
        className="bg-transparent border-info text-foreground *:data-[slot=alert-description]:text-foreground/90 mt-10"
      >
        <Info />
        <AlertDescription>
          Afin d'informer toute personne que vous êtes catholique et désirez l'intervention d'un
          prêtre en cas d'urgence, portez systématiquement sur vous une « carté d'identité
          catholique ». Contactez l'archidiocèse ou le curé de votre paroisse pour en recevoir une.
        </AlertDescription>
      </Alert>
    </ServiceLayout>
  )
}
