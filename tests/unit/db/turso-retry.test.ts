import type { Connection, Statement } from '@tursodatabase/serverless'
import { describe, expect, it } from 'vitest'
import { connectWithRetries } from '#server/db/turso-retry'

const RETRYABLE = 'HTTP error! status: 502'

function statement(overrides: Record<string, unknown> = {}) {
  const stmt = {
    raw: () => stmt,
    on: () => stmt,
    ...overrides,
  }
  return stmt as unknown as Statement
}

function connection({ prepare, transaction }: Partial<Connection> = {}): Connection {
  return { ...(prepare ? { prepare } : {}), ...(transaction ? { transaction } : {}) } as Connection
}

describe('connectWithRetries', () => {
  it('retries prepare on a transient error then succeeds', async () => {
    let prepareCalls = 0
    const proxied = connectWithRetries(
      connection({
        prepare: () => {
          prepareCalls++
          if (prepareCalls === 1) return Promise.reject(new Error(RETRYABLE))
          return Promise.resolve(statement({ run: () => Promise.resolve('ran') }))
        },
      })
    )

    const stmt = await proxied.prepare('x')
    await expect(stmt.run()).resolves.toBe('ran')
    expect(prepareCalls).toBe(2)
  })

  it('gives up after MAX_ATTEMPTS and rethrows the last error', async () => {
    let prepareCalls = 0
    const proxied = connectWithRetries(
      connection({
        prepare: () => {
          prepareCalls++
          return Promise.reject(new Error(RETRYABLE))
        },
      })
    )

    await expect(proxied.prepare('x')).rejects.toThrow(RETRYABLE)
    expect(prepareCalls).toBe(3)
  })

  it('does not retry non-transient errors', async () => {
    let prepareCalls = 0
    const proxied = connectWithRetries(
      connection({
        prepare: () => {
          prepareCalls++
          return Promise.reject(new Error('HTTP error! status: 400'))
        },
      })
    )

    await expect(proxied.prepare('x')).rejects.toThrow('status: 400')
    expect(prepareCalls).toBe(1)
  })

  it('retries a failing statement execution', async () => {
    let runCalls = 0
    const proxied = connectWithRetries(
      connection({
        prepare: () =>
          Promise.resolve(
            statement({
              run: () => {
                runCalls++
                if (runCalls === 1) return Promise.reject(new Error(RETRYABLE))
                return Promise.resolve('ran')
              },
            })
          ),
      })
    )

    const stmt = await proxied.prepare('x')
    await expect(stmt.run()).resolves.toBe('ran')
    expect(runCalls).toBe(2)
  })

  it('retries the raw().all() chain', async () => {
    let allCalls = 0
    const proxied = connectWithRetries(
      connection({
        prepare: () =>
          Promise.resolve(
            statement({
              all: () => {
                allCalls++
                if (allCalls === 1) return Promise.reject(new Error(RETRYABLE))
                return Promise.resolve([['row']])
              },
            })
          ),
      })
    )

    const stmt = await proxied.prepare('x')
    await expect(stmt.raw(false).all()).resolves.toEqual([['row']])
    expect(allCalls).toBe(2)
  })

  it('retries the function returned by transaction()', async () => {
    let txnCalls = 0
    const proxied = connectWithRetries(
      connection({
        transaction: () => () => {
          txnCalls++
          if (txnCalls === 1) return Promise.reject(new Error(RETRYABLE))
          return Promise.resolve('committed')
        },
      })
    )

    const run = proxied.transaction(async () => {})
    await expect(run()).resolves.toBe('committed')
    expect(txnCalls).toBe(2)
  })

  it('passes non-function properties through', () => {
    const proxied = connectWithRetries({ inTransaction: false } as Connection)
    expect(proxied.inTransaction).toBe(false)
  })

  it('borne les tentatives sous charge concurrente lors du réveil', async () => {
    let calls = 0
    const wakeUntil = Date.now() + 200
    const proxied = connectWithRetries(
      connection({
        prepare: () => {
          calls++
          if (Date.now() < wakeUntil) return Promise.reject(new Error(RETRYABLE))
          return Promise.resolve(statement({ all: () => Promise.resolve([['row']]) }))
        },
      })
    )

    const results = await Promise.all(
      Array.from({ length: 20 }, () => proxied.prepare('x').then((s) => s.raw(false).all()))
    )

    expect(results).toHaveLength(20)
    expect(results.every((r) => Array.isArray(r))).toBe(true)
    expect(calls).toBeLessThanOrEqual(20 * 3)
  })
})
