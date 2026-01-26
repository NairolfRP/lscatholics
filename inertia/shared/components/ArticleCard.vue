<template>
  <article class="group">
    <Link :route="route as any" :params="{ slug }">
      <Card class="card-hover h-full">
        <CardHeader>
          <div class="uppercase font-bold text-primary text-sm">
            {{ category }}
          </div>
          <CardTitle
            class="font-bold text-xl group-hover:text-catholic-gold transition-colors mb-1"
          >
            {{ title }}
          </CardTitle>
          <span class="text-base font-normal">
            <time v-if="publishedAt" :datetime="publishedAt">{{ formatDate(publishedAt) }}</time>
          </span>
        </CardHeader>
        <CardFooter class="px-6">
          <CardAction class="flex">
            <Button variant="link" size="sm" class="text-catholic-gold">
              Lire la suite
              <ArrowRight class="w-3 h-3 ml-1" />
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </Link>
  </article>
</template>
<script setup lang="ts">
import { formatDate } from '@/lib/utils'
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { ArrowRight } from 'lucide-vue-next'
import { Link } from '@tuyau/inertia/vue'
import { Button } from '@/shared/components/ui/button'

type Props = {
  route?: string
  slug: string
  category?: string
  title: string
  publishedAt: string
}

withDefaults(defineProps<Props>(), {
  route: 'news.single',
  slug: '',
  category: 'Archidiocèse',
  title: '',
  publishedAt: '',
})
</script>
