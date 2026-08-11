import { APP_PRODUCTION_URL } from '#/config/app.constants'

const MINUTE = 60
const DAY = 24 * 60 * 60

export const SESSION_CONFIG = {
  expiresIn: 7 * DAY,
  updateAge: DAY,
  freshAge: DAY,
  cookieCache: {
    enabled: true,
    maxAge: 5 * MINUTE,
    strategy: 'compact',
    version: '1',
  },
} as const

export const GTAW_PROVIDER_ID = 'gtaw'
export const GTAW_REDIRECT_URI = `${APP_PRODUCTION_URL}/api/auth/callback/gtaw`

export const ERROR_CODES = {
  FORBIDDEN_SIGN_IN_PROVIDER: 'FORBIDDEN_SIGN_IN_PROVIDER',
  CANT_UNLINK_GTAW_ACCOUNT: 'CANT_UNLINK_GTAW_ACCOUNT',
  ONE_ACCOUNT_PER_SOCIAL_PROVIDER: 'ONE_ACCOUNT_PER_SOCIAL_PROVIDER',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const
