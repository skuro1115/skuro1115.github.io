import { track } from './track'

export const DONATION_PRESETS = [100, 300, 500, 1000] as const
export const DONATION_MIN = 100
export const DONATION_MAX = 3000

export type DonationAmount = number

const apiBase = (import.meta.env.VITE_DONATE_API_BASE ?? '').trim()
const clientId = (import.meta.env.VITE_PAYPAL_CLIENT_ID ?? '').trim()

export const paypalClientId = clientId
export const isPayPalConfigured = Boolean(apiBase && clientId)

export type DonationCaptureResult = {
  id: string
  status: string
  amount: DonationAmount
}

export class DonationError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message)
    this.name = 'DonationError'
  }
}

function ensureValidAmount(amount: number): DonationAmount {
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) {
    throw new DonationError('金額は整数で指定してください')
  }
  if (amount < DONATION_MIN || amount > DONATION_MAX) {
    throw new DonationError(`金額は ${DONATION_MIN}〜${DONATION_MAX} 円の範囲で指定してください`)
  }
  return amount
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new DonationError(`API ${path} failed (${res.status}): ${text || 'no body'}`)
  }
  return (await res.json()) as T
}

export async function createDonationOrder(amount: number): Promise<string> {
  const value = ensureValidAmount(amount)
  track('donate-create-order', { amount: value, mode: isPayPalConfigured ? 'paypal' : 'mock' })

  if (!isPayPalConfigured) {
    return mockCreateOrder(value)
  }
  const data = await postJson<{ id: string }>('/api/donate/create', { amount: value })
  return data.id
}

export async function captureDonationOrder(
  orderId: string,
  amount: number,
): Promise<DonationCaptureResult> {
  const value = ensureValidAmount(amount)

  if (!isPayPalConfigured) {
    return mockCaptureOrder(orderId, value)
  }
  const data = await postJson<{ id: string; status: string }>('/api/donate/capture', {
    orderId,
  })
  return { id: data.id, status: data.status, amount: value }
}

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

async function mockCreateOrder(amount: DonationAmount): Promise<string> {
  await delay(400)
  return `MOCK-${Date.now().toString(36)}-${amount}`
}

async function mockCaptureOrder(
  orderId: string,
  amount: DonationAmount,
): Promise<DonationCaptureResult> {
  await delay(600)
  return { id: orderId, status: 'COMPLETED', amount }
}
