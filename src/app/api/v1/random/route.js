/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/random/route.js
 * Purpose    : Random series endpoint — GET /api/v1/random
 *
 * Summary    :
 * Returns a random series from the Toraka catalog. Uses a
 * curated list of popular slugs to pick from, ensuring the
 * returned series has good data quality. Great for discovery.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const toraka = require('@/lib/toraka');
const { success, error, cors } = require('@/lib/response');

/**
 * Curated list of popular series slugs for random selection
 *
 * These slugs are known to exist in the Toraka catalog and
 * have complete data. This ensures random requests always
 * return valid, high-quality results.
 */
const POPULAR_SLUGS = [
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
  'age-of-arrogance',
  'i-grow-stronger-by-eating',
  'return-of-the-mount-hua-sect',
  'legend-of-the-northern-blade',
  'mercenary-enrollment',
  'the-max-level-hero-has-returne',
  'demon-king-of-the-royal-academy',
  'solo-leveling-ragnarok',
  'revenge-of-the-iron-blooded-sword-hound',
];

/**
 * GET handler for /api/v1/random
 *
 * Selects a random series slug from the curated list and
 * returns its full data. Each call returns a different series.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with random series data
 *
 * @example
 * GET /api/v1/random
 * // → { success: true, data: { title: "Eleceed", ... } }
 */
export async function GET(request) {
  /* Handle CORS preflight */
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    /* Pick a random slug from the curated list */
    const randomIndex = Math.floor(Math.random() * POPULAR_SLUGS.length);
    const slug = POPULAR_SLUGS[randomIndex];

    /* Fetch the series data */
    const series = await toraka.getSeries(slug);

    /* Return the random series */
    return success(series);

  } catch (err) {
    /* Log the error */
    console.error(`[Random API] Error fetching random series:`, err.message);

    /* If the randomly selected series fails, try another one */
    try {
      const fallbackSlug = POPULAR_SLUGS[0]; /* Solo Leveling as fallback */
      const fallback = await toraka.getSeries(fallbackSlug);
      return success(fallback);
    } catch (fallbackErr) {
      return error(
        500,
        'Unable to fetch a random series at this time.',
        'INTERNAL_ERROR'
      );
    }
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
