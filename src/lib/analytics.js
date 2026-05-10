/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  API Usage Analytics — In-memory tracking            ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * Tracks endpoint usage, search queries, error rates, and
 * response times. Data resets on serverless cold starts.
 * Exposed via GET /api/v1/stats analytics section.
 */

const analytics = {
  /** Total requests since cold start */
  totalRequests: 0,

  /** Requests per endpoint: { '/api/v1/search': 142, ... } */
  endpoints: {},

  /** Top search queries: { 'solo leveling': 45, ... } */
  queries: {},

  /** Error count by status: { '404': 12, '429': 3, ... } */
  errors: {},

  /** Response time tracking */
  timings: {
    count: 0,
    totalMs: 0,
    maxMs: 0,
  },

  /** Requests per IP (top 10) */
  ips: {},

  /** Timestamp of first request */
  startedAt: new Date().toISOString(),
};

/**
 * Track a completed request
 * @param {object} opts
 * @param {string} opts.pathname - Request path
 * @param {number} opts.status - Response status code
 * @param {number} opts.durationMs - Request duration in ms
 * @param {string} opts.ip - Client IP
 * @param {string} [opts.query] - Search query (if /search endpoint)
 */
export function trackRequest({ pathname, status, durationMs, ip, query }) {
  analytics.totalRequests++;

  /* Endpoint tracking */
  const ep = pathname.replace(/\/[^/]+$/, '/{slug}'); // Normalize slugs
  analytics.endpoints[ep] = (analytics.endpoints[ep] || 0) + 1;

  /* Search query tracking */
  if (query && query.trim().length >= 2) {
    const q = query.trim().toLowerCase().slice(0, 50);
    analytics.queries[q] = (analytics.queries[q] || 0) + 1;
  }

  /* Error tracking */
  if (status >= 400) {
    const code = String(status);
    analytics.errors[code] = (analytics.errors[code] || 0) + 1;
  }

  /* Timing tracking */
  analytics.timings.count++;
  analytics.timings.totalMs += durationMs;
  if (durationMs > analytics.timings.maxMs) {
    analytics.timings.maxMs = durationMs;
  }

  /* IP tracking (keep top 10) */
  if (ip) {
    analytics.ips[ip] = (analytics.ips[ip] || 0) + 1;
  }
}

/**
 * Get analytics snapshot
 * @returns {object} Current analytics data
 */
export function getAnalytics() {
  /* Top endpoints */
  const topEndpoints = Object.entries(analytics.endpoints)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  /* Top queries */
  const topQueries = Object.entries(analytics.queries)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([query, count]) => ({ query, count }));

  /* Top IPs */
  const topIps = Object.entries(analytics.ips)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([ip, count]) => ({ ip: ip.replace(/\d+$/, '***'), count })); // Mask last octet

  return {
    total_requests: analytics.totalRequests,
    started_at: analytics.startedAt,
    top_endpoints: topEndpoints,
    top_queries: topQueries,
    errors: analytics.errors,
    response_times: {
      avg_ms: analytics.timings.count > 0
        ? Math.round(analytics.timings.totalMs / analytics.timings.count)
        : 0,
      max_ms: Math.round(analytics.timings.maxMs),
      count: analytics.timings.count,
    },
    top_ips: topIps,
  };
}

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
