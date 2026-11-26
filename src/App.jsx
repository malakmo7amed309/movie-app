import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import MovieDetails from './pages/MovieDetails'
import Browse from './pages/Browse'
import Library from './pages/Library'
import NotFound from './pages/NotFound'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'search', element: <Search /> },
        { path: 'movie/:id', element: <MovieDetails /> },
        { path: 'browse', element: <Browse /> },
        { path: 'library', element: <Library /> },
        { path: 'favorites', element: <Navigate to="/library" replace /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
)

export default function App() {
  return <RouterProvider router={router} />
}
