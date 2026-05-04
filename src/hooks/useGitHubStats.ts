import { useState, useEffect } from 'react'

interface GitHubStats {
  stars: number
  forks: number
  isLoading: boolean
  error: Error | null
}

export function useGitHubStats(githubUrl?: string): GitHubStats {
  const [stars, setStars] = useState(0)
  const [forks, setForks] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!githubUrl) return

    const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/)
    if (!match) return

    const [, owner, repo] = match
    const cleanRepo = repo.replace(/\.git$/, '')
    setIsLoading(true)

    fetch(`https://api.github.com/repos/${owner}/${cleanRepo}`)
      .then((res) => {
        if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setStars(data.stargazers_count ?? 0)
        setForks(data.forks_count ?? 0)
        setIsLoading(false)
      })
      .catch((err) => {
        setError(err instanceof Error ? err : new Error('Fetch failed'))
        setIsLoading(false)
      })
  }, [githubUrl])

  return { stars, forks, isLoading, error }
}
