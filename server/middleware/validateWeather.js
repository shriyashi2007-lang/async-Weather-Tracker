import { AppError } from '../utils/errors.js';
export function validateWeather(req, res, next) {
  const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
  const units = req.query.units ?? 'metric';
  if (!city || city.length > 100 || !/^[\p{L}\p{M} .,'’-]+$/u.test(city) || !/\p{L}/u.test(city)) return next(new AppError(400, 'INVALID_CITY', 'Enter a city using 1–100 letters, spaces, hyphens, apostrophes, periods or commas.'));
  if (!['metric', 'imperial'].includes(units)) return next(new AppError(400, 'INVALID_UNITS', 'Units must be metric or imperial.'));
  req.weatherQuery = { city, units }; next();
}
