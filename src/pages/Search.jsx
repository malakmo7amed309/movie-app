import { useEffect, useState } from 'react'
import { searchMovies } from '../api'
import { useFavorites } from '../favorites'
import MovieCard from '../components/MovieCard'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'

export default function Search() {
  const [query, setQuery] = useState('')
  const [debounced, setDebounced] = useState('')
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { toggle, isFavorite } = useFavorites()

  // Debounce: only search 400ms after the user stops typing
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query.trim()), 400)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    if (!debounced) {
      setMovies([])
      return
    }
    let cancelled = false
    setLoading(true)
    setError('')
    searchMovies(debounced)
      .then((data) => !cancelled && setMovies(data.results))
      .catch(() => !cancelled && setError('Search failed. Check your connection and try again.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [debounced])

  return (
    <>
      <section className="page-header">
        <h1>Search movies</h1>
        <input
          type="search"
          className="search-input"
          placeholder="Type a movie title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search movies"
        />
      </section>
      {loading ? (
        <Spinner />
      ) : error ? (
        <ErrorBox message={error} />
      ) : debounced && movies.length === 0 ? (
        <p className="empty-state">No movies found for “{debounced}”.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isFavorite={isFavorite(movie.id)} onToggleFavorite={toggle} />
          ))}
        </div>
      )}
    </>
  )
}
