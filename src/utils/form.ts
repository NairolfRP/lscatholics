import type z from 'zod'

export function getFieldErrors(error: z.ZodError): Record<string, Array<{ message: string }>> {
  return error.issues.reduce<Record<string, Array<{ message: string }>>>((acc, issue) => {
    const key = issue.path[0]?.toString()
    if (!key) return acc
    acc[key] = [...(acc[key] ?? []), { message: issue.message }]
    return acc
  }, {})
}
