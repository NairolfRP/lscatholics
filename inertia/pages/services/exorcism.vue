<template>
  <ServiceLayout serviceId="exorcism">
    <Typography>
      Le Service Archidiocésain de l'Exorcisme, de la Délivrance et de la Compassion accueille et
      accompagne toute personne en souffrance ou se pensant sous l'influence ou l'emprise des forces
      du Mal.
    </Typography>
    <Typography>
      Un rendez-vous avec le prêtre exorciste permet de discerner, écarter la question de l'emprise
      démoniaque et prier avec compassion.
    </Typography>

    <Typography variant="h2" class="mt-10">
      Conditions pour être reçu par un prêtre exorciste
    </Typography>
    <Typography variant="list">
      <li>Toute personne, baptisée ou non, peut être entendue et reçue par le prêtre exorciste</li>
    </Typography>

    <Typography variant="h2" class="mt-10"> Un non-baptisé peut-il être exorcisé ? </Typography>
    <Typography>
      Le rite du grand exorcisme n'est pratiqué que sur des personnes baptisées, car le baptême est
      le premier de tous les exorcismes. Le non-baptisé sera d'abord invité à se convertir et à se
      faire baptiser, puis, seulement si le baptême ne guérit pas l'emprise, le rite d'exorcisme
      sera pratiqué.
    </Typography>

    <Typography variant="h2" class="mt-15 uppercase text-xl italic text-foreground/70">
      (( A LIRE - AVERTISSEMENT HORS ROLEPLAY))
    </Typography>
    <Typography variant="muted" class="pt-5">
      (( La pratique IRL du grand exorcisme est d'une <strong>extrême rareté</strong>. Et encore
      moins si la maladie mentale ou physique n'a pas D’ABORD été écartée par des professionnels de
      la santé. La plupart des cas reçus par les exorcistes sont des personnes en souffrance qui
      viennent écarter la question démoniaque, ou des personnes avec des problèmes de santé mentale
      qui seront tout le temps redirigées vers des professionnels de santé.
    </Typography>

    <Typography variant="muted" class="pt-5 font-bold">
      Tout troll, toute exagération et toute action surnaturelle (léviter (oui quelqu'un l'a déjà
      fait en jeu.... !), changer sa voix etc.) sera refusée et ignorée en jeu.
    </Typography>

    <Typography variant="muted" class="pt-5">
      Nous testons de proposer ce service car il peut potentiellement apporter des scènes
      intéressantes, mais s'il y a trop d'abus, nous le fermerons et ne le jouerons plus. ))
    </Typography>
  </ServiceLayout>
</template>
<script lang="ts" setup>
import { Typography } from '@/shared/components/ui/typography'
import ServiceLayout from '@/pages/services/ServiceLayout.vue'
</script>
