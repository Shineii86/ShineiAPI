/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/lib/toraka.js
 * Purpose    : Toraka API client with caching and error handling
 *
 * Summary    :
 * HTTP client for the upstream Toraka API (core.toraka.com).
 * Handles all communication including request construction,
 * response parsing, error mapping, and cache integration.
 * Each method maps to a specific Toraka endpoint and returns
 * normalized data that ShineiAPI serves to consumers.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const { TORAKA } = require('./constants');
const cache = require('./cache');

/**
 * Make an HTTP request to the Toraka API
 *
 * Core request function that handles URL construction, headers,
 * timeouts, and error mapping. All Toraka API calls go through
 * this function for consistent behavior.
 *
 * @param {string} endpoint - API endpoint path (e.g., '/series/solo-leveling')
 * @param {object} [params] - Query parameters to append to the URL
 * @returns {Promise<any>} Parsed JSON response from Toraka
 * @throws {Error} On network errors, timeouts, or non-200 responses
 *
 * @example
 * const data = await torakaRequest('/search', { q: 'solo leveling' });
 */
async function torakaRequest(endpoint, params = {}) {
  /* Build the full URL with query parameters */
  const url = new URL(`${TORAKA.BASE_URL}${endpoint}`);

  /* Append query parameters, filtering out undefined/null values */
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });

  /* Create an AbortController for request timeout */
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TORAKA.TIMEOUT);

  try {
    /* Execute the upstream request */
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'ShineiAPI/2.0.2 (github.com/Shineii86/ShineiAPI)',
      },
      signal: controller.signal,
    });

    /* Clear the timeout since request completed */
    clearTimeout(timeoutId);

    /* Handle non-success HTTP status codes */
    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      throw new Error(
        `Toraka API error: ${response.status} ${response.statusText} — ${errorText}`
      );
    }

    /* Parse and return the JSON response */
    const data = await response.json();
    return data;

  } catch (err) {
    /* Clear timeout on any error */
    clearTimeout(timeoutId);

    /* Re-throw with better context */
    if (err.name === 'AbortError') {
      throw new Error(`Toraka API request timed out after ${TORAKA.TIMEOUT}ms`);
    }
    throw err;
  }
}

/**
 * Fetch series details by slug
 *
 * Retrieves complete series information including metadata,
 * chapters, ratings, and cover images from the Toraka API.
 * Results are cached for 5 minutes.
 *
 * @param {string} slug - URL-friendly series identifier (e.g., 'solo-leveling')
 * @returns {Promise<object>} Normalized series data
 *
 * @example
 * const series = await getSeries('nano-machine');
 * console.log(series.title); // 'Nano Machine'
 */
/**
 * Normalize raw Toraka series data into the API response format
 *
 * Shared normalization logic used by both getSeries (with chapters)
 * and getSeriesBasic (without chapters). Avoids code duplication.
 *
 * @param {object} raw - Raw series data from Toraka API
 * @param {boolean} includeChapters - Whether to include the chapter list
 * @returns {object} Normalized series object
 */
function normalizeSeries(raw, includeChapters = true) {
  const series = {
    id:            raw.uuid,
    title:         raw.title,
    slug:          raw.slug,
    synopsis:      raw.synopsis,
    rating:        raw.rating,
    status:        raw.meta?.status?.name || 'Unknown',
    type:          raw.meta?.type?.name || 'Unknown',
    genres:        (raw.meta?.genres || []).map(g => ({
      id:   g.uuid,
      name: g.name,
      slug: g.slug,
    })),
    authors:       (raw.meta?.authors || []).map(a => ({
      id:   a.uuid,
      name: a.name,
      slug: a.slug,
    })),
    artists:       (raw.meta?.artists || []).map(a => ({
      id:   a.uuid,
      name: a.name,
      slug: a.slug,
    })),
    alt_titles:    raw.alt_titles || [],
    cover:         raw.cover || null,
    banner:        raw.banner || null,
    official_sources: (raw.official_sources || []).map(s => ({
      name:     s.name,
      url:      s.url,
      language: s.language,
      type:     s.type,
    })),
    popularity_rank:  raw.popularity_rank,
    score_ranking:    raw.score_ranking,
    rating_count:     raw.rating_count,
    bookmarks_count:  raw.bookmarks_count,
    chapters_count:   raw.chapters_available,
  };

  /* Only include chapter list when explicitly requested */
  if (includeChapters) {
    series.chapters = (raw.chapters || []).map(ch => ({
      id:           ch.uuid,
      order:        ch.order,
      title:        ch.title,
      source:       ch.source_name,
      published_at: ch.published_at,
    }));
  }

  return series;
}

