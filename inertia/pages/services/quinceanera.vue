<template>
  <ServiceLayout serviceId="quinceanera">
    <Typography>
      La <strong>Quinceañera</strong> est une célébration traditionnelle et une action de grâce à
      l'occasion du 15e anniversaire d'une jeune femme hispanique. A la demande de la famille, une
      messe ou un rite de bénédiction est célébré pour souligner son passage à la vie adulte.
    </Typography>

    <Typography variant="h2" class="mt-10"> Conditions </Typography>
    <Typography variant="list">
      <li>La jeune fille doit avoir atteint l'âge de <strong>15 ans</strong></li>
      <li>
        La jeune fille doit avoir
        <strong>reçu tous ses sacrements de l'initiation chrétienne</strong> : baptême, première
        communion et confirmation
      </li>
      <li>
        La famille doit être <strong>enregistrée comme paroissiens</strong>. Nous ne célébrons pas
        les Quinceañera des non-paroissiens.
      </li>
      <li>La famille doit avoir versé son offrande avant la célébration (voir grille tarifaire)</li>
    </Typography>

    <Typography variant="h2" class="mt-10"> Escorte de la Quinceañera </Typography>
    <Typography variant="list">
      <li>Les parents accompagnent la Quinceañera au début de la célébration</li>
      <li>Les <em>damas y chambelanes</em> (accompagnateurs)</li>
      <li>
        Les <em>Padrinos/Madrinas</em> (parrains/marraines) auront la charge d'apporter les cadeaux
        (religieux) qui seront remis à la jeune fille
      </li>
      <li>Les grands-parents</li>
      <li><em>Compañeros de Fe</em> (compagnons de foi)</li>
    </Typography>

    <Typography variant="h2" class="mt-10"> Langue </Typography>
    <Typography>La Quinceañera peut être célébrée en anglais ou en espagnol.</Typography>
  </ServiceLayout>
</template>
<script lang="ts" setup>
import { Typography } from '@/components/ui/typography'
import ServiceLayout from '@/pages/services/ServiceLayout.vue'
</script>
