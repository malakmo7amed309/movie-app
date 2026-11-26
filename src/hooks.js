import { useCallback, useEffect, useState } from 'react'

/** Loads pages of movies and appends them. `fetchPage(page)` must return { results, total_pages }. */
export function usePagedMovies(fetchPage, deps) {
  const [movies, setMovies] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  // New filters start over from page 1.
  useEffect(() => {
    setMovies([])
    setPage(1)
    setTotalPages(1)
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    fetchPage(page)
      .then((data) => {
        if (cancelled) return
        setMovies((prev) => {
          const seen = new Set(page === 1 ? [] : prev.map((m) => m.id))
          return [...(page === 1 ? [] : prev), ...data.results.filter((m) => !seen.has(m.id))]
        })
        setTotalPages(Math.min(data.total_pages || 1, 500))
      })
      .catch(() => !cancelled && setError('Could not load movies. Check your connection and try again.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [page, attempt, ...deps]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => setPage((p) => p + 1), [])
  const retry = useCallback(() => setAttempt((a) => a + 1), [])
  return { movies, loading, error, hasMore: page < totalPages, loadMore, retry }
}
