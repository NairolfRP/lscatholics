import env from '#start/env'
import type { Secret } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

type FleecaConfig = {
  apiKey: Secret<string>
  baseUrl: string
  timeout: number
  mode: 0 | 1
}

/**
 * Fleeca v2 gateway configuration.
 *
 * Mode:     0 = sandbox (non-production), 1 = live.
 */
const fleecaConfig: FleecaConfig = {
  apiKey: env.get('FLEECA_API_KEY'),
  baseUrl: env.get('FLEECA_BASE_URL', 'https://fleeca.gta.world/api/v2'),
  /** HTTP timeout for Fleeca API calls (ms) */
  timeout: 15_000,
  /** 0 = sandbox, 1 = live – driven by NODE_ENV */
  mode: app.inProduction ? (1 as const) : (0 as const),
}

export default fleecaConfig
