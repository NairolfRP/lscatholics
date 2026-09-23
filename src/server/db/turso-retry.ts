import type { Connection, Statement } from '@tursodatabase/serverless'

const RETRYABLE_STATUS = [408, 429, 502, 503, 504]
const MAX_ATTEMPTS = 3
const RETRY_DELAYS = [150, 500, 1500]

function isRetryable(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return RETRYABLE_STATUS.some((status) => error.message.includes(`status: ${status}`))
}

async function withRetry<T>(operation: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (!isRetryable(error) || attempt >= MAX_ATTEMPTS - 1) throw error
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS[attempt]))
    }
  }
}

function wrapStatement<T extends Statement>(statement: T): T {
  return new Proxy(statement, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver)
      if (typeof value !== 'function') return value
      if (property === 'raw') {
        const raw = value as (...args: unknown[]) => Statement
        return (...args: unknown[]) => wrapStatement(raw.apply(target, args))
      }
      return (...args: unknown[]) => withRetry(() => value.apply(target, args))
    },
  })
}

export function connectWithRetries(connection: Connection): Connection {
  return new Proxy(connection, {
    get(target, property, receiver) {
      const value = Reflect.get(target, property, receiver)
      if (typeof value !== 'function') return value

      if (property === 'prepare') {
        const prepare = value as (sql: string) => Promise<Statement>
        return async (sql: string) => {
          const statement = await withRetry(() => prepare.call(target, sql))
          return wrapStatement(statement)
        }
      }

      if (property === 'transaction') {
        return (fn: unknown) => {
          const wrapped = value.call(target, fn)
          if (typeof wrapped === 'function') {
            return (...args: unknown[]) => withRetry(() => wrapped(...args))
          }
          return wrapped
        }
      }

      return (...args: unknown[]) => withRetry(() => value.apply(target, args))
    },
  })
}
