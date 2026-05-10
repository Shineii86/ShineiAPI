/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Stats Endpoint — Public API Statistics              ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

const cache = require('@/lib/cache');
const { success, cors } = require('@/lib/response');
const { getAnalytics } = require('@/lib/analytics');

export const dynamic = 'force-dynamic';

const startTime = Date.now();

function formatUptime(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m`;
  return `${m}m ${s % 60}s`;
}

export async function GET(request) {
  if (request.method === 'OPTIONS') return cors();

  const uptimeMs = Date.now() - startTime;
  const cacheStats = cache.getStats();
  const usage = getAnalytics();

  return success({
    name: 'ShineiAPI',
    version: '2.0.3',
    description: 'Free manga, manhwa, and webtoon REST API',
    uptime: { ms: uptimeMs, human: formatUptime(uptimeMs) },
    cache: cacheStats,
    endpoints: 10,
    rate_limit: { max_requests: 60, window: '60s', scope: 'per IP' },
    analytics: {
      total_requests: usage.total_requests,
      top_endpoints: usage.top_endpoints,
      top_queries: usage.top_queries,
      errors: usage.errors,
      response_times: usage.response_times,
    },
    data_source: 'Toraka (toraka.com)',
    documentation: 'https://shineiapi.vercel.app/docs',
    repository: 'https://github.com/Shineii86/ShineiAPI',
    license: 'MIT',
  });
}

export async function OPTIONS() {
  return cors();
}

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
