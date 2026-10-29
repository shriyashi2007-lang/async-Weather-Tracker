import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { fileURLToPath } from 'node:url';
import { createWeatherService } from './services/weatherService.js';
import { weatherRoutes } from './routes/weather.js';
import { createRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { AppError } from './utils/errors.js';
export function createApp(config, overrides = {}) {
  const app = express();
  app.disable('x-powered-by');
  if (process.env.VERCEL) app.set('trust proxy', 1);
  app.use(helmet({ contentSecurityPolicy: { directives: { 'script-src': ["'self'"], 'style-src': ["'self'"], 'upgrade-insecure-requests': process.env.NODE_ENV === 'production' ? [] : null } } }));
  if (config.origins.length) app.use('/api', cors({ origin(origin, callback) { callback(origin && !config.origins.includes(origin) ? new AppError(403, 'ORIGIN_NOT_ALLOWED', 'This origin is not allowed.') : null, true); } }));
  app.use('/api', createRateLimiter(overrides.rateLimit || 60), weatherRoutes(createWeatherService({ ...config, ...overrides })));
  app.use('/api', (req, res, next) => next(new AppError(404, 'NOT_FOUND', 'API endpoint not found.')));
  app.use(express.static(fileURLToPath(new URL('../public', import.meta.url))));
  app.use(errorHandler);
  return app;
}
