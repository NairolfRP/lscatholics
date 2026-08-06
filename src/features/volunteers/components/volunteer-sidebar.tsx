import { HandHeartIcon, StoreIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'

export function VolunteersSidebar() {
  return (
    <>
      <Card className="border-primary/20 bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HandHeartIcon className="size-5" /> Notre mission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="border-l-2 border-primary pl-4">
            <Typography className="text-muted-foreground italic">
              <strong className="text-foreground not-italic">Mission :</strong> Catholic Charities
              s'engage à témoigner du message du Christ en menant des actions auprès de diverses
              communautés, au service des pauvres et des plus vulnérables, afin de promouvoir la
              dignité humaine et défendre la justice sociale.
            </Typography>
          </blockquote>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-accent">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <StoreIcon className="size-5" /> Votre entreprise souhaite s'engager socialement ?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Typography className="text-muted-foreground">
            Ces dernières années, de nombreuses entreprises aux États-Unis ont adopté des politiques
            internes pour participer à la construction d'un monde meilleur. Pourquoi ne pas, à votre
            tour, vous engager en faveur de la communauté ?
          </Typography>

          <Typography className="text-muted-foreground">
            Votre entreprise peut mettre en place des politiques de ressources humaines pour inciter
            ses employés à faire du bénévolat.
          </Typography>

          <ul className="ml-4 list-disc space-y-2 text-base/7 text-muted-foreground">
            <li>Votre employé fait du bénévolat et déclare ses heures à vos RH.</li>
            <li>
              En échange, votre entreprise convertit ces heures en don financier à l'organisation.
            </li>
          </ul>

          <Typography className="text-muted-foreground">
            Des études sérieuses démontrent que le bénévolat permet à ses employés d'améliorer leur{' '}
            <strong className="text-foreground">bien-être général</strong> et d'être{' '}
            <strong className="text-foreground">plus efficaces</strong> au travail. N'hésitez pas à
            prendre contact avec nous pour obtenir des conseils sur la mise en place de ces
            politiques dans votre entreprise.
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
