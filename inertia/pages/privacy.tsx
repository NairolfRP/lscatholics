import Head from '@/shared/components/app-head'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Typography } from '@/shared/components/ui/typography'
import { LinkText } from '@/shared/components/link-text'
import HeroSection from '@/shared/components/layout/default/hero-section'

export default function PrivacyPage() {
  return (
    <>
      <Head title="Politique de confidentialité" />

      <HeroSection align="text-left" bgColor="bg-linear-to-r from-primary to-catholic-blue">
        <h1 className="text-4xl text-white font-bold">(( Politique de confidentialité ))</h1>
      </HeroSection>

      <section className="container mx-auto max-w-7xl text-justify py-16">
        <Alert variant="info" className="mb-5">
          <AlertDescription>
            Contrairement au reste du site, cette page n'est pas fictive.
          </AlertDescription>
        </Alert>

        <Typography variant="h2">Informations collectées</Typography>
        <Typography className="not-first:mt-2">
          Lors de l'utilisation de notre site, nous collectons uniquement les informations
          nécessaires à l&apos;authentification des utilisateurs via l'API de{' '}
          <LinkText external href="https://gta.world/" target="_blank">
            GTA World
          </LinkText>
          . Après l'inscription, l'utilisateur peut aussi, de manière optionnelle, lier son compte
          utilisateur{' '}
          <LinkText external href="https://discord.com/" target="_blank">
            Discord
          </LinkText>
          . Les données collectées sont les suivantes :
        </Typography>
        <Typography variant="list" className="my-4">
          <li>
            <strong>Nom d'utilisateur :</strong> pseudonyme GTA World
          </li>
          <li>
            <strong>Identifiant unique :</strong> ID du compte GTA World
          </li>
        </Typography>
        <Typography className="not-first:mt-2">
          Ces informations sont utilisées exclusivement pour l'identification et la gestion des
          comptes sur notre site.
        </Typography>

        <Typography variant="h2" className="mt-10">
          Utilisation des Données
        </Typography>
        <Typography className="not-first:mt-2">
          Les informations collectées servent uniquement à :
        </Typography>
        <Typography variant="list" className="my-4">
          <li>Permettre l'accès sécurisé aux fonctionnalités du site</li>
          <li>Gérer et maintenir votre compte utilisateur</li>
        </Typography>
        <Typography className="not-first:mt-2">
          Aucune autre information n'est demandée ni stockée, et vos données ne sont jamais
          partagées ni vendues à des tiers.
        </Typography>

        <Typography variant="h2" className="mt-10">
          Cookies
        </Typography>
        <Typography className="not-first:mt-2">
          Notre site utilise des cookies pour permettre une connexion sécurisée et maintenir la
          session utilisateur. Ces cookies sont nécessaires au bon fonctionnement du site et ne
          contiennent pas d'informations personnelles sensibles.
        </Typography>

        <Typography variant="h2" className="mt-10">
          Suppression des Comptes
        </Typography>
        <Typography className="not-first:mt-2">
          Vous avez la possibilité de supprimer votre compte à tout moment depuis les paramètres de
          votre profil. La suppression de votre compte entraîne la suppression définitive de toutes
          les informations associées (nom d'utilisateur et identifiant unique).
        </Typography>

        <Typography variant="h2" className="mt-10">
          Modifications de cette Politique
        </Typography>
        <Typography className="not-first:mt-2">
          Cette politique de confidentialité peut être mise à jour pour refléter les changements de
          nos pratiques ou des exigences légales.
        </Typography>
      </section>
    </>
  )
}
