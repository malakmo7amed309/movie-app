# How CineScope works, in plain language

A walkthrough of the app for anyone who wants to understand (or explain) the code.

## The big picture

The app is a single-page application (SPA). The browser loads one HTML page, and
React swaps what's on screen as you move between Home, Search, Favorites and movie
details - no full page reloads. All movie data comes from the TMDB API, a public
REST API: the app sends an HTTP request, gets JSON back, and renders it.

## The pieces

**`src/api.js` - talking to the API.**
All API calls live in one file. It creates a pre-configured axios instance
(axios is a library for HTTP requests) with the base URL and API key baked in,
so every call is one line: `tmdb.get('/trending/movie/week')`. Centralizing this
means the key and URL are changed in exactly one place.

**`src/config.js` - settings.**
The API key and image URLs. TMDB serves images separately from data: the API
returns a file name like `/abc123.jpg` and the app builds the full URL with a
size prefix (`w342` for posters, `w780` for backdrops).

**`src/App.jsx` - the routes.**
React Router maps URLs to pages: `/` is Home, `/search` is Search,
`/movie/:id` is the details page (`:id` is a URL parameter), `/favorites` is the
favorites list, and `*` catches anything else with a 404 page. All pages share a
`Layout` with the navbar and footer - `Outlet` is where the current page renders.

**`src/pages/Home.jsx` - fetching and rendering data.**
The core React pattern in this app: `useState` holds the movies, loading flag
and error message; `useEffect` runs the fetch when the page number changes;
the render shows a spinner, an error box with retry, or the grid, depending on
state. The `cancelled` flag in the effect's cleanup prevents a slow response
from overwriting a newer one (a "race condition").

**`src/pages/Search.jsx` - debouncing.**
Every keystroke would fire an API request if we searched directly. Instead,
each keystroke starts a 400ms timer; typing again cancels the previous timer.
The search only fires when the user pauses. This is called debouncing, and it
keeps the app fast and the API happy.

**`src/pages/MovieDetails.jsx` - parallel requests.**
The details page needs two API responses (movie info + cast). `Promise.all`
fires both at once and continues when both arrive, instead of waiting for one
then the other.

**`src/favorites.js` - a custom hook.**
`useFavorites` packages favorite-movie logic so any page can use it:
`favorites`, `toggle(movie)` and `isFavorite(id)`. It reads from localStorage
on load and writes back on every change via `useEffect`, so favorites survive
a refresh. This is the power of custom hooks: stateful logic, written once,
shared everywhere.

**`src/components/MovieCard.jsx` - reusable UI.**
One card component is used by Home, Search and Favorites. It receives data and
callbacks as props (`movie`, `isFavorite`, `onToggleFavorite`) and decides
nothing about where data comes from. Props down, events up.

## Concepts worth being able to name

- **SPA and client-side routing** - one page, URLs handled in the browser.
- **REST API + JSON** - request/response over HTTP, data as JSON.
- **Async/await with axios** - non-blocking network calls.
- **useState / useEffect** - React's state and side-effect model.
- **Effect cleanup + race conditions** - ignoring stale responses.
- **Debouncing** - delaying work until input settles.
- **Custom hooks** - reusing stateful logic across pages.
- **Props down, events up** - one-way data flow between components.
- **localStorage** - simple client-side persistence.
- **CSS custom properties + grid + media queries** - theming and responsive layout.
