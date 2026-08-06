import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createSortedRowModel,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
} from '@tanstack/react-table'

export const dashboardTableFeatures = tableFeatures({
  rowSortingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  rowPaginationFeature,
  sortedRowModel: createSortedRowModel(),
})

export type DashboardTableFeatures = typeof dashboardTableFeatures
