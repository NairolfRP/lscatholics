<template>
  <Head title="Nos Paroisses" />

  <PageBanner bg-color="bg-gradient-to-r from-catholic-purple to-catholic-blue" py="16">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">Nos Paroisses</h1>
    <p class="text-xl opacity-90">
      Découvrez les communautés de foi qui composent notre archidiocèse
    </p>
  </PageBanner>

  <section class="py-16">
    <div class="container max-w-7xl mx-auto px-4">
      <h2
        class="scroll-m-20 border-b pb-10 text-3xl text-catholic-purple font-bold tracking-tight transition-colors first:mt-0"
      >
        Doyenné Notre-Dame-des-Saints
      </h2>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card v-for="parish in parishes" :key="parish.id" class="card-hover pt-0">
          <div
            v-if="parish.image"
            class="aspect-video bg-cover bg-center"
            :style="`background-image: url(${parish.image})`"
          ></div>
          <div v-else class="aspect-video bg-gray-200 rounded-t-lg"></div>
          <CardContent class="p-6">
            <h3 class="font-bold text-xl mb-2 text-catholic-purple">{{ parish.name }}</h3>
            <div class="flex items-start gap-2 mb-3 text-sm text-gray-600">
              <MapPin class="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{{ parish.address }}</span>
            </div>

            <p class="text-base text-justify leading-7 py-2">{{ parish.description }}</p>

            <div class="mb-4">
              <h4 class="inline font-semibold mb-2 text-sm">{{ parish.priestOffice }} :</h4>
              <div class="inline ml-2 space-y-1 text-xs">
                {{ parish.priestName }}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import PageBanner from '@/components/layout/PageBanner.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Head } from '@inertiajs/vue3'
import { MapPin } from 'lucide-vue-next'
import { parishes } from '@/constants/parishes.constants'
</script>
