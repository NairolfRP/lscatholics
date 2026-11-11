import { env } from '#/config/env.server'

export const inProd = env.NODE_ENV === 'production'
