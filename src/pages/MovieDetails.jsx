import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getMovie, getCredits, getVideos, getSimilar } from '../api'
import { useLibrary } from '../library'
import Rail from '../components/Rail'
import TrailerModal from '../components/TrailerModal'
import { IMG_BACKDROP, IMG_POSTER, IMG_PROFILE } from '../config'
import Spinner from '../components/Spinner'
import ErrorBox from '../components/ErrorBox'

export default function MovieDetails() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [cast, setCast] = useState([])
  const [trailer, setTrailer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const lib = useLibrary()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError('')
    setCopied(false)
    Promise.all([getMovie(id), getCredits(id), getVideos(id)])
      .then(([movieData, creditsData, videosData]) => {
        if (cancelled) return
        setMovie(movieData)
        setCast(creditsData.cast.slice(0, 8))
        const vids = videosData.results || []
        const pick =
          vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
          vids.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
          vids.find((v) => v.site === 'YouTube')
        setTrailer(pick || null)
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
            <span>{movie.vote_count > 0 ? `★ ${movie.vote_average.toFixed(1)} (${movie.vote_count} votes)` : 'Not rated yet'}</span>
            {movie.runtime > 0 && <span>{hours}h {minutes}m</span>}
            <span>{movie.genres?.map((g) => g.name).join(', ')}</span>
          </div>
          <p className="overview">{movie.overview || 'No overview available.'}</p>
          <div className="detail-actions">
            {trailer && <button className="btn" onClick={() => setOpen(true)}>▶ Watch trailer</button>}
            <button className={`btn btn-ghost ${lib.has(movie.id, 'favorite') ? 'is-on' : ''}`} aria-pressed={lib.has(movie.id, 'favorite')} onClick={() => lib.toggle(movie, 'favorite')}>
              {lib.has(movie.id, 'favorite') ? '♥ Favorite' : '♡ Favorite'}
            </button>
            <button className={`btn btn-ghost ${lib.has(movie.id, 'watchlist') ? 'is-on' : ''}`} aria-pressed={lib.has(movie.id, 'watchlist')} onClick={() => lib.toggle(movie, 'watchlist')}>
              {lib.has(movie.id, 'watchlist') ? '✓ In watchlist' : '+ Watchlist'}
            </button>
            <button className={`btn btn-ghost ${lib.has(movie.id, 'watched') ? 'is-on' : ''}`} aria-pressed={lib.has(movie.id, 'watched')} onClick={() => lib.toggle(movie, 'watched')}>
              {lib.has(movie.id, 'watched') ? '✓ Watched' : 'Mark watched'}
            </button>
            <button className="btn btn-ghost" onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setCopied(true) } catch { setCopied(false) } }}>
              {copied ? 'Link copied' : 'Copy link'}
            </button>
          </div>
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
          <Link to="/browse" className="back-link">← Back to browse</Link>
        </div>
      </div>
      <div className="details-more">
        <Rail key={movie.id} title="You might also like" load={() => getSimilar(movie.id).then((d) => d.results.slice(0, 16))} />
      </div>
      {open && trailer && <TrailerModal video={trailer} title={movie.title} onClose={() => setOpen(false)} />}
    </article>
  )
}
