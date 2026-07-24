export type OrderBy<TColumns> =
  | `${Extract<keyof TColumns, string>}.${'asc' | 'desc'}`
  | (string & {})
