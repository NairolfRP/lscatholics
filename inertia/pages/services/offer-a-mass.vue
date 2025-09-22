<template>
  <ServiceLayout serviceId="requestMass">
    <Typography variant="h2">
      Conditions pour demander une messe à une intention particulière
    </Typography>
    <Typography variant="list">
      <li>Il est recommandé d'être baptisé, ou au moins d'avoir la foi</li>
      <li>Déposer une offrande égale ou supérieure au prix fixé sur la grille tarifaire</li>
    </Typography>

    <Typography variant="h2">Comment demander une messe à une intention particulière ?</Typography>
    <Typography>
      Déposez votre offrande et indiquez votre intention particulière à l'archidiocèse. Un prêtre
      vous informera ultérieurement quand et où cette messe sera célébrée.
    </Typography>
    <Typography>
      Au début de la liturgie, le prêtre annoncera à quelle intention la messe est dite.
    </Typography>
  </ServiceLayout>
</template>
<script lang="ts" setup>
import ServiceLayout from '@/pages/services/ServiceLayout.vue'
import { Typography } from '@/components/ui/typography'
</script>
