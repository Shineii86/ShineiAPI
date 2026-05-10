/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Stats Endpoint — Public API Statistics              ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/stats/route.js
 * Purpose    : Public API statistics and metadata
 *
 * Summary    :
 * Returns API statistics including uptime, cache performance,
 * rate limit config, and endpoint count. Uses the standard
 * response helper for consistent headers and format.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const cache = require('@/lib/cache');
const { success, cors } = require('@/lib/response');

/* Force dynamic rendering (no static caching of stats) */
export const dynamic = 'force-dynamic';

/* Track server start time for uptime calculation */
const startTime = Date.now();

/**
 * Format milliseconds into a human-readable uptime string
 *
 * @param {number} ms - Uptime in milliseconds
 * @returns {string} Formatted uptime (e.g., "2d 5h 30m")
 */
function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m ${s % 60}s`;
}

/**
 * GET handler for /api/v1/stats
 *
 * Returns public API statistics and metadata.
 *
 * @returns {Response} JSON response with API stats
 *
 * @example
 * GET /api/v1/stats
 */
export async function GET(request) {
  if (request.method === 'OPTIONS') {
    return cors();
  }

  const uptimeMs = Date.now() - startTime;
  const cacheStats = cache.getStats();

  return success({
    name: 'ShineiAPI',
    version: '2.0.2',
    description: 'Free manga, manhwa, and webtoon REST API',
    uptime: {
      ms: uptimeMs,
      human: formatUptime(uptimeMs),
    },
    cache: cacheStats,
    endpoints: 10,
    rate_limit: {
      max_requests: 60,
      window: '60s',
      scope: 'per IP',
    },
    data_source: 'Toraka (toraka.com)',
    documentation: 'https://shineiapi.vercel.app/docs',
    repository: 'https://github.com/Shineii86/ShineiAPI',
    license: 'MIT',
  });
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return cors();
}

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
