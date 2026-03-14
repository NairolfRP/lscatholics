import type { ComponentPropsWithoutRef, HTMLAttributes } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Minus, Plus } from 'lucide-react'

export interface NumberFieldContextValue {
  id?: string
  value: number | null
  textValue: string
  inputValue: string
  setInputValue: (val: string) => void
  commitInputValue: () => void
  /** Directly commit a numeric value (bypasses input string parsing) */
  commitValue: (val: number | null) => void
  increment: () => void
  decrement: () => void
  disabled: boolean
  readonly: boolean
  min?: number
  max?: number
  step: number
  inputRef: React.RefObject<HTMLInputElement | null>
}

export const NumberFieldContext = createContext<NumberFieldContextValue | null>(null)

export function useNumberFieldContext(): NumberFieldContextValue {
  const ctx = useContext(NumberFieldContext)
  if (!ctx) throw new Error('NumberField components must be used inside <NumberField>')
  return ctx
}

export interface NumberFieldProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Controlled value */
  value?: number | null
  /** Uncontrolled default value */
  defaultValue?: number
  onChange?: (value: number | null) => void
  min?: number
  max?: number
  /** Step size (default: 1) */
  step?: number
  disabled?: boolean
  readonly?: boolean
  /** Disable value change on wheel scroll */
  disableWheelChange?: boolean
  /** Formatting options passed to Intl.NumberFormat */
  formatOptions?: Intl.NumberFormatOptions
  /** Locale for formatting (defaults to browser locale) */
  locale?: string
  name?: string
  required?: boolean
}

function clamp(value: number, min?: number, max?: number): number {
  let v = value
  if (min !== undefined) v = Math.max(min, v)
  if (max !== undefined) v = Math.min(max, v)
  return v
}

function snapToStep(value: number, step: number, min?: number): number {
  const base = min ?? 0
  return Math.round((value - base) / step) * step + base
}

export interface NumberFieldContentProps extends HTMLAttributes<HTMLDivElement> {}

export function NumberFieldContent({ className, ...props }: NumberFieldContentProps) {
  return (
    <div
      className={cn(
        'relative [&>[data-slot=input]]:has-[[data-slot=increment]]:pr-5 [&>[data-slot=input]]:has-[[data-slot=decrement]]:pl-5',
        className
      )}
      {...props}
    />
  )
}

export interface NumberFieldInputProps extends Omit<
  ComponentPropsWithoutRef<typeof Input>,
  'value' | 'onChange'
> {}

export function NumberFieldInput({
  className,
  onKeyDown,
  onBlur,
  onFocus,
  ...props
}: NumberFieldInputProps) {
  const {
    inputValue,
    setInputValue,
    commitInputValue,
    commitValue,
    increment,
    decrement,
    value,
    min,
    max,
    step,
    disabled,
    readonly,
    inputRef,
    id,
  } = useNumberFieldContext()

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(e)
    if (disabled || readonly) return

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        increment()
        break
      case 'ArrowDown':
        e.preventDefault()
        decrement()
        break
      case 'PageUp': {
        e.preventDefault()
        const current = value ?? min ?? 0
        commitValue(current + step * 10)
        break
      }
      case 'PageDown': {
        e.preventDefault()
        const current = value ?? min ?? 0
        commitValue(current - step * 10)
        break
      }
      case 'Home':
        if (min !== undefined) {
          e.preventDefault()
          commitValue(min)
        }
        break
      case 'End':
        if (max !== undefined) {
          e.preventDefault()
          commitValue(max)
        }
        break
      case 'Enter':
        commitInputValue()
        break
    }
  }

  return (
    <Input
      ref={inputRef}
      id={id}
      data-slot="input"
      type="text"
      inputMode="decimal"
      value={inputValue}
      disabled={disabled}
      readOnly={readonly}
      onChange={(e) => setInputValue(e.target.value)}
      onFocus={(e) => {
        onFocus?.(e)
        e.target.select()
      }}
      onBlur={(e) => {
        onBlur?.(e)
        commitInputValue()
      }}
      onKeyDown={handleKeyDown}
      className={cn('text-center', className)}
      {...props}
    />
  )
}

export interface NumberFieldDecrementProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'onClick'
> {}

export function NumberFieldDecrement({
  className,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  ...props
}: NumberFieldDecrementProps) {
  const { decrement, disabled } = useNumberFieldContext()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    intervalRef.current = null
    timeoutRef.current = null
  }

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    onPointerDown?.(e)
    if (disabled) return
    decrement()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(decrement, 100)
    }, 400)
  }

  useEffect(() => () => clearTimers(), [])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="decrement"
      aria-label="Decrement"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={(e) => {
        onPointerUp?.(e)
        clearTimers()
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        clearTimers()
      }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 left-0 size-9 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children ?? <Minus className="h-4 w-4" />}
    </Button>
  )
}

