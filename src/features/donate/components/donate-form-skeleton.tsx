import { CardContent, CardFooter } from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import { cn } from '#shared/lib/utils.ts'

export function DonateFormSkeleton() {
  return (
    <>
      <CardContent role="status">
        <span className="sr-only">Chargement du formulaire de don…</span>
        <FieldGroup>
          <DonateFormSkeletonSection>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-9 rounded-md" />
              ))}
            </div>
          </DonateFormSkeletonSection>

          <DonateFormSkeletonSection>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <DonateFormSkeletonField labelClassName="max-w-24" />
              <DonateFormSkeletonField labelClassName="max-w-32" />
              <DonateFormSkeletonField labelClassName="max-w-16" description />
              <DonateFormSkeletonField labelClassName="max-w-28" description />
            </div>
          </DonateFormSkeletonSection>

          <DonateFormSkeletonSection>
            <DonateFormSkeletonField labelClassName="max-w-40" description />
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <DonateFormSkeletonField labelClassName="max-w-24" description />
              <DonateFormSkeletonField labelClassName="max-w-32" description />
            </div>
          </DonateFormSkeletonSection>

          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end" aria-hidden="true">
        <div className="h-10 w-56 animate-pulse rounded-md bg-muted" />
      </CardFooter>
    </>
  )
}

function DonateFormSkeletonSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-5">
      <Skeleton className="h-5 w-40" />
      {children}
    </div>
  )
}

function DonateFormSkeletonField({
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
