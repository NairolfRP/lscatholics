import type { ColumnDef, PaginationState, TableMeta } from '@tanstack/react-table'
import { Table } from '#shared/components/table.tsx'
import { Button } from '#shared/components/ui/button.tsx'

type DashboardListProps<TItem extends Record<string, any>> = {
  columns: Array<ColumnDef<TItem, any>>
  data: Array<TItem> | undefined
  total: number | undefined
  entityLabel: string
  pagination: PaginationState
  onPaginationChange: (p: any) => void
  sorting: any
  onSortingChange: (s: any) => void
  filters: Record<string, unknown>
  onFilterChange: (f: any) => void
  meta: TableMeta<Record<string, any>>
  isDefaultFilters: boolean
  onResetFilters: () => void
}

export function DashboardList<TItem extends Record<string, any>>(props: DashboardListProps<TItem>) {
  return (
    <div>
      <Table
        data={props.data!}
        columns={props.columns as Array<ColumnDef<Record<string, any>, any>>}
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