async function getSeries(slug, { includeChapters = false } = {}) {
  /* Check cache first — avoid hitting upstream API unnecessarily */
  const cacheKey = cache.makeKey('series', { slug, chapters: includeChapters ? 'yes' : 'no' });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  /* Fetch from Toraka API */
  const response = await torakaRequest(`/series/${slug}`);

  /* Extract and normalize the series data */
  const raw = response.data || response;
  const series = normalizeSeries(raw, includeChapters);

  /* Cache the normalized result */
  cache.set(cacheKey, series);

  return series;
}

/**
 * Fetch chapter list for a series
 *
 * Retrieves all chapters for a given series with their
 * metadata, sources, and publication dates. Cached for
 * 10 minutes since chapters change less frequently.
 *
 * @param {string} slug - Series slug identifier
 * @returns {Promise<Array>} Array of chapter objects
 *
 * @example
 * const chapters = await getChapters('solo-leveling');
 * console.log(chapters.length); // 200
 */
async function getChapters(slug) {
  /* Check cache first */
  const cacheKey = cache.makeKey('chapters', { slug });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  /* Fetch from Toraka API */
  const response = await torakaRequest(`/series/${slug}/chapters`);

  /* Normalize chapter data */
  const chapters = (response.data || []).map(ch => ({
    id:         ch.uuid,
    number:     ch.name,
    identifier: ch.identifier,
    title:      ch.title,
    subtitle:   ch.subtitle,
    released:   ch.released_at,
    updated:    ch.updated_at,
    is_locked:  ch.is_locked,
    sources:    (ch.sources || []).map(s => ({
      id:   s.uuid,
      name: s.name,
      slug: s.slug,
      url:  s.url,
    })),
  }));

  /* Cache with longer TTL (chapters are more stable) */
  cache.set(cacheKey, chapters, 600); /* 10 minutes */

  return chapters;
}

/**
 * Search for series by query string
 *
 * Performs a full-text search across the Toraka catalog.
 * Returns matched series with relevance ranking and
 * available metadata for filtering.
 *
 * @param {string} query    - Search query string
 * @param {number} [page=1] - Page number for pagination
 * @returns {Promise<Array>} Array of search result objects
 *
 * @example
 * const results = await search('solo leveling');
 * results.forEach(r => console.log(r.title));
 */
async function search(query, page = 1) {
  /* Validate search query */
  if (!query || query.trim().length === 0) {
    throw new Error('Search query is required');
  }

  /* Check cache */
  const cacheKey = cache.makeKey('search', { q: query, page });
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  /* Execute search against Toraka */
  const response = await torakaRequest('/search', { q: query });

  /* Normalize search results */
  const results = (response.data || []).map(item => ({
    id:              item.uuid,
    title:           item.name,
    slug:            item.slug,
    synopsis:        item.synopsis,
    alt_titles:      item.alt_titles || [],
    authors:         item.authors || [],
    artists:         item.artists || [],
    genres:          item.genres || [],
    type:            item.type,
    status:          item.status,
    rating:          item.rating,
    chapters_count:  item.chapters_count,
    bookmarks_count: item.bookmarks_count,
    popularity_rank: item.popularity_rank,
    trending_rank:   item.trending_rank,
    cover:           item.cover,
    sources:         (item.available_sources || []).map(s => ({
      id:             s.uuid,
      name:           s.name,
      latest_chapter: s.latest_chapter,
      color:          s.color,
    })),
    created_at:      item.created_at,
    updated_at:      item.updated_at,
  }));

  /* Cache search results */
  cache.set(cacheKey, results);

  return results;
}

/* ─── Export all client functions ─── */
module.exports = {
  getSeries,
  getChapters,
  search,
  torakaRequest,
  normalizeSeries,
};

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
