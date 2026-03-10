import { useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
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
import { EMPLOYMENT_TYPE, type EmploymentType } from '#shared/constants/employment.constants'
import type { JobFiltersHandle } from '@/features/jobs/hooks/use_job_filters'

interface Props {
  jobFilters: JobFiltersHandle
}

export default function JobFiltersMobile({ jobFilters }: Props) {
  const {
    filters,
    activeFiltersCount,
    hasActiveFilters,
    setSearch,
    toggleDepartment,
    toggleEmploymentType,
    clearAllFilters,
  } = jobFilters

  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full sm:w-auto gap-2">
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="z-100 w-full px-5 pb-20 sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtres de recherche</SheetTitle>
          <SheetDescription>Affinez votre recherche d'offres d'emploi</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mobile-search">Recherche</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                id="mobile-search"
                value={filters.search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Département</Label>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="departments" className="border rounded-lg">
                <AccordionTrigger className="px-4 hover:no-underline">
                  <span className="text-sm">
                    {filters.departments.length === 0
                      ? 'Tous les départements'
                      : `${filters.departments.length} sélectionné${filters.departments.length > 1 ? 's' : ''}`}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {DEPARTMENTS.map((dept) => (
                      <div key={dept.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={`mobile-dept-${dept.id}`}
                          checked={filters.departments.includes(dept.id)}
                          onCheckedChange={() => toggleDepartment(dept.id)}
                        />
                        <Label
                          htmlFor={`mobile-dept-${dept.id}`}
                          className="text-sm font-normal cursor-pointer leading-tight flex-1"
                        >
                          <p className="font-medium">{dept.shortTitle}</p>
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {filters.departments.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
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
            <div className="space-y-3">
              {Object.entries(EMPLOYMENT_TYPE).map(([key, label]) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mobile-type-${key}`}
                    checked={filters.employmentTypes.includes(key)}
                    onCheckedChange={() => toggleEmploymentType(key as EmploymentType)}
                  />
                  <Label
                    htmlFor={`mobile-type-${key}`}
                    className="text-sm font-normal cursor-pointer leading-none"
                  >
                    {label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="mt-6 gap-2 sm:gap-0">
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearAllFilters} className="w-full sm:w-auto">
              <X className="w-4 h-4 mr-2" />
              Réinitialiser
            </Button>
          )}
          <Button onClick={() => setOpen(false)} className="w-full sm:w-auto">
            Appliquer
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
