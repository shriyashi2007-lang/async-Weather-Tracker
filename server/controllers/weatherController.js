export function weatherController(service) {
  return async (req, res, next) => {
    try { res.set('Cache-Control', 'no-store').json(await service(req.weatherQuery)); } catch (error) { next(error); }
  };
}
