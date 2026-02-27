<template>
  <Card class="sticky top-4">
    <CardHeader class="pb-4">
      <div class="flex items-center justify-between">
        <CardTitle class="text-lg">Filtres</CardTitle>
        <Button
          v-if="hasActiveFilters"
          variant="ghost"
          size="sm"
          @click="clearAllFilters"
          class="h-8 px-2 text-xs"
        >
          <X class="w-3 h-3 mr-1" />
          Réinitialiser
        </Button>
      </div>
      <p v-if="activeFiltersCount > 0" class="text-xs text-muted-foreground">
        {{ activeFiltersCount }} filtre{{ activeFiltersCount > 1 ? 's' : '' }} actif{{
          activeFiltersCount > 1 ? 's' : ''
        }}
      </p>
    </CardHeader>
    <CardContent class="space-y-6">
      <div class="space-y-2">
        <Label for="search">Recherche</Label>
        <div class="relative">
          <Search
            class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          />
          <Input
            id="search"
            :model-value="filters.search"
            @update:model-value="(v) => setSearch(v as string)"
            placeholder="Rechercher..."
            class="pl-9"
          />
        </div>
      </div>

      <div class="space-y-2">
        <Label>Département</Label>
        <Popover v-model:open="departmentOpen">
          <PopoverTrigger as-child>
            <Button
              variant="outline"
              role="combobox"
              :aria-expanded="departmentOpen"
              class="w-full justify-between font-normal"
            >
              <span class="truncate">
                {{
                  filters.departments.length === 0
                    ? 'Tous les départements'
                    : `${filters.departments.length} sélectionné${filters.departments.length > 1 ? 's' : ''}`
                }}
              </span>
              <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder="Rechercher..." />
              <CommandEmpty>Aucun résultat.</CommandEmpty>
              <CommandList>
                <CommandGroup>
                  <CommandItem
                    v-for="dept in departments"
                    :key="dept.id"
                    :value="dept.id"
                    @select="toggleDepartment(dept.id)"
                    class="cursor-pointer"
                  >
                    <Check
                      :class="[
                        'mr-2 h-4 w-4',
                        filters.departments.includes(dept.id) ? 'opacity-100' : 'opacity-0',
                      ]"
                    />
                    {{ dept.shortTitle }}
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <div v-if="filters.departments.length > 0" class="flex flex-wrap gap-1.5 mt-2">
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
        <div class="space-y-2">
          <div
            v-for="[key, label] in employmentTypeEntries"
            :key="key"
            class="flex items-center space-x-2"
          >
            <Checkbox
              :id="`type-${key}`"
              :model-value="filters.employmentTypes.includes(key)"
              @update:model-value="() => toggleEmploymentType(key as EmploymentType)"
            />
            <Label
              :for="`type-${key}`"
              class="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {{ label }}
            </Label>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, ChevronsUpDown, Search, X } from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Checkbox } from '@/shared/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command'
import { DEPARTMENTS, getDepartmentTitleById } from '@/shared/constants/departments.constants'
import { EMPLOYMENT_TYPE, type EmploymentType } from '#shared/constants/employment.constants'
import { useJobFilters } from '@/features/jobs/composables/use_job_filters'

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

const departmentOpen = ref(false)

const departments = DEPARTMENTS
const employmentTypeEntries = computed(() => Object.entries(EMPLOYMENT_TYPE))
</script>
