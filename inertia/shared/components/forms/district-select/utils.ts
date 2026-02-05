import { computed } from 'vue'
import { getLSDistricts, getNorthDistricts } from '#shared/constants/districts.constants'

export const sortedLSDistricts = computed(() =>
  getLSDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)

export const sortedNorthDistricts = computed(() =>
  getNorthDistricts().toSorted((a, b) => a.label.localeCompare(b.label))
)
