import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Search from './pages/Search'
import MovieDetails from './pages/MovieDetails'
import Favorites from './pages/Favorites'
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
        { path: 'favorites', element: <Favorites /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL }
)

export default function App() {
  return <RouterProvider router={router} />
}
