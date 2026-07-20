import { env } from '#/config/env.server'

export const inDev = env.NODE_ENV === 'development'
export const inProd = env.NODE_ENV === 'production'
