import type {
  CellData,
  ColumnDef,
  OnChangeFn,
  PaginationState,
  RowData,
  SortingState,
  TableFeatures,
  TableMeta,
  TableOptions,
} from '@tanstack/react-table'
import { flexRender, useTable } from '@tanstack/react-table'
import { ArrowDownAZIcon, ArrowUpAZIcon, FunnelIcon } from 'lucide-react'
import { DebouncedInput } from '#/shared/components/debounced-input'
import { dashboardTableFeatures } from '#shared/lib/table-features'
import type { DashboardTableFeatures } from '#shared/lib/table-features'
import type { Filters } from '../lib/types/table'
import { cn } from '../lib/utils'
import { Pagination } from './pagination'
import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'

export const DEFAULT_PAGE_INDEX = 0
export const DEFAULT_PAGE_SIZE = 10

type Props<T extends Record<string, unknown>> = {
  data: T[]
  columns: ColumnDef<DashboardTableFeatures, T, unknown>[]
  pagination: PaginationState
  paginationOptions: Pick<
    TableOptions<DashboardTableFeatures, T>,
    'onPaginationChange' | 'rowCount'
  >
  filters: Filters<T>
  onFilterChange: (dataFilters: Partial<Filters<T>>) => void
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
  meta: TableMeta<DashboardTableFeatures, T>
}

// oxlint-disable-next-line react/react-compiler : False positive about TanStack Table
export function Table<T extends Record<string, unknown>>({
  data,
  columns,
  pagination,
  paginationOptions,
  filters,
  onFilterChange,
  sorting,
  onSortingChange,
  meta,
}: Props<T>) {
  const table = useTable({
    features: dashboardTableFeatures,
    data,
    columns,
    state: { pagination, sorting },
    onSortingChange,
    ...paginationOptions,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    meta,
  })

  return (
    <div className="flex flex-col gap-4">
      <UITable>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const fieldMeta = header.column.columnDef.meta
                const canSort = header.column.getCanSort()
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          className={cn('flex items-center gap-2', {
                            'cursor-pointer select-none': canSort,
                          })}
                          {...{
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {canSort &&
                            ({
                              asc: <ArrowUpAZIcon className="size-4" />,
                              desc: <ArrowDownAZIcon className="size-4" />,
                              false: <FunnelIcon className="size-4" />,
                            }[header.column.getIsSorted() as string] ??
                              null)}
                        </div>
                        {header.column.getCanFilter() && fieldMeta?.filterKey !== undefined ? (
                          <DebouncedInput
                            className="w-36 rounded border shadow"
                            onChange={(value) => {
                              // oxlint-disable-next-line typescript/no-unnecessary-type-assertion
                              onFilterChange({
                                [fieldMeta.filterKey as keyof T]: value,
                              } as Partial<Filters<T>>)
                            }}
                            placeholder="Search..."
                            type={fieldMeta.filterVariant === 'number' ? 'number' : 'text'}
                            value={
                              (filters[fieldMeta.filterKey as keyof Filters<T>] ?? '') as
                                | string
                                | number
                            }
                          />
                        ) : null}
                      </>
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
      </UITable>
      <Pagination totalPages={Math.ceil((paginationOptions.rowCount || 1) / pagination.pageSize)} />
    </div>
  )
}

declare module '@tanstack/react-table' {
  // oxlint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<
    in out TFeatures extends TableFeatures,
    in out TData extends RowData,
    TValue extends CellData = CellData,
  > {
    filterKey?: keyof TData
    filterVariant?: 'text' | 'number'
  }
}
