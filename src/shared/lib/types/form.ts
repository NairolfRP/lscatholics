import type { ComponentProps, ComponentPropsWithRef } from 'react'
import type {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from '#/shared/components/ui/field'

type FieldProps = ComponentProps<typeof Field>
type FieldLabelProps = ComponentProps<typeof FieldLabel>
type FieldDescriptionProps = ComponentProps<typeof FieldDescription>
type FieldContentProps = ComponentProps<typeof FieldContent>

export type FieldComponentProps<
  C extends React.ElementType,
  T extends Record<string, unknown> = {},
  O extends keyof ComponentPropsWithRef<C> = Exclude<keyof C, unknown>,
> = {
  id?: string
  fieldProps?: Omit<FieldProps, 'data-invalid'>
  fieldLabelProps?: Omit<FieldLabelProps, 'htmlFor'>
  fieldDescriptionProps?: FieldDescriptionProps
  fieldContentProps?: FieldContentProps
} & Omit<ComponentPropsWithRef<C>, 'id' | O> &
  T

export type SelectValues = { label: string; value: string }
