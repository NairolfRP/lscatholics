<template>
  <Head :title="event.title" />
  <article>
    <header>
      <PageBanner :bg-image="event.coverImageUrl" py="16" align="text-left">
        <div class="flex flex-col gap-5 text-left">
          <h1 class="text-4xl md:text-5xl font-bold uppercase">
            {{ event.title }}
          </h1>
          <p class="text-xl font-bold opacity-90">
            {{ formatDate(new Date(event.startDate), 'DD MMMM @ HH:mm', { locales: 'fr-FR' }) }}
            <span v-if="event.endDate"
              >-
              {{
                formatDate(new Date(event.endDate), 'DD MMMM @ HH:mm', { locales: 'fr-FR' })
              }}</span
            >
          </p>
        </div>
      </PageBanner>
    </header>

    <div class="container mx-auto px-4 py-12 lg:py-16">
      <div class="max-w-7xl mx-auto">
        <Link route="find.events">
          <Button class="mb-10 cursor-pointer" size="lg"><ArrowLeft /> Tous les événements</Button>
        </Link>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-10">
          <div class="article-content">
            <div v-if="isContentReady" v-html="sanitizedContent" class="prose text-justify" />
            <div v-else v-text="event?.content || ''" class="prose text-justify" />
          </div>
          <div class="space-y-3">
            <h3 class="scroll-m-20 text-2xl font-bold tracking-tight">Détails</h3>
            <dl>
              <dt class="text-primary uppercase text-sm font-bold">Début</dt>
              <dd class="text-sm">
                {{ formatDate(new Date(event.startDate), 'DD MMM HH:mm:ss', { locales: 'fr-FR' }) }}
              </dd>
            </dl>
            <dl v-if="event.endDate">
              <dt class="text-primary uppercase text-sm font-bold">Fin</dt>
              <dd class="text-sm">
                {{ formatDate(new Date(event.endDate), 'DD MMM HH:mm:ss', { locales: 'fr-FR' }) }}
              </dd>
            </dl>

            <dl v-if="event.location">
              <dt class="text-primary uppercase text-sm font-bold">Lieu</dt>
              <dd class="text-sm">
                {{ event.location }}
              </dd>
            </dl>

            <dl v-if="event.registrationRequired">
              <dt class="text-primary uppercase text-sm font-bold">Inscription requise</dt>
              <dd class="text-sm">Oui</dd>
            </dl>

            <dl v-if="event.maxParticipants">
              <dt class="text-primary uppercase text-sm font-bold">Nombre de places</dt>
              <dd class="text-sm">{{ event.maxParticipants }}</dd>
            </dl>

            <template v-if="event.flyerUrl">
              <img :src="event.flyerUrl" alt="Event Flyer" width="791" height="1024" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3'
import { Link } from '@tuyau/inertia/vue'
import PageBanner from '@/components/layout/PageBanner.vue'
import { computed, onMounted } from 'vue'
import { useSanitize } from '@/composables/use_sanitize'
import { formatDate } from '@vueuse/core'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'

const { event } = defineProps<{
  event: {
    title: string
    content: string
    location: string
    coverImageUrl?: string
    flyerUrl?: string
    registrationRequired?: boolean
    maxParticipants?: number
    startDate: string
    endDate?: string
  }
}>()

const { initializePurify, sanitize, isReady } = useSanitize()

const sanitizedContent = computed(() => {
  return sanitize(event?.content)
})

const isContentReady = computed(() => {
  return isReady.value && event?.content
})

onMounted(async () => {
  await initializePurify()
})
</script>
<style scoped>
.article-content {
  line-height: 1.75;

  @media (max-width: 640px) {
    font-size: 1rem;
    line-height: 1.6;
  }
}

.article-content :deep(blockquote) {
  position: relative;
}

.article-content :deep(blockquote):before {
  content: '"';
  font-size: 4rem;
  color: var(--color-primary);
  opacity: 0.3;
  position: absolute;
  left: -0.5rem;
  top: -1rem;
}

.article-content :deep(a) {
  word-break: break-word;
}

.article-content :deep(ul li),
.article-content :deep(ol li) {
  margin-bottom: 0.5rem;
}

.article-content :deep(figure) {
  margin: 2rem 0;
}

.article-content :deep(figcaption) {
  text-align: center;
  font-style: italic;
  color: var(--color-gray-600);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
