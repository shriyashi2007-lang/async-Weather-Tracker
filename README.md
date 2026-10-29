# Async Weather Tracker

A responsive vanilla JavaScript weather dashboard with a pastel-pink interface, expressive condition effects, local time, unit preference, and browser-only recent searches.

## Structure

- `public/` — static interface and browser API client.
- `server/` — Express app, validation, controller, OpenWeatherMap service, rate limit, and JSON error handling.
- `api/index.js` — Vercel serverless entry point.
- `tests/` — backend integration tests with a stubbed upstream API.

## Set up and run

Node.js 20 or newer is required.

```sh
npm install
copy .env.example .env
# Add a real OpenWeatherMap key to WEATHER_API_KEY in .env
npm start
```

Open `http://localhost:3000`. Use `npm run dev` while developing, `npm run build` to verify production syntax, and `npm test` for backend checks.

## Environment variables

| Name | Required | Purpose |
| --- | --- | --- |
| `WEATHER_API_KEY` | Yes | Server-only OpenWeatherMap API key. |
| `PORT` | No | Local listener port; defaults to `3000`. |
| `CLIENT_ORIGIN` | No | Comma-separated allowed origins for cross-origin API use. Leave blank for same-origin hosting. |

`WEATHER_API_KEY` is checked before the local server starts. It never reaches the browser. `.env` is ignored by Git.

## API

`GET /api/weather?city=Delhi&units=metric`

`city` accepts 1–100 Unicode letters plus spaces, commas, periods, hyphens, and apostrophes. `units` is `metric` (default) or `imperial`.

Successful responses use a provider-independent shape:

```json
{
  "city": "Delhi",
  "country": "IN",
  "coord": { "lat": 28.61, "lon": 77.21 },
  "temp": 25,
  "feelsLike": 25.3,
  "humidity": 35,
  "pressure": 1012,
  "windSpeed": 3,
  "visibility": 10000,
  "condition": { "main": "Clear", "description": "clear sky", "icon": "01d", "code": 800 },
  "timezoneOffset": 19800,
  "sunrise": 0,
  "sunset": 0,
  "units": "metric",
  "fetchedAt": "2026-10-29T00:00:00.000Z"
}
```

Errors are JSON in the form `{ "error": { "code", "message" } }`. Relevant codes include `INVALID_CITY`, `INVALID_UNITS`, `CITY_NOT_FOUND`, `RATE_LIMITED`, `UPSTREAM_RATE_LIMITED`, `UPSTREAM_TIMEOUT`, `SERVICE_UNAVAILABLE`, and `NOT_FOUND`. `GET /api/health` returns `{ "status": "ok", "uptime" }`.

The server keeps up to 200 current-weather results for five minutes, keyed by city and unit, and limits `/api` to 60 requests per IP every 15 minutes.

## Deploy to Vercel

Import this directory in Vercel, then set `WEATHER_API_KEY` in the project’s environment variables. Add `CLIENT_ORIGIN` only if a different browser origin will call the API. `vercel.json` serves `public/` and rewrites `/api/*` to the Express serverless function.

The in-memory cache and rate-limit counter are best-effort on Vercel because each serverless instance holds its own memory.

## Scope notes

This project keeps the original provider’s current-weather endpoint. It supports the displayed temperature, feels-like temperature, humidity, wind, pressure, visibility, condition, local time, and sunrise/sunset. Hourly and multi-day forecasts were intentionally omitted because they require OpenWeatherMap forecast endpoints beyond the original integration.

The prior client-side source contained an OpenWeatherMap key. Treat it as exposed and rotate it in the OpenWeatherMap dashboard before deployment.
