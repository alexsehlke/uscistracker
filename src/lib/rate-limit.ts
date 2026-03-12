const requests = new Map<string, { count: number; resetAt: number }>();

// Clean up stale entries every 5 minutes
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of requests) {
    if (now > entry.resetAt) {
      requests.delete(key);
    }
  }
}

/**
 * Simple in-memory rate limiter.
 * Returns { success: true } if under limit, or { success: false, retryAfter } if over.
 */
export function rateLimit(
  key: string,
  { limit = 30, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): { success: boolean; retryAfter?: number } {
  cleanup();

  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now > entry.resetAt) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true };
  }

  entry.count++;
  if (entry.count > limit) {
    return { success: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  return { success: true };
}
