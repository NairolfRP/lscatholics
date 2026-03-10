import router from '@adonisjs/core/services/router'
import { controllers } from '#generated/controllers'
import { middleware } from '#start/kernel'

router
  .group(() => {
    router
      .get('/characters', [controllers.characters.Characters, 'index'])
      .use(middleware.auth())
      .as('characters.list')

    router
      .patch('/characters/current', [controllers.characters.Characters, 'updateCurrent'])
      .use(middleware.auth())
      .as('characters.current')
  })
  .prefix('/user')
