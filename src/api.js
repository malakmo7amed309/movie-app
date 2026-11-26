import axios from 'axios'
import { API_KEY, API_BASE } from './config'

const tmdb = axios.create({ baseURL: API_BASE, params: { api_key: API_KEY } })

export const CATEGORIES = [
  { id: 'trending', label: 'Trending', path: '/trending/movie/week' },
  { id: 'now_playing', label: 'In theaters', path: '/movie/now_playing' },
  { id: 'top_rated', label: 'Top rated', path: '/movie/top_rated' },
  { id: 'upcoming', label: 'Upcoming', path: '/movie/upcoming' },
]

export async function getCategory(id, page = 1) {
  const cat = CATEGORIES.find((c) => c.id === id) || CATEGORIES[0]
  const { data } = await tmdb.get(cat.path, { params: { page } })
  return data
}

export async function getTrending(page = 1) {
  return getCategory('trending', page)
}

export async function discoverMovies({ genre, sort = 'popularity.desc', year, minRating, page = 1 }) {
  const params = { page, sort_by: sort, 'vote_count.gte': sort.startsWith('vote_average') ? 300 : 20, include_adult: false }
  if (genre) params.with_genres = genre
  if (year) params.primary_release_year = year
  if (minRating) params['vote_average.gte'] = minRating
  const { data } = await tmdb.get('/discover/movie', { params })
  return data
}

export async function getGenres() {
  const { data } = await tmdb.get('/genre/movie/list')
  return data.genres
}

export async function searchMovies(query, page = 1) {
  const { data } = await tmdb.get('/search/movie', { params: { query, page } })
  return data
}

export async function getMovie(id) {
  const { data } = await tmdb.get(`/movie/${id}`)
  return data
}

export async function getCredits(id) {
  const { data } = await tmdb.get(`/movie/${id}/credits`)
  return data
}

export async function getVideos(id) {
  const { data } = await tmdb.get(`/movie/${id}/videos`)
  return data
}

export async function getSimilar(id) {
  const { data } = await tmdb.get(`/movie/${id}/recommendations`)
  return data
}
