import type { Log } from '@sentry/tanstackstart-react'
import { describe, expect, it } from 'vitest'
import { beforeSendLog } from '#/config/sentry'

describe('beforeSendLog', () => {
  it('removes credentials and raw payloads', () => {
    const log = {
      level: 'info',
      message: 'Donation payment initiated',
      attributes: {
        source: 'donation',
        payment_id: 'pay_123',
        amount: 500,
        apiToken: 'secret',
        password: 'hunter2',
        rawBody: '{"private":true}',
        data: { phone: '123456' },
      },
    } satisfies Log

    expect(beforeSendLog(log)).toEqual({
      level: 'info',
      message: 'Donation payment initiated',
      attributes: {
        source: 'donation',
        payment_id: 'pay_123',
        amount: 500,
      },
    })
  })

  it('keeps in-game roleplay attributes and errors for debugging', () => {
    const log = {
      level: 'error',
      message: 'Donation payment initiation failed',
      attributes: {
        firstname: 'Jean',
        lastname: 'Dupont',
        phone: '4821337',
        address: '12 Rue de la Paix',
        err: { message: 'Card rejected' },
      },
    } satisfies Log

    expect(beforeSendLog(log)).toEqual(log)
  })
})
