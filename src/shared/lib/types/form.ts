import type React from 'react'
import type {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '#/shared/components/ui/field'

type FieldProps = React.ComponentProps<typeof Field>
type FieldLabelProps = React.ComponentProps<typeof FieldLabel>
type FieldDescriptionProps = React.ComponentProps<typeof FieldDescription>
type FieldContentProps = React.ComponentProps<typeof FieldContent>

export type FieldComponentProps<
  C extends React.ElementType,
  T extends Record<string, unknown> = Record<string, unknown>,
  O extends keyof React.ComponentPropsWithRef<C> = Exclude<keyof C, unknown>,
> = {
  id?: string
  fieldProps?: Omit<FieldProps, 'data-invalid'>
  fieldLabelProps?: Omit<FieldLabelProps, 'htmlFor'>
  fieldDescriptionProps?: FieldDescriptionProps
  fieldContentProps?: FieldContentProps
} & Omit<React.ComponentPropsWithRef<C>, 'id' | O> &
  T

export type SelectValues = { label: string; value: string | null }
