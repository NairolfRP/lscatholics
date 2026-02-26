<template>
  <Head title="Demande d'emploi" />

  <PageBanner py="16" bg-color="bg-linear-to-r from-primary to-catholic-blue/60">
    <div class="max-w-4xl">
      <Typography variant="h1" class="md:text-4xl font-serif font-semibold mb-3">
        Demande d'emploi
      </Typography>
      <Typography variant="h2">{{ job.title }}</Typography>
    </div>
  </PageBanner>
  <div class="container mx-auto max-w-5xl px-4 py-12 space-y-10">
    <Card class="w-full rounded-none">
      <CardHeader class="border-b space-y-3">
        <CardTitle class="text-2xl scroll-m-20 tracking-tight">
          Demande d'emploi : {{ job.title }}
        </CardTitle>
        <CardDescription>
          L’Archidiocèse recrute, embauche et promeut son personnel sur la base du mérite, des
          compétences et des qualifications, sans discrimination fondée sur la race, la couleur de
          peau, l’origine nationale ou ethnique, l’ascendance, un handicap physique ou mental,
          l’état de santé, la situation matrimoniale, le sexe, l’âge, la grossesse ou le statut
          d’ancien combattant.<br /><br />L’Archidiocèse se réserve le droit d’être le seul juge du
          mérite, des compétences et des qualifications, et peut accorder une préférence aux
          candidats catholiques dans l’ensemble de ses décisions en matière d’emploi, en fonction de
          considérations religieuses et d’autres besoins, critères et politiques religieux.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form :id="formId" @submit="onSubmit" class="flex flex-col gap-4">
          <div :class="sectionClasses">
            <Typography variant="h4" :class="sectionTitleClasses">
              Informations personnelles
            </Typography>
            <EmploymentApplicationPersonalInformationsSection />
          </div>
          <div :class="sectionClasses">
            <Typography variant="h4" :class="sectionTitleClasses">
              Éducation et compétences
            </Typography>
            <EmploymentApplicationEducationSkillsSection />
          </div>

          <div :class="sectionClasses">
            <Typography variant="h4" :class="sectionTitleClasses">
              Expérience professionnelle
            </Typography>
            <EmploymentApplicationProfessionalExperienceSection />
          </div>

          <div :class="sectionClasses">
            <Typography variant="h4" :class="sectionTitleClasses">
              Déclaration {{ values.gender === 'female' ? 'de la candidate' : 'du candidat' }}
            </Typography>
            <EmploymentApplicationDeclarationSection />
          </div>

          <div :class="sectionClasses">
            <Typography variant="h4" :class="sectionTitleClasses"> (( Section OOC )) </Typography>
            <EmploymentApplicationOOCSection />
          </div>
        </form>
      </CardContent>
      <CardFooter class="border-t">
        <Field orientation="horizontal">
          <Button type="button" variant="outline" @click="onReset">Réinitialiser</Button>
          <Button type="submit" :form="formId">Soumettre la candidature</Button>
        </Field>
      </CardFooter>
    </Card>
  </div>
</template>
<script setup lang="ts">
import { Typography } from '@/shared/components/ui/typography'
import Head from '@/shared/components/AppHead.vue'
import PageBanner from '@/shared/components/layout/PageBanner.vue'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { computed } from 'vue'
import { Button } from '@/shared/components/ui/button'
import { Field } from '@/shared/components/ui/field'
import EmploymentApplicationProfessionalExperienceSection from '@/features/employment-application/components/form/EmploymentApplicationProfessionalExperienceSection.vue'
import { useEmploymentApplicationForm } from '@/features/employment-application/composables/use_employment_application_form'
import EmploymentApplicationOOCSection from '@/features/employment-application/components/form/EmploymentApplicationOOCSection.vue'
import EmploymentApplicationPersonalInformationsSection from '@/features/employment-application/components/form/EmploymentApplicationPersonalInformationsSection.vue'
import EmploymentApplicationDeclarationSection from '@/features/employment-application/components/form/EmploymentApplicationDeclarationSection.vue'
import EmploymentApplicationEducationSkillsSection from '@/features/employment-application/components/form/EmploymentApplicationEducationSkillsSection.vue'
import type { InertiaProps } from '@/types'
import type { Data } from '@generated/data'

type PageProps = InertiaProps<{
  job: Data.Job.Variants['employmentApplication']
  isExpired: boolean
}>

const formId = computed(() => `employment-application-${props.job.slug}`)

const sectionTitleClasses = 'border-b mb-3'
const sectionClasses = 'mb-5'

const props = defineProps<PageProps>()

const { onSubmit, onReset, values } = useEmploymentApplicationForm({ slug: props.job.slug })
</script>
