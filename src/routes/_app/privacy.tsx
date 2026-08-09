import type { PropsWithChildren } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { InfoIcon } from 'lucide-react'
import { Typography } from '#/shared/components/ui/typography'
import Hero from '#/shared/layouts/app/components/hero'
import { pageMetadata } from '#/utils/seo'
import { Alert, AlertDescription } from '#shared/components/ui/alert.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'

const lastUpdated = '9 août 2026'

export const Route = createFileRoute('/_app/privacy')({
  head: () => ({
    meta: pageMetadata('Politique de confidentialité'),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Hero
        variant="minimal"
        backgroundColor="bg-linear-to-r from-primary to-catholic-blue"
        title="Politique de confidentialité"
        subtitle={`Dernière mise à jour : ${lastUpdated}`}
      />

      <section className="container mx-auto prose max-w-5xl px-2 pt-10 pb-20 dark:prose-invert">
        <div className="space-y-10">
          <Alert>
            <InfoIcon />
            <AlertDescription>
              Contrairement au reste de l'application, cette page n'est pas fictive. Elle décrit les
              données réelles collectées et traitées par cette application.
            </AlertDescription>
          </Alert>
          <PrivacyCard title="1. Nature de l'application">
            <p>
              Cette application sert de portail pour la faction{' '}
              <strong>Archidiocèse de Los Santos</strong>, un projet de jeu de rôle (
              <em>« roleplay »</em>) sur le serveur de jeu{' '}
              <a href="https://gta.world/" target="_blank" rel="noopener noreferrer">
                GTA World
              </a>
              . Elle n'est <strong>ni affiliée ni un produit officiel</strong> de la marque GTA
              World.
            </p>
            <p>
              L'application présente du <strong>contenu entièrement fictif</strong>. Elle ne
              constitue en aucun cas un site religieux réel ni une organisation réelle, et ne vise
              aucun autre public que les joueurs du serveur de jeu susmentionné.
            </p>
          </PrivacyCard>

          <PrivacyCard title="2. Responsable du traitement">
            <p>
              Le responsable du traitement des données est le créateur et développeur de
              l'application. Pour toute question, vous pouvez le contacter via :
            </p>
            <ul>
              <li>
                <strong>Discord</strong> : nairolf.rp
              </li>
              <li>
                <strong>Message privé sur le forum GTA World</strong> :{' '}
                <a
                  href="https://forum-fr.gta.world/profile/11040-nairolf/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://forum-fr.gta.world/profile/11040-nairolf/
                </a>
              </li>
            </ul>
          </PrivacyCard>

          <PrivacyCard title="3. Données collectées">
            <p>
              Conformément au{' '}
              <a
                href="https://www.cnil.fr/fr/reglement-europeen-protection-donnees"
                target="_blank"
                rel="noopener noreferrer"
              >
                Règlement (UE) 2016/679 du 27 avril 2016 (RGPD)
              </a>{' '}
              et à la{' '}
              <a
                href="https://www.cnil.fr/fr/le-cadre-national/la-loi-informatique-et-libertes"
                target="_blank"
                rel="noopener noreferrer"
              >
                loi informatique et Libertés du 6 janvier 1978
              </a>
              , nous collectons le strict minimum de données nécessaires au fonctionnement de
              l'application.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.1 Données collectées lors de la création de compte et de la connexion
            </Typography>
            <p>
              Nous utilisons uniquement le{' '}
              <a
                href="https://forum.gta.world/en/topic/141258-gta-world-oauth-api-documentation-updated-march-1st-2025/"
                target="_blank"
                rel="noopener noreferrer"
              >
                service d'authentification (OAuth) de GTA World
              </a>{' '}
              pour permettre la connexion. Les données suivantes sont récupérées via l'API OAuth de
              GTA World :
            </p>
            <ul>
              <li>
                <strong>Identifiant GTA World</strong> (nom d'utilisateur)
              </li>
              <li>
                <strong>ID unique du compte GTA World</strong>
              </li>
            </ul>
            <p>
              <strong>Aucune adresse e-mail ni information personnelle n'est collectée</strong>{' '}
              auprès de GTA World.
            </p>
            <p>
              La politique de confidentialité de GTA World est disponible à l'adresse suivante :{' '}
              <a href="https://gta.world/terms" target="_blank" rel="noopener noreferrer">
                https://gta.world/terms
              </a>
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.2 Données collectées lors du lien avec Discord (optionnel)
            </Typography>
            <p>
              L'utilisateur peut choisir de lier son compte Discord via ses paramètres de compte
              pour accéder à des fonctionnalités complémentaires. Nous limitons la collecte aux
              informations de base sur l'identité du compte, c'est-à-dire :
            </p>
            <ul>
              <li>
                <strong>ID Discord</strong>
              </li>
              <li>
                <strong>Nom d'utilisateur Discord</strong>
              </li>
              <li>
                <strong>Avatar Discord</strong>
              </li>
            </ul>
            <p>
              <strong>Aucune adresse e-mail ni donnée supplémentaire n'est collectée</strong> via
              Discord.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.3 Données des personnages et factions (GTA World)
            </Typography>
            <p>
              Après la connexion et pendant la durée d'utilisation de l'application, nous récupérons
              les informations suivantes depuis le service de GTA World :
            </p>
            <ul>
              <li>
                <strong>Personnages</strong> : identité (ID, prénom et nom) et IBAN des personnages
              </li>
              <li>
                <strong>Factions</strong> : ID, nom de la faction, rang et nom du rang
              </li>
            </ul>
            <p>
              Ces données ne sont pas persistées dans nos bases de données. Elles sont exclusivement
              récupérées puis synchronisées via les API mises à disposition par GTA World.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.4 Données de session
            </Typography>
            <p>
              Les sessions sont stockées dans des cookies sécurisés et cryptés et en base de
              données. Les informations suivantes sont enregistrées :
            </p>
            <ul>
              <li>
                <strong>Adresse IP</strong> (pour la gestion des sessions et la sécurité)
              </li>
              <li>
                <strong>Agent utilisateur du navigateur</strong> (pour la gestion des sessions)
              </li>
              <li>
                <strong>Date d'expiration de la session</strong> (durée de vie : 7 jours maximum)
              </li>
            </ul>
            <p>
              Vous pouvez à tout moment révoquer vos sessions via vos paramètres de compte, ou vous
              déconnecter pour supprimer votre session actuelle.
            </p>
            <p>
              Pour des raisons de sécurité, les actions sensibles peuvent nécessiter une
              réauthentification si la session existe depuis plus de 24 heures.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.5 Données du personnage actuel
            </Typography>
            <p>
              Un cookie de préférence (<code>lscatholics.current_character</code>) permet de
              mémoriser le personnage sélectionné par l'utilisateur. Ce cookie est sécurisé et
              expire après 30 jours.
            </p>
          </PrivacyCard>

          <PrivacyCard title="4. Durée de conservation">
            <ul>
              <li>
                <strong>Comptes utilisateurs</strong> : conservés tant que le compte existe. La
                suppression du compte entraîne la suppression de toutes les données associées
              </li>
              <li>
                <strong>Sessions</strong> : expires après 7 jours maximum. Le cache des cookies est
                limité à 5 minutes
              </li>
              <li>
                <strong>Cookie du personnage actuel</strong> : 30 jours
              </li>
              <li>
                <strong>Personnages et factions</strong> : temporairement mis en mémoire durant 5
                minutes. Ils ne sont ni conservés ni sauvegardés sur notre base de données
              </li>
            </ul>
          </PrivacyCard>

          <PrivacyCard title="5. Tiers et sous-traitants">
            <p>
              Vos données ne sont jamais vendues, partagées, ni louées à des tiers à des fins
              commerciales ou marketing.
            </p>
            <p>
              Les seules entités ayant accès à vos données sont les partenaires techniques
              indispensables au fonctionnement de l'application, listés ci-dessous. Nous vous
              encourageons à prendre connaissance de leurs politiques en matière de traitement des
              données :
            </p>
            <ul>
              <li>
                <strong>GTA World</strong> (fournisseur d'authentification OAuth et API du serveur
                de jeu) —{' '}
                <a href="https://gta.world/terms" target="_blank" rel="noopener noreferrer">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Discord</strong> (lien de compte optionnel) —{' '}
                <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Vercel</strong> (hébergement de l'application) —{' '}
                <a
                  href="https://vercel.com/legal/privacy-notice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Turso Cloud</strong> (hébergeur de la base de données) —{' '}
                <a
                  href="https://turso.tech/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </PrivacyCard>

          <PrivacyCard title="6. Outils d'analyse et de mesure de performance">
            <p>Nous utilisons les outils suivants pour améliorer l'expérience utilisateur :</p>

            <Typography as="h3" variant="h4" className="mt-6">
              6.1 Vercel Analytics
            </Typography>
            <p>
              Vercel Analytics est un outil d'analyse respectueux de la vie privée qui ne collecte{' '}
              <strong>aucun identifiant personnel</strong> permettant de tracer ou d'identifier les
              visiteurs. Les données collectées sont entièrement anonymes et agrégées. Aucun cookie
              tiers n'est utilisé.
            </p>
            <p>
              Pour plus d'informations, consultez leur politique de confidentialité :{' '}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://vercel.com/docs/analytics/privacy-policy
              </a>
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              6.2 Vercel Speed Insights
            </Typography>
            <p>
              Vercel Speed Insights mesure les performances de l'application (Web Vitals). Comme
              Vercel Analytics, cet outil est conçu pour respecter la vie privée.
            </p>
            <p>
              Pour plus d'informations, consultez leur politique de confidentialité :{' '}
              <a
                href="https://vercel.com/docs/speed-insights/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://vercel.com/docs/speed-insights/privacy-policy
              </a>
            </p>
          </PrivacyCard>

          <PrivacyCard title="7. Vos droits">
            <p>
              Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits
              suivants concernant vos données personnelles :
            </p>
            <ul>
              <li>
                <strong>Droit d'accès</strong> (art. 15 RGPD) : obtenir la confirmation que des
                données vous concernant sont traitées et en obtenir une copie
              </li>
              <li>
                <strong>Droit de rectification</strong> (art. 16 RGPD) : faire corriger des données
                inexactes ou incomplètes
              </li>
              <li>
                <strong>Droit à l'effacement</strong> (art. 17 RGPD) : demander la suppression de
                vos données personnelles
              </li>
              <li>
                <strong>Droit à la limitation du traitement</strong> (art. 18 RGPD) : demander la
                limitation du traitement de vos données
              </li>
              <li>
                <strong>Droit à la portabilité</strong> (art. 20 RGPD) : recevoir vos données dans
                un format structuré, couramment utilisé et lisible par machine
              </li>
              <li>
                <strong>Droit d'opposition</strong> (art. 21 RGPD) : vous opposer au traitement de
                vos données à des fins de prospection ou pour motif légitime
              </li>
              <li>
                <strong>Droit de retirer votre consentement</strong> à tout moment, sans affecter la
                licéité du traitement fondé sur le consentement antérieur à son retrait
              </li>
            </ul>
            <p>
              Vous pouvez exercer ces droits en contactant le responsable du traitement (voir
              section concernée). Si vous estimez que vos droits ne sont pas respectés, vous pouvez
              adresser une réclamation à l'autorité de contrôle compétente en France, la Commission
              Nationale de l'Informatique et des Libertés (CNIL) via leur site internet :{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                https://www.cnil.fr
              </a>
              .
            </p>
          </PrivacyCard>

          <PrivacyCard title="8. Suppression du compte">
            <p>
              Vous pouvez supprimer votre compte à tout moment depuis vos{' '}
              <Link to="/account/settings">paramètres de compte</Link>. Cette action est{' '}
              <strong>irréversible</strong>.
            </p>
          </PrivacyCard>

          <PrivacyCard title="9. Modifications de cette politique">
            <p>
              Cette politique de confidentialité peut être mise à jour à tout moment. La date de
              dernière mise à jour est indiquée en haut de cette page.
            </p>
          </PrivacyCard>
        </div>
      </section>
    </>
  )
}

function PrivacyCard({ title, children }: PropsWithChildren<{ title: string }>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="scroll-m-20 text-2xl font-bold tracking-tight transition-colors">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="-mb-(--card-spacing)">
        <div className="-mx-(--card-spacing) space-y-4 border-t bg-muted/50 px-(--card-spacing) py-4 text-base leading-relaxed">
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
