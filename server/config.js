export function readConfig(env = process.env) {
  if (!env.WEATHER_API_KEY?.trim() || env.WEATHER_API_KEY === 'your_openweathermap_api_key') throw new Error('WEATHER_API_KEY is required. Set it in .env locally or in Vercel environment variables.');
  const port = Number(env.PORT || 3000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be an integer between 1 and 65535.');
  const origins = (env.CLIENT_ORIGIN || '').split(',').map(x => x.trim()).filter(Boolean);
  for (const origin of origins) {
    let url;
    try { url = new URL(origin); } catch { throw new Error('CLIENT_ORIGIN must contain comma-separated HTTP(S) origins.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) throw new Error('CLIENT_ORIGIN must contain exact HTTP(S) origins without paths or wildcards.');
  }
  return { apiKey: env.WEATHER_API_KEY.trim(), port, origins };
}
