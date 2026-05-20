import { configApp } from '@adonisjs/eslint-config'
import reactHooks from 'eslint-plugin-react-hooks'
import react from 'eslint-plugin-react'

export default configApp(
  {
    ignores: ['tmp/**'],
  },
  {
    plugins: {
      'react-hooks': reactHooks,
      'react': react,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/no-danger': 'warn',
      'react/no-array-index-key': 'off',
      'react/self-closing-comp': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
  {
    rules: {
      '@unicorn/filename-case': ['warn'],
      '@adonisjs/no-backend-import-in-frontend': 'off',
    },
  }
)
