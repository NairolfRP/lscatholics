import type { Client, ResultSet, Transaction } from '@libsql/client'
import { LibsqlError } from '@libsql/client'
import { describe, expect, it } from 'vitest'
import { connectWithRetries } from '#server/db/turso-retry'

const result = { rows: [], rowsAffected: 0 } as unknown as ResultSet

function httpError(status: number): LibsqlError {
  return new LibsqlError(
    `Server returned HTTP status ${status}`,
    'SERVER_ERROR',
    undefined,
    undefined,
    Object.assign(new Error(`status ${status}`), { status })
  )
}

function client(overrides: Partial<Client> = {}): Client {
  return { ...overrides } as Client
}

function transaction(overrides: Partial<Transaction> = {}): Transaction {
  return { closed: false, close: () => {}, ...overrides } as Transaction
}

describe('connectWithRetries', () => {
  it('retries execute on a transient error then succeeds', async () => {
    let executeCalls = 0
    const proxied = connectWithRetries(
      client({
        execute: () => {
          executeCalls++
          if (executeCalls === 1) return Promise.reject(httpError(502))
          return Promise.resolve(result)
        },
      })
    )

    await expect(proxied.execute('x')).resolves.toBe(result)
    expect(executeCalls).toBe(2)
  })

  it('gives up after MAX_ATTEMPTS and rethrows the last error', async () => {
    let executeCalls = 0
    const proxied = connectWithRetries(
      client({
        execute: () => {
          executeCalls++
          return Promise.reject(httpError(503))
        },
      })
    )

    await expect(proxied.execute('x')).rejects.toThrow('HTTP status 503')
    expect(executeCalls).toBe(3)
  })

  it('does not retry non-transient errors', async () => {
    let executeCalls = 0
    const proxied = connectWithRetries(
      client({
        execute: () => {
          executeCalls++
          return Promise.reject(httpError(400))
        },
      })
    )

    await expect(proxied.execute('x')).rejects.toThrow('HTTP status 400')
    expect(executeCalls).toBe(1)
  })

  it('retries a failing batch', async () => {
    let batchCalls = 0
    const proxied = connectWithRetries(
      client({
        batch: () => {
          batchCalls++
          if (batchCalls === 1) return Promise.reject(httpError(502))
          return Promise.resolve([result])
        },
      })
    )

    await expect(proxied.batch(['x'])).resolves.toEqual([result])
    expect(batchCalls).toBe(2)
  })

  it('retries transaction()', async () => {
    let transactionCalls = 0
    const proxied = connectWithRetries(
      client({
        transaction: () => {
          transactionCalls++
          if (transactionCalls === 1) return Promise.reject(httpError(502))
          return Promise.resolve(transaction())
        },
      })
    )

    await expect(proxied.transaction()).resolves.toMatchObject({ closed: false })
    expect(transactionCalls).toBe(2)
  })

  it('retries a failing statement execution inside a transaction', async () => {
    let executeCalls = 0
    const proxied = connectWithRetries(
      client({
        transaction: () =>
          Promise.resolve(
            transaction({
              execute: () => {
                executeCalls++
                if (executeCalls === 1) return Promise.reject(httpError(502))
                return Promise.resolve(result)
              },
            })
          ),
      })
    )

    const tx = await proxied.transaction()
    await expect(tx.execute('x')).resolves.toBe(result)
    expect(executeCalls).toBe(2)
  })

  it('keeps close() synchronous', () => {
    let closed = false
    const proxied = connectWithRetries(client({ close: () => void (closed = true) }))

    expect(proxied.close()).toBeUndefined()
    expect(closed).toBe(true)
  })

  it('passes non-function properties through', () => {
    const proxied = connectWithRetries(client({ closed: false }))
    expect(proxied.closed).toBe(false)
  })

  it('borne les tentatives sous charge concurrente lors du réveil', async () => {
    let calls = 0
    const wakeUntil = Date.now() + 200
    const proxied = connectWithRetries(
      client({
        execute: () => {
          calls++
          if (Date.now() < wakeUntil) return Promise.reject(httpError(503))
          return Promise.resolve(result)
        },
      })
    )

    const results = await Promise.all(Array.from({ length: 20 }, () => proxied.execute('x')))

    expect(results).toHaveLength(20)
    expect(results.every((r) => r === result)).toBe(true)
    expect(calls).toBeLessThanOrEqual(20 * 3)
  })
})
