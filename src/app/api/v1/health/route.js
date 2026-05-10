/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Health check endpoint — GET /api/v1/health          ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/health/route.js
 * Purpose    : API health check and status monitoring
 *
 * Summary    :
 * Returns API health status, upstream connectivity,
 * cache stats, and uptime. Used for monitoring, load
 * balancer health checks, and status pages.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 *
 */

const { success, error, cors } = require('@/lib/response');
const cache = require('@/lib/cache');
const { API_META } = require('@/lib/constants');

/* ─── Track server start time ─── */
const START_TIME = Date.now();

/**
 * GET handler for /api/v1/health
 *
 * Returns comprehensive health information:
 * - API status (healthy/degraded/down)
 * - Upstream Toraka API connectivity
 * - Cache statistics
 * - Uptime
 * - Version info
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with health data
 *
 * @example
 * GET /api/v1/health
 */
export async function GET(request) {
  if (request.method === 'OPTIONS') {
    return cors();
  }

  const checks = {
    api: 'healthy',
    upstream: 'unknown',
    cache: 'unknown',
  };

  let overallStatus = 'healthy';

  /* ─── Check upstream Toraka API ─── */
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const upstreamRes = await fetch('https://core.toraka.com/api/v1/series/solo-leveling', {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': `ShineiAPI/${API_META.VERSION}` },
    });

    clearTimeout(timeoutId);
    checks.upstream = upstreamRes.ok ? 'healthy' : 'degraded';
    if (!upstreamRes.ok) overallStatus = 'degraded';
  } catch {
    checks.upstream = 'down';
    overallStatus = 'degraded';
  }

  /* ─── Check cache ─── */
  try {
    const stats = cache.getStats();
    checks.cache = 'healthy';
    checks.cacheStats = stats;
  } catch {
    checks.cache = 'down';
    overallStatus = 'degraded';
  }

  /* ─── Build response ─── */
  const uptimeMs = Date.now() - START_TIME;
  const uptimeSeconds = Math.floor(uptimeMs / 1000);
  const uptimeMinutes = Math.floor(uptimeSeconds / 60);
  const uptimeHours = Math.floor(uptimeMinutes / 60);
  const uptimeDays = Math.floor(uptimeHours / 24);

  const health = {
    status: overallStatus,
    version: API_META.VERSION,
    uptime: {
      ms: uptimeMs,
      human: uptimeDays > 0
        ? `${uptimeDays}d ${uptimeHours % 24}h ${uptimeMinutes % 60}m`
        : uptimeHours > 0
          ? `${uptimeHours}h ${uptimeMinutes % 60}m ${uptimeSeconds % 60}s`
          : `${uptimeMinutes}m ${uptimeSeconds % 60}s`,
    },
    checks,
    timestamp: new Date().toISOString(),
  };

  const status = overallStatus === 'healthy' ? 200 : 503;

  return new Response(JSON.stringify({ success: overallStatus === 'healthy', data: health }), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function OPTIONS() {
  return cors();
}

/**
 * HEAD handler for /api/v1/health
 *
 * Quick health check — same logic but returns no body.
 * Useful for load balancer probes and monitoring.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} Empty response with status code
 */
export async function HEAD(request) {
  const checks = {
    api: 'healthy',
    upstream: 'unknown',
  };

  let overallStatus = 'healthy';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const upstreamRes = await fetch('https://core.toraka.com/api/v1/series/solo-leveling', {
      method: 'HEAD',
      signal: controller.signal,
      headers: { 'User-Agent': `ShineiAPI/${API_META.VERSION}` },
    });

    clearTimeout(timeoutId);
    checks.upstream = upstreamRes.ok ? 'healthy' : 'degraded';
    if (!upstreamRes.ok) overallStatus = 'degraded';
  } catch {
    checks.upstream = 'down';
    overallStatus = 'degraded';
  }

  const status = overallStatus === 'healthy' ? 200 : 503;

  return new Response(null, {
    status,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
