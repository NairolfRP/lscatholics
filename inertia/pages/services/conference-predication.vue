<template>
  <ServiceLayout serviceId="conference">
    <Typography>
      L'Église se donne pour rôle d'éveiller les consciences et de donner des pistes de réflexions
      sur notre société, sur la morale, sur nos relations entre humains et exerce son rôle
      d'enseignement de la foi.
    </Typography>
    <Typography>
      Vous pouvez inviter l'archevêque, un prêtre, un diacre ou un religieux à venir tenir une
      conférence ou une prédication sur un thème.
    </Typography>

    <Typography variant="h2" class="mt-10"> Conditions </Typography>
    <Typography variant="list">
      <li>
        Il n'y a aucune condition, sauf celle de couvrir les frais associés (déplacement, repas,
        hébergement, ...). Voir aussi la grille tarifaire.
      </li>
      <li>
        Ces demandes nécessitent un traitement préalable et, si acceptée, une préparation. Envisagez
        de soumettre votre demande au moins deux semaines avant la date envisagée.
      </li>
    </Typography>
  </ServiceLayout>
</template>
<script lang="ts" setup>
import { Typography } from '@/components/ui/typography'
import ServiceLayout from '@/pages/services/ServiceLayout.vue'
</script>
