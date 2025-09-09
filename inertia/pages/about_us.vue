<template>
  <Head title="À propos" />

  <PageBanner bg-color="hero-gradient" :bg-image="BannerImage" class="relative" py="24">
    <div class="relative z-10">
      <h1 class="text-5xl md:text-6xl font-bold mb-6 font-serif">
        <span class="text-gradient">Nous Sommes</span><br />
        Une Famille de Familles
      </h1>
      <p class="text-xl md:text-2xl opacity-90 leading-relaxed">
        Nous sommes quatre millions de catholiques. Nous sommes une Cité de Saints. Nous sommes le
        Peuple de Dieu de l'Archidiocèse de Los Santos.
      </p>
    </div>

    <div class="absolute -bottom-15 left-1/2 transform -translate-x-1/2">
      <ChevronDown class="w-6 h-6 animate-bounce" />
    </div>
  </PageBanner>

  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-catholic-purple mb-6 font-serif">Notre Mission</h2>
          <div class="w-24 h-1 bg-catholic-gold mx-auto cross-divider mb-8"></div>
        </div>

        <div class="prose prose-lg max-w-none text-justify">
          <Typography>
            Nous, le Peuple de Dieu de l'Archidiocèse de Los Santos, recevons notre mission de
            poursuivre l'oeuvre rédemptrice de Jésus-Christ. Baptisés dans le Corps du Christ,
            confirmés dans l'Esprit Saint, nourris par la Parole et l'Eucharistie, nous partageons
            la mission du Christ, comme prêtres, prophètes et rois-serviteurs. Nous formons un seul
            corps avec l'Église catholique à travers le monde, en communion avec le Pape.
          </Typography>

          <Typography>
            Sous l'autorité pastorale de notre
            <Link route="archbishop.index" class="underline text-primary">Archevêque</Link>, nous
            collaborons ensemble pour vivre et annoncer l'Évangile. Le Christ a proclamé le règne de
            Dieu. Nous sommes appelés à en être les instruments dans le monde. Nous nous engageons à
            bâtir une communauté de foi et d'amour. Avec le Christ, nous portons la Bonne Nouvelle
            aux pauvres. Nous nous engageons à combattre toutes les formes de pauvreté présentes
            parmi nous — spirituelles, économiques et morales. Avec le Christ, nous défendons la
            dignité de toute vie humaine. Nous nous engageons à respecter chaque personne et à être
            des intendants fidèles de la création de Dieu. Avec le Christ, nous affirmons les liens
            qui nous unissent. Nous nous engageons à abattre les murs qui divisent. Nous consacrons
            nos paroisses, nos écoles, nos institutions, nos services et nos organisations à cette
            mission, sous la tendre protection de Marie, Reine des Saints.
          </Typography>
        </div>
      </div>
    </div>
  </section>

  <section class="py-15">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-primary mb-6 font-serif">Notre Histoire</h2>
          <div class="w-24 h-1 bg-catholic-gold mx-auto cross-divider mb-8"></div>
        </div>

        <div class="prose prose-lg max-w-none text-justify">
          <Typography>
            La première église de Haute-Andreas se composait de 21 missions, trois pueblos, quatre
            presidios et plusieurs asistencias. Chacun de ces lieux répondait à un plan précis. On
            peut retrouver ces fondations, au nord et au sud, le long de l'El Camino Real.
          </Typography>

          <Typography>
            L'Église de Notre Dame, la Reine des Saints, aussi connue sous le nom de La Placita, fut
            construite en 1814. C'est la première église de la ville de Los Santos, dont le nom
            abrégé provient du nom complet de la ville : El Pueblo de Nuestra Señora la Reina de los
            Santos (« Le Village de Notre-Dame, la Reine des Saints »). Si La Placita est la
            première église bâtie à Los Santos, la mission San Gabriel, érigée en 1771, fut la
            première église de notre Archidiocèse, avant même à la naissance de notre pays. Cette
            mission abrita le récemment canonisé saint Junìpero Serra, un missionnaire franciscain
            espagnol, qui a taversé le Mexique pour rejoindre San Andreas. L'influence franciscaine
            se perçoit encore aujourd'hui dans les noms de nombreuses rues, villes et quartiers de
            notre archidiocèse.
          </Typography>

          <Typography>
            Sur le plan spirituel, saint Junìpero est reconnu comme l'un des fondateurs de notre
            Église à Los Santos, dans notre État et même dans notre pays. Il commença son oeuvre
            missionnaire à Mexico où il rendit visite à la relique de la Tilma de Notre-Dame de
            Guadalupe, patronne des Amériques. Nous avons la grâce immense de puvoir vénérer
            Notre-Dame, tout comme saint Junìpero, devant une des reliques de la Tilma précieusement
            conservée dans l'une des chapelles latérales de la Cathédrale Notre-Dame-des-Saints.
          </Typography>

          <Typography>
            Aujourd'hui, l'Archidiocèse de Los Santos comprend trois comtés situés au sud de San
            Andreas : Los Santos, Ventura et Santa Barbara. Son territoire s'étend de la limite du
            nord du comté de Santa Barbara, près de Maria, jusqu'à la limite sud de l'île du comté
            de Los Santos. Il couvre une superficie de 22 430 km². En 2005, la population catholique
            s'élevait à 4 349 267 fidèles sur un total de 11 258 600 habitants. L'archidiocèse
            compte 288 paroisses réparties dans 120 villes.
          </Typography>

          <Typography>
            Il y a également 30 missions et chapelles, ainsi que 16 églises catholiques de rite
            oriental. Au total, l'Archidiocèse dispose de 214 écoles primaires et 51 lycées
            catholiques, le plus vaste réseau scolaire de l'État de San Andreas. Dans ce contexte
            culturellement très diversifié, des services éthniques sont proposés à 72 communautés
            différentes. Cela inclut l'accompagnement clrical, la liturgie, les services sociaux,
            des ressources, des conseils et des initiatives culturelles.
          </Typography>
        </div>
      </div>
    </div>
  </section>

  <section
    class="relative py-20 bg-gray-50 bg-cover bg-center h-100 text-white"
    :style="`background-image: url(${VolunteerImage})`"
  >
    <div class="absolute inset-0 bg-black/60"></div>
    <div class="container relative z-10 mx-auto px-4">
      <div class="max-w-6xl mx-auto space-y-5">
        <Typography variant="h2" class="border-none pb-0 text-5xl text-catholic-gold font-bold">
          Notre impact
        </Typography>
        <Typography>
          Avec Catholic Charities, nous venons en aide à des millions d'enfants, de personnes âgées,
          de familles, d'hommes et de femmes, de migrants, de sans-abri et autres populations
          vulnérables, dans les comtés de Los Santos, de Ventura et de Santa Babara.
        </Typography>
        <Button variant="warning" size="lg" class="cursor-pointer">
          <ArrowRight /> Devenez bénévole
        </Button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Link } from '@tuyau/inertia/vue'
import VolunteerImage from '@/assets/images/thanksgiving2024.png'
import { ChevronDown, ArrowRight } from 'lucide-vue-next'
import PageBanner from '@/components/layout/PageBanner.vue'
import BannerImage from '@/assets/images/olacathedral-cross.png'
import { Typography } from '@/components/ui/typography'
</script>
