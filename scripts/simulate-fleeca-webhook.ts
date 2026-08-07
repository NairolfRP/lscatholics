import { createHmac } from 'node:crypto'
import { env } from '#/config/env.server.ts'
import { pendingPaymentRepository } from '#server/repositories/pending-payment.repository.ts'
import { inProd } from '#server/services/app.service.ts'

const VALID_STATUSES = ['payment_successful', 'payment_failed', 'pending'] as const
type SimulatedStatus = (typeof VALID_STATUSES)[number]

const DEFAULT_BASE_URL = 'http://localhost:3000'

interface ParsedArgs {
  id?: string
  status?: string
  amount?: number
  url: string
}

function parseArgs(argv: string[]): ParsedArgs {
  const args: ParsedArgs = { url: DEFAULT_BASE_URL }

  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i]
    const value = argv[i + 1]

    if (flag === '--id' && value) {
      args.id = value
      i += 1
    } else if (flag === '--status' && value) {
      args.status = value
      i += 1
    } else if (flag === '--amount' && value) {
      args.amount = Number(value)
      i += 1
    } else if (flag === '--url' && value) {
      args.url = value.replace(/\/+$/, '')
      i += 1
    }
  }

  return args
}

function printUsage() {
  console.log(
    'Usage: bun run simulate:webhook -- --id <payment_id> --status payment_successful|payment_failed|pending [--amount <number>] [--url <base_url>]'
  )
}

async function main() {
  const args = parseArgs(process.argv.slice(2))

  if (!args.id || !args.status) {
    printUsage()
    process.exit(1)
  }

  const isStatus = (value: string): value is SimulatedStatus =>
    (VALID_STATUSES as readonly string[]).includes(value)

  if (!isStatus(args.status)) {
    console.error(
      `Invalid --status "${args.status}". Expected one of: ${VALID_STATUSES.join(', ')}`
    )
    process.exit(1)
  }
  const status = args.status

  let amount = args.amount
  if (amount === undefined) {
    const pending = await pendingPaymentRepository.findById(args.id)
    if (!pending) {
      console.error(
        `No pending payment found for "${args.id}". Pass --amount to force a payload anyway.`
      )
      process.exit(1)
    }
    amount = pending.amount
  }

  if (!Number.isFinite(amount)) {
    console.error(`Invalid --amount "${args.amount}".`)
    process.exit(1)
  }

  if (!env.FLEECA_API_KEY) {
    console.error('FLEECA_API_KEY is not set in .env.local.')
    process.exit(1)
  }

  const mode = inProd ? 'live' : 'sandbox'
  const payload = JSON.stringify({
    payment_id: args.id,
    payment_url: `${args.url}/gateway/${args.id}`,
    mode,
    amount,
    status,
    paid_at: new Date().toISOString(),
  })

  const signature = `sha256=${createHmac('sha256', env.FLEECA_API_KEY).update(payload).digest('hex')}`
  const webhookUrl = `${args.url}/api/payment/fleeca/webhook`

  console.log(`Simulating webhook -> ${webhookUrl}`)
  console.log(`  payload: ${payload}`)
  console.log(`  signature: ${signature}`)

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Fleeca-Signature': signature,
    },
    body: payload,
  })

  const responseBody = await response.text()
  console.log(`  response: ${response.status} ${responseBody}`)

  if (response.status !== 200) {
    console.error(`Webhook rejected (HTTP ${response.status}).`)
    process.exit(1)
  }

  console.log('Webhook accepted.')
}

main().catch((err) => {
  console.error('Failed to simulate webhook.', err)
  process.exit(1)
})
