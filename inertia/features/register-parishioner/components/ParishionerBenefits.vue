<template>
  <div class="grid md:grid-cols-3 gap-6 mb-12">
    <Card v-for="benefit in benefits">
      <CardContent class="pt-6">
        <div class="flex flex-col items-center text-center">
          <component :is="benefit.icon" :class="benefit.iconClass" />
          <h3 class="font-semibold text-gray-900 mb-2">{{ benefit.title }}</h3>
          <p class="text-sm text-gray-600">
            {{ benefit.description }}
          </p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Church, Heart, Users } from 'lucide-vue-next'
import { Card, CardContent } from '@/shared/components/ui/card'

const benefits = [
  {
    icon: Users,
    iconClass: 'w-10 h-10 text-blue-600 mb-3',
    title: 'Rejoindre nos communautés',
    description: "Rencontrez d'autres paroissiens et grandissez ensemble dans la foi.",
  },
  {
    icon: Heart,
    iconClass: 'w-10 h-10 text-purple-600 mb-3',
    title: 'Développement spirituel',
    description:
      'Accéder aux sacrements, aux activités pastorales et aux programmes à la foi religieuse',
  },
  {
    icon: Church,
    iconClass: 'w-10 h-10 text-indigo-600 mb-3',
    title: 'Restez informés',
    description:
      'Recevez des informations sur les horaires des messes, les événements et les actualités des paroisses.',
  },
]
</script>
