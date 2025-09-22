<template>
  <ServiceLayout serviceId="christianInitiation">
    <Typography>L'initiation chrétienne est un parcours en trois sacrements :</Typography>
    <Typography variant="list">
      <li>Le baptême, par lequel on devient chrétien et accède aux sacrements.</li>
      <li>
        La première communion, par laquelle on reçoit le Corps et le Sang du Christ pour la première
        fois.
      </li>
      <li>
        La confirmation, par laquelle, l'âge de la raison atteint, on reçoit l'Esprit Saint par
        l'imposition des mains de l'Archevêque.
      </li>
    </Typography>

    <Typography class="italic">
      L'Église catholique recommande très fortement de baptiser son enfant le plus tôt après sa
      naissance.
    </Typography>

    <Typography variant="h2" class="mt-10">Le baptême</Typography>
    <Typography variant="list">
      <li>
        Tout le monde peut se faire baptiser, enfant ou adulte. Il n'y a aucun âge minimum ou
        maximum.
      </li>
      <li>
        Au-delà de 7 ans, début de l'âge de la raison, il est nécessaire de consentir et de désirer
        le baptême.
      </li>
      <li>
        En dessous de 7 ans, ce sont les parents qui demandent le baptême pour leur enfant. Ils
        doivent s'engager à l'éduquer dans la foi catholique.
      </li>
      <li>
        Choisissez un parrain ou une marraine baptisée et de foi catholique. Le parrain/marraine
        doit être âgé d'au moins 16 ans, excepté dérogation.
      </li>
    </Typography>

    <Typography>
      Les personnes âgées de 12 ans et + reçoivent le baptême, la confirmation et la première
      communion au cours de la même célébration.
    </Typography>

    <Typography>
      Pour demander le baptême pour votre enfant ou vous-même, contactez l'archidiocèse.
    </Typography>

    <Typography variant="h2" class="mt-10">La première communion</Typography>
    <Typography variant="list">
      <li>Être baptisé et ne pas déjà avoir célébré sa première communion</li>
      <li>Être âgé d'au moins 8 ans</li>
    </Typography>
    <Typography>
      Si l'enfant ou l'adulte est âgé de plus de 12 ans, il peut recevoir la confirmation en même
      temps que la première communion.
    </Typography>
    <Typography>
      Pour célébrer votre première communion au Corps et au Sang du Christ, contactez l'archidiocèse
    </Typography>

    <Typography variant="h2" class="mt-10">La confirmation</Typography>
    <Typography variant="list">
      <li>
        Vous devez être baptisé, n'avoir jamais reçu la confirmation et avoir reçu votre première
        communion
      </li>
      <li>Vous devez être âgé d'au moins 12 ans.</li>
      <li>
        La confirmation nécessite un consentement, il n'est pas du ressort des parents. Vous devez
        désirer confirmer votre foi catholique.
      </li>
      <li>
        Désignez un parrain ou une marraine de confirmation, qui est baptisé et confirmé et de foi
        catholique. Le parrain/marraine doit être âgé d'au moins 16 ans, sauf dérogation.
      </li>
    </Typography>
    <Typography>
      Pour demander à recevoir le sacrement de la confirmation, contactez l'archidiocèse.
    </Typography>
  </ServiceLayout>
</template>
<script lang="ts" setup>
import ServiceLayout from '@/pages/services/ServiceLayout.vue'
import { Typography } from '@/components/ui/typography'
</script>
