import { Search, X } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { getDepartmentTitleById } from '@/shared/constants/departments.constants'
import { EMPLOYMENT_TYPE, type EmploymentType } from '#shared/constants/employment.constants'
import type { JobFiltersHandle } from '@/features/jobs/hooks/use_job_filters'

interface Props {
  jobFilters: JobFiltersHandle
}

export default function JobActiveFilters({ jobFilters }: Props) {
  const {
    filters,
    hasActiveFilters,
    setSearch,
    toggleDepartment,
    toggleEmploymentType,
    clearAllFilters,
  } = jobFilters

  if (!hasActiveFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Filtres actifs :</span>

      {filters.search && (
        <Badge variant="secondary" className="gap-1">
          <Search className="w-3 h-3" />"{filters.search}"
          <button
            onClick={() => setSearch('')}
            className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}

      {filters.departments.map((deptId) => (
        <Badge key={`active-dept-${deptId}`} variant="secondary" className="gap-1">
          {getDepartmentTitleById(deptId)?.short || deptId}
          <button
            onClick={() => toggleDepartment(deptId)}
            className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {filters.employmentTypes.map((type) => (
        <Badge key={`active-type-${type}`} variant="secondary" className="gap-1">
          {EMPLOYMENT_TYPE[type as EmploymentType]}
          <button
            onClick={() => toggleEmploymentType(type as EmploymentType)}
            className="ml-1 hover:bg-secondary-foreground/10 rounded-full p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      <Button
        variant="ghost"
        size="sm"
        onClick={clearAllFilters}
        className="h-7 px-2 text-xs ml-auto"
      >
        Tout effacer
      </Button>
    </div>
  )
}
