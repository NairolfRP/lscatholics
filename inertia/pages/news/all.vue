<template>
  <Head title="Actualités" />

  <PageBanner py="16">
    <Typography variant="h1" class="md:text-5xl font-bold mb-4">Actualités</Typography>
    <p class="text-xl opacity-90">Restez informé de la vie de notre archidiocèse</p>
  </PageBanner>

  <div class="container mx-auto max-w-7xl">
    <section class="py-8 bg-gray-50 hidden">
      <div class="md:container mx-auto px-4">
        <div class="flex flex-wrap gap-3 justify-center">
          <Button
            variant="outline"
            size="sm"
            :class="{ 'bg-catholic-gold text-white': !selectedCategory }"
            @click="handleCategoryChange()"
          >
            Toutes les actualités
          </Button>
          <Button
            v-for="category in categories"
            :key="category.id"
            variant="outline"
            size="sm"
            :class="{ 'bg-catholic-gold text-white': selectedCategory === category.id }"
            @click="handleCategoryChange(category.id)"
          >
            {{ category.name }}
          </Button>
        </div>
      </div>
    </section>

    <section class="py-16">
      <div v-if="error" class="max-w-4xl mx-auto px-3">
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Impossible de charger les actualités</AlertTitle>
          <AlertDescription>
            Nous n'avons pas pu récupérer les articles. Cela peut être dû à un problème serveur ou
            réseau. Réessayez plus tard.
          </AlertDescription>
        </Alert>
      </div>
      <div
        v-else-if="!articles.data || articles.data.length === 0"
        class="w-full text-center mx-auto font-medium italic"
      >
        Aucun article trouvé
      </div>
      <div v-else class="md:container mx-auto px-4">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ArticleCard
            v-for="article in articles.data"
            :key="article.id"
            :title="article.title"
            :slug="article.slug"
            :category="article.category"
            :published-at="article.publishedAt"
            class="group"
          />
        </div>

        <div class="mt-12 flex justify-center">
          <Pagination
            v-if="totalItems > itemsPerPage"
            v-slot="{ page }"
            :items-per-page="itemsPerPage"
            :total="totalItems"
            :default-page="page"
          >
            <PaginationContent v-slot="{ items }">
              <PaginationFirst @click="handlePageChange(firstPage)" />
              <PaginationPrevious @click="handlePageChange(page - 1)" />

              <template v-for="(item, index) in items" :key="index">
                <PaginationItem
                  v-if="item.type === 'page'"
                  :value="item.value"
                  :is-active="item.value === page"
                  @click="handlePageChange(item.value)"
                >
                  {{ item.value }}
                </PaginationItem>
              </template>

              <PaginationNext @click="handlePageChange(page + 1)" />
              <PaginationLast @click="handlePageChange(lastPage)" />
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import { Button } from '@/shared/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '@/shared/components/ui/pagination'
import Head from '@/shared/components/AppHead.vue'
import type { InferPageProps } from '@adonisjs/inertia/types'
import type NewsController from '#news/controllers/news_controller'
import { Alert, AlertDescription, AlertTitle } from '@/shared/components/ui/alert'
import { CircleAlert } from 'lucide-vue-next'
import { router } from '@inertiajs/vue3'
import { tuyau } from '@/lib/tuyau'
import { Typography } from '@/shared/components/ui/typography'
import ArticleCard from '@/shared/components/ArticleCard.vue'

const { selectedCategory, categories, articles } = defineProps<{
  articles: InferPageProps<NewsController, 'index'>['articles']
  selectedCategory: InferPageProps<NewsController, 'index'>['selectedCategory']
  categories: InferPageProps<NewsController, 'index'>['categories']
  error: boolean
}>()

const {
  total: totalItems,
  perPage: itemsPerPage,
  currentPage: page,
  firstPage,
  lastPage,
} = articles.meta

const handleCategoryChange = (categoryId?: string) => {
  router.get(
    tuyau.newsroom.$url(),
    {
      category: categoryId,
    },
    {
      preserveScroll: true,
      only: ['articles', 'selectedCategory', 'error'],
    }
  )
}

const handlePageChange = (newPage?: number) => {
  const p = Math.max(firstPage, Math.min(newPage || 1, lastPage))

  router.get(
    tuyau.newsroom.$url(),
    {
      page: p,
      category: selectedCategory,
    },
    {
      preserveScroll: true,
      only: ['articles', 'selectedCategory', 'error'],
    }
  )
}
</script>
