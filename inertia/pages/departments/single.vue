<template>
  <template v-if="department">
    <Head :title="department.title" />
    <PageBanner
      :bg-image="department.page?.bannerImg || DefaultBanner"
      :bg-color="department.page?.bannerColor"
      align="text-left"
    >
      <h1 class="text-4xl text-white font-bold">{{ department.title }}</h1>
    </PageBanner>

    <section class="container mx-auto max-w-7xl text-justify py-16 px-5 md:px-16">
      <Typography v-if="department.page?.content">{{ department.page.content }}</Typography>
      <Typography v-else>{{ department.description }}</Typography>
    </section>

    <section
      v-if="
        department.page?.director || (department.page?.teams && department.page?.teams?.length > 0)
      "
    >
      <div class="w-full h-25 flex items-center bg-secondary mb-10 border-b-5 border-b-yellow-600">
        <div class="container mx-auto max-w-7xl text-justify py-16 px-16">
          <Typography
            variant="h2"
            class="border-0 m-0 text-secondary-foreground uppercase font-bold"
          >
            Notre équipe
          </Typography>
        </div>
      </div>

      <div v-if="department.page?.director" class="container mx-auto max-w-7xl pb-16 px-5 md:px-16">
        <div class="flex flex-col md:flex-row flex-wrap items-center md:items-end gap-8 md:gap-15">
          <img
            v-if="department.page?.director?.image"
            :src="department.page?.director?.image"
            alt="Director image"
            class="max-w-full h-auto md:w-[20%]"
          />
          <div v-else class="bg-gradient-to-b from-secondary to-yellow-800 h-70 w-[20%]"></div>
          <div>
            <Typography variant="h3" class="uppercase font-bold m-0 p-0 leading-5">{{
              department.page.director.name || 'Vacant'
            }}</Typography>
            <Typography class="text-secondary font-semibold leading-0 mb-10">{{
              department.page.director.position || 'N/A'
            }}</Typography>
            <div class="flex flex-col">
              <Typography variant="h4" class="uppercase font-bold text-base text-secondary">
                Téléphone
              </Typography>
              <span class="flex items-center gap-2">
                <Phone class="size-4" /> {{ department.page.director.phone || 'N/A' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="container mx-auto max-w-7xl pb-16 px-5 md:px-16">
        <div class="flex flex-col gap-12">
          <div v-for="team of department.page?.teams">
            <Typography variant="h3" class="font-bold text-secondary uppercase">
              {{ team.title }}
            </Typography>
            <div
              v-if="team.members?.length > 0"
              class="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5"
            >
              <Card v-for="member of team.members" class="h-full pt-0">
                <CardHeader
                  :class="
                    cn('flex flex-col justify-end p-5 min-h-60 bg-cover', {
                      'bg-gradient-to-b from-secondary to-yellow-950': !member.image,
                    })
                  "
                  :style="member.image ? `background-image: url(${member.image})` : undefined"
                >
                  <CardTitle class="text-xl text-white font-bold leading-4">
                    {{ member.name || 'VACANT' }}
                  </CardTitle>
                  <CardDescription class="text-xl text-secondary font-medium">
                    {{ member.position }}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Typography variant="h4" class="uppercase font-bold text-base text-secondary">
                    Téléphone
                  </Typography>
                  <span class="flex items-center gap-2">
                    <Phone class="size-4" /> {{ member.phone || 'N/A' }}
                  </span>
                </CardContent>
              </Card>
            </div>
            <Typography class="italic" v-else>
              Aucun membre dans l'équipe pour le moment.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  </template>
  <Not_found v-else />
</template>
<script lang="ts" setup>
import PageBanner from '@/components/layout/PageBanner.vue'
import { computed } from 'vue'
import { getDepartmentBySlug } from '@/constants/departments.constants'
import Not_found from '@/pages/errors/not_found.vue'
import { Head } from '@inertiajs/vue3'
import { Typography } from '@/components/ui/typography'
import { Phone } from 'lucide-vue-next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import DefaultBanner from '@/assets/images/cathedralTower.png'

type Props = {
  departmentSlug: string
}
const props = defineProps<Props>()

const department = computed(() => getDepartmentBySlug(props.departmentSlug))
</script>
