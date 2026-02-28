<template>
  <Sheet v-model:open="open">
    <SheetTrigger as-child>
      <Button variant="outline" class="w-full sm:w-auto gap-2">
        <SlidersHorizontal class="w-4 h-4" />
        Filtres
        <Badge v-if="activeFiltersCount > 0" variant="secondary" class="ml-1">
          {{ activeFiltersCount }}
        </Badge>
      </Button>
    </SheetTrigger>
    <SheetContent side="left" class="z-100 w-full px-5 pb-20 sm:max-w-md overflow-y-auto">
      <SheetHeader>
        <SheetTitle>Filtres de recherche</SheetTitle>
        <SheetDescription> Affinez votre recherche d'offres d'emploi </SheetDescription>
      </SheetHeader>

      <div class="mt-6 space-y-6">
        <div class="space-y-2">
          <Label for="mobile-search">Recherche</Label>
          <div class="relative">
            <Search
              class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
            />
            <Input
              id="mobile-search"
              :model-value="filters.search"
              @update:model-value="(v) => setSearch(v as string)"
              placeholder="Rechercher..."
              class="pl-9"
            />
          </div>
        </div>

        <div class="space-y-2">
          <Label>Département</Label>
          <Accordion type="single" collapsible class="w-full">
            <AccordionItem value="departments" class="border rounded-lg">
              <AccordionTrigger class="px-4 hover:no-underline">
                <span class="text-sm">
                  {{
                    filters.departments.length === 0
                      ? 'Tous les départements'
                      : `${filters.departments.length} sélectionné${filters.departments.length > 1 ? 's' : ''}`
                  }}
                </span>
              </AccordionTrigger>
              <AccordionContent class="px-4 pb-4">
                <div class="space-y-3 max-h-64 overflow-y-auto">
                  <div
                    v-for="dept in departments"
                    :key="dept.id"
                    class="flex items-start space-x-2"
                  >
                    <Checkbox
                      :id="`mobile-dept-${dept.id}`"
                      :checked="filters.departments.includes(dept.id)"
                      @update:checked="() => toggleDepartment(dept.id)"
                    />
                    <Label
                      :for="`mobile-dept-${dept.id}`"
                      class="text-sm font-normal cursor-pointer leading-tight flex-1"
                    >
                      <p class="font-medium">{{ dept.shortTitle }}</p>
                    </Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div v-if="filters.departments.length > 0" class="flex flex-wrap gap-1.5">
            <Badge
              v-for="deptId in filters.departments"
              :key="deptId"
              variant="secondary"
              class="gap-1 cursor-pointer hover:bg-secondary/80"
              @click="toggleDepartment(deptId)"
            >
              {{ getDepartmentTitleById(deptId)?.short || deptId }}
              <X class="w-3 h-3" />
            </Badge>
          </div>
        </div>

        <div class="space-y-2">
          <Label>Type d'emploi</Label>
          <div class="space-y-3">
            <div
              v-for="[key, label] in employmentTypeEntries"
              :key="key"
              class="flex items-center space-x-2"
            >
              <Checkbox
                :id="`mobile-type-${key}`"
                :model-value="filters.employmentTypes.includes(key)"
                @update:model-value="() => toggleEmploymentType(key as EmploymentType)"
              />
              <Label
                :for="`mobile-type-${key}`"
                class="text-sm font-normal cursor-pointer leading-none"
              >
                {{ label }}
              </Label>
            </div>
          </div>
        </div>
      </div>

      <SheetFooter class="mt-6 gap-2 sm:gap-0">
        <Button
          v-if="hasActiveFilters"
          variant="outline"
          @click="clearAllFilters"
          class="w-full sm:w-auto"
        >
          <X class="w-4 h-4 mr-2" />
          Réinitialiser
        </Button>
        <Button @click="open = false" class="w-full sm:w-auto"> Appliquer </Button>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Search, SlidersHorizontal, X } from 'lucide-vue-next'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Checkbox } from '@/shared/components/ui/checkbox'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/components/ui/sheet'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/components/ui/accordion'
import { DEPARTMENTS, getDepartmentTitleById } from '@/shared/constants/departments.constants'
import { useJobFilters } from '@/features/jobs/composables/use_job_filters'
import { EMPLOYMENT_TYPE, type EmploymentType } from '#shared/constants/employment.constants'

interface Props {
  initialFilters?: {
    search?: string
    departments?: string[]
    employmentTypes?: string[]
  }
}

const props = defineProps<Props>()

const {
  filters,
  activeFiltersCount,
  hasActiveFilters,
  setSearch,
  toggleDepartment,
  toggleEmploymentType,
  clearAllFilters,
} = useJobFilters(props.initialFilters)

const open = ref(false)

const departments = DEPARTMENTS
const employmentTypeEntries = computed(() => Object.entries(EMPLOYMENT_TYPE))
</script>
