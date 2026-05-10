/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Series detail endpoint — GET /api/v1/series/{slug}  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/series/[slug]/route.js
 * Purpose    : Series detail with optional chapter inclusion
 *
 * Summary    :
 * Returns complete series information by URL slug. Supports
 * an optional `include=chapters` parameter to embed the full
 * chapter list in a single response. Without it, chapters
 * are stripped and available via the /chapters sub-endpoint.
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
 * Normalize a user-provided slug into a valid Toraka slug
 *
 * Handles spaces, special characters, and encoding issues.
 * Converts "nano machine" → "nano-machine",
 * "Solo Leveling!!" → "solo-leveling", etc.
 *
 * @param {string} slug - Raw slug from the URL path
 * @returns {string} Cleaned, URL-safe slug
 */
function normalizeSlug(slug) {
  return slug
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')        /* spaces/underscores → hyphens */
    .replace(/[^a-z0-9-]/g, '')     /* strip non-alphanumeric except hyphens */
    .replace(/-+/g, '-')            /* collapse consecutive hyphens */
    .replace(/^-|-$/g, '');         /* trim leading/trailing hyphens */
}

/**
 * GET handler for /api/v1/series/{slug}
 *
 * Retrieves complete series information by its URL slug.
 * Optionally includes the full chapter list when
 * `include=chapters` is passed as a query parameter.
 *
 * Query Parameters:
 *   - include (optional) — Comma-separated list of includes.
 *                          Currently supports 'chapters'.
 *
 * @param {Request} request - The incoming HTTP request
 * @param {object}  params  - Route parameters containing the slug
 * @returns {Response} JSON response with series data or error
 *
 * @example
 * GET /api/v1/series/solo-leveling
 * GET /api/v1/series/solo-leveling?include=chapters
 * GET /api/v1/series/nano machine
 * GET /api/v1/series/nano%20machine
 */
export async function GET(request, { params }) {
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    const { slug } = params;

    /* ─── Validate slug ─── */
    if (!slug || slug.trim() === '') {
      return error(400, 'Series slug is required', 'MISSING_SLUG');
    }

    /* Normalize slug: lowercase, trim, convert spaces to hyphens, strip special chars */
    const cleanSlug = normalizeSlug(slug);

    if (!cleanSlug) {
      return error(400, 'Invalid series slug after normalization. Use alphanumeric characters and hyphens.', 'INVALID_SLUG');
    }

    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include')?.trim() || '';
    const includeChapters = include.split(',').map(s => s.trim()).includes('chapters');

    /* ─── Fetch from Toraka via the shared client ─── */
    const series = await toraka.getSeries(cleanSlug, { includeChapters });

    return success(series);

  } catch (err) {
    console.error('[Series API] Error:', err.message);

    if (err.message.includes('404') || err.message.includes('Not Found')) {
      return error(404, `Series '${params.slug}' not found. Check the slug and try again.`, 'SERIES_NOT_FOUND');
    }

    if (err.name === 'AbortError' || err.message.includes('timed out')) {
      return error(504, 'Upstream API request timed out. Please try again later.', 'UPSTREAM_TIMEOUT');
    }

    return error(500, 'An unexpected error occurred while fetching the series.', 'INTERNAL_ERROR');
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return cors();
}

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
