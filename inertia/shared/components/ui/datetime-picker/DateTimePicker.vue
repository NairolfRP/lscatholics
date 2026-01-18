<template>
  <Popover v-model:open="open">
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[280px] justify-start text-left font-normal',
            !props.modelValue && 'text-muted-foreground'
          )
        "
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        <span>{{ formattedValue }}</span>
      </Button>
    </PopoverTrigger>

    <PopoverContent class="w-auto p-0">
      <Calendar v-model="datePart" initial-focus locale="fr" />

      <div class="p-3 border-t border-border">
        <div class="flex items-center justify-center gap-2">
          <Select
            :model-value="hourPart?.toString()"
            @update:model-value="
              (value) =>
                (hourPart = typeof value === 'string' && value ? parseInt(value, 10) : undefined)
            "
          >
            <SelectTrigger class="w-[80px]"><SelectValue placeholder="Heure" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="h in hours" :key="h.value" :value="h.value.toString()">{{
                h.label
              }}</SelectItem>
            </SelectContent>
          </Select>
          <span>:</span>
          <Select
            :model-value="minutePart?.toString()"
            @update:model-value="
              (value) =>
                (minutePart = typeof value === 'string' && value ? parseInt(value, 10) : undefined)
            "
          >
            <SelectTrigger class="w-[80px]"><SelectValue placeholder="Min" /></SelectTrigger>
            <SelectContent>
              <SelectItem v-for="m in minutes" :key="m.value" :value="m.value.toString()">{{
                m.label
              }}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="flex justify-between p-3 border-t border-border">
        <Button size="sm" variant="ghost" @click="setToday">Aujourd'hui</Button>
        <Button size="sm" variant="ghost" @click="clearDate">
          <ClearIcon class="h-4 w-4 mr-1" />
          Effacer
        </Button>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import { computed, ref, type Ref, watch } from 'vue'
import { CalendarDate, type DateValue, getLocalTimeZone } from '@internationalized/date'
import { Calendar as CalendarIcon, X as ClearIcon } from 'lucide-vue-next'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

import { Button } from '@/shared/components/ui/button'
import { Calendar } from '@/shared/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { cn } from '@/lib/utils'

const props = withDefaults(
  defineProps<{
    modelValue?: Date | null
    placeholder?: string
  }>(),
  {
    placeholder: 'Sélectionner une date et heure',
  }
)
const emit = defineEmits(['update:modelValue'])
const datePart: Ref<DateValue | undefined> = ref()
const hourPart: Ref<number | undefined> = ref()
const minutePart: Ref<number | undefined> = ref()
const open = ref(false)
watch(
  () => props.modelValue,
  (newDate) => {
    if (newDate && !isNaN(newDate.getTime())) {
      datePart.value = new CalendarDate(
        newDate.getFullYear(),
        newDate.getMonth() + 1,
        newDate.getDate()
      )
      hourPart.value = newDate.getHours()
      minutePart.value = newDate.getMinutes()
    } else {
      datePart.value = undefined
      hourPart.value = undefined
      minutePart.value = undefined
    }
  },
  { immediate: true }
)
watch([datePart, hourPart, minutePart], ([newDatePart, newHour, newMinute]) => {
  if (newDatePart && newHour !== undefined && newMinute !== undefined) {
    let combinedDate = newDatePart.toDate(getLocalTimeZone())
    combinedDate.setHours(newHour)
    combinedDate.setMinutes(newMinute)
    combinedDate.setSeconds(0)
    if (props.modelValue?.getTime() !== combinedDate.getTime()) {
      emit('update:modelValue', combinedDate)
    }
  }
})
const formattedValue = computed(() => {
  if (props.modelValue) {
    return format(props.modelValue, 'dd MMMM yyyy, HH:mm', { locale: fr })
  }
  return props.placeholder
})
const clearDate = () => {
  emit('update:modelValue', null)
  open.value = false
}
const setToday = () => {
  emit('update:modelValue', new Date())
}
const hours = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, '0'),
}))
const minutes = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, '0'),
}))
</script>
