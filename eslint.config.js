import { configApp } from '@adonisjs/eslint-config'

export default configApp({
  rules: {
    '@unicorn/filename-case': ['warn'],
    '@adonisjs/no-backend-import-in-frontend': 'off',
  },
})
