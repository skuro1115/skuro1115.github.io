import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { DonationAmounts } from '../components/DonationAmounts'
import { useDocumentMeta } from '../hooks/useDocumentMeta'
import { track } from '../lib/track'
import {
  captureDonationOrder,
  createDonationOrder,
  isPayPalConfigured,
  paypalClientId,
  type DonationAmount,
  type DonationCaptureResult,
} from '../lib/donate'

const page = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.15 } },
}

type Status = 'idle' | 'pending' | 'success' | 'error'

export default function Donate() {
  useDocumentMeta({
    title: 'Support',
    description:
      'skuro の開発を支援するページ。コーヒー1杯分から任意の金額でサポートできます（PayPal）。',
  })

  const [amount, setAmount] = useState<DonationAmount>(300)
  const [status, setStatus] = useState<Status>('idle')
  const [result, setResult] = useState<DonationCaptureResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const reset = () => {
    setStatus('idle')
    setResult(null)
    setErrorMessage(null)
  }

  const handleSuccess = (captured: DonationCaptureResult) => {
    setResult(captured)
    setStatus('success')
    track('donate-capture-success', {
      amount: captured.amount,
      orderId: captured.id,
      mode: isPayPalConfigured ? 'paypal' : 'mock',
    })
  }

  const handleError = (msg: string) => {
    setErrorMessage(msg)
    setStatus('error')
    track('donate-capture-error', {
      amount,
      message: msg.slice(0, 120),
      mode: isPayPalConfigured ? 'paypal' : 'mock',
    })
  }

  const handleMockDonate = async () => {
    setStatus('pending')
    setErrorMessage(null)
    try {
      const id = await createDonationOrder(amount)
      const captured = await captureDonationOrder(id, amount)
      handleSuccess(captured)
    } catch (e) {
      handleError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <motion.main variants={page} initial="initial" animate="animate" exit="exit">
      <section className="bg-gradient-to-br from-amber-50 via-orange-50 to-white border-b border-border">
        <div className="max-w-2xl mx-auto px-6 pt-12 pb-10">
          <Link
            to="/"
            className="font-mono text-sm text-muted hover:text-gray-900 transition-colors"
          >
            ← back
          </Link>
          <div className="mt-6 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-md"
            >
              ☕
            </span>
            <p className="font-mono text-xs text-amber-700 uppercase tracking-widest">
              Support development
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mt-4">
            コーヒーを1杯おごる
          </h1>
          <p className="text-gray-700 leading-relaxed mt-3">
            skuro の開発活動への任意のサポートです。リターンや対価は提供されません。
            集まったサポートはアプリの開発・運用費用に充てさせていただきます。
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {status === 'success' && result ? (
          <ThanksCard result={result} onReset={reset} />
        ) : (
          <>
            <DonationAmounts
              value={amount}
              onChange={setAmount}
              disabled={status === 'pending'}
            />

            <div className="mt-8">
              {isPayPalConfigured ? (
                <PayPalScriptProvider
                  options={{
                    clientId: paypalClientId,
                    currency: 'JPY',
                    intent: 'capture',
                  }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'rect', label: 'donate' }}
                    forceReRender={[amount]}
                    createOrder={async () => {
                      try {
                        return await createDonationOrder(amount)
                      } catch (e) {
                        handleError(e instanceof Error ? e.message : String(e))
                        throw e
                      }
                    }}
                    onApprove={async (data) => {
                      try {
                        const captured = await captureDonationOrder(data.orderID, amount)
                        handleSuccess(captured)
                      } catch (e) {
                        handleError(e instanceof Error ? e.message : String(e))
                      }
                    }}
                    onError={(err) => handleError(String(err))}
                    onCancel={() => setStatus('idle')}
                  />
                </PayPalScriptProvider>
              ) : (
                <MockPaymentPanel
                  amount={amount}
                  pending={status === 'pending'}
                  onClick={handleMockDonate}
                />
              )}
            </div>

            {status === 'error' && errorMessage && (
              <div
                role="alert"
                className="mt-6 p-4 rounded-lg border border-red-200 bg-red-50 text-sm text-red-700"
              >
                <p className="font-medium mb-1">決済エラー</p>
                <p className="font-mono text-xs leading-relaxed break-all">{errorMessage}</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 text-xs font-medium text-red-700 underline hover:no-underline"
                >
                  もう一度試す
                </button>
              </div>
            )}

            <Notes />
          </>
        )}
      </div>
    </motion.main>
  )
}

function MockPaymentPanel({
  amount,
  pending,
  onClick,
}: {
  amount: DonationAmount
  pending: boolean
  onClick: () => void
}) {
  return (
    <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50/40 p-6">
      <p className="font-mono text-xs text-amber-700 uppercase tracking-widest mb-2">
        Sandbox 待機中
      </p>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        PayPal sandbox の接続が完了するまで、フロー検証用のモック決済ボタンを表示しています。
        本番環境では PayPal の支払いボタンに置き換わります。
      </p>
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        data-track="donate-mock-pay"
        data-track-amount={amount}
        className="w-full rounded-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? '処理中…' : `モック決済で ¥${amount.toLocaleString()} を送る`}
      </button>
    </div>
  )
}

function ThanksCard({
  result,
  onReset,
}: {
  result: DonationCaptureResult
  onReset: () => void
}) {
  return (
    <div className="rounded-2xl border-l-4 border-amber-400 bg-amber-50/60 p-6">
      <p className="font-mono text-xs text-amber-700 uppercase tracking-widest mb-3">
        Thank you ☕
      </p>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        ¥{result.amount.toLocaleString()} のサポート、ありがとうございます
      </h2>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        いただいたサポートはアプリの開発・運用費に充てさせていただきます。
        <br />
        感想・要望は GitHub 経由でお寄せいただけると嬉しいです。
      </p>
      <dl className="text-sm space-y-1 mb-6">
        <div className="flex gap-3">
          <dt className="font-mono text-xs text-subtle w-24">取引ID</dt>
          <dd className="font-mono text-xs text-gray-700 break-all">{result.id}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="font-mono text-xs text-subtle w-24">ステータス</dt>
          <dd className="font-mono text-xs text-gray-700">{result.status}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-sm font-medium rounded-lg hover:border-gray-300 hover:bg-surface transition-colors"
        >
          もう一度サポートする
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apps に戻る
        </Link>
      </div>
    </div>
  )
}

function Notes() {
  return (
    <section className="mt-12 pt-8 border-t border-border text-sm text-gray-600 leading-relaxed space-y-3">
      <p>
        <span className="font-medium text-gray-800">ご利用にあたって:</span>{' '}
        本ページは寄付（任意のサポート）であり、商品やサービスの対価ではありません。
        リターンや特典の提供はありません。
      </p>
      <p>
        <span className="font-medium text-gray-800">プライバシー:</span>{' '}
        決済処理は PayPal が行い、本サイトはクレジットカード番号などを取得・保存しません。
      </p>
      <p>
        <span className="font-medium text-gray-800">通貨:</span>{' '}
        支払いは日本円（JPY）です。
      </p>
    </section>
  )
}
