import type { Client, Transaction } from '@libsql/client'

const RETRYABLE_STATUS = [408, 429, 502, 503, 504]
const MAX_ATTEMPTS = 3
const RETRY_DELAYS = [150, 500, 1500]

function statusOf(error: unknown): number | undefined {
  const candidates: unknown[] = [error]
  if (error instanceof Error) candidates.push(error.cause)

  for (const candidate of candidates) {
    if (typeof candidate !== 'object' || candidate === null || !('status' in candidate)) continue
    if (typeof candidate.status === 'number') return candidate.status
  }

  return undefined
}

function isRetryable(error: unknown): boolean {
  const status = statusOf(error)
  return status !== undefined && RETRYABLE_STATUS.includes(status)
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

function wrapTransaction(transaction: Transaction): Transaction {
  return new Proxy(transaction, {
    get(target, property) {
      const value = Reflect.get(target, property, target)
      if (typeof value !== 'function') return value
      if (property === 'close') return value.bind(target)
      return (...args: unknown[]) => withRetry(() => value.apply(target, args))
    },
  })
}

export function connectWithRetries(client: Client): Client {
  return new Proxy(client, {
    get(target, property) {
      const value = Reflect.get(target, property, target)
      if (typeof value !== 'function') return value
      if (property === 'close' || property === 'reconnect') return value.bind(target)

      if (property === 'transaction') {
        return async (...args: unknown[]) =>
          wrapTransaction(await withRetry(() => value.apply(target, args)))
      }

      return (...args: unknown[]) => withRetry(() => value.apply(target, args))
    },
  })
}
