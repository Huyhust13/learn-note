function apiLogger(req, res, next) {
  const start = Date.now();

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (Object.keys(req.body || {}).length > 0) {
    console.log(req.body);
  }
  if (Object.keys(req.query || {}).length > 0) {
    console.log(req.query);
  }
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`    Status: ${res.statusCode} Duration: ${duration}ms`);
  });
  next();
}

module.exports = apiLogger;
