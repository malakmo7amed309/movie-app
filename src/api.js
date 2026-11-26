import axios from 'axios'
import { API_KEY, API_BASE } from './config'

const tmdb = axios.create({
  baseURL: API_BASE,
  params: { api_key: API_KEY },
})

export async function getTrending(page = 1) {
  const { data } = await tmdb.get('/trending/movie/week', { params: { page } })
  return data
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
