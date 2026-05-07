type TrackProps = Record<string, string | number | boolean | undefined>

declare global {
  interface Window {
    plausible?: (event: string, opts?: { props?: TrackProps }) => void
  }
}

export function track(event: string, props: TrackProps = {}) {
  const cleaned = Object.fromEntries(
    Object.entries(props).filter(([, v]) => v !== undefined),
  ) as TrackProps

  if (typeof window === 'undefined') return

  if (typeof window.plausible === 'function') {
    window.plausible(event, { props: cleaned })
    return
  }

  if (import.meta.env.DEV) {
    console.info('[track]', event, cleaned)
  }
}

export function installTrackingListener() {
  if (typeof window === 'undefined') return

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null
    const el = target?.closest<HTMLElement>('[data-track]')
    if (!el) return

    const event = el.dataset.track
    if (!event) return

    const props: TrackProps = { path: window.location.pathname }
    for (const [key, value] of Object.entries(el.dataset)) {
      if (key === 'track' || value === undefined) continue
      if (key.startsWith('track')) {
        const propKey = key.slice(5, 6).toLowerCase() + key.slice(6)
        props[propKey] = value
      }
    }
    track(event, props)
  })
}
