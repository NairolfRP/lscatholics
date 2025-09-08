<template>
  <Head title="Cardinal Callahan" />

  <PageBanner bg-color="bg-catholic-red" py="24">
    <h1 class="text-5xl md:text-6xl mb-4 font-bold font-serif">Cardinal Callahan</h1>
    <p class="text-lg md:text-xl text-white/80 opacity-90 leading-relaxed italic">
      Cardinal de l'Église catholique et 7e archevêque de Los Santos
    </p>
  </PageBanner>

  <div class="py-20">
    <div class="container flex flex-col gap-15 max-w-7xl mx-auto px-4">
      <section>
        <h2
          class="scroll-m-20 pb-10 text-4xl font-bold tracking-tight transition-colors first:mt-0"
        >
          Son Éminence, le cardinal Ronan Callahan, archevêque de Los Santos
        </h2>

        <div class="flex flex-col md:flex-row gap-5">
          <div class="flex flex-col space-y-5 md:w-80 md:flex-shrink-0 items-center md:items-start">
            <img
              :src="ArchbishopPortrait"
              alt="Portrait officiel du Cardinal Callahan"
              class="max-h-110 mx-auto object-contain"
            />

            <a
              href="https://facebrowser.gta.world/CardinalCallahan"
              target="_blank"
              class="mx-auto w-auto"
            >
              <Button class="bg-[#D15454] hover:bg-[#D15454]/90 cursor-pointer w-full">
                <Facebrower />
                Cardinal Callahan sur Facebrowser
              </Button>
            </a>
          </div>

          <div class="flex-1">
            <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
              Le cardinal Ronan Callahan a été nommé 7e archevêque de Los Santos le 22 février 2025
              par le pape François. Né le 26 janvier 1960 à Worcester dans le Massachusetts, il est
              le deuxième enfant de l'union de Seamus (1936-2005) et Bridget (1938-2015) Callahan,
              une famille irlandais-américaine immigrée dans l'est des États-Unis depuis le 19e
              siècle.
            </p>

            <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
              Il commence ses études à l'école élémentaire catholique de la Sainte Famille (Holy
              Family Academy) de Gardner (Massachusetts), puis poursuit au lycée de Saint Jean (St
              John's High School) à Shrewsbury (Massachusetts) avant d'entrer au Séminaire Saint
              Jean à Boston et poursuivre ses études en vue d'être prêtre au Collège pontifical
              nord-américain à Rome.
            </p>

            <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
              Il est ordonné prêtre en 1987 pour l'archidiocèse de Los Santos. Il est vicaire de
              paroisse de 1987 à 1989, puis curé d'une paroisse de 1989 à 1995. De 1995 à 2002, il
              est professeur au Séminaire Saint Jean à Boston.
            </p>

            <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
              En 2002, il est nommé évêque auxiliaire de l'archidiocèse de Boston par le pape saint
              Jean-Paul II et reçoit la consécration épiscopale des mains du cardinal Bernard Law.
              En 2011, le pape Benoit XVI le nomme évêque de Bridport (Connecticut), puis en 2018,
              le pape François le transfert en Ohio comme Archevêque de Cincinnati.
            </p>

            <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
              Lors du consistoire du 29 juin 2018, Sa Sainteté le Pape François le créé cardinal. A
              Rome, il est actuellement membre du Dicastère pour l'Évangélisation et du Dicastère
              pour la Culture et l'Éducation.
            </p>

            <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
              En mai 2025, il participe au conclave qui élit le pape Léon XIV.
            </p>

            <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
              Sa devise épiscopale est « Qui est semblable au Seigneur notre Dieu ? » (Ps 113:5)
            </p>
          </div>
        </div>
      </section>

      <section>
        <h3
          class="uppercase scroll-m-20 border-b border-[#D15454] mb-10 text-3xl font-bold tracking-tight transition-colors first:mt-0"
        >
          Armoiries
        </h3>

        <img
          :src="CoatOfArms"
          alt="Armoiries du Cardinal Callahan"
          class="md:float-right max-h-90 md:max-h-70 mx-auto md:mx-0"
        />

        <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
          Comme le veut la tradition héraldique de l’Église, les armoiries d’un archevêque se
          composent de deux parties :
        </p>
        <ul class="ml-6 list-disc [&>li]:mt-2">
          <li>
            d’une part, les <strong>armes de l’archidiocèse de Los Santos</strong>, qui apparaissent
            à dextre (côté gauche pour le spectateur) ;
          </li>
          <li>
            d’autre part, les <strong>armes personnelles du prélat</strong>, qui figurent à senestre
            (côté droit pour le spectateur).
          </li>
        </ul>
        <p class="text-justify leading-7 [&:not(:first-child)]:mt-4 mb-6">
          Ce parti d’écu exprime l’union spirituelle et pastorale entre l’évêque et l’Église locale
          confiée à sa sollicitude.
        </p>

        <ul class="ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>À dextre :</strong> sur fond d’azur, trois paires d’ailes d’or, chacune
            accompagnée d’une rose stylisée. Ces insignes représentent l’Archidiocèse de Los Santos.
            Les ailes évoquent le nom de la cité placée sous le patronage des anges, tandis que les
            roses rappellent la tradition spirituelle et mariale propre à la région.
          </li>
          <li>
            <strong>À senestre :</strong> sur fond de sinople, une harpe d’or, un croissant d’argent
            et un aigle de gueules. Ces armoiries personnelles expriment l’identité du Cardinal : la
            harpe souligne son héritage irlandais, le croissant d’argent rappelle l’Immaculée
            Conception, patronne des États-Unis, et l’aigle rouge symbolise les origines américaines
            de sa famille dans l’Est du pays.
          </li>
        </ul>

        <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
          Les ornements qui entourent l’écu sont ceux réservés aux cardinaux de la Sainte Église
          romaine :
        </p>
        <ul class="ml-6 list-disc [&>li]:mt-2">
          <li>
            le <strong>chapeau galero de gueules</strong>, orné de quinze houppes de chaque côté ;
          </li>
          <li>
            la <strong>croix archiépiscopale à double traverse</strong>, signe de sa dignité
            métropolitaine.
          </li>
        </ul>

        <p class="text-justify leading-7 [&:not(:first-child)]:mt-6">
          Au bas de l’écu, un listel d’argent porte la devise de Son Éminence :
          <em>« Quis ut Deus »</em> (« Qui est semblable au Seigneur notre Dieu ? »), tirée du
          Psaume 112:5.
        </p>

        <div class="clear-both"></div>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import PageBanner from '@/components/layout/PageBanner.vue'
import ArchbishopPortrait from '@/assets/images/cardinal_callahan_officiel_portrait.png'
import { Button } from '@/components/ui/button'
import Facebrower from '@/components/svg/Facebrower.vue'
import CoatOfArms from '@/assets/images/cardinal_callahan_armoiries.png'
</script>
