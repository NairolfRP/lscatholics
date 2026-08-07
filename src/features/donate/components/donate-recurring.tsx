import {
  FLEECA_STANDING_ORDER_IBAN,
  recurringDonationSteps,
} from '#/features/donate/constants/donate.constants.ts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#shared/components/ui/card.tsx'
import { Typography } from '#shared/components/ui/typography.tsx'

export function DonateRecurring() {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Configurer un don périodique</CardTitle>
        <CardDescription>
          Effectuez des dons de manière périodique et automatique à l'intention de l'Église.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Typography>
          Pour cela, connectez-vous à votre <strong>espace en ligne Fleeca</strong>, accédez à la
          page <strong>Virement Récurrent</strong> puis suivez les étapes ci-dessous.
        </Typography>

        <ol className="space-y-4">
          {recurringDonationSteps.map((step, index) => (
            <li key={step.title} className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {index + 1}
              </span>
              <div>
                <Typography className="font-semibold">{step.title}</Typography>
                <Typography className="text-muted-foreground">{step.description}</Typography>
              </div>
            </li>
          ))}
        </ol>

        <div className="rounded-xl border bg-muted p-4">
          <Typography className="font-semibold">IBAN de l'Archidiocèse de Los Santos</Typography>
          <Typography className="font-mono text-lg font-bold tracking-wider text-primary">
            {FLEECA_STANDING_ORDER_IBAN}
          </Typography>
        </div>

        <ul className="space-y-2 text-base/7 text-muted-foreground">
          <li>
            <strong className="text-foreground">Montant :</strong> indiquez le montant que vous
            souhaitez donner automatiquement et périodiquement.
          </li>
          <li>
            <strong className="text-foreground">Type de répétition :</strong> choisissez la
            fréquence de votre don
          </li>
          <li>
            <strong className="text-foreground">Date de début :</strong> définissez la date à
            laquelle les dons périodiques commenceront.
          </li>
          <li>
            <strong className="text-foreground">Remarque :</strong> remplissez simplement « Donation
            ».
          </li>
        </ul>

        <Typography>
          Cliquez enfin sur <strong>CONFIRMER</strong> pour enregistrer votre don périodique.
        </Typography>
      </CardContent>
    </Card>
  )
}
