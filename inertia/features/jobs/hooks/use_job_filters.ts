import { useCallback, useMemo, useRef, useState } from 'react'
import { router } from '@inertiajs/react'
import { urlFor } from '@/client'
import type { EmploymentType } from '#shared/constants/employment.constants'

export type JobFiltersHandle = ReturnType<typeof useJobFilters>

export type JobFilters = {
  search?: string
  departments: string[]
  employmentTypes: string[]
}

export function useJobFilters(_initialFilters?: Partial<JobFilters>) {
  const [filters, setFilters] = useState<JobFilters>({
    search: '',
    departments: [],
    employmentTypes: [],
  })

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const sync = useCallback(
    (overrides?: Partial<typeof filters>, immediate = false) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)

      debounceRef.current = setTimeout(
        () => {
          const merged = { ...filters, ...overrides }
          const params: Record<string, string> = {}

          if (merged.search) params.search = merged.search
          if (merged.departments.length > 0) params.departments = merged.departments.join(',')
          if (merged.employmentTypes.length > 0)
            params.employmentTypes = merged.employmentTypes.join(',')

          router.get(urlFor('jobs.index'), params, {
            preserveState: true,
            preserveScroll: true,
            only: ['offers', 'filters'],
            replace: true,
          })
        },
        immediate ? 0 : 400
      )
    },
    [filters]
  )

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
      setFilters((prev) => ({ ...prev, search: value }))
      sync({ search: value })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.search]
  )

  const toggleDepartment = useCallback(
    (departmentId: string) => {
      const next = filters.departments.includes(departmentId)
        ? filters.departments.filter((id) => id !== departmentId)
        : [...filters.departments, departmentId]
      setFilters((prev) => ({ ...prev, departments: next }))
      sync({ departments: next }, true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.departments]
  )

  const toggleEmploymentType = useCallback(
    (type: EmploymentType) => {
      const next = filters.employmentTypes.includes(type)
        ? filters.employmentTypes.filter((t) => t !== type)
        : [...filters.employmentTypes, type]
      setFilters((prev) => ({ ...prev, employmentTypes: next }))
      sync({ employmentTypes: next }, true)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filters.employmentTypes]
  )

  const clearAllFilters = useCallback(() => {
    setFilters({ search: '', departments: [], employmentTypes: [] })
    sync({ search: '', departments: [], employmentTypes: [] }, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, search: '' }))
    sync({ search: '' }, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearDepartments = useCallback(() => {
    setFilters((prev) => ({ ...prev, departments: [] }))
    sync({ departments: [] }, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const clearEmploymentTypes = useCallback(() => {
    setFilters((prev) => ({ ...prev, employmentTypes: [] }))
    sync({ employmentTypes: [] }, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
