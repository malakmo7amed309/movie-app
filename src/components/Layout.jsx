import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useLibrary } from '../library'

export default function Layout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const lib = useLibrary()
  const [text, setText] = useState('')
  const input = useRef(null)
  const saved = lib.count('favorite') + lib.count('watchlist') + lib.count('watched')

  useEffect(() => { window.scrollTo(0, 0) }, [pathname])

  // Press "/" anywhere to jump to the search box.
  useEffect(() => {
    const onKey = (e) => {
      const tag = document.activeElement?.tagName
      if (e.key === '/' && tag !== 'INPUT' && tag !== 'TEXTAREA') {
        e.preventDefault()
        input.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = (e) => {
    e.preventDefault()
    const q = text.trim()
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q)}`)
      input.current?.blur()
    }
  }

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <header className="navbar">
        <div className="container navbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-icon">▶</span> CineScope
          </NavLink>
          <nav className="nav-links" aria-label="Main">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/browse">Browse</NavLink>
            <NavLink to="/library">Library{saved > 0 && <span className="count">{saved}</span>}</NavLink>
          </nav>
          <form className="nav-search" onSubmit={submit} role="search">
            <input ref={input} value={text} onChange={(e) => setText(e.target.value)} placeholder="Search movies  ( / )" aria-label="Search movies" />
          </form>
        </div>
      </header>
      <main id="main" className="container page">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Built with React + the TMDB API. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </>
  )
}
