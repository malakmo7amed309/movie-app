import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header className="navbar">
        <div className="container navbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-icon">▶</span> CineScope
          </NavLink>
          <nav className="nav-links">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/search">Search</NavLink>
            <NavLink to="/favorites">Favorites</NavLink>
          </nav>
        </div>
      </header>
      <main className="container page">
        <Outlet />
      </main>
      <footer className="footer">
        <p>Built with React + the TMDB API. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </>
  )
}
