<template>
  <ServiceLayout serviceId="confession">
    <Typography>
      La confession est une étape répétée et indispensable de la vie du chrétien, qui en toute
      humilité confesse ses fautes puis demande et reçoit l'absolution de ses péchés et le pardon de
      Dieu.
    </Typography>
    <Typography variant="h2" class="mt-10"> Conditions pour se confesser </Typography>
    <Typography variant="list">
      <li>Le pénitent doit être baptisé</li>
      <li>Le pénitent doit regretter ses péchés</li>
    </Typography>
    <Typography>
      La confession étant un sacrement, le non-baptisé ne peut pas recevoir l'absolution des péchés.
      Il peut néanmoins demander à rencontrer un prêtre pour trouver en lui une oreille attentive et
      des conseils.
    </Typography>

    <Typography variant="h2" class="mt-10">Le secret de la confession</Typography>
    <Typography>
      Le secret sacramentel de la confession est inviolable, quel qu’en soit la raison. Le prêtre
      est tenu à ce secret, même devant les autorités publiques, sous peine d'excommunication.
    </Typography>

    <Typography variant="h2" class="mt-10">Déroulement d'une confession</Typography>
    <Typography variant="list">
      <li>
        Vous pouvez commencer par dire
        <span class="font-medium italic">« Bénissez-moi mon père, parce que j'ai péché »</span>.
      </li>
      <li>Le prêtre vous bénit et dit une phrase d'accueil.</li>
      <li>
        Vous pouvez, facultativement, dire depuis combien de temps vous ne vous êtes pas confessé.
      </li>
      <li>
        Listez tous vos péchés, même les plus petits, contre Dieu, contre vous-même et contre votre
        prochain. Le prêtre n'a pas besoin de savoir tous les détails, simplement ce qu'il faut pour
        qu'il puisse comprendre la nature du péché.
      </li>
      <li>Le prêtre peut vous poser des questions, amorcer un dialogue et donner des conseils.</li>
      <li>
        Le prêtre vous propose un acte de pénitence à réaliser après la confession pour assurer la
        réparation du péché et prouver votre bonne volonté.
      </li>
      <li>
        Le prêtre récite enfin les paroles d'absolution des péchés, c'est-à-dire le pardon de Dieu
        et la remise à zéro de tous vos péchés.
      </li>
    </Typography>

    <Typography variant="h2" class="mt-10">Comment se confesser ?</Typography>
    <Typography> Contactez l'archidiocèse ou demandez directement à un prêtre. </Typography>
  </ServiceLayout>
</template>
<script lang="ts" setup>
import { Typography } from '@/shared/components/ui/typography'
import ServiceLayout from '@/pages/services/ServiceLayout.vue'
</script>
