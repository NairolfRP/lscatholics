export type PaginatedData<T> = {
  result: Array<T>
  rowCount: number
}

export type PaginationParams = { page: number; pageSize: number }
export type SortParams = { sortBy: `${string}.${'asc' | 'desc'}` }
export type Filters<T> = Partial<T & PaginationParams & SortParams>
