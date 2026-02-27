<template>
  <SelectGroup>
    <SelectLabel>Los Santos</SelectLabel>
    <SelectItem v-for="lsDistrict of sortedLSDistricts" :key="lsDistrict.id" :value="lsDistrict.id">
      {{ lsDistrict.label }}
    </SelectItem>
  </SelectGroup>
  <SelectSeparator />
  <SelectGroup>
    <SelectLabel>Autre ville/district</SelectLabel>
    <SelectItem
      v-for="northDistrict of sortedNorthDistricts"
      :key="northDistrict.id"
      :value="northDistrict.id"
    >
      {{ northDistrict.label }}
    </SelectItem>
  </SelectGroup>
</template>

<script setup lang="ts">
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
} from '@/shared/components/ui/select'
import { sortedLSDistricts, sortedNorthDistricts } from './'
</script>
