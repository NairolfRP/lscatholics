import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'
import { Input } from './ui/input'

export function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 200,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<ComponentProps<typeof Input>, 'onChange'>) {
  const [value, setValue] = useState<string | number>(initialValue)

  useEffect(() => {
    // oxlint-disable-next-line react/react-compiler
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <Input
      {...props}
      // oxlint-disable-next-line typescript/no-unnecessary-condition
      value={value ?? ''}
      onChange={(e) => {
        if (e.target.value === '') return setValue('')
        if (props.type === 'number') {
          setValue(e.target.valueAsNumber)
        } else {
          setValue(e.target.value)
        }
      }}
    />
  )
}
