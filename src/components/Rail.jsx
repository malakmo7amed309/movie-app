import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import MovieCard from './MovieCard'

/** Horizontal row of cards with scroll buttons. `load` returns a promise of movies. */
export default function Rail({ title, to, load }) {
  const [movies, setMovies] = useState(null)
  const [failed, setFailed] = useState(false)
  const row = useRef(null)

  useEffect(() => {
    let cancelled = false
    load().then((m) => !cancelled && setMovies(m)).catch(() => !cancelled && setFailed(true))
    return () => { cancelled = true }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const scroll = (dir) => row.current?.scrollBy({ left: dir * row.current.clientWidth * 0.85, behavior: 'smooth' })

  return (
    <section className="rail">
      <div className="rail-head">
        <h2>{title}</h2>
        <div className="rail-tools">
          {to && <Link to={to} className="see-all">See all</Link>}
          <button className="icon-btn" onClick={() => scroll(-1)} aria-label={`Scroll ${title} left`}>‹</button>
          <button className="icon-btn" onClick={() => scroll(1)} aria-label={`Scroll ${title} right`}>›</button>
        </div>
      </div>
      {failed ? (
        <p className="empty-state">Could not load this row.</p>
      ) : !movies ? (
        <div className="rail-row">{Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton-card" />)}</div>
      ) : (
        <div className="rail-row" ref={row}>
          {movies.map((m) => <div className="rail-item" key={m.id}><MovieCard movie={m} /></div>)}
        </div>
      )}
    </section>
  )
}
