import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
  TableMeta,
} from '@tanstack/react-table'
import { Table } from '#shared/components/table.tsx'
import { Button } from '#shared/components/ui/button.tsx'
import type { DashboardTableFeatures } from '#shared/lib/table-features.ts'
import type { Filters } from '#shared/lib/types/table.ts'

type DashboardListProps<TItem extends Record<string, unknown>> = {
  columns: ColumnDef<DashboardTableFeatures, TItem>[]
  data: TItem[] | undefined
  total: number | undefined
  entityLabel: string
  pagination: PaginationState
  onPaginationChange: OnChangeFn<PaginationState>
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  filters: Filters<TItem>
  onFilterChange: (f: Partial<Filters<TItem>>) => void
  meta: TableMeta<DashboardTableFeatures, TItem>
  isDefaultFilters: boolean
  onResetFilters: () => void
}

export function DashboardList<TItem extends Record<string, unknown>>(
  props: DashboardListProps<TItem>
) {
  return (
    <div>
      <Table
        data={props.data ?? []}
        columns={props.columns}
        pagination={props.pagination}
        paginationOptions={{ onPaginationChange: props.onPaginationChange, rowCount: props.total }}
        filters={props.filters}
        onFilterChange={props.onFilterChange}
        sorting={props.sorting}
        onSortingChange={props.onSortingChange}
        meta={props.meta}
      />
      <div className="flex items-center gap-2 pt-5">
        <span className="text-muted-foreground">
          {props.total} {props.entityLabel} trouvés
        </span>
        {!props.isDefaultFilters && (
          <Button onClick={props.onResetFilters} disabled={props.isDefaultFilters}>
            Réinitialiser les filtres
          </Button>
        )}
      </div>
    </div>
  )
}
