import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'
import { InferSocialProviders } from '@adonisjs/ally/types'
import { GTAWDriver } from '@gtaw-oauth-providers/adonisjs-ally'

const allyConfig = defineConfig({
  gtaw: GTAWDriver({
    server: 'fr',
    clientId: env.get('GTAW_CLIENT_ID'),
    clientSecret: env.get('GTAW_CLIENT_SECRET'),
    callbackUrl: 'https://archls.infos.st/api/auth/gtaw/callback',
  }),
  discord: services.discord({
    clientId: env.get('DISCORD_CLIENT_ID'),
    clientSecret: env.get('DISCORD_CLIENT_SECRET'),
    callbackUrl: '',
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
