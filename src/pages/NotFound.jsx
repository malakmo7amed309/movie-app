import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="page-header">
      <h1>404 - Page not found</h1>
      <p>This page walked off the set. <Link to="/">Back to trending</Link></p>
    </section>
  )
}
