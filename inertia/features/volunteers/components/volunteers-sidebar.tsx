import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ChartArea, Store } from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'

export function VolunteersSidebar() {
  return (
    <div className="flex flex-col gap-5 col-span-2">
      <Card className="bg-accent text-accent-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartArea /> Vous avez encore besoin d'être convaincu ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          Voici des faits concrets :
          <Typography variant="list" className="list-decimal lg:text-base mt-3">
            <li>
              Plus de <strong>68%</strong> des bénévoles affirment que le bénévolat a{' '}
              <strong>amélioré leur forme physique</strong>
            </li>
            <li>
              <strong>89%</strong> reconnaissent que leur engagement a contribué à leur{' '}
              <strong>bien-être général</strong>
            </li>
            <li>
              <strong>73%</strong> constatent que leur action bénévole a{' '}
              <strong>réduit leur niveau de stress</strong> au quotidien
            </li>
            <li>
              <strong>92%</strong> déclarent que leur bénévolat a donné plus de{' '}
              <strong>sens à leur vie</strong>
            </li>
          </Typography>
        </CardContent>
      </Card>

      <Card className="bg-accent text-accent-foreground">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store /> Votre entreprise souhaite s'engager socialement ?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Typography className="text-inherit lg:text-base">
            Ces dernières années, de nombreuses entreprises aux États-Unis ont adopté des politiques
            internes pour participer à la construction d'un monde meilleur. Pourquoi ne pas, à votre
            tour, vous engager en faveur de la communauté ?
          </Typography>

          <Typography className="text-inherit lg:text-base">
            Votre entreprise peut mettre en place des politiques de ressources humaines pour inciter
            ses employés à faire du bénévolat.
          </Typography>
          <Typography variant="list" className="text-inherit lg:text-base mt-3">
            <li>Votre employé fait du bénévolat et déclare ses heures à vos RH</li>
            <li>
              En échange, votre entreprise convertit ces heures en don financier à l'organisation
            </li>
          </Typography>
          <Typography className="text-inherit lg:text-base">
            Des études sérieuses démontrent que le bénévolat permet à ses employés d'améliorer leur{' '}
            <strong>bien-être général</strong> et d'être <strong>plus efficaces</strong> au travail.
            N'hésitez pas à prendre contact avec nous pour obtenir des conseils sur la mise en place
            de ces politiques dans votre entreprise.
          </Typography>
        </CardContent>
      </Card>
    </div>
  )
}
