<template>
  <Head title="Créer un article" />

  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="icon" as-child>
        <Link :href="urlFor('dashboard.dashboard_articles.index')">
          <ArrowLeft class="h-4 w-4" />
        </Link>
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Créer un article</h1>
        <p class="text-gray-500 dark:text-gray-400">Ajoutez un nouvel article à votre site</p>
      </div>
    </div>

    <DashboardCreatePostForm />
  </div>
</template>
<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3'
import { Button } from '@/shared/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { urlFor } from '@/client'
import DashboardCreatePostForm from '@/features/posts/components/dashboard/form/DashboardCreatePostForm.vue'
</script>
