// Per-process protection for local/single-server use. Use a shared store when scaling.
const attempts = new Map();
export const authLimiter = (req, res, next) => {
  const now = Date.now();
  for (const [key, entry] of attempts) if (entry.until <= now) attempts.delete(key);
  const key = req.ip;
  const entry = attempts.get(key) || { count: 0, until: now + 15 * 60_000 };
  if (entry.count >= 30 || (!attempts.has(key) && attempts.size >= 10000)) {
    res.set('Retry-After', String(Math.max(1, Math.ceil((entry.until - now) / 1000))));
    return res.status(429).json({ message: 'Too many authentication requests. Please try again later.' });
  }
  entry.count++;
  attempts.set(key, entry);
  next();
};
