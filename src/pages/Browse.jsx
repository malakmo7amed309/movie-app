import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES, discoverMovies, getCategory, getGenres } from '../api'
import { usePagedMovies } from '../hooks'
import MovieGrid from '../components/MovieGrid'

const SORTS = [
  { id: 'popularity.desc', label: 'Most popular' },
  { id: 'vote_average.desc', label: 'Highest rated' },
  { id: 'primary_release_date.desc', label: 'Newest' },
  { id: 'revenue.desc', label: 'Box office' },
]
const RATINGS = [0, 6, 7, 8]
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i)

export default function Browse() {
  const [params, setParams] = useSearchParams()
  const [genres, setGenres] = useState([])
  const category = params.get('category') || ''
  const genre = params.get('genre') || ''
  const sort = params.get('sort') || 'popularity.desc'
  const year = params.get('year') || ''
  const minRating = Number(params.get('rating') || 0)
  const filtering = Boolean(genre || year || minRating || params.get('sort'))

  useEffect(() => { getGenres().then(setGenres).catch(() => {}) }, [])

  const set = (patch) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) (v ? next.set(k, v) : next.delete(k))
    // A category and custom filters are different modes.
    if ('category' in patch && patch.category) ['genre', 'sort', 'year', 'rating'].forEach((k) => next.delete(k))
    if (!('category' in patch)) next.delete('category')
    setParams(next, { replace: true })
  }

  const useCategory = category && !filtering
  const { movies, loading, error, hasMore, loadMore, retry } = usePagedMovies(
    (page) => (useCategory ? getCategory(category, page) : discoverMovies({ genre, sort, year, minRating, page })),
    [category, genre, sort, year, minRating],
  )

  const title = useCategory ? CATEGORIES.find((c) => c.id === category)?.label : 'Browse movies'

  return (
    <>
      <section className="page-header">
        <h1>{title}</h1>
        <p>Pick a collection, or filter by genre, year and rating.</p>
      </section>

      <div className="chips" role="group" aria-label="Collections">
        {CATEGORIES.map((c) => (
          <button key={c.id} className={`chip ${useCategory && category === c.id ? 'active' : ''}`} aria-pressed={useCategory && category === c.id} onClick={() => set({ category: c.id })}>{c.label}</button>
        ))}
      </div>

      <div className="filters">
        <label>Genre
          <select value={genre} onChange={(e) => set({ genre: e.target.value })}>
            <option value="">All genres</option>
            {genres.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
        </label>
        <label>Sort by
          <select value={sort} onChange={(e) => set({ sort: e.target.value === 'popularity.desc' ? '' : e.target.value })}>
            {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </label>
        <label>Year
          <select value={year} onChange={(e) => set({ year: e.target.value })}>
            <option value="">Any year</option>
            {YEARS.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
        <label>Min rating
          <select value={minRating} onChange={(e) => set({ rating: e.target.value === '0' ? '' : e.target.value })}>
            {RATINGS.map((r) => <option key={r} value={r}>{r === 0 ? 'Any' : `${r}+ stars`}</option>)}
          </select>
        </label>
        {(filtering || category) && <button className="btn btn-ghost" onClick={() => setParams({}, { replace: true })}>Clear</button>}
      </div>

      <MovieGrid movies={movies} loading={loading} error={error} hasMore={hasMore} onMore={loadMore} onRetry={retry} empty="No movies match these filters. Try loosening them." />
    </>
  )
}
