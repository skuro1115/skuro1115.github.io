import { useState, useEffect } from 'react'

interface AppStoreIcon {
  iconUrl: string | null
  isLoading: boolean
  error: Error | null
}

export function useAppStoreIcon(appStoreUrl?: string): AppStoreIcon {
  const [iconUrl, setIconUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!appStoreUrl) return

    const match = appStoreUrl.match(/id(\d+)/)
    if (!match) return

    const trackId = match[1]
    setIsLoading(true)

    fetch(`https://itunes.apple.com/lookup?id=${trackId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`iTunes API error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        const result = data.results?.[0]
        const url =
          result?.artworkUrl512 ||
          result?.artworkUrl100?.replace(/100x100/, '512x512') ||
          result?.artworkUrl100 ||
          null
        setIconUrl(url)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Fetch failed'))
        setIsLoading(false)
      })
  }, [appStoreUrl])

  return { iconUrl, isLoading, error }
}
