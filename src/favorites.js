import { useState, useEffect } from 'react'

const KEY = 'movie-app-favorites'

function read() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch {
    return []
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(read)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggle = (movie) => {
    setFavorites((current) =>
      current.some((m) => m.id === movie.id)
        ? current.filter((m) => m.id !== movie.id)
        : [...current, { id: movie.id, title: movie.title, poster_path: movie.poster_path, vote_average: movie.vote_average, release_date: movie.release_date }]
    )
  }

  const isFavorite = (id) => favorites.some((m) => m.id === id)

  return { favorites, toggle, isFavorite }
}
