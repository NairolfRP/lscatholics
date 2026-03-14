import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from '@/shared/components/ui/select'
import {
  sortedLSDistricts,
  sortedNorthDistricts,
} from '@/shared/components/fields/district-select/utils'

export function DistrictSelectGroups() {
  return (
    <>
      <SelectGroup>
        <SelectLabel>Los Santos</SelectLabel>
        {sortedLSDistricts().map((lsDistrict) => (
          <SelectItem key={lsDistrict.id} value={lsDistrict.id}>
            {lsDistrict.label}
          </SelectItem>
        ))}
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup>
        <SelectLabel>Autre ville/district</SelectLabel>
        {sortedNorthDistricts().map((northDistrict) => (
          <SelectItem key={northDistrict.id} value={northDistrict.id}>
            {northDistrict.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </>
  )
}
