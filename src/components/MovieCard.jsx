import { Link } from 'react-router-dom'
import { IMG_POSTER } from '../config'
import { useLibrary } from '../library'

export default function MovieCard({ movie }) {
  const lib = useLibrary()
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'
  const fav = lib.has(movie.id, 'favorite')
  const later = lib.has(movie.id, 'watchlist')
  const seen = lib.has(movie.id, 'watched')

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-poster-link">
        {movie.poster_path ? (
          <img src={`${IMG_POSTER}${movie.poster_path}`} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="poster-placeholder">No poster</div>
        )}
        <span className="movie-rating">★ {rating}</span>
        {seen && <span className="seen-badge">Watched</span>}
      </Link>
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p className="movie-year">{year}</p>
      </div>
      <div className="card-actions">
        <button
          className={`icon-btn ${later ? 'on' : ''}`}
          aria-pressed={later}
          onClick={() => lib.toggle(movie, 'watchlist')}
          aria-label={later ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}
          title="Watchlist"
        >
          {later ? '✓' : '+'}
        </button>
        <button
          className={`icon-btn heart ${fav ? 'on' : ''}`}
          aria-pressed={fav}
          onClick={() => lib.toggle(movie, 'favorite')}
          aria-label={fav ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
          title="Favorite"
        >
          {fav ? '♥' : '♡'}
        </button>
      </div>
    </article>
  )
}
