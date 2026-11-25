# CineScope - Movie Discovery App

A movie discovery app powered by the TMDB API. Browse what's trending this week,
search any title, open full details with the top cast, and keep a favorites list
that persists between visits.

**Live demo:** https://malakmo7amed309.github.io/movie-app/

## Screenshots

| Home - trending | Movie details |
| --- | --- |
| ![Home](docs/screenshot-home.png) | ![Details](docs/screenshot-details.png) |

| Search | Mobile |
| --- | --- |
| ![Search](docs/screenshot-search.png) | ![Mobile](docs/screenshot-mobile.png) |

## Features

- Trending movies of the week with pagination
- Live search with debouncing (searches as you type, without spamming the API)
- Movie details page: backdrop, rating, runtime, genres, overview and top 8 cast
- Favorites: add/remove from any page, saved to localStorage
- Loading spinner and friendly error states with retry on every screen
- Fully responsive, custom dark cinema theme (no UI framework)

## Tech stack

- React 19 + Vite
- React Router 7 (client-side routing with a 404 page)
- axios
- TMDB API
- Plain CSS (custom properties, grid, responsive breakpoints)

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173

The TMDB key lives in `src/config.js`. Get a free key at
https://www.themoviedb.org/settings/api and replace the placeholder.

Production build:

```bash
npm run build
npm run preview
```

## How it works (plain language)

See [docs/how-it-works.md](docs/how-it-works.md) for a walkthrough of the code
and the concepts behind it.

## Author

Malak Mohamed - [GitHub](https://github.com/malakmo7amed309)

This product uses the TMDB API but is not endorsed or certified by TMDB.
