import { rateLimit } from 'express-rate-limit';
export function createRateLimiter(max = 60) {
  return rateLimit({ windowMs: 15 * 60 * 1000, limit: max, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED', message: 'Too many requests. Please try again in 15 minutes.' } } });
}
