/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#auth/controllers/auth_controller')
router
  .group(() => {
    router.get('/redirect/gtaw', [AuthController, 'redirectToProvider'])
    router.get('/callback/gtaw', [AuthController, 'handleCallback'])
    router.get('/logout', [AuthController, 'logout']).use(middleware.auth()).as('logout')
  })
  .prefix('api/auth')
