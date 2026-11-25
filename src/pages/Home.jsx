import { useEffect, useState } from 'react'
import { getTrending } from '../api'
import { useFavorites } from '../favorites'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'

export default function Home() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const { toggle, isFavorite } = useFavorites()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    getTrending(page)
      .then((data) => {
        if (cancelled) return
        setMovies(data.results)
        setTotalPages(Math.min(data.total_pages, 20))
      })
      .catch(() => !cancelled && setError('Could not load trending movies. Check your connection and try again.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [page])

  return (
    <>
      <section className="page-header">
        <h1>Trending this week</h1>
        <p>The movies everyone is talking about right now.</p>
      </section>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox message={error} onRetry={() => setPage((p) => p)} />
      ) : (
        <>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} isFavorite={isFavorite(movie.id)} onToggleFavorite={toggle} />
            ))}
          </div>
          <div className="pagination">
            <button className="btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next →</button>
          </div>
        </>
      )}
    </>
  )
}
