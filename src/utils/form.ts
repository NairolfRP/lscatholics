import type z from 'zod'

export function getFieldErrors(error: z.ZodError): Record<string, { message: string }[]> {
  return error.issues.reduce<Record<string, { message: string }[]>>((acc, issue) => {
    const key = formatErrorPath(issue.path)
    if (!key) return acc
    acc[key] = [...(acc[key] ?? []), { message: issue.message }]
    return acc
  }, {})
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
