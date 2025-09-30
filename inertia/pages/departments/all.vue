<template>
  <Head title="Départements" />
  <section class="container max-w-4xl mx-auto my-40 space-y-10 px-5">
    <Typography variant="h1">Départements (ordre alphabétique)</Typography>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Link
        v-for="department in DEPARTMENTS.toSorted((a, b) =>
          a.shortTitle.localeCompare(b.shortTitle)
        )"
        :key="`department-${department.id}`"
        route="departments.single"
        :params="{ slug: department.slug }"
        as-child
      >
        <Card class="h-full bg-primary/10 card-hover cursor-pointer">
          <CardHeader>
            <CardTitle class="font-bold text-xl">{{ department.shortTitle }}</CardTitle>
            <CardContent class="text-sm mt-4 p-0">
              {{ department.description }}
            </CardContent>
          </CardHeader>
        </Card>
      </Link>
    </div>
  </section>
</template>
<script lang="ts" setup>
import { Typography } from '@/components/ui/typography'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DEPARTMENTS } from '@/constants/departments.constants'
import Head from '@/components/AppHead.vue'
import { Link } from '@tuyau/inertia/vue'
</script>
