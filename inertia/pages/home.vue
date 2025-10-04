<template>
  <PageBanner :bg-image="HomepageBanner" height="min-h-[50vh]">
    <div class="max-w-4xl mx-auto text-center">
      <h1 class="text-5xl md:text-6xl font-bold mb-6 font-serif">
        Bienvenue sur le site de
        <span class="text-gradient block">l'Archidiocèse de Los Santos</span>
      </h1>
      <p class="text-xl md:text-2xl mb-8 opacity-90">
        Rejoignez-nous dans la prière, la communion et le service au sein de l'Église catholique à
        Los Santos
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" class="bg-catholic-gold hover:bg-yellow-600 text-white" as-child>
          <Link route="find.events">
            <Calendar class="w-5 h-5 mr-2" />
            Prochains événements
          </Link>
        </Button>
        <Button
          variant="outline"
          size="lg"
          class="border-primary bg-primary text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground"
          as-child
        >
          <Link route="about-us"> Découvrir notre communauté </Link>
        </Button>
      </div>
    </div>

    <!--<template #corner>
      <h3 class="font-semibold mb-2">Prochaines Célébrations</h3>
      <div class="space-y-1 text-xs">
        <div>Messe de 18h - Cathédrale</div>
        <div>Vêpres - 19h30</div>
      </div>
    </template> -->
  </PageBanner>

  <section class="py-16 bg-gray-50">
    <div class="container max-w-7xl mx-auto px-4">
      <div class="grid md:grid-cols-3 gap-6">
        <!-- <Card class="text-center hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div
              class="size-12 bg-catholic-purple text-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Clock class="size-6" />
            </div>
            <h3 class="font-semibold mb-2">Horaires</h3>
            <p class="text-sm text-gray-600 mb-4">
              Consultez les horaires de messes et célébrations
            </p>
            <Button variant="outline" size="sm">Voir les horaires</Button>
          </CardContent>
        </Card> -->

        <Link route="archbishop.index" as-child>
          <Card class="text-center hover:shadow-lg transition-shadow">
            <CardContent class="p-6">
              <div
                class="size-12 bg-catholic-red rounded-full text-white text-2xl pb-1 flex items-center justify-center mx-auto mb-4"
              >
                ✠
              </div>
              <h3 class="font-semibold mb-2">Cardinal Ronan Callahan</h3>
              <p class="text-sm text-gray-600 mb-4">
                Notre Archevêque, Son Éminence le Cardinal Ronan Callahan
              </p>
              <Button variant="outline" size="sm">Découvrir</Button>
            </CardContent>
          </Card>
        </Link>

        <Link route="services.index" as-child>
          <Card class="text-center hover:shadow-lg transition-shadow">
            <CardContent class="p-6">
              <div
                class="size-12 bg-catholic-gold text-white rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Heart class="size-6" />
              </div>
              <h3 class="font-semibold mb-2">Sacrements</h3>
              <p class="text-sm text-gray-600 mb-4">
                Baptême, communion, mariage, confirmation, confession...
              </p>
              <Button variant="outline" size="sm">En savoir plus</Button>
            </CardContent>
          </Card>
        </Link>

        <Card class="text-center hover:shadow-lg transition-shadow">
          <CardContent class="p-6">
            <div
              class="size-12 bg-catholic-blue text-white rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <BookOpen class="size-6" />
            </div>
            <h3 class="font-semibold mb-2">Ressources</h3>
            <p class="text-sm text-gray-600 mb-4">Prières, méditations et enseignements</p>
            <Button variant="outline" size="sm">Explorer</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>

  <section class="py-16 bg-catholic-purple text-white">
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-6 font-serif">Rejoignez nos paroisses</h2>
      <p class="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
        Découvrez la richesse de notre foi et participez à la vie de notre communauté
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          size="lg"
          class="border-white hover:bg-white hover:text-catholic-purple"
        >
          <NotebookPen class="w-5 h-5 mr-2" />
          S'enregistrer comme paroissien
        </Button>
        <Link route="find.parishes" as-child>
          <Button size="lg" class="bg-catholic-gold hover:bg-yellow-600">
            <MapPin class="w-5 h-5 mr-2" />
            Trouver une paroisse
          </Button>
        </Link>
      </div>
    </div>
  </section>

  <section class="py-16">
    <div class="container mx-auto max-w-7xl px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-catholic-purple mb-4 font-serif">
          Actualités de l'Archidiocèse
        </h2>
        <div class="w-24 h-1 bg-catholic-gold mx-auto cross-divider"></div>
      </div>

      <WhenVisible data="posts">
        <template #fallback>
          <div class="grid md:grid-cols-3 gap-8 items-stretch">
            <div v-for="() of Array.from({ length: 3 })" class="flex flex-col space-y-3 h-full">
              <Skeleton class="h-[400px] w-full rounded-xl" />
              <div class="space-y-2">
                <Skeleton class="h-4 w-w-full" />
                <Skeleton class="h-4 w-full" />
              </div>
            </div>
          </div>

          <div class="flex justify-center mt-8">
            <Skeleton class="h-10 w-[212px]" />
          </div>
        </template>
        <Alert v-if="errors.E_HOME_RECENT_POSTS" variant="destructive">
          <CircleAlert />
          <AlertDescription>{{ errors.E_HOME_RECENT_POSTS }}</AlertDescription>
        </Alert>

        <div v-else-if="props.posts?.length === 0" class="italic text-center">
          Aucun article pour le moment !
        </div>

        <div v-else class="grid md:grid-cols-3 gap-8 items-stretch">
          <Link
            v-for="post in props.posts"
            route="news.single"
            :params="{ slug: post.slug }"
            :key="`home-recent-post-${post.id}`"
            as-child
          >
            <Card class="card-hover h-full pt-0">
              <div class="aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <div
                  v-if="post.coverImageUrl"
                  class="w-full h-full bg-cover bg-center"
                  :style="`background-image: url(${post.coverImageUrl})`"
                ></div>
                <div
                  v-else
                  class="w-full h-full bg-gradient-to-br from-catholic-purple to-catholic-blue opacity-20"
                ></div>
              </div>
              <CardContent class="p-6">
                <span
                  v-if="post.publishedAt"
                  class="flex justify-end text-sm text-muted-foreground"
                >
                  {{ formatDate(new Date(post.publishedAt), 'DD/MM/YYYY') }}
                </span>
                <Badge class="mb-2">{{ post.category }}</Badge>
                <h3 class="font-bold text-lg mb-2">{{ post.title }}</h3>

                <p class="text-gray-600 mb-4 mt-4 text-sm">
                  {{ post.excerpt }}
                </p>

                <Button variant="link" class="p-0 text-catholic-gold">
                  Lire la suite <ArrowRight class="w-4 h-4 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </WhenVisible>

      <div v-if="props.posts?.length > 0" class="text-center mt-8">
        <Link route="news.index" as-child>
          <Button variant="default" size="lg" class="cursor-pointer">
            Voir toutes les actualités
          </Button>
        </Link>
      </div>
    </div>
  </section>

  <!-- <section class="py-16">
    <div class="container mx-auto px-4">
      <div class="max-w-4xl mx-auto">
        <Card class="overflow-hidden">
          <div class="md:flex">
            <div class="md:w-1/3">
              <div
                class="aspect-square bg-gradient-to-br from-catholic-gold/20 to-catholic-purple/20 md:h-full flex items-center justify-center"
              >
                <div class="w-32 h-32 bg-white/50 rounded-full flex items-center justify-center">
                  <span class="text-4xl">👨‍💼</span>
                </div>
              </div>
            </div>
            <CardContent class="md:w-2/3 p-8">
              <Badge class="mb-4">Message de l'Archevêque</Badge>
              <h3 class="text-2xl font-bold mb-4 text-catholic-purple font-serif">
                Cardinal Ronan Callahan
              </h3>
              <p class="text-gray-600 mb-6 leading-relaxed">
                "Chers frères et sœurs en Christ, c'est avec une joie immense que je vous accueille
                sur le site de notre Archidiocèse. Que cette plateforme soit pour vous un lieu de
                rencontre, de prière et de communion fraternelle."
              </p>
              <Button variant="outline">
                Lire le message complet
                <ArrowRight class="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  </section> -->

  <section class="py-16 bg-catholic-gold text-white">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-8 text-center">
        <div class="space-y-2">
          <div class="text-4xl font-bold text-green-700">288</div>
          <div class="text-sm text-gray-900 font-medium uppercase tracking-wide">Paroisses</div>
        </div>
        <div class="space-y-2">
          <div class="text-4xl font-bold text-catholic-purple">42</div>
          <div class="text-sm text-gray-900 font-medium uppercase tracking-wide">
            langues différentes
          </div>
        </div>
        <div class="space-y-2">
          <div class="text-4xl font-bold text-catholic-red">{{ nbOfFaithful }}</div>
          <div class="text-sm text-gray-900 font-medium uppercase tracking-wide">Catholiques</div>
        </div>
        <div class="space-y-2">
          <div class="text-4xl font-bold text-catholic-blue">{{ yearsOfHistory }}</div>
          <div class="text-sm text-gray-900 font-medium uppercase tracking-wide">
            Ans d'histoire
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- <section class="py-16 bg-gray-50">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold text-catholic-purple mb-8 font-serif">Prière du Jour</h2>
        <Card class="p-8">
          <CardContent class="space-y-4">
            <div class="text-6xl text-catholic-gold mb-4">✠</div>
            <blockquote class="text-lg italic text-gray-700 font-serif leading-relaxed">
              "Seigneur, accorde-nous la grâce de Te chercher de tout notre cœur, et de Te trouver
              dans le silence de la prière et la joie du partage fraternel."
            </blockquote>
            <footer class="text-sm text-gray-500 mt-4">— Prière pour l'unité de l'Église</footer>
          </CardContent>
        </Card>
      </div>
    </div>
  </section> --->

  <!-- <section class="py-16 bg-catholic-gold text-white">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4 font-serif">Restez Connecté</h2>
        <p class="text-lg mb-8 opacity-90">Recevez nos actualités et méditations quotidiennes</p>
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Votre adresse email"
            class="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <Button class="bg-white text-catholic-gold hover:bg-gray-100">
            <Mail class="w-4 h-4 mr-2" />
            S'abonner
          </Button>
        </div>
      </div>
    </div>
  </section> -->
</template>

<script setup lang="ts">
import { WhenVisible } from '@inertiajs/vue3'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CircleAlert,
  Heart,
  MapPin,
  NotebookPen,
} from 'lucide-vue-next'
import { formatNumber, yearsBetween } from '@/lib/utils'
import { ARCHDIOCESAN_HISTORY_START_DATE } from '@/constants/archdiocese.constants'
import { computed } from 'vue'
import HomepageBanner from '@/assets/images/cathedral-mass-with-cardinal.png'
import PageBanner from '@/components/layout/PageBanner.vue'
import { Link } from '@tuyau/inertia/vue'
import { useErrors } from '@/composables/use_errors'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@vueuse/core'

type Post = {
  id: number
  slug: string
  title: string
  excerpt?: string
  coverImageUrl?: string
  category?: string
  publishedAt?: string
}

type Props = {
  posts?: Post[]
}

const props = withDefaults(defineProps<Props>(), {
  posts: () => [] as Post[],
})

const errors = useErrors()

const now = new Date()

const yearsOfHistory = computed(() => yearsBetween(ARCHDIOCESAN_HISTORY_START_DATE, now))

const nbOfFaithful = formatNumber(4349267)
</script>
