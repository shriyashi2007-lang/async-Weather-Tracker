export class WeatherClientError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

export async function getWeather(city, units, signal) {
  let response;
  try { response = await fetch(`/api/weather?city=${encodeURIComponent(city)}&units=${units}`, { signal }); }
  catch (error) { if (error.name === 'AbortError') throw error; throw new WeatherClientError('NETWORK_ERROR', 'We can’t reach the weather service right now. Check your connection and try again.'); }
  let body;
  try { body = await response.json(); } catch { throw new WeatherClientError('INVALID_RESPONSE', 'The weather service returned an unreadable response. Please retry.'); }
  if (!response.ok) throw new WeatherClientError(body?.error?.code || 'REQUEST_FAILED', body?.error?.message || 'We couldn’t load weather for that city. Please try again.');
  return body;
}
