import env from '#start/env'
import { defineConfig, services } from '@adonisjs/ally'
import { InferSocialProviders } from '@adonisjs/ally/types'
import { GTAWDriver } from '@gtaw-oauth-providers/adonisjs-ally'
import app from '@adonisjs/core/services/app'

const allyConfig = defineConfig({
  gtaw: GTAWDriver({
    server: 'fr',
    clientId: env.get('GTAW_CLIENT_ID'),
    clientSecret: env.get('GTAW_CLIENT_SECRET'),
    callbackUrl: 'https://archls.infos.st/api/auth/callback/gtaw',
  }),
  discord: services.discord({
    clientId: env.get('DISCORD_CLIENT_ID'),
    clientSecret: env.get('DISCORD_CLIENT_SECRET'),
    callbackUrl: app.inProduction
      ? 'https://archls.infos.st/api/auth/callback/discord'
      : 'http://localhost:3333/api/auth/callback/discord',
    scopes: ['identify'],
  }),
})

export default allyConfig

declare module '@adonisjs/ally/types' {
  interface SocialProviders extends InferSocialProviders<typeof allyConfig> {}
}
