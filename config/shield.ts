import { defineConfig } from '@adonisjs/shield'
import app from '@adonisjs/core/services/app'

const shieldConfig = defineConfig({
  /**
   * Configure CSP policies for your app. Refer documentation
   * to learn more
   */
  csp: {
    enabled: true,
    directives: {
      defaultSrc: [`'self'`],
      scriptSrc: app.inDev
        ? [`'self'`, `'unsafe-eval'`, `'unsafe-inline'`, 'https://cloud.umami.is']
        : [`'self'`, 'https://cloud.umami.is'],
      styleSrc: [`'self'`, `'unsafe-inline'`, 'https://fonts.googleapis.com'],
      imgSrc: [`'self'`, 'data:', 'https:'],
      fontSrc: [`'self'`, 'https://fonts.gstatic.com'],
      connectSrc: [
        `'self'`,
        ...(app.inDev ? ['ws://localhost:24678'] : []),
        'https://api.aelf.org',
        'https://ucp-fr.gta.world',
        'https://api-gateway.umami.dev',
      ],
      frameSrc: [`'none'`],
      objectSrc: [`'none'`],
      baseUri: [`'self'`],
      formAction: [`'self'`],
      frameAncestors: [`'none'`],
    },
    reportOnly: false,
  },

  /**
   * Configure CSRF protection options. Refer documentation
   * to learn more
   */
  csrf: {
    enabled: true,
    exceptRoutes: [],
    enableXsrfCookie: true,
    methods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  },

  /**
   * Control how your website should be embedded inside
   * iFrames
   */
  xFrame: {
    enabled: true,
    action: 'DENY',
  },

  /**
   * Force browser to always use HTTPS
   */
  hsts: {
    enabled: true,
    maxAge: '180 days',
  },

  /**
   * Disable browsers from sniffing the content type of a
   * response and always rely on the "content-type" header.
   */
  contentTypeSniffing: {
    enabled: true,
  },
})

export default shieldConfig
