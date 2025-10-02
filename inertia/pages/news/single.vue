<template>
  <Head :title="post.title" :description="post.excerpt" :image="post.coverImageUrl || undefined">
    <meta head-key="og:type" property="og:type" content="article" />
    <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />

    <meta property="article:published_time" :content="post.publishedAt" />
    <meta property="article:modified_time" :content="post.updatedAt" />
    <meta property="article:section" :content="post.category" />
  </Head>
  <article>
    <header>
      <PageBanner :bg-image="post.coverImageUrl" py="16">
        <div class="flex flex-col gap-5">
          <Typography variant="h1" class="md:text-5xl font-bold mb-4">
            {{ post.title }}
          </Typography>
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
          <MarkdownContent :content="post.content" class="prose text-justify" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import Head from '@/components/AppHead.vue'
import PageBanner from '@/components/layout/PageBanner.vue'
import { formatDate } from '@/lib/utils'
import { Typography } from '@/components/ui/typography'
import { MarkdownContent } from '@/components/ui/markdown'

const { post } = defineProps<{
  post: {
    slug: string
    title: string
    excerpt: string
    coverImageUrl?: string
    category: string
    content: string
    publishedAt: string
    updatedAt: string
    status: string
  }
}>()
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