export interface NumberFieldIncrementProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  'onClick'
> {}

export function NumberFieldIncrement({
  className,
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  ...props
}: NumberFieldIncrementProps) {
  const { increment, disabled } = useNumberFieldContext()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearTimers() {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    intervalRef.current = null
    timeoutRef.current = null
  }

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    onPointerDown?.(e)
    if (disabled) return
    increment()
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(increment, 100)
    }, 400)
  }

  useEffect(() => () => clearTimers(), [])

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      data-slot="increment"
      aria-label="Increment"
      disabled={disabled}
      onPointerDown={handlePointerDown}
      onPointerUp={(e) => {
        onPointerUp?.(e)
        clearTimers()
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e)
        clearTimers()
      }}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 right-0 size-9 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children ?? <Plus className="h-4 w-4" />}
    </Button>
  )
}

export function NumberField({
  className,
  value: controlledValue,
  defaultValue,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  readonly = false,
  disableWheelChange = false,
  formatOptions,
  locale,
  name,
  required,
  children,
  id,
  ...props
}: NumberFieldProps) {
  const isControlled = controlledValue !== undefined

  const [internalValue, setInternalValue] = useState<number | null>(
    defaultValue !== undefined ? defaultValue : null
  )

  const numericValue = isControlled ? (controlledValue ?? null) : internalValue

  const formatter = useMemo(
    () => new Intl.NumberFormat(locale, formatOptions),
    [locale, formatOptions]
  )

  const textValue = numericValue !== null ? formatter.format(numericValue) : ''
  const [inputValue, setInputValueState] = useState(textValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const isFocusedRef = useRef(false)

  // Sync display when value changes externally (not while user is typing)
  useEffect(() => {
    if (!isFocusedRef.current) {
      setInputValueState(textValue)
    }
  }, [textValue])

  const commitValue = useCallback(
    (next: number | null) => {
      const clamped = next !== null ? clamp(snapToStep(next, step, min), min, max) : null
      if (!isControlled) setInternalValue(clamped)
      onChange?.(clamped)
      setInputValueState(clamped !== null ? formatter.format(clamped) : '')
    },
    [isControlled, onChange, formatter, step, min, max]
  )

  // Strip locale formatting and parse to a number
  const parseInput = useCallback(
    (raw: string): number | null => {
      if (raw.trim() === '') return null
      const decimalSep = formatter.format(1.1).replace(/\d/g, '')[0] ?? '.'
      const cleaned = raw
        .replace(new RegExp(`[^0-9${decimalSep}\\-]`, 'g'), '')
        .replace(decimalSep, '.')
      const parsed = parseFloat(cleaned)
      return Number.isNaN(parsed) ? null : parsed
    },
    [formatter]
  )

  const setInputValue = useCallback((val: string) => setInputValueState(val), [])

  const commitInputValue = useCallback(() => {
    commitValue(parseInput(inputValue))
    isFocusedRef.current = false
  }, [inputValue, parseInput, commitValue])

  const increment = useCallback(() => {
    const current = numericValue ?? min ?? 0
    commitValue(clamp(current + step, min, max))
  }, [numericValue, step, min, max, commitValue])

  const decrement = useCallback(() => {
    const current = numericValue ?? min ?? 0
    commitValue(clamp(current - step, min, max))
  }, [numericValue, step, min, max, commitValue])

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (disableWheelChange || disabled || readonly) return
      if (document.activeElement !== inputRef.current) return
      e.preventDefault()
      if (e.deltaY < 0) increment()
      else decrement()
    },
    [disableWheelChange, disabled, readonly, increment, decrement]
  )

  return (
    <NumberFieldContext.Provider
      value={{
        value: numericValue,
        textValue,
        inputValue,
        setInputValue,
        commitInputValue,
        commitValue,
        increment,
        decrement,
        disabled,
        readonly,
        min,
        max,
        step,
        inputRef,
        id,
      }}
    >
      <div
        className={cn('grid gap-1.5', className)}
        onWheel={handleWheel}
        data-disabled={disabled || undefined}
        {...props}
      >
        {children}
        {name && <input type="hidden" name={name} value={numericValue ?? ''} required={required} />}
      </div>
    </NumberFieldContext.Provider>
  )
}
