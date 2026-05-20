import { useCallback, useMemo, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import { urlFor } from '@/lib/client'
import type { EmploymentType } from '#shared/constants/employment.constants'

export type JobFiltersHandle = ReturnType<typeof useJobFilters>

export type JobFilters = {
  search?: string
  departments: string[]
  employmentTypes: string[]
}

const DEFAULT_FILTERS: JobFilters = {
  search: '',
  departments: [],
  employmentTypes: [],
}

export function useJobFilters(initialFilters?: Partial<JobFilters>) {
  const [filters, setFilters] = useState<JobFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sync = useCallback((nextFilters: JobFilters, immediate = false) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(
      () => {
        const params: Record<string, string> = {}

        if (nextFilters.search) params.search = nextFilters.search
        if (nextFilters.departments.length > 0)
          params.departments = nextFilters.departments.join(',')
        if (nextFilters.employmentTypes.length > 0)
          params.employmentTypes = nextFilters.employmentTypes.join(',')

        router.get(urlFor('jobs.index'), params, {
          preserveState: true,
          preserveScroll: true,
          only: ['offers', 'filters'],
          replace: true,
        })
      },
      immediate ? 0 : 400
    )
  }, [])

  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.search) count++
    if (filters.departments.length > 0) count++
    if (filters.employmentTypes.length > 0) count++
    return count
  }, [filters])

  const hasActiveFilters = activeFiltersCount > 0

  const setSearch = useCallback(
    (value: string) => {
      const next = { ...filters, search: value }
      setFilters(next)
      sync(next)
    },
    [filters, sync]
  )

  const toggleDepartment = useCallback(
    (departmentId: string) => {
      const next = filters.departments.includes(departmentId)
        ? filters.departments.filter((id) => id !== departmentId)
        : [...filters.departments, departmentId]
      const nextFilters = { ...filters, departments: next }
      setFilters(nextFilters)
      sync(nextFilters, true)
    },
    [filters, sync]
  )

  const toggleEmploymentType = useCallback(
    (type: EmploymentType) => {
      const next = filters.employmentTypes.includes(type)
        ? filters.employmentTypes.filter((t) => t !== type)
        : [...filters.employmentTypes, type]
      const nextFilters = { ...filters, employmentTypes: next }
      setFilters(nextFilters)
      sync(nextFilters, true)
    },
    [filters, sync]
  )

  const clearAllFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS)
    sync(DEFAULT_FILTERS, true)
  }, [sync])

  const clearSearch = useCallback(() => {
    const next = { ...filters, search: '' }
    setFilters(next)
    sync(next, true)
  }, [filters, sync])

  const clearDepartments = useCallback(() => {
    const next = { ...filters, departments: [] }
    setFilters(next)
    sync(next, true)
  }, [filters, sync])

  const clearEmploymentTypes = useCallback(() => {
    const next = { ...filters, employmentTypes: [] }
    setFilters(next)
    sync(next, true)
  }, [filters, sync])

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
