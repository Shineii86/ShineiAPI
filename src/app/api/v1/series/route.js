/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Browse series endpoint — GET /api/v1/series         ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/series/route.js
 * Purpose    : Browse all series with filtering and sorting
 *
 * Summary    :
 * Proxies the Toraka series listing endpoint with support
 * for pagination, sorting, genre filtering, and search.
 * Returns a paginated list of series from the upstream catalog.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 *
 */

const { success, error, cors } = require('@/lib/response');
const cache = require('@/lib/cache');

/* ─── Allowed sort fields ─── */
const ALLOWED_SORTS = [
  'popularity_rank',
  'trending_rank',
  'rating',
  'updated_at',
  'created_at',
];

/* ─── Toraka API base ─── */
const TORAKA_BASE = 'https://core.toraka.com/api/v1';

/* ─── Cache TTL for browse results ─── */
const BROWSE_CACHE_TTL = 300; /* 5 minutes */

/**
 * GET handler for /api/v1/series
 *
 * Browse all series with optional filtering, sorting, and
 * pagination. Proxies directly to the Toraka series listing
 * endpoint with validated parameters.
 *
 * Query Parameters:
 *   - page  (optional) — Page number, defaults to 1
 *   - sort  (optional) — Sort field, defaults to 'popularity_rank'
 *   - genre (optional) — Genre slug to filter by
 *   - q     (optional) — Search string to filter results
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with paginated series list
 *
 * @example
 * GET /api/v1/series
 * GET /api/v1/series?page=2
 * GET /api/v1/series?sort=rating&genre=action
 * GET /api/v1/series?q=nano&sort=popularity_rank
 */
export async function GET(request) {
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    const { searchParams } = new URL(request.url);

    /* ─── Parse and validate parameters ─── */
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
    const sort = searchParams.get('sort') || 'popularity_rank';
    const genre = searchParams.get('genre')?.trim() || null;
    const q = searchParams.get('q')?.trim() || null;

    /* Validate sort field */
    if (!ALLOWED_SORTS.includes(sort)) {
      return error(
        400,
        `Invalid sort parameter "${sort}". Allowed values: ${ALLOWED_SORTS.join(', ')}`,
        'INVALID_SORT'
      );
    }

    /* Validate page number */
    if (isNaN(page) || page < 1) {
      return error(400, 'Page must be a positive integer.', 'INVALID_PAGE');
    }

    /* ─── Check cache ─── */
    const cacheKey = cache.makeKey('browse', { page, sort, genre, q });
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
    url.searchParams.append('page', String(page));
    url.searchParams.append('sort', sort);
    if (genre) url.searchParams.append('genre', genre);
    if (q) url.searchParams.append('q', q);

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
      console.error(`[Browse API] Toraka returned ${response.status}: ${errorText}`);

      if (response.status === 404) {
        return error(404, 'No series found with the given filters.', 'NOT_FOUND');
      }
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
    cache.set(cacheKey, { data: series, total }, BROWSE_CACHE_TTL);

    return success(series, {
      page,
      limit: 25,
      total,
    });

  } catch (err) {
    console.error('[Browse API] Error:', err.message);

    if (err.name === 'AbortError') {
      return error(504, 'Upstream API request timed out.', 'UPSTREAM_TIMEOUT');
    }

    return error(500, 'An unexpected error occurred while browsing series.', 'INTERNAL_ERROR');
  }
}

/**
 * OPTIONS handler for CORS preflight requests
 */
export async function OPTIONS() {
  return cors();
}
