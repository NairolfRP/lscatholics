<template>
  <Head title="Événements" />

  <PageBanner bg-color="bg-linear-to-r from-catholic-blue to-catholic-gold" py="16">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">Événements</h1>
    <p class="text-xl opacity-90">
      Participez à la vie spirituelle et communautaire de notre archidiocèse
    </p>
  </PageBanner>

  <section class="py-16">
    <div class="container max-w-7xl mx-auto px-4">
      <Typography
        variant="h2"
        class="border-none text-3xl font-bold text-catholic-purple mb-8 text-center font-serif"
      >
        Événements à venir
      </Typography>

      <div v-if="error" class="max-w-4xl mx-auto px-3">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Impossible de charger les événements</AlertTitle>
          <AlertDescription>
            Nous n'avons pas pu récupérer les événements à venir. Cela peut être dû à un problème
            serveur ou réseau. Réessayez plus tard.
          </AlertDescription>
        </Alert>
      </div>
      <div
        v-else-if="!events || events.length === 0"
        class="w-full text-center mx-auto font-medium italic"
      >
        Aucun événement à venir
      </div>
      <div v-else class="space-y-6">
        <Link
          v-for="event in events"
          :key="event.id"
          route="event"
          :params="{ slug: event.slug }"
          as-child
        >
          <Card
            class="card-hover cursor-pointer overflow-hidden hover:shadow-lg transition-shadow p-0"
          >
            <div class="md:flex">
              <div class="md:w-1/3">
                <div
                  v-if="event.coverImageUrl"
                  class="aspect-video md:aspect-square md:h-full bg-cover bg-center"
                  :style="`background-image: url(${event.coverImageUrl})`"
                ></div>
                <div v-else class="aspect-video md:aspect-square bg-gray-200 md:h-full"></div>
              </div>
              <CardContent class="md:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <div class="flex items-center gap-4 mb-4">
                    <div v-if="event.startDate" class="text-center">
                      <div class="text-2xl font-bold text-catholic-gold">
                        {{ formatDay(new Date(event.startDate)) }}
                      </div>
                      <div class="text-sm text-gray-600">
                        {{ formatMonth(new Date(event.startDate)) }}
                      </div>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-catholic-purple mb-1">
                        {{ event.title }}
                      </h3>
                      <div class="flex items-center gap-4 text-sm text-gray-600">
                        <div v-if="event.startDate" class="flex items-center gap-1">
                          <Clock class="w-4 h-4" />
                          {{ formatTime(new Date(event.startDate)) }}
                        </div>
                        <div v-if="event.location" class="flex items-center gap-1">
                          <MapPin class="w-4 h-4" />
                          {{ event.location }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p class="text-gray-700 mb-4 leading-relaxed">
                    {{ event.description }}
                  </p>
                </div>

                <div class="flex items-center justify-between">
                  <div class="flex gap-2">
                    <Badge v-if="event.registrationRequired" variant="secondary">
                      Inscription requise
                    </Badge>
                    <Badge v-if="event.maxParticipants" variant="outline"> Places limitées </Badge>
                  </div>
                  <Button>
                    En savoir plus
                    <ArrowRight class="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import Head from '@/shared/components/AppHead.vue'
import { Link } from '@adonisjs/inertia/vue'
import { ArrowRight, CircleAlert, Clock, MapPin } from 'lucide-vue-next'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { Typography } from '@/shared/components/ui/typography'
import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  events: Data.Event.Variants['publicList'][]
  error: boolean
}>

const { events } = defineProps<PageProps>()

const formatDay = (date: Date): string => {
  return date.getDate().toString()
}

const formatMonth = (date: Date): string => {
  return date.toLocaleDateString('fr-FR', { month: 'short' })
}

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
