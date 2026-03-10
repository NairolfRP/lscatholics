import type { Data } from '@generated/data'
import type { ComponentType, PropsWithChildren, ReactNode } from 'react'
import type { JSONDataTypes } from '@adonisjs/core/types/transformers'

export type InertiaPageComponent<TProps = {}> = ComponentType<TProps> & {
  layout?: (page: ReactNode) => ReactNode
}

export type InertiaProps<T extends JSONDataTypes = {}> = PropsWithChildren<Data.SharedProps & T>
