import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchMovies } from '../api'
import { usePagedMovies } from '../hooks'
import MovieGrid from '../components/MovieGrid'

const KEY = 'cinescope-recent-searches'
const readRecent = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') || '').trim()
  const [text, setText] = useState(q)
  const [recent, setRecent] = useState(readRecent)

  useEffect(() => setText(q), [q])
  // Debounce: update the URL 400ms after the user stops typing.
  useEffect(() => {
    if (text.trim() === q) return
    const t = setTimeout(() => setParams(text.trim() ? { q: text.trim() } : {}, { replace: true }), 400)
    return () => clearTimeout(t)
  }, [text, q, setParams])

  // Remember searches that actually returned something.
  const { movies, loading, error, hasMore, loadMore, retry } = usePagedMovies(
    (page) => (q ? searchMovies(q, page) : Promise.resolve({ results: [], total_pages: 1 })),
    [q],
  )
  useEffect(() => {
    if (!q || loading || movies.length === 0) return
    const next = [q, ...readRecent().filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 6)
    localStorage.setItem(KEY, JSON.stringify(next))
    setRecent(next)
  }, [q, loading, movies.length])

  const clearRecent = () => { localStorage.removeItem(KEY); setRecent([]) }

  return (
    <>
      <section className="page-header">
        <h1>Search movies</h1>
        <input type="search" className="search-input" placeholder="Type a movie title..." value={text} onChange={(e) => setText(e.target.value)} aria-label="Search movies" autoFocus />
      </section>
      {!q ? (
        recent.length > 0 ? (
          <section>
            <div className="rail-head"><h2>Recent searches</h2><button className="see-all link-btn" onClick={clearRecent}>Clear</button></div>
            <div className="chips">
              {recent.map((r) => <Link key={r} className="chip" to={`/search?q=${encodeURIComponent(r)}`}>{r}</Link>)}
            </div>
          </section>
        ) : <p className="empty-state">Search by title. Press / on any page to jump here.</p>
      ) : (
        <MovieGrid movies={movies} loading={loading} error={error} hasMore={hasMore} onMore={loadMore} onRetry={retry} empty={`No movies found for “${q}”.`} />
      )}
    </>
  )
}
