import { Link } from 'react-router-dom'
import { IMG_POSTER } from '../config'

export default function MovieCard({ movie, isFavorite, onToggleFavorite }) {
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'NR'

  return (
    <article className="movie-card">
      <Link to={`/movie/${movie.id}`} className="movie-poster-link">
        {movie.poster_path ? (
          <img src={`${IMG_POSTER}${movie.poster_path}`} alt={`${movie.title} poster`} loading="lazy" />
        ) : (
          <div className="poster-placeholder">No poster</div>
        )}
        <span className="movie-rating">★ {rating}</span>
      </Link>
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p className="movie-year">{year}</p>
      </div>
      <button
        className={`fav-btn ${isFavorite ? 'fav-active' : ''}`}
        onClick={() => onToggleFavorite(movie)}
        aria-label={isFavorite ? `Remove ${movie.title} from favorites` : `Add ${movie.title} to favorites`}
      >
        {isFavorite ? '♥' : '♡'}
      </button>
    </article>
  )
}
