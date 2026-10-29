import { Router } from 'express';
import { validateWeather } from '../middleware/validateWeather.js';
import { weatherController } from '../controllers/weatherController.js';
export function weatherRoutes(service) {
  const router = Router();
  router.get('/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
  router.get('/weather', validateWeather, weatherController(service));
  return router;
}
