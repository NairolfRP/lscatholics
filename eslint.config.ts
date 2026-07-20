import tsParser from '@typescript-eslint/parser'
// @ts-ignore
import drizzle from 'eslint-plugin-drizzle'
import oxlintPlugin from 'eslint-plugin-oxlint'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
  {
    files: ['**/server/repositories/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      drizzle,
    },
    rules: {
      'drizzle/enforce-delete-with-where': 'error',
      'drizzle/enforce-update-with-where': 'error',
    },
  },
  ...oxlintPlugin.configs['flat/recommended']
)
