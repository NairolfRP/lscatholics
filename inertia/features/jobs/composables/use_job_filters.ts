import { computed, ref } from 'vue'
import { router } from '@inertiajs/vue3'
import type { EmploymentType } from '#shared/constants/employment.constants'
import { tuyau } from '@/lib/tuyau'

interface JobFilters {
  search: string
  departments: string[]
  employmentTypes: string[]
}

export function useJobFilters(initialFilters?: Partial<JobFilters>) {
  const filters = ref<JobFilters>({
    search: initialFilters?.search || '',
    departments: initialFilters?.departments || [],
    employmentTypes: initialFilters?.employmentTypes || [],
  })

  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.value.search) count++
    if (filters.value.departments.length > 0) count++
    if (filters.value.employmentTypes.length > 0) count++
    return count
  })

  const hasActiveFilters = computed(() => activeFiltersCount.value > 0)

  let debounceTimeout: ReturnType<typeof setTimeout> | null = null
  const syncToUrl = (immediate = false) => {
    if (debounceTimeout) clearTimeout(debounceTimeout)

    const delay = immediate ? 0 : 400

    debounceTimeout = setTimeout(() => {
      const params: Record<string, string | string[]> = {}

      if (filters.value.search) params.search = filters.value.search
      if (filters.value.departments.length > 0)
        params.departments = filters.value.departments.join(',')
      if (filters.value.employmentTypes.length > 0) {
        params.employmentTypes = filters.value.employmentTypes.join(',')
      }

      router.get(tuyau.$url('jobs.index'), params, {
        preserveState: true,
        preserveScroll: true,
        only: ['offers', 'offersMeta', 'filters'],
        replace: true,
      })
    }, delay)
  }

  const setSearch = (value: string) => {
    filters.value.search = value
    syncToUrl()
  }

  const toggleDepartment = (departmentId: string) => {
    const current = filters.value.departments
    filters.value.departments = current.includes(departmentId)
      ? current.filter((id) => id !== departmentId)
      : [...current, departmentId]
    syncToUrl(true)
  }

  const toggleEmploymentType = (type: EmploymentType) => {
    const current = filters.value.employmentTypes
    filters.value.employmentTypes = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    syncToUrl(true)
  }

  const clearAllFilters = () => {
    filters.value = {
      search: '',
      departments: [],
      employmentTypes: [],
    }
    syncToUrl(true)
  }

  const clearSearch = () => {
    filters.value.search = ''
    syncToUrl(true)
  }

  const clearDepartments = () => {
    filters.value.departments = []
    syncToUrl(true)
  }

  const clearEmploymentTypes = () => {
    filters.value.employmentTypes = []
    syncToUrl(true)
  }

  return {
    filters,
    activeFiltersCount,
    hasActiveFilters,
    setSearch,
    toggleDepartment,
    toggleEmploymentType,
    clearAllFilters,
    clearSearch,
    clearDepartments,
    clearEmploymentTypes,
  }
}
