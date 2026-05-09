import { useState } from 'react'
import {
  DONATION_MAX,
  DONATION_MIN,
  DONATION_PRESETS,
  type DonationAmount,
} from '../lib/donate'
import { track } from '../lib/track'

type Props = {
  value: DonationAmount
  onChange: (amount: DonationAmount) => void
  disabled?: boolean
}

export function DonationAmounts({ value, onChange, disabled }: Props) {
  const isPreset = (DONATION_PRESETS as readonly number[]).includes(value)
  const [customRaw, setCustomRaw] = useState<string>(isPreset ? '' : String(value))
  const [error, setError] = useState<string | null>(null)

  const setPreset = (amount: DonationAmount) => {
    setCustomRaw('')
    setError(null)
    onChange(amount)
  }

  const setCustom = (raw: string) => {
    setCustomRaw(raw)
    if (raw === '') {
      setError(null)
      return
    }
    const parsed = Number(raw)
    if (!Number.isInteger(parsed)) {
      setError('整数で指定してください')
      return
    }
    if (parsed < DONATION_MIN || parsed > DONATION_MAX) {
      setError(`${DONATION_MIN}〜${DONATION_MAX} 円の範囲で指定してください`)
      return
    }
    setError(null)
    onChange(parsed)
  }

  return (
    <div>
      <p className="font-mono text-xs text-subtle uppercase tracking-widest mb-3">
        Amount (JPY)
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {DONATION_PRESETS.map((preset) => {
          const active = value === preset && !customRaw
          return (
            <button
              key={preset}
              type="button"
              onClick={() => setPreset(preset)}
              disabled={disabled}
              data-track="donate-amount-select"
              data-track-amount={preset}
              data-track-mode="preset"
              className={`rounded-xl border px-4 py-3 text-base font-bold transition-colors ${
                active
                  ? 'border-amber-400 bg-amber-50 text-amber-700'
                  : 'border-border bg-white text-gray-700 hover:border-gray-300 hover:bg-surface'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              ¥{preset.toLocaleString()}
            </button>
          )
        })}
      </div>

      <label className="block">
        <span className="font-mono text-xs text-subtle uppercase tracking-widest mb-2 block">
          Custom ({DONATION_MIN}〜{DONATION_MAX})
        </span>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 font-bold text-lg">¥</span>
          <input
            type="number"
            inputMode="numeric"
            min={DONATION_MIN}
            max={DONATION_MAX}
            step={100}
            value={customRaw}
            onChange={(e) => setCustom(e.target.value)}
            onBlur={() => {
              if (customRaw && !error) {
                track('donate-amount-select', { amount: value, mode: 'custom' })
              }
            }}
            disabled={disabled}
            placeholder="任意の金額"
            className="flex-1 px-3 py-2 rounded-lg border border-border bg-white text-gray-900 placeholder:text-subtle focus:border-amber-400 focus:outline-none disabled:opacity-50"
          />
        </div>
        {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      </label>
    </div>
  )
}

