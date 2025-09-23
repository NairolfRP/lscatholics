export type FleecaPaymentRequest = {
  auth_key: string
  type: number
  price: number
}

export type FleecaValidationResponse = {
  token: string
  auth_key: string
  message: string
  payment: number
  routing_from: string
  routing_to: string
  sandbox: boolean
  token_expired: boolean
  token_created_at: string
}

export type PaymentSessionData = {
  sessionId: string
  source: string
  amount: number
  metadata: Record<string, any>
  createdAt: Date
  expiresAt: Date
}

export type PaymentResult<TData extends Record<string, any>> = {
  success: boolean
  sessionData: PaymentSessionData
  transactionData?: TData
}
