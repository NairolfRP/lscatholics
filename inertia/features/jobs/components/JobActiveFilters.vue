<template>
  <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-2">
    <span class="text-sm text-muted-foreground">Filtres actifs :</span>

    <Badge v-if="filters.search" variant="secondary" class="gap-1">
      <Search class="w-3 h-3" />
      "{{ filters.search }}"
      <button
        @click="setSearch('')"
        class="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
      >
        <X class="w-3 h-3" />
      </button>
    </Badge>

    <Badge
      v-for="deptId in filters.departments"
      :key="`active-dept-${deptId}`"
      variant="secondary"
      class="gap-1"
    >
      {{ getDepartmentTitleById(deptId)?.short || deptId }}
      <button
        @click="toggleDepartment(deptId)"
        class="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
      >
        <X class="w-3 h-3" />
      </button>
    </Badge>

    <Badge
      v-for="type in filters.employmentTypes"
      :key="`active-type-${type}`"
      variant="secondary"
      class="gap-1"
    >
      {{ EMPLOYMENT_TYPE[type as EmploymentType] }}
      <button
        @click="toggleEmploymentType(type as EmploymentType)"
        class="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
      >
        <X class="w-3 h-3" />
      </button>
    </Badge>

    <Button variant="ghost" size="sm" @click="clearAllFilters" class="h-7 px-2 text-xs ml-auto">
      Tout effacer
    </Button>
  </div>
</template>

<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
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
  hasActiveFilters,
  setSearch,
  toggleDepartment,
  toggleEmploymentType,
  clearAllFilters,
} = useJobFilters(props.initialFilters)
</script>
