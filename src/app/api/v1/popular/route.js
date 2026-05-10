/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Popular & trending endpoint — GET /api/v1/popular   ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/popular/route.js
 * Purpose    : Popular and trending series listing
 *
 * Summary    :
 * Returns popular or trending series by proxying the Toraka
 * series listing with the appropriate sort parameter.
 * Supports pagination and caches results for 5 minutes.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 *
 */

const { success, error, cors } = require('@/lib/response');
const cache = require('@/lib/cache');

/* ─── Toraka API base ─── */
const TORAKA_BASE = 'https://core.toraka.com/api/v1';

/* ─── Allowed types ─── */
const ALLOWED_TYPES = ['popular', 'trending'];

/* ─── Cache TTL ─── */
const POPULAR_CACHE_TTL = 300; /* 5 minutes */

/**
 * GET handler for /api/v1/popular
 *
 * Returns popular or trending series from the Toraka catalog.
 *
 * Query Parameters:
 *   - page (optional) — Page number, defaults to 1
 *   - type (optional) — 'popular' or 'trending', defaults to 'popular'
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with popular/trending series
 *
 * @example
 * GET /api/v1/popular
 * GET /api/v1/popular?type=trending&page=2
 */
export async function GET(request) {
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    const { searchParams } = new URL(request.url);

    /* ─── Parse and validate parameters ─── */
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const type = (searchParams.get('type') || 'popular').toLowerCase().trim();

    /* Validate type */
    if (!ALLOWED_TYPES.includes(type)) {
      return error(
        400,
        `Invalid type "${type}". Allowed values: ${ALLOWED_TYPES.join(', ')}`,
        'INVALID_TYPE'
      );
    }

    /* Map type to Toraka sort parameter */
    const sort = type === 'trending' ? 'trending_rank' : 'popularity_rank';

    /* ─── Check cache ─── */
    const cacheKey = cache.makeKey('popular', { type, page });
    const cached = cache.get(cacheKey);
    if (cached) {
      return success(cached.data, {
        page,
        limit: 25,
        total: cached.total,
      });
    }

    /* ─── Build Toraka URL ─── */
    const url = new URL(`${TORAKA_BASE}/series`);
    url.searchParams.append('sort', sort);
    url.searchParams.append('page', String(page));

    /* ─── Fetch from Toraka ─── */
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ShineiAPI/2.0.2 (github.com/Shineii86/ShineiAPI)',
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error(`[Popular API] Toraka returned ${response.status}: ${errorText}`);

      if (response.status === 429) {
        return error(429, 'Upstream API rate limit exceeded. Try again later.', 'UPSTREAM_RATE_LIMIT');
      }
      return error(502, 'Upstream API returned an error.', 'UPSTREAM_ERROR');
    }

    const data = await response.json();

    /* ─── Normalize response ─── */
    const series = (data.data || []).map(item => ({
      id: item.uuid,
      title: item.title || item.name,
      slug: item.slug,
      synopsis: item.synopsis,
      alt_titles: item.alt_titles || [],
      authors: item.authors || [],
      artists: item.artists || [],
      genres: item.genres || [],
      type: item.type,
      status: item.status,
      rating: item.rating,
      chapters_count: item.chapters_count || item.chapters_available,
      bookmarks_count: item.bookmarks_count,
      popularity_rank: item.popularity_rank,
      trending_rank: item.trending_rank,
      cover: item.cover,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    const total = data.pagination?.total || series.length;

    /* ─── Cache the result ─── */
    cache.set(cacheKey, { data: series, total }, POPULAR_CACHE_TTL);

    return success(series, {
      page,
      limit: 25,
      total,
    });

  } catch (err) {
    console.error('[Popular API] Error:', err.message);

    if (err.name === 'AbortError') {
      return error(504, 'Upstream API request timed out.', 'UPSTREAM_TIMEOUT');
    }

    return error(500, 'An unexpected error occurred while fetching popular series.', 'INTERNAL_ERROR');
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return cors();
}
