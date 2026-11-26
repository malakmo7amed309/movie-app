import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, getCategory, getMovie, getVideos } from '../api'
import { IMG_BACKDROP_LG } from '../config'
import Rail from '../components/Rail'
import TrailerModal from '../components/TrailerModal'
import { useLibrary } from '../library'

function Hero() {
  const [movie, setMovie] = useState(null)
  const [video, setVideo] = useState(null)
  const [open, setOpen] = useState(false)
  const lib = useLibrary()

  useEffect(() => {
    let cancelled = false
    getCategory('trending').then(async (data) => {
      const pick = data.results.find((m) => m.backdrop_path && m.overview) || data.results[0]
      const [full, vids] = await Promise.all([getMovie(pick.id), getVideos(pick.id)])
      if (cancelled) return
      setMovie(full)
      const list = vids.results || []
      setVideo(list.find((v) => v.site === 'YouTube' && v.type === 'Trailer') || null)
    }).catch(() => {})
    return () => { cancelled = true }
  }, [])

  if (!movie) return <div className="hero hero-loading" aria-busy="true" />
  const later = lib.has(movie.id, 'watchlist')
  return (
    <section className="hero" style={{ backgroundImage: `url(${IMG_BACKDROP_LG}${movie.backdrop_path})` }}>
      <div className="hero-shade">
        <p className="eyebrow">Trending now</p>
        <h1>{movie.title}</h1>
        <p className="hero-meta">{movie.vote_average > 0 ? `★ ${movie.vote_average.toFixed(1)}` : 'Not rated yet'} · {movie.release_date?.slice(0, 4)} · {movie.genres?.slice(0, 3).map((g) => g.name).join(', ')}</p>
        <p className="hero-overview">{movie.overview}</p>
        <div className="hero-actions">
          {video && <button className="btn" onClick={() => setOpen(true)}>▶ Watch trailer</button>}
          <Link to={`/movie/${movie.id}`} className="btn btn-ghost">Details</Link>
          <button className="btn btn-ghost" aria-pressed={later} onClick={() => lib.toggle(movie, 'watchlist')}>{later ? '✓ In watchlist' : '+ Watchlist'}</button>
        </div>
      </div>
      {open && video && <TrailerModal video={video} title={movie.title} onClose={() => setOpen(false)} />}
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      {CATEGORIES.map((c) => (
        <Rail key={c.id} title={c.label} to={`/browse?category=${c.id}`} load={() => getCategory(c.id).then((d) => d.results.slice(0, 16))} />
      ))}
    </>
  )
}
