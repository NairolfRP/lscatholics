import { CardContent, CardFooter } from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import { cn } from '#shared/lib/utils.ts'

export function RegisterParishionerFormSkeleton() {
  return (
    <>
      <CardContent role="status">
        <span className="sr-only">Chargement du formulaire d'inscription…</span>
        <FieldGroup>
          <ParishionerFormSkeletonSection>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <ParishionerFormSkeletonField labelClassName="max-w-24" />
              <ParishionerFormSkeletonField labelClassName="max-w-32" />
              <ParishionerFormSkeletonField labelClassName="max-w-16" />
              <ParishionerFormSkeletonField labelClassName="max-w-28" />
            </div>
          </ParishionerFormSkeletonSection>

          <ParishionerFormSkeletonSection>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <ParishionerFormSkeletonField labelClassName="max-w-20" description />
              <ParishionerFormSkeletonField labelClassName="max-w-28" />
              <ParishionerFormSkeletonField labelClassName="max-w-24" description />
              <ParishionerFormSkeletonField labelClassName="max-w-32" description />
            </div>
          </ParishionerFormSkeletonSection>

          <ParishionerFormSkeletonSection>
            <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
              <ParishionerFormSkeletonField labelClassName="max-w-24" />
              <ParishionerFormSkeletonField labelClassName="max-w-16" />
            </div>
            <ParishionerFormSkeletonField labelClassName="max-w-20" description />
          </ParishionerFormSkeletonSection>
        </FieldGroup>
      </CardContent>
      <CardFooter className="justify-end" aria-hidden="true">
        <div className="h-10 w-40 animate-pulse rounded-md bg-muted" />
      </CardFooter>
    </>
  )
}

type ParishionerFormSkeletonSectionProps = {
  children: React.ReactNode
}

function ParishionerFormSkeletonSection({ children }: ParishionerFormSkeletonSectionProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-5">
      <Skeleton className="h-5 w-40" />
      {children}
    </div>
  )
}

type ParishionerFormSkeletonFieldProps = {
  labelClassName: string
  description?: boolean
}

function ParishionerFormSkeletonField({
  labelClassName,
  description = false,
}: ParishionerFormSkeletonFieldProps) {
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
