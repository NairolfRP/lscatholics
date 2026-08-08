import { useSuspenseQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { Filter, SearchIcon } from 'lucide-react'
import { departments } from '#/config/departments.ts'
import { JobPostingCard } from '#/features/job-posting/components/job-posting-card.tsx'
import { CAREERS_PAGINATION_LIMIT } from '#/features/job-posting/constants/job-posting.constants.ts'
import { jobPostingsQueryOptions } from '#/features/job-posting/queries.ts'
import { DebouncedInput } from '#shared/components/debounced-input.tsx'
import { Pagination } from '#shared/components/pagination.tsx'
import { Button } from '#shared/components/ui/button'
import { Card, CardContent, CardHeader } from '#shared/components/ui/card'
import { Checkbox } from '#shared/components/ui/checkbox'
import { Label } from '#shared/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#shared/components/ui/select'
import { Separator } from '#shared/components/ui/separator'
import { Spinner } from '#shared/components/ui/spinner.tsx'
import { EMPLOYMENT_TYPE_VALUES, employmentTypeLabel } from '#shared/constants/employment.ts'
import Hero from '#shared/layouts/app/components/hero.tsx'

const departmentItems = departments.map((department) => ({
  label: department.shortTitle ?? department.title,
  value: department.id,
}))

export default function JobPostingsPage() {
  const navigate = useNavigate({ from: '/careers' })
  const routeSearch = useSearch({ from: '/_app/careers' })
  const { data, isFetching } = useSuspenseQuery(jobPostingsQueryOptions(routeSearch))

  const jobs = data.jobPostings
  const totalPages = Math.ceil(data.total / CAREERS_PAGINATION_LIMIT)
  const hasActiveFilters = Boolean(
    routeSearch.search?.trim() || routeSearch.department || routeSearch.type.length > 0
  )

  const handleInputSearch = (text: string) => {
    const trimmed = text.trim()
    if (routeSearch.search && trimmed.toUpperCase() === routeSearch.search.trim().toUpperCase()) {
      return
    }

    void navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        search: trimmed,
      }),
      reloadDocument: false,
    })
  }

  const handleClearFilters = () => {
    void navigate({
      search: {},
    })
  }

  return (
    <>
      <Hero
        variant="minimal"
        title="Offres d'emploi"
        subtitle="Travaillez pour l'archidiocèse de Los Santos"
      />
      <div className="container mx-auto max-w-7xl px-4 pt-15 pb-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-72">
            <Card className="sticky top-[calc(var(--header-height)+25px)] shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Filter className="h-5 w-5" />
                  Filtres
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="search">Mots-clés</Label>
                  <div className="relative">
                    <SearchIcon className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />
                    <DebouncedInput
                      type="search"
                      id="search"
                      placeholder="Rechercher..."
                      aria-label="Rechercher..."
                      className="pl-9"
                      value={routeSearch.search}
                      onChange={(v) => handleInputSearch(v as string)}
                      disabled={isFetching}
                      debounce={500}
                      autoComplete="off"
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label>Département</Label>
                  <Select
                    items={departmentItems}
                    value={routeSearch.department ?? null}
                    onValueChange={(v) => {
                      void navigate({
                        search: (prev) => ({ ...prev, page: 1, department: v ?? undefined }),
                      })
                    }}
                    disabled={isFetching}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Tous les départements" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value={null}>Tous les départements</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        {departmentItems.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <Label>Type de contrat</Label>
                  <div className="space-y-3">
                    {EMPLOYMENT_TYPE_VALUES.map((type) => (
                      <div key={type} className="flex items-center space-x-3">
                        <Checkbox
                          id={`type-${type}`}
                          checked={routeSearch.type.includes(type)}
                          onCheckedChange={(checked) => {
                            void navigate({
                              search: (prev) => ({
                                ...prev,
                                page: 1,
                                type: checked
                                  ? [...prev.type, type]
                                  : prev.type.filter((v) => v !== type),
                              }),
                            })
                          }}
                          disabled={isFetching}
                        />
                        <Label
                          htmlFor={`type-${type}`}
                          className="cursor-pointer text-sm font-normal text-muted-foreground"
                        >
                          {employmentTypeLabel[type]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="flex-1 space-y-6">
            <Card className="shadow-sm">
              <CardContent className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  <span className="font-bold">{data.total}</span> offres trouvées
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {isFetching && (
                <div>
                  <Spinner className="mx-auto size-10 text-muted-foreground" />
                </div>
              )}
              {jobs.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
                  <p className="text-lg font-medium text-muted-foreground">
                    Aucune offre ne correspond à vos critères.
                  </p>
                  {hasActiveFilters && (
                    <Button variant="link" onClick={() => handleClearFilters()}>
                      Réinitialiser les filtres
                    </Button>
                  )}
                </div>
              )}

              {jobs.map((job) => (
                <JobPostingCard key={job.slug} job={job} />
              ))}
            </div>

            <div className="pt-8">
              <Pagination totalPages={totalPages} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
