/** 0 = sandbox (test), 1 = live/production */
export type FleecaPaymentMode = 0 | 1

export type FleecaPaymentStatus = 'payment_successful' | 'payment_failed' | 'pending'

export type FleecaCreatePaymentRequest = {
  amount: number
  mode: FleecaPaymentMode
  description?: string
}

export type FleecaCreatePaymentResponse = {
  success: boolean
  payment_id: string
  payment_link: string
  message: string
}

export type FleecaPaymentDetails = {
  payment_id: string
  merchant_id: number
  amount: number
  description: string | null
  status: FleecaPaymentStatus
  mode: 'live' | 'sandbox'
  payer_routing: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export type FleecaWebhookPayload = {
  payment_id: string
  payment_url: string
  mode: 'sandbox' | 'live'
  amount: number
  payer_routing: string
  status: FleecaPaymentStatus
  description?: string
  status_reason?: string
  created_at: string
  paid_at: string
}

export type PaymentSource = string

export type InitiatePaymentOptions = {
  source: PaymentSource
  amount: number
  /** Free-form data forwarded to the payment handler (e.g. donor info) */
  metadata?: Record<string, unknown>
  /** Shown to the payer on Fleeca's hosted page */
  description?: string
}

export type InitiatePaymentResult = {
  paymentId: string
  paymentUrl: string
}

/**
 * Result returned by `PaymentService.resolvePaymentStatus()`.
 *
 * `origin`:
 *   - `"pending_table"` — payment is still in-flight (record found in DB)
 *   - `"fleeca_api"`    — record was already deleted (terminal); Fleeca API was queried as fallback
 *   - `"not_found"`     — unknown payment_id (never existed or already reaped)
 *   - `"expired"`       — record existed in DB but `expires_at` is past
 */
export type ResolvedPaymentStatus =
  | { origin: 'pending_table'; status: 'pending'; amount: number; source: PaymentSource }
  | { origin: 'fleeca_api'; status: FleecaPaymentStatus; amount: number }
  | { origin: 'not_found' }
  | { origin: 'expired' }
