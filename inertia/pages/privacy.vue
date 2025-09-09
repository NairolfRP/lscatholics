<template>
  <PageBanner align="text-left" bg-color="bg-gradient-to-r from-primary to-catholic-blue">
    <h1 class="text-4xl text-white font-bold">(( Politique de confidentialité ))</h1>
  </PageBanner>

  <section class="container mx-auto max-w-7xl text-justify py-16">
    <Alert variant="info" class="mb-5">
      <AlertDescription>
        Contrairement au reste du site, cette page n'est pas fictive.
      </AlertDescription>
    </Alert>

    <Typography variant="h2">Informations collectées</Typography>
    <Typography class="[&:not(:first-child)]:mt-2">
      Lors de l’utilisation de notre site, nous collectons uniquement les informations nécessaires à
      l&apos;authentification des utilisateurs via l'API de
      <a href="https://gta.world/" class="underline text-primary" target="_blank">GTA World</a>.
      Après l'inscription, l'utilisateur peut aussi, de manière optionnelle, lier son compte
      utilisateur <a class="underline text-primary" href="https://discord.com/">Discord</a>. Les
      données collectées sont les suivantes :
    </Typography>
    <Typography variant="list" class="my-4">
      <li><strong>Nom d'utilisateur :</strong> pseudonyme GTA World</li>
      <li><strong>Identifiant unique :</strong> ID du compte GTA World</li>
    </Typography>
    <Typography class="[&:not(:first-child)]:mt-2">
      Ces informations sont utilisées exclusivement pour l'identification et la gestion des comptes
      sur notre site.
    </Typography>

    <Typography variant="h2" class="mt-10"> Utilisation des Données </Typography>
    <Typography class="[&:not(:first-child)]:mt-2">
      Les informations collectées servent uniquement à :
    </Typography>
    <Typography variant="list" class="my-4">
      <li>Permettre l’accès sécurisé aux fonctionnalités du site</li>
      <li>Gérer et maintenir votre compte utilisateur</li>
    </Typography>
    <Typography class="[&:not(:first-child)]:mt-2">
      Aucune autre information n’est demandée ni stockée, et vos données ne sont jamais partagées ni
      vendues à des tiers.
    </Typography>

    <Typography variant="h2" class="mt-10"> Cookies </Typography>
    <Typography class="[&:not(:first-child)]:mt-2">
      Notre site utilise des cookies pour permettre une connexion sécurisée et maintenir la session
      utilisateur. Ces cookies sont nécessaires au bon fonctionnement du site et ne contiennent pas
      d’informations personnelles sensibles.
    </Typography>

    <Typography variant="h2" class="mt-10"> Suppression des Comptes </Typography>
    <Typography class="[&:not(:first-child)]:mt-2">
      Vous avez la possibilité de supprimer votre compte à tout moment depuis les paramètres de
      votre profil. La suppression de votre compte entraîne la suppression définitive de toutes les
      informations associées (nom d’utilisateur et identifiant unique).
    </Typography>

    <Typography variant="h2" class="mt-10"> Modifications de cette Politique </Typography>
    <Typography class="[&:not(:first-child)]:mt-2">
      Cette politique de confidentialité peut être mise à jour pour refléter les changements de nos
      pratiques ou des exigences légales.
    </Typography>
  </section>
</template>
<script setup lang="ts">
import PageBanner from '@/components/layout/PageBanner.vue'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Typography } from '@/components/ui/typography'
</script>
