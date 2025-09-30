<template>
  <Head title="Services" />

  <PageBanner bg-color="bg-gradient-to-r from-catholic-blue to-catholic-blue/90" py="16">
    <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">Services</h1>
    <p class="text-xl opacity-90">
      Tous les sacrements et sacramentaux catholiques ainsi que les services proposés pour vivre sa
      foi en Église
    </p>
  </PageBanner>

  <section class="py-16">
    <div class="container max-w-7xl mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          v-for="service of SERVICES"
          :key="service.id"
          route="services.single"
          :params="{ slug: service.slug }"
          as-child
        >
          <Card class="flex justify-between h-full bg-primary/10 card-hover text-center">
            <CardContent class="p-6">
              <div
                :class="
                  cn(
                    'size-12 bg-catholic-gold text-white rounded-full flex items-center justify-center mx-auto mb-4',
                    service.iconClasses
                  )
                "
              >
                <component :is="service.icon ? service.icon : Heart" class="size-6" />
              </div>
              <h3 class="font-semibold mb-2">{{ service.title }}</h3>
              <p class="text-sm text-gray-600 text-justify mb-4">
                {{ service.description }}
              </p>
            </CardContent>
            <CardFooter class="flex gap-2 justify-end text-right text-gray-600 font-medium">
              Lire plus <ArrowRight class="size-4" />
            </CardFooter>
          </Card>
        </Link>
      </div>
    </div>
  </section>
</template>
<script lang="ts" setup>
import Head from '@/components/AppHead.vue'
import PageBanner from '@/components/layout/PageBanner.vue'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Heart, ArrowRight } from 'lucide-vue-next'
import { Link } from '@tuyau/inertia/vue'
import { SERVICES } from '#shared/constants/services.constants'
import { cn } from '@/lib/utils'
</script>
