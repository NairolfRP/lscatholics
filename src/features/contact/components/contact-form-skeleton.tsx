import { CardContent, CardFooter } from '#shared/components/ui/card.tsx'
import { FieldGroup } from '#shared/components/ui/field.tsx'
import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import { cn } from '#shared/lib/utils.ts'

export function ContactFormSkeleton() {
  return (
    <>
      <CardContent role="status">
        <span className="sr-only">Chargement du formulaire de contact…</span>
        <FieldGroup aria-hidden="true">
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
            <ContactFormSkeletonField labelClassName="max-w-20" controlClassName="h-9" />
            <ContactFormSkeletonField labelClassName="max-w-32" controlClassName="h-9" />
          </div>
          <ContactFormSkeletonField labelClassName="max-w-24" controlClassName="h-9 max-w-92" />
          <ContactFormSkeletonField labelClassName="max-w-20" description controlClassName="h-9" />
          <ContactFormSkeletonField labelClassName="max-w-24" controlClassName="h-25" counter />
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex justify-start gap-4" aria-hidden="true">
        <div className="flex h-10 w-full animate-pulse items-center justify-center gap-2 rounded-md bg-muted">
          <span className="size-4 rounded-full bg-muted-foreground/25" />
          <span className="h-3 w-24 rounded-md bg-muted-foreground/25" />
        </div>
      </CardFooter>
    </>
  )
}

type ContactFormSkeletonFieldProps = {
  labelClassName: string
  controlClassName: string
  description?: boolean
  counter?: boolean
}

function ContactFormSkeletonField({
  labelClassName,
  controlClassName,
  description = false,
  counter = false,
}: ContactFormSkeletonFieldProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-1">
        <Skeleton className={cn('h-4', labelClassName)} />
        {description && <Skeleton className="h-3 max-w-64" />}
      </div>
      <Skeleton className={cn('rounded-md', controlClassName)} />
      {counter && <Skeleton className="ml-auto h-3 w-14" />}
    </div>
  )
}
