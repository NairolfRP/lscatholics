import type { JSONDataTypes } from '@adonisjs/core/types/transformers'
import type { SharedProps } from '@adonisjs/inertia/types'

export type InertiaProps<T extends JSONDataTypes = {}> = SharedProps & T
