import { useState, type CSSProperties } from 'react'

type Props = {
  src?: string
  title: string
  alt?: string
  className?: string
  fallbackClassName?: string
  fallbackStyle?: CSSProperties
  fallbackTextClassName?: string
  ariaHidden?: boolean
  loading?: 'lazy' | 'eager'
}

export function AppIcon({
  src,
  title,
  alt,
  className = 'w-14 h-14 rounded-2xl shadow-md ring-1 ring-black/10',
  fallbackClassName,
  fallbackStyle,
  fallbackTextClassName = 'text-white font-bold text-xl',
  ariaHidden,
  loading,
}: Props) {
  const [errored, setErrored] = useState(false)

  if (src && !errored) {
    return (
      <img
        src={src}
        alt={ariaHidden ? '' : alt ?? `${title} アイコン`}
        aria-hidden={ariaHidden || undefined}
        loading={loading}
        onError={() => setErrored(true)}
        className={className}
      />
    )
  }

  return (
    <div
      className={`flex items-center justify-center ${fallbackTextClassName} ${
        fallbackClassName ?? 'bg-gradient-to-br from-blue-500 to-indigo-600'
      } ${className}`}
      style={fallbackStyle}
      aria-hidden={ariaHidden || undefined}
      role={ariaHidden ? undefined : 'img'}
      aria-label={ariaHidden ? undefined : alt ?? `${title} アイコン`}
    >
      <span className="leading-none">{title.charAt(0)}</span>
    </div>
  )
}
