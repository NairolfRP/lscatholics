<template>
  <template v-if="service">
    <Head :title="service.title" />

    <PageBanner
      :bg-color="
        service.iconClasses
          ? service.iconClasses
          : 'bg-linear-to-r from-catholic-blue to-catholic-blue/90'
      "
      py="16"
    >
      <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">
        {{ service.title }}
      </h1>
      <p class="text-xl opacity-90">
        {{ service.description }}
      </p>
    </PageBanner>

    <div class="container max-w-7xl mx-auto px-4 py-10">
      <Link route="services.index">
        <Button class="cursor-pointer"> <ChevronLeft /> Retourner à la liste des services </Button>
      </Link>
    </div>

    <section class="pt-5 pb-16">
      <div class="container max-w-7xl mx-auto px-4">
        <slot />
      </div>
    </section>
  </template>
  <template v-else>Une erreur est survenue</template>
</template>
<script lang="ts" setup>
import Head from '@/shared/components/AppHead.vue'
import { Link } from '@tuyau/inertia/vue'
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { Button } from '@/shared/components/ui/button'
import { ChevronLeft } from 'lucide-vue-next'
import { SERVICES } from '#shared/constants/services.constants'
import { computed } from 'vue'

const props = defineProps<{
  serviceId: (typeof SERVICES)[number]['id']
}>()

const service = computed(() => SERVICES.find((s) => s.id === props.serviceId))
</script>
