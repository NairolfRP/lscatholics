import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Typography } from '@/shared/components/ui/typography'

export function DonateRecurring() {
  return (
    <Card className="p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-gray-900">
          Configurer un don périodique
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Typography>
          Vous pouvez de manière <strong>périodique</strong> et <strong>automatique</strong>{' '}
          effectuer des dons à l'intention de l'Église. Pour cela, vous devez vous connecter sur
          votre
          <strong>espace en ligne Fleeca</strong> puis accéder à la page
          <strong>Standing Orders</strong>. Cliquez sur <strong>Add New</strong> et remplissez le
          formulaire avec les informations suivantes :
        </Typography>
        <Typography variant="list">
          <li>
            <strong>Montant :</strong> Indiquez le montant que vous souhaitez donner à l'Église de
            manière automatique et périodique.
          </li>
          <li>
            <strong>IBAN :</strong> 0200 1914 4
          </li>
          <li>
            <strong>Repeat Type :</strong> Choisissez la fréquence à laquelle vous souhaitez
            effectuer votre don périodique, soit de manière mensuelle, soit tous les X jours.
          </li>
          <li>
            <strong>Start Date :</strong> Définissez la date à laquelle les dons périodiques
            commenceront.
          </li>
          <li>
            <strong>Remarks :</strong> Commentaire des dons. Remplissez simplement « Donation »
          </li>
        </Typography>
        <Typography>
          Cliquez enfin sur « Confirm » pour enregistrer votre don périodique.
        </Typography>
      </CardContent>
    </Card>
  )
}
