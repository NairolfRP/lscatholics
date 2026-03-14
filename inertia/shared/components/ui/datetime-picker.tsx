import { useEffect, useMemo, useState } from 'react'
import { Calendar as CalendarIcon, X as ClearIcon } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
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

const hours = Array.from({ length: 24 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, '0'),
}))

const minutes = Array.from({ length: 60 }, (_, i) => ({
  value: i,
  label: i.toString().padStart(2, '0'),
}))

type Props = {
  id?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
  placeholder?: string
}

export default function DateTimePicker({
  id,
  value,
  onChange,
  placeholder = 'Sélectionner une date et heure',
}: Props) {
  const [open, setOpen] = useState(false)
  const [datePart, setDatePart] = useState<Date | undefined>(undefined)
  const [hourPart, setHourPart] = useState<number | undefined>(undefined)
  const [minutePart, setMinutePart] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (value && !isNaN(value.getTime())) {
      setDatePart(value)
      setHourPart(value.getHours())
      setMinutePart(value.getMinutes())
    } else {
      setDatePart(undefined)
      setHourPart(undefined)
      setMinutePart(undefined)
    }
  }, [value])

  useEffect(() => {
    if (datePart && hourPart !== undefined && minutePart !== undefined) {
      const combinedDate = new Date(datePart)
      combinedDate.setHours(hourPart)
      combinedDate.setMinutes(minutePart)
      combinedDate.setSeconds(0)

      if (value?.getTime() !== combinedDate.getTime()) {
        onChange?.(combinedDate)
      }
    }
  }, [datePart, hourPart, minutePart, onChange, value])

  const formattedValue = useMemo(() => {
    if (value) return format(value, 'dd MMMM yyyy, HH:mm', { locale: fr })
    return placeholder
  }, [value, placeholder])

  const clearDate = () => {
    onChange?.(null)
    setOpen(false)
  }

  const setToday = () => {
    onChange?.(new Date())
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span>{formattedValue}</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={datePart} onSelect={setDatePart} locale={fr} autoFocus />

        <div className="p-3 border-t border-border">
          <div className="flex items-center justify-center gap-2">
            <Select
              value={hourPart?.toString()}
              onValueChange={(val) => setHourPart(val ? parseInt(val, 10) : undefined)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Heure" />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h.value} value={h.value.toString()}>
                    {h.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span>:</span>

            <Select
              value={minutePart?.toString()}
              onValueChange={(val) => setMinutePart(val ? parseInt(val, 10) : undefined)}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Min" />
              </SelectTrigger>
              <SelectContent>
                {minutes.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between p-3 border-t border-border">
          <Button size="sm" variant="ghost" onClick={setToday}>
            Aujourd'hui
          </Button>
          <Button size="sm" variant="ghost" onClick={clearDate}>
            <ClearIcon className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
