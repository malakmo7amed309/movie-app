import MovieCard from './MovieCard'
import Spinner from './Spinner'
import ErrorBox from './ErrorBox'

/** Grid with a "Load more" button, skeleton-free loading and an error state. */
export default function MovieGrid({ movies, loading, error, hasMore, onMore, onRetry, empty }) {
  if (error && movies.length === 0) return <ErrorBox message={error} onRetry={onRetry} />
  if (loading && movies.length === 0) return <Spinner />
  if (!loading && movies.length === 0) return <p className="empty-state">{empty}</p>
  return (
    <>
      <div className="movie-grid">
        {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
      </div>
      {error && <ErrorBox message={error} onRetry={onRetry} />}
      {loading && <Spinner />}
      {!loading && hasMore && (
        <div className="pagination"><button className="btn" onClick={onMore}>Load more</button></div>
      )}
    </>
  )
}
