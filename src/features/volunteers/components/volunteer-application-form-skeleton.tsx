import { CardContent, CardFooter } from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import { cn } from '#shared/lib/utils.ts'

export function VolunteerApplicationFormSkeleton() {
  return (
    <>
      <CardContent role="status">
        <span className="sr-only">Chargement du formulaire de candidature…</span>
        <FieldGroup>
          <VolunteerFormSkeletonSection>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <VolunteerFormSkeletonField labelClassName="max-w-24" />
              <VolunteerFormSkeletonField labelClassName="max-w-32" />
              <VolunteerFormSkeletonField labelClassName="max-w-36" description />
              <VolunteerFormSkeletonField labelClassName="max-w-16" description />
            </div>
          </VolunteerFormSkeletonSection>

          <VolunteerFormSkeletonSection>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <VolunteerFormSkeletonField labelClassName="max-w-28" description />
              <VolunteerFormSkeletonField labelClassName="max-w-32" description />
              <VolunteerFormSkeletonField labelClassName="max-w-24" description />
              <VolunteerFormSkeletonField labelClassName="max-w-36" description />
            </div>
          </VolunteerFormSkeletonSection>

          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end" aria-hidden="true">
        <div className="h-10 w-48 animate-pulse rounded-md bg-muted" />
      </CardFooter>
    </>
  )
}

function VolunteerFormSkeletonSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-5">
      <Skeleton className="h-5 w-40" />
      {children}
    </div>
  )
}

function VolunteerFormSkeletonField({
  labelClassName,
  description = false,
}: {
  labelClassName: string
  description?: boolean
}) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Skeleton className={cn('h-4', labelClassName)} />
        {description && <Skeleton className="h-3 max-w-64" />}
      </div>
      <Skeleton className="h-9 rounded-md" />
    </div>
  )
}
