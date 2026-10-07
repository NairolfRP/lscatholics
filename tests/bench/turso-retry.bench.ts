import type { Client, ResultSet } from '@libsql/client'
import { test } from 'vitest'
import { connectWithRetries } from '#server/db/turso-retry'

const result = { rows: [], rowsAffected: 0 } as unknown as ResultSet

function makeClient(): Client {
  return {
    execute: () => Promise.resolve(result),
    transaction: () => Promise.resolve({ closed: false, close: () => {} }),
  } as unknown as Client
}

const rawClient = makeClient()
const wrappedClient = connectWithRetries(makeClient())

test('overhead du proxy Turso (chemin steady-state)', async ({ bench }) => {
  await bench.compare(
    bench('execute — client direct', () => {
      void rawClient.execute('sql')
    }),
    bench('execute — via connectWithRetries', () => {
      void wrappedClient.execute('sql')
    })
  )
})

test('création de transaction (par requête transactionnelle)', async ({ bench }) => {
  await bench.compare(
    bench('transaction — client direct', () => {
      void rawClient.transaction()
    }),
    bench('transaction — via connectWithRetries', () => {
      void wrappedClient.transaction()
    })
  )
})
