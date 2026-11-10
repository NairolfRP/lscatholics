import type { AnyFormApi } from '@tanstack/react-form'
import { z } from 'zod'

export type FieldErrors = Record<string, { message: string }[]>

export function getFieldErrors(error: z.ZodError): FieldErrors {
  return error.issues.reduce<FieldErrors>((acc, issue) => {
    const key = formatErrorPath(issue.path)
    if (!key) return acc
    acc[key] = [...(acc[key] ?? []), { message: issue.message }]
    return acc
  }, {})
}

/**
 * Applies server-side field errors to a TanStack Form instance.
 *
 * `setErrorMap` types `onServer.fields` against `DeepKeys<TFormData>`, but
 * validation errors arrive as runtime strings. This is the single place where
 * that boundary is bridged.
 */
export function applyServerFieldErrors(
  formApi: Pick<AnyFormApi, 'setErrorMap'>,
  error: z.ZodError | FieldErrors
): void {
  const fields = error instanceof z.ZodError ? getFieldErrors(error) : error

  formApi.setErrorMap({ onServer: { fields } } as Parameters<AnyFormApi['setErrorMap']>[0])
}

function formatErrorPath(path: readonly z.core.$ZodIssue['path'][number][]): string {
  let key = ''
  for (const segment of path) {
    if (typeof segment === 'number') {
      key += `[${segment}]`
    } else {
      key += key ? `.${String(segment)}` : String(segment)
    }
  }
  return key
}
