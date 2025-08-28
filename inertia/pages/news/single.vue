<template>
  <Head :title="post.title" />
  <article>
    <header>
      <PageBanner :bg-image="post.coverImageUrl" py="16">
        <div class="flex flex-col gap-5">
          <h1 class="text-4xl md:text-5xl font-bold mb-4 font-serif">{{ post.title }}</h1>
          <p class="text-xl opacity-90">
            {{ post.excerpt }}
          </p>
        </div>
      </PageBanner>
    </header>

    <div class="container mx-auto px-4 py-12 lg:py-16">
      <div class="max-w-4xl mx-auto">
        <div class="article-content">
          <div class="flex flex-col mb-10">
            <span class="font-bold uppercase">Pour diffusion immédiate</span>
            <time :datetime="post.publishedAt">{{ formatDate(post.publishedAt) }}</time>
          </div>
          <div v-if="isContentReady" v-html="sanitizedContent" class="prose text-justify" />
          <div v-else v-text="post?.content || ''" class="prose text-justify" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { InferPageProps } from '@adonisjs/inertia/types'
import type NewsController from '#news/controllers/news_controller'
import { Head } from '@inertiajs/vue3'
import PageBanner from '@/components/layout/PageBanner.vue'
import { formatDate } from '@/lib/utils'
import { computed, onMounted } from 'vue'
import { useSanitize } from '@/composables/use_sanitize'

const { post } = defineProps<{
  post: InferPageProps<NewsController, 'single'>['post']
}>()

const { initializePurify, sanitize, isReady } = useSanitize()

const sanitizedContent = computed(() => {
  return sanitize(post?.content)
})

const isContentReady = computed(() => {
  return isReady.value && post?.content
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
