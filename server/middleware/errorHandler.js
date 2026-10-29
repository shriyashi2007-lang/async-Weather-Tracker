export function errorHandler(error, req, res, next) {
  const known = Number.isInteger(error.status) && typeof error.code === 'string';
  if (!known) console.error('Unexpected weather server error');
  res.status(known ? error.status : 500).json({ error: { code: known ? error.code : 'INTERNAL_ERROR', message: known ? error.message : 'Something went wrong. Please try again shortly.' } });
}
