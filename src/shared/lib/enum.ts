export function createEnum<const T extends Record<string, unknown>>(obj: T) {
  const frozen = Object.freeze({ ...obj })
  const values = Object.freeze(Object.values(frozen)) as [T[keyof T], ...Array<T[keyof T]>]
  return [frozen, values] as const
}
