import type { PropsWithChildren } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { InfoIcon } from 'lucide-react'
import { Typography } from '#/shared/components/ui/typography'
import Hero from '#/shared/layouts/app/components/hero'
import { pageMetadata } from '#/utils/seo'
import { Alert, AlertDescription } from '#shared/components/ui/alert.tsx'
import { Card, CardContent, CardHeader, CardTitle } from '#shared/components/ui/card.tsx'

const lastUpdated = '12 novembre 2026'

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
        backgroundColor="bg-linear-to-r from-primary to-primary/80"
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
            <p>
              La plupart des données saisies dans l'application sont des{' '}
              <strong>données de jeu (roleplay)</strong> et ne concernent pas votre personne réelle.
              Nous vous invitons à ne pas y saisir de données personnelles réelles sensibles.
            </p>
          </PrivacyCard>

          <PrivacyCard title="2. Responsable du traitement">
            <p>
              Le responsable du traitement des données est le créateur et développeur de
              l'application. Pour toute question relative à vos données, contactez-le via :
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

          <PrivacyCard title="3. Données traitées">
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
                loi Informatique et Libertés du 6 janvier 1978
              </a>
              , nous collectons le strict minimum de données nécessaires au fonctionnement de
              l'application : des identifiants de connexion et des données de jeu.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.1 Compte et connexion
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
              pour permettre la connexion. Les données suivantes sont récupérées :
            </p>
            <ul>
              <li>
                <strong>Identifiant GTA World</strong> (nom d'utilisateur)
              </li>
              <li>
                <strong>ID unique du compte GTA World</strong>
              </li>
              <li>
                <strong>Jetons de connexion</strong> (pour maintenir la session)
              </li>
            </ul>
            <p>
              <strong>Aucune adresse e-mail réelle n'est collectée</strong> auprès de GTA World ; un
              identifiant technique interne est généré à la place.
            </p>
            <p>
              La politique de confidentialité de GTA World est disponible à l'adresse suivante :{' '}
              <a href="https://global.gta.world/privacy" target="_blank" rel="noopener noreferrer">
                https://global.gta.world/privacy
              </a>
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.2 Lien avec Discord (optionnel)
            </Typography>
            <p>
              L'utilisateur peut choisir de lier son compte Discord via ses paramètres de compte
              pour accéder à des fonctionnalités complémentaires. Nous limitons la collecte aux
              informations de base de l'identité du compte :
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
              <li>
                <strong>Jetons de connexion</strong>
              </li>
            </ul>
            <p>
              <strong>Aucune adresse e-mail réelle n'est collectée</strong> via Discord.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.3 Personnages et factions (GTA World)
            </Typography>
            <p>
              Pendant l'utilisation de l'application, nous récupérons les informations suivantes
              depuis le service de GTA World :
            </p>
            <ul>
              <li>
                <strong>Personnages</strong> : identité (ID, prénom et nom) et IBAN du personnage
                (donnée de jeu)
              </li>
              <li>
                <strong>Factions</strong> : ID, nom de la faction, rang et nom du rang du personnage
              </li>
            </ul>
            <p>
              Ces données ne sont pas persistées dans notre base de données. Elles sont récupérées
              puis mises en cache en mémoire pendant 5 minutes.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.4 Sessions et sécurité
            </Typography>
            <p>
              Les sessions sont stockées de manière sécurisée en base de données. Un cache de
              session à court terme (5 minutes), signé pour garantir son intégrité, est également
              conservé dans un cookie afin d'améliorer l'expérience utilisateur.
            </p>
            <p>Les informations suivantes sont enregistrées :</p>
            <ul>
              <li>
                <strong>Adresse IP</strong> (gestion des sessions et sécurité)
              </li>
              <li>
                <strong>Agent utilisateur du navigateur</strong> (gestion des sessions)
              </li>
              <li>
                <strong>Date d'expiration de la session</strong> : 7 jours après la dernière
                activité, prolongée automatiquement tant que vous utilisez l'application
              </li>
            </ul>
            <p>
              Vous pouvez à tout moment révoquer vos sessions via vos paramètres de compte, ou vous
              déconnecter pour supprimer votre session actuelle. Pour des raisons de sécurité, les
              actions sensibles peuvent nécessiter une ré-authentification si la session existe
              depuis plus de 24 heures.
            </p>
            <p>
              Des <strong>données de modération</strong> sont associées au compte : rôle, statut de
              bannissement, motif et date d'expiration le cas échéant. Elles sont gérées par les
              utilisateurs qui ont reçu ces permissions spécifiques.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.5 Personnage actuel
            </Typography>
            <p>
              Un cookie de préférence mémorise le personnage sélectionné par l'utilisateur. Ce
              cookie est sécurisé et expire après 30 jours.
            </p>

            <Typography as="h3" variant="h4" className="mt-6">
              3.6 Mesure d'audience et monitoring
            </Typography>
            <p>
              Nous utilisons <strong>Vercel Analytics</strong> et{' '}
              <strong>Vercel Speed Insights</strong> pour mesurer la fréquentation et les
              performances. Ces outils sont conçus pour respecter la vie privée : aucun identifiant
              personnel, aucune trace individuelle, aucun cookie tiers.
            </p>
            <p>
              Nous utilisons également{' '}
              <a href="https://sentry.io" target="_blank" rel="noopener noreferrer">
                Sentry
              </a>{' '}
              pour détecter et corriger les erreurs inattendues. Les données sont hébergées dans
              l'Union européenne.
            </p>
          </PrivacyCard>

          <PrivacyCard title="4. Bases légales">
            <ul>
              <li>
                <strong>Compte et connexion</strong> : exécution du contrat (fourniture du service).
              </li>
              <li>
                <strong>Discord lié</strong> : consentement (optionnel et révocable).
              </li>
              <li>
                <strong>Sessions, sécurité et modération</strong> : intérêt légitime (sécurité et
                prévention des abus).
              </li>
              <li>
                <strong>Mesure d'audience et monitoring</strong> : intérêt légitime (amélioration et
                fiabilité de l'application).
              </li>
            </ul>
          </PrivacyCard>

          <PrivacyCard title="5. Durée de conservation">
            <ul>
              <li>
                <strong>Compte utilisateur</strong> : tant que le compte existe. Vous pouvez le
                supprimer à tout moment via vos paramètres.
              </li>
              <li>
                <strong>Sessions</strong> : 7 jours après la dernière activité.
              </li>
              <li>
                <strong>Personnage actuel</strong> : 30 jours (cookie).
              </li>
              <li>
                <strong>Personnages et factions</strong> : 5 minutes en mémoire, non persistés.
              </li>
              <li>
                <strong>Brouillons de formulaires</strong> : jusqu'à suppression par vos soins
                (stockage local du navigateur).
              </li>
            </ul>
          </PrivacyCard>

          <PrivacyCard title="6. Destinataires et transferts">
            <p>
              Vos données réelles ne sont jamais vendues, louées ni partagées à des fins
              commerciales ou marketing. Les seuls destinataires sont les partenaires techniques
              indispensables :
            </p>
            <ul>
              <li>
                <strong>GTA World</strong> (authentification OAuth et API de jeu) —{' '}
                <a
                  href="https://global.gta.world/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Discord</strong> (liaison de compte optionnelle) —{' '}
                <a href="https://discord.com/privacy" target="_blank" rel="noopener noreferrer">
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Vercel</strong> (hébergement) —{' '}
                <a
                  href="https://vercel.com/legal/privacy-notice"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Turso Cloud</strong> (base de données) —{' '}
                <a
                  href="https://turso.tech/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Politique de confidentialité
                </a>
              </li>
              <li>
                <strong>Sentry</strong> (monitoring des erreurs, région UE) —{' '}
                <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
            <p>
              Certains de ces prestataires (Vercel, Discord, Turso) sont établis hors de l'Union
              européenne ; les transferts sont encadrés par les garanties prévues par le RGPD.
              D'autres services (polices Bunny Fonts, images Imgur) peuvent recevoir votre adresse
              IP lors du chargement des pages.
            </p>
          </PrivacyCard>

          <PrivacyCard title="7. Cookies et stockage local">
            <p>
              L'application utilise des cookies et le stockage local du navigateur pour fonctionner.
              Ces éléments sont strictement nécessaires au service et ne sont pas utilisés à des
              fins publicitaires. Aucun cookie tiers de suivi n'est déposé.
            </p>
          </PrivacyCard>

          <PrivacyCard title="8. Sécurité">
            <p>
              Les données sont transmises en HTTPS. Les cookies de session sont signés et l'accès
              aux données est limité aux personnes autorisées. Aucun système n'étant infaillible,
              nous vous encourageons à ne pas saisir de données réelles sensibles dans les champs de
              jeu.
            </p>
          </PrivacyCard>

          <PrivacyCard title="9. Vos droits">
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
                vos données pour motif légitime
              </li>
              <li>
                <strong>Droit de retirer votre consentement</strong> à tout moment, sans affecter la
                licéité du traitement fondé sur le consentement antérieur à son retrait
              </li>
            </ul>
            <p>
              Vous pouvez exercer ces droits en contactant le responsable du traitement (voir
              section 2). Si vous estimez que vos droits ne sont pas respectés, vous pouvez adresser
              une réclamation à l'autorité de contrôle compétente en France, la Commission Nationale
              de l'Informatique et des Libertés (CNIL) :{' '}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
                https://www.cnil.fr
              </a>
              .
            </p>
          </PrivacyCard>

          <PrivacyCard title="10. Suppression du compte">
            <p>
              Vous pouvez supprimer votre compte à tout moment depuis vos{' '}
              <Link to="/account/settings">paramètres de compte</Link>. Cette action est{' '}
              <strong>irréversible</strong>.
            </p>
          </PrivacyCard>

          <PrivacyCard title="11. Modifications de cette politique">
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
        <CardTitle className="scroll-m-20 font-serif text-2xl font-bold tracking-tight transition-colors">
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
