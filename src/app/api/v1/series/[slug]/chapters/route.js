/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/series/[slug]/chapters/route.js
 * Purpose    : Chapter list endpoint — GET /api/v1/series/{slug}/chapters
 *
 * Summary    :
 * Retrieves all chapters for a given series. Returns chapter
 * numbers, titles, publication dates, source information,
 * and lock status. Supports pagination via page and limit
 * query parameters.
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
 * GET handler for /api/v1/series/{slug}/chapters
 *
 * Retrieves chapter list with optional pagination.
 * Chapters are returned in reverse order (newest first)
 * by default from the upstream API.
 *
 * @param {Request} request - The incoming HTTP request
 * @param {object}  params  - Route parameters containing the slug
 * @returns {Response} JSON response with chapter list or error
 *
 * @example
 * GET /api/v1/series/solo-leveling/chapters
 * GET /api/v1/series/solo-leveling/chapters?page=1&limit=25
 */
export async function GET(request, { params }) {
  /* Handle CORS preflight */
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    /* Extract the series slug from the URL */
    const { slug } = params;

    /* Validate that a slug was provided */
    if (!slug || slug.trim() === '') {
      return error(400, 'Series slug is required', 'MISSING_SLUG');
    }

    /* Parse pagination parameters from the query string */
    const { searchParams } = new URL(request.url);
    const page  = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '100', 10)));

    /* Normalize slug: lowercase, trim, convert spaces to hyphens, strip special chars */
    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[\s_]+/g, '-')        /* spaces/underscores → hyphens */
      .replace(/[^a-z0-9-]/g, '')     /* strip non-alphanumeric except hyphens */
      .replace(/-+/g, '-')            /* collapse consecutive hyphens */
      .replace(/^-|-$/g, '');         /* trim leading/trailing hyphens */

    if (!cleanSlug) {
      return error(400, 'Invalid series slug after normalization.', 'INVALID_SLUG');
    }

    /* Fetch chapters from Toraka */
    const chapters = await toraka.getChapters(cleanSlug);

    /* Apply pagination to the results */
    const startIndex = (page - 1) * limit;
    const endIndex   = startIndex + limit;
    const paginated  = chapters.slice(startIndex, endIndex);

    /* Return paginated chapter list */
    return success(paginated, {
      page,
      limit,
      total: chapters.length,
    });

  } catch (err) {
    /* Log the error for debugging */
    console.error(`[Chapters API] Error fetching chapters:`, err.message);

    /* Handle specific error types */
    if (err.message.includes('404') || err.message.includes('Not Found')) {
      return error(
        404,
        `Series '${params.slug}' not found. No chapters available.`,
        'SERIES_NOT_FOUND'
      );
    }

    if (err.message.includes('timed out')) {
      return error(
        504,
        'Upstream API request timed out. Please try again later.',
        'UPSTREAM_TIMEOUT'
      );
    }

    return error(
      500,
      'An unexpected error occurred while fetching chapters.',
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
