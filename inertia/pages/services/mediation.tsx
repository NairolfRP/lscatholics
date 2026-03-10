import { Typography } from '@/shared/components/ui/typography'
import ServiceLayout from '@/pages/services/service-layout'

export default function MediationPage() {
  return (
    <ServiceLayout serviceId="mediation">
      <Typography>
        Dans sa mission de promotion de la paix et de la justice, l'Église catholique s'est toujours
        donner un rôle dans la résolution pacifique des conflits et le dialogue entre les individus,
        que ce soit les <strong>conflits internationaux entre États</strong> à travers ses
        importants réseaux diplomatiques ou que ce soit <strong>local</strong> par l'action des
        évêques et des autres membres du clergé.
      </Typography>
      <Typography>
        L'Église se tient toujours prête à être un <strong>médiateur discret</strong> et{' '}
        <strong>neutre</strong>, que ce soit <strong>entre des groupes d'individus</strong>,{' '}
        <strong>entre des institutions</strong> ou{' '}
        <strong>entre des individus et des institutions</strong>. Par le dialogue, nous pouvons
        trouver le chemin de la paix.
      </Typography>
      <Typography>
        Pour demander l'intervention de l'Église catholique comme médiateur entre deux groupes,
        contactez l'archidiocèse de Los Santos ou un membre du clergé.
      </Typography>
    </ServiceLayout>
  )
}
