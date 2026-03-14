import { getLSDistricts, getNorthDistricts } from '#shared/constants/districts.constants'

export const sortedLSDistricts = () =>
  getLSDistricts().toSorted((a, b) => a.label.localeCompare(b.label))

export const sortedNorthDistricts = () =>
  getNorthDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
