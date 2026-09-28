import type { Connection, Statement } from '@tursodatabase/serverless'
import { test } from 'vitest'
import { connectWithRetries } from '#server/db/turso-retry'

function statement(): Statement {
  const stmt = {
    raw: () => stmt,
    on: () => stmt,
    all: () => Promise.resolve([{ n: 1 }]),
    get: () => Promise.resolve({ n: 1 }),
    run: () => Promise.resolve({ n: 1 }),
    values: () => Promise.resolve([[1]]),
  }
  return stmt as unknown as Statement
}

function makeConnection(): Connection {
  return { prepare: () => Promise.resolve(statement()) } as unknown as Connection
}

const rawStatement = statement()
const wrappedStatement: Statement = await connectWithRetries(makeConnection()).prepare('sql')
const rawConnection = makeConnection()
const wrappedConnection = connectWithRetries(makeConnection())

test('overhead du proxy Turso (chemin steady-state)', async ({ bench }) => {
  await bench.compare(
    bench('statement raw().all() — client direct', () => {
      rawStatement.raw(false).all()
    }),
    bench('statement raw().all() — via connectWithRetries', () => {
      wrappedStatement.raw(false).all()
    })
  )
})

test('préparation de requête (appelée une fois par requête, puis mise en cache)', async ({
  bench,
}) => {
  await bench.compare(
    bench('prepare — client direct', () => {
      rawConnection.prepare('sql')
    }),
    bench('prepare — via connectWithRetries', () => {
      wrappedConnection.prepare('sql')
    })
  )
})
