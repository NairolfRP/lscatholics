import { Skeleton } from '#shared/components/ui/skeleton.tsx'
import { cn } from '#shared/lib/utils.ts'

export function GiftShopFormSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-5">
      <span className="sr-only">Chargement du formulaire de commande…</span>
      <GiftShopFormSkeletonSection>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2">
          <GiftShopFormSkeletonField labelClassName="max-w-24" />
          <GiftShopFormSkeletonField labelClassName="max-w-32" />
        </div>
      </GiftShopFormSkeletonSection>

      <GiftShopFormSkeletonSection>
        <GiftShopFormSkeletonField labelClassName="max-w-24" description />
        <GiftShopFormSkeletonField labelClassName="max-w-40" description />
      </GiftShopFormSkeletonSection>

      <Skeleton className="h-10 w-full rounded-md sm:w-48 sm:self-end" />
    </div>
  )
}

function GiftShopFormSkeletonSection({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border p-5">
      <Skeleton className="h-5 w-40" />
      {children}
    </div>
  )
}

function GiftShopFormSkeletonField({
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
