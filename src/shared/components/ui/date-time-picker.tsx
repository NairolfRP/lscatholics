'use client'

/**
 * DateTimePicker — shadcn/ui (Base UI) component
 *
 * Dependencies:
 *   bunx shadcn@latest add popover calendar button input label
 *   date-fns (bundled with react-day-picker)
 *
 * Usage:
 *   <DateTimePicker value={date} onChange={setDate} />
 */

import * as React from 'react'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { fr } from 'react-day-picker/locale'
import { Button } from '#/shared/components/ui/button'
import { Calendar } from '#/shared/components/ui/calendar'
import { Input } from '#/shared/components/ui/input'
import { Label } from '#/shared/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '#/shared/components/ui/popover'
import { cn } from '#/shared/lib/utils'
import { formatDateTime } from '#/utils/date'

// ─── Types ──────────────────────────────────────────────────────────────────

type DateTimePickerInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'className' | 'defaultValue' | 'placeholder' | 'type' | 'value' | 'onBlur' | 'onChange'
>

interface DateTimePickerProps extends DateTimePickerInputProps {
  /** Input name **/
  name?: string
  /** Controlled value — a plain JS Date object, or undefined when empty. */
  value?: Date
  /** Called with the new Date each time date or time changes, or undefined when cleared. */
  onChange?: (date: Date | undefined) => void
  /** Called when the visible picker trigger loses focus. */
  onBlur?: React.FocusEventHandler<HTMLButtonElement>
  /** Placeholder shown in the trigger when no date is selected. */
  placeholder?: string
  /** Set the field as required */
  required?: boolean
  /** Disable the entire picker. */
  disabled?: boolean
  /** Extra class names forwarded to the trigger button. */
  className?: string
  endMonth?: Date
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Pads a number to two digits (e.g. 9 → "09"). */
const pad = (n: number): string => String(n).padStart(2, '0')

/**
 * Returns "HH:MM" from a Date.
 * Falls back to "00:00" when date is undefined.
 */
const toTimeString = (date: Date | undefined): string => {
  if (!date) return '00:00'
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Combines a calendar day with a time string "HH:MM" into a new Date.
 * Preserves the date's seconds as-is (zeroed on first pick).
 */
const combineDateTime = (day: Date, timeStr: string): Date => {
  const [hoursStr, minutesStr] = timeStr.split(':')
  const result = new Date(day)
  // oxlint-disable-next-line typescript/no-unnecessary-condition
  result.setHours(Number(hoursStr ?? 0), Number(minutesStr ?? 0), 0, 0)
  return result
}

export function DateTimePicker({
  id,
  name,
  value,
  onChange,
  onBlur,
  placeholder = 'Pick a date & time',
  required,
  disabled = false,
  endMonth,
  className,
  'aria-invalid': ariaInvalid,
  'aria-required': ariaRequired,
  ...inputProps
}: DateTimePickerProps) {
  const [timeStr, setTimeStr] = React.useState<string>(() => toTimeString(value))

  React.useEffect(() => {
    // oxlint-disable-next-line react/react-compiler
    setTimeStr(toTimeString(value))
  }, [value])

  const handleDaySelect = (day: Date | undefined) => {
    if (!day) {
      onChange?.(undefined)
      return
    }
    onChange?.(combineDateTime(day, timeStr))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setTimeStr(newTime)

    if (value && newTime) {
      onChange?.(combineDateTime(value, newTime))
    }
  }

  const formattedLabel = value ? formatDateTime(value) : placeholder
  const inputValue = value ? value.toISOString() : ''

  return (
    <>
      {name ? (
        <input
          {...inputProps}
          type="hidden"
          name={name}
          value={inputValue}
          required={required}
          disabled={disabled}
        />
      ) : null}
      <Popover>
        <PopoverTrigger
          disabled={disabled}
          render={
            <Button
              id={id}
              variant="outline"
              data-empty={!value}
              aria-invalid={ariaInvalid}
              aria-required={ariaRequired}
              onBlur={onBlur}
              className={cn(
                'w-70 justify-start text-left font-normal',
                'data-[empty=true]:text-muted-foreground',
                className
              )}
            >
              <CalendarIcon className="mr-2 size-4 shrink-0" />
              <span>{formattedLabel}</span>
            </Button>
          }
        />

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            locale={fr}
            timeZone="Europe/Paris"
            selected={value}
            onSelect={handleDaySelect}
            defaultMonth={value}
            endMonth={endMonth}
          />

          <div className="border-t p-3">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-4 shrink-0 text-muted-foreground" />
              <Label htmlFor="datetime-picker-time" className="sr-only">
                Time
              </Label>
              <Input
                id="datetime-picker-time"
                type="time"
                value={timeStr}
                onChange={handleTimeChange}
                disabled={!value}
                className="h-8 w-full cursor-pointer"
              />
            </div>
            {!value && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Select a date first to set the time.
              </p>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
