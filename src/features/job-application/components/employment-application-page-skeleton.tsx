import { Card, CardContent, CardHeader } from '#shared/components/ui/card.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'

export function EmploymentApplicationPageSkeleton() {
  return (
    <>
      <section className="relative flex w-full overflow-hidden bg-linear-to-r from-blue-900 to-blue-700 pt-[calc(var(--header-height)+1rem)] pb-16">
        <div className="relative mx-auto flex w-full max-w-7xl flex-col justify-center gap-5 px-6 md:px-10">
          <Skeleton className="h-6 w-64 rounded-full bg-white/20" />
          <Skeleton className="h-10 w-3/5 bg-white/20 sm:h-12 md:h-14" />
          <Skeleton className="h-4 w-2/3 max-w-xl bg-white/20" />
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 pt-5 pb-20 sm:px-6 lg:px-8">
        <Skeleton className="h-11 w-56 rounded-lg" />

        <div className="mt-10 grid grid-cols-1 items-start gap-5 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader className="gap-3">
              <Skeleton className="h-7 w-64" />
              <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
              <Skeleton className="h-28 rounded-xl" />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <Skeleton className="h-6 w-44" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
