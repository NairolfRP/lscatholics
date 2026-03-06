<template>
  <Head title="Modifier l'article" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="urlFor('dashboard.dashboard_articles.index')">
          <ArrowLeft class="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Modifier l'article</h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ post.title }}
        </p>
      </div>
    </div>

    <DashboardEditPostForm />
  </div>
</template>
<script lang="ts" setup>
import { Head, Link } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { urlFor } from '@/client'
import type { Data } from '@generated/data'
import DashboardEditPostForm from '@/features/posts/components/dashboard/form/DashboardEditPostForm.vue'

type PageProps = {
  post: Data.Posts.Post.Variants['allFields']
}

defineProps<PageProps>()
</script>
