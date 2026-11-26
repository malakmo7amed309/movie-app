import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLibrary } from '../library'
import MovieCard from '../components/MovieCard'

const TABS = [
  { id: 'favorite', label: 'Favorites', empty: 'Tap the heart on any movie to keep it here.' },
  { id: 'watchlist', label: 'Watchlist', empty: 'Tap + on a movie to save it for later.' },
  { id: 'watched', label: 'Watched', empty: 'Mark movies as watched from their details page.' },
]
const SORTS = {
  added: (a, b) => b.added - a.added,
  rating: (a, b) => (b.vote_average || 0) - (a.vote_average || 0),
  title: (a, b) => a.title.localeCompare(b.title),
  year: (a, b) => (b.release_date || '').localeCompare(a.release_date || ''),
}

export default function Library() {
  const lib = useLibrary()
  const [params, setParams] = useSearchParams()
  const tab = TABS.find((t) => t.id === params.get('tab')) || TABS[0]
  const [sort, setSort] = useState('added')
  const [confirm, setConfirm] = useState(false)
  const items = lib.list(tab.id).sort(SORTS[sort])

  return (
    <>
      <section className="page-header">
        <h1>Your library</h1>
        <p>Saved on this device. Nothing leaves your browser.</p>
      </section>
      <div className="chips" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={t.id === tab.id} className={`chip ${t.id === tab.id ? 'active' : ''}`} onClick={() => { setParams({ tab: t.id }, { replace: true }); setConfirm(false) }}>
            {t.label} <span className="count">{lib.count(t.id)}</span>
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="empty-state">{tab.empty} <Link to="/browse">Browse movies</Link></p>
      ) : (
        <>
          <div className="filters">
            <label>Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="added">Recently added</option>
                <option value="rating">Rating</option>
                <option value="title">Title</option>
                <option value="year">Release year</option>
              </select>
            </label>
            {confirm ? (
              <>
                <button className="btn btn-danger" onClick={() => { lib.clear(tab.id); setConfirm(false) }}>Yes, clear {items.length}</button>
                <button className="btn btn-ghost" onClick={() => setConfirm(false)}>Cancel</button>
              </>
            ) : (
              <button className="btn btn-ghost" onClick={() => setConfirm(true)}>Clear {tab.label.toLowerCase()}</button>
            )}
          </div>
          <div className="movie-grid">{items.map((m) => <MovieCard key={m.id} movie={m} />)}</div>
        </>
      )}
    </>
  )
}
