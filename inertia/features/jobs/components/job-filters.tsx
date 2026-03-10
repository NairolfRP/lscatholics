import { useState } from 'react'
import { Check, ChevronsUpDown, Search, X } from 'lucide-react'
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
import type { JobFiltersHandle } from '@/features/jobs/hooks/use_job_filters'

type Props = {
  jobFilters: JobFiltersHandle
}

export default function JobFilters({ jobFilters }: Props) {
  const {
    filters,
    activeFiltersCount,
    hasActiveFilters,
    setSearch,
    toggleDepartment,
    toggleEmploymentType,
    clearAllFilters,
  } = jobFilters

  const [departmentOpen, setDepartmentOpen] = useState(false)

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtres</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Réinitialiser
            </Button>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif
            {activeFiltersCount > 1 ? 's' : ''}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Recherche</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              id="search"
              value={filters.search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Département</Label>
          <Popover open={departmentOpen} onOpenChange={setDepartmentOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={departmentOpen}
                className="w-full justify-between font-normal"
              >
                <span className="truncate">
                  {filters.departments.length === 0
                    ? 'Tous les départements'
                    : `${filters.departments.length} sélectionné${filters.departments.length > 1 ? 's' : ''}`}
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Rechercher..." />
                <CommandEmpty>Aucun résultat.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    {DEPARTMENTS.map((dept) => (
                      <CommandItem
                        key={dept.id}
                        value={dept.id}
                        onSelect={() => toggleDepartment(dept.id)}
                        className="cursor-pointer"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${filters.departments.includes(dept.id) ? 'opacity-100' : 'opacity-0'}`}
                        />
                        {dept.shortTitle}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {filters.departments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {filters.departments.map((deptId) => (
                <Badge
                  key={deptId}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-secondary/80"
                  onClick={() => toggleDepartment(deptId)}
                >
                  {getDepartmentTitleById(deptId)?.short || deptId}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Type d'emploi</Label>
          <div className="space-y-2">
            {Object.entries(EMPLOYMENT_TYPE).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${key}`}
                  checked={filters.employmentTypes.includes(key)}
                  onCheckedChange={() => toggleEmploymentType(key as EmploymentType)}
                />
                <Label
                  htmlFor={`type-${key}`}
                  className="text-sm font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
