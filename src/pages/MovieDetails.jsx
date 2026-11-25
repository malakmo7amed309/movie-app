import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovie, getCredits } from '../api'
import { useFavorites } from '../favorites'
import { IMG_BACKDROP, IMG_POSTER, IMG_PROFILE } from '../config'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [cast, setCast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { toggle, isFavorite } = useFavorites()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    Promise.all([getMovie(id), getCredits(id)])
      .then(([movieData, creditsData]) => {
        if (cancelled) return
        setMovie(movieData)
        setCast(creditsData.cast.slice(0, 8))
      })
      .catch(() => !cancelled && setError('Could not load this movie. It may not exist.'))
      .finally(() => !cancelled && setLoading(false))
    return () => { cancelled = true }
  }, [id])

  if (loading) return <Spinner />
  if (error) return <ErrorBox message={error} />
  if (!movie) return null

  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A'
  const hours = Math.floor((movie.runtime || 0) / 60)
  const minutes = (movie.runtime || 0) % 60

  return (
    <article className="details">
      {movie.backdrop_path && (
        <div className="backdrop" style={{ backgroundImage: `url(${IMG_BACKDROP}${movie.backdrop_path})` }} />
      )}
      <div className="details-body">
        {movie.poster_path && (
          <img className="details-poster" src={`${IMG_POSTER}${movie.poster_path}`} alt={`${movie.title} poster`} />
        )}
        <div className="details-info">
          <h1>{movie.title} <span className="details-year">({year})</span></h1>
          {movie.tagline && <p className="tagline">“{movie.tagline}”</p>}
          <div className="details-meta">
            <span>★ {movie.vote_average?.toFixed(1)} ({movie.vote_count} votes)</span>
            {movie.runtime > 0 && <span>{hours}h {minutes}m</span>}
            <span>{movie.genres?.map((g) => g.name).join(', ')}</span>
          </div>
          <p className="overview">{movie.overview || 'No overview available.'}</p>
          <button className={`btn ${isFavorite(movie.id) ? 'btn-danger' : ''}`} onClick={() => toggle(movie)}>
            {isFavorite(movie.id) ? '♥ Remove from favorites' : '♡ Add to favorites'}
          </button>
          {cast.length > 0 && (
            <>
              <h2>Top cast</h2>
              <div className="cast-row">
                {cast.map((person) => (
                  <div key={person.id} className="cast-card">
                    {person.profile_path ? (
                      <img src={`${IMG_PROFILE}${person.profile_path}`} alt={person.name} loading="lazy" />
                    ) : (
                      <div className="poster-placeholder">No photo</div>
                    )}
                    <strong>{person.name}</strong>
                    <span>{person.character}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          <Link to="/" className="back-link">← Back to trending</Link>
        </div>
      </div>
    </article>
  )
}
