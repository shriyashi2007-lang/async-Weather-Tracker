import { AppError } from '../utils/errors.js';
const numeric = x => typeof x === 'number' && Number.isFinite(x) ? x : null;
const text = x => typeof x === 'string' ? x : null;
export function normalizeWeather(data, units, now) {
  const w = data.weather?.[0];
  return { city: text(data.name), country: text(data.sys?.country), coord: { lat: numeric(data.coord?.lat), lon: numeric(data.coord?.lon) }, temp: numeric(data.main?.temp), feelsLike: numeric(data.main?.feels_like), humidity: numeric(data.main?.humidity), pressure: numeric(data.main?.pressure), windSpeed: numeric(data.wind?.speed), visibility: numeric(data.visibility), condition: { main: text(w?.main), description: text(w?.description), icon: text(w?.icon), code: numeric(w?.id) }, timezoneOffset: numeric(data.timezone), sunrise: numeric(data.sys?.sunrise), sunset: numeric(data.sys?.sunset), units, fetchedAt: new Date(now).toISOString() };
}
export function createWeatherService({ apiKey, fetcher = fetch, now = Date.now, ttl = 300000, maxEntries = 200, timeout = 10000 }) {
  const cache = new Map();
  return async ({ city, units }) => {
    const timestamp = now();
    for (const [key, item] of cache) if (item.expires <= timestamp) cache.delete(key);
    const key = `${city.toLowerCase()}:${units}`;
    if (cache.has(key)) return cache.get(key).data;
    let response;
    try {
      response = await fetcher(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${units}&appid=${encodeURIComponent(apiKey)}`, { signal: AbortSignal.timeout(timeout) });
    } catch (error) {
      if (['TimeoutError', 'AbortError'].includes(error.name)) throw new AppError(504, 'UPSTREAM_TIMEOUT', 'The weather service took too long. Please retry.');
      throw new AppError(503, 'SERVICE_UNAVAILABLE', 'Cannot reach the weather service. Please try again shortly.');
    }
    if (response.status === 404) throw new AppError(404, 'CITY_NOT_FOUND', 'We couldn’t find that city. Check the spelling or add a country code.');
    if ([401, 403].includes(response.status)) {
      console.error(`Weather provider authentication rejected (HTTP ${response.status}); check WEATHER_API_KEY.`);
      throw new AppError(502, 'UPSTREAM_AUTH_ERROR', 'The weather service is not configured correctly. Please try again later.');
    }
    if (response.status === 429) throw new AppError(429, 'UPSTREAM_RATE_LIMITED', 'The weather service is busy. Please wait a little before retrying.');
    if (!response.ok) throw new AppError(502, 'UPSTREAM_ERROR', 'The weather service is temporarily unavailable. Please retry shortly.');
    let raw;
    try { raw = await response.json(); } catch { throw new AppError(502, 'INVALID_UPSTREAM_RESPONSE', 'The weather service returned an unreadable response. Please retry.'); }
    if (!raw || typeof raw !== 'object' || !raw.name || !raw.main) throw new AppError(502, 'INVALID_UPSTREAM_RESPONSE', 'The weather service returned incomplete data. Please retry.');
    const data = normalizeWeather(raw, units, now());
    if (cache.size >= maxEntries) cache.delete(cache.keys().next().value);
    cache.set(key, { data, expires: now() + ttl });
    return data;
  };
}
