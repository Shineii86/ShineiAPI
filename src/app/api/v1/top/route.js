/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/top/route.js
 * Purpose    : Top rated series endpoint — GET /api/v1/top
 *
 * Summary    :
 * Returns the highest-rated series from the Toraka catalog.
 * Fetches data for a curated list of top-tier series and
 * sorts them by rating in descending order. Useful for
 * building leaderboards and recommendation features.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const toraka = require('@/lib/toraka');
const cache  = require('@/lib/cache');
const { success, error, cors } = require('@/lib/response');

/**
 * Top-tier series slugs sorted by known quality
 *
 * These series are known to have high ratings in the Toraka
 * catalog. We fetch them in parallel and sort by rating.
 */
const TOP_SERIES_SLUGS = [
  'solo-leveling',
  'nano-machine',
  'tower-of-god',
  'the-beginning-after-the-end',
  'omniscient-readers-viewpoint',
  'eleceed',
  'unOrdinary',
  'god-of-high-school',
  'noblesse',
  'lookism',
  'weak-hero',
  'wind-breaker',
  'true-beauty',
  'sweet-home',
  'bastard',
  'the-remarried-empress',
  'return-of-the-mount-hua-sect',
  'legend-of-the-northern-blade',
  'mercenary-enrollment',
  'solo-leveling-ragnarok',
];

/**
 * GET handler for /api/v1/top
 *
 * Fetches multiple series in parallel, sorts by rating,
 * and returns the top results. Results are cached for
 * 10 minutes to reduce upstream load.
 *
 * Query Parameters:
 *   - limit (optional) — Number of results, defaults to 10, max 20
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with top-rated series
 *
 * @example
 * GET /api/v1/top
 * GET /api/v1/top?limit=5
 */
export async function GET(request) {
  /* Handle CORS preflight */
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    /* Parse the limit parameter */
    const { searchParams } = new URL(request.url);
    const limit = Math.min(20, Math.max(1, parseInt(
      searchParams.get('limit') || '10', 10
    )));

    /* Check cache for top-rated results */
    const cacheKey = cache.makeKey('top', { limit });
    const cached = cache.get(cacheKey);
    if (cached) return success(cached);

    /* Fetch all top series in parallel for speed */
    const results = await Promise.allSettled(
      TOP_SERIES_SLUGS.map(slug => toraka.getSeries(slug))
    );

    /* Filter out failed requests and extract successful data */
    const series = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value)
      /* Sort by rating in descending order (highest first) */
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      /* Return only the requested number of results */
      .slice(0, limit);

    /* Cache top-rated results for 10 minutes */
    cache.set(cacheKey, series, 600);

    return success(series);

  } catch (err) {
    console.error(`[Top API] Error fetching top series:`, err.message);
    return error(
      500,
      'An unexpected error occurred while fetching top series.',
      'INTERNAL_ERROR'
    );
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 *
 * @returns {Response} Empty 200 response with CORS headers
 */
export async function OPTIONS() {
  return cors();
}

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
