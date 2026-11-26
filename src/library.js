import { useSyncExternalStore } from 'react'

// One shared store so every card and page agrees. Saved in localStorage.
const KEY = 'cinescope-library'
const OLD_KEY = 'movie-app-favorites'

function read() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (saved && typeof saved === 'object') return saved
  } catch { /* ignore */ }
  // Migrate the old favorites list so nobody loses their hearts.
  try {
    const old = JSON.parse(localStorage.getItem(OLD_KEY)) || []
    return Object.fromEntries(old.map((m) => [m.id, { ...m, favorite: true, added: Date.now() }]))
  } catch {
    return {}
  }
}

let state = read()
const listeners = new Set()

function commit(next) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ }
  listeners.forEach((l) => l())
}

const snapshot = () => state
const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export const FLAGS = ['favorite', 'watchlist', 'watched']

function toggle(movie, flag) {
  const current = state[movie.id] || {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    added: Date.now(),
  }
  const updated = { ...current, [flag]: !current[flag] }
  // Marking watched takes it off the watchlist.
  if (flag === 'watched' && updated.watched) updated.watchlist = false
  const next = { ...state }
  if (FLAGS.some((f) => updated[f])) next[movie.id] = updated
  else delete next[movie.id]
  commit(next)
}

export function useLibrary() {
  const items = useSyncExternalStore(subscribe, snapshot)
  return {
    has: (id, flag) => Boolean(items[id]?.[flag]),
    toggle,
    list: (flag) => Object.values(items).filter((m) => m[flag]),
    count: (flag) => Object.values(items).filter((m) => m[flag]).length,
    clear: (flag) => {
      const next = {}
      for (const [id, m] of Object.entries(items)) {
        const u = { ...m, [flag]: false }
        if (FLAGS.some((f) => u[f])) next[id] = u
      }
      commit(next)
    },
  }
}
