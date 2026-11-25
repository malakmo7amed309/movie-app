import { Link } from 'react-router-dom'
import { useFavorites } from '../favorites'
import MovieCard from '../components/MovieCard'

export default function Favorites() {
  const { favorites, toggle, isFavorite } = useFavorites()

  return (
    <>
      <section className="page-header">
        <h1>Your favorites</h1>
        <p>Saved on this device with localStorage.</p>
      </section>
      {favorites.length === 0 ? (
        <p className="empty-state">
          Nothing here yet. <Link to="/">Browse trending movies</Link> and tap the heart on anything you like.
        </p>
      ) : (
        <div className="movie-grid">
          {favorites.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isFavorite={isFavorite(movie.id)} onToggleFavorite={toggle} />
          ))}
        </div>
      )}
    </>
  )
}
