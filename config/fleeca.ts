import env from '#start/env'

type FleecaConfig = {
  server: 'fr' | 'en'
  authKey: string
  sessionTTL: number
}

const fleecaConfig: FleecaConfig = {
  server: 'fr',
  authKey: env.get('GTAW_FLEECA_AUTH_KEY'),
  sessionTTL: 1800,
}

export default fleecaConfig
