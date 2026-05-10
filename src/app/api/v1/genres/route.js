/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/genres/route.js
 * Purpose    : Genre listing endpoint — GET /api/v1/genres
 *
 * Summary    :
 * Returns the complete list of supported genres with their
 * names, slugs, and descriptions. Genres are cached from
 * the constants module since they rarely change. Useful for
 * building filter UIs and genre-based browsing.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

const { success, error, cors } = require('@/lib/response');
const { GENRES } = require('@/lib/constants');

/**
 * Genre descriptions for each supported genre
 *
 * Provides human-readable descriptions that help API consumers
 * understand what each genre covers. These are static since
 * the Toraka API doesn't provide genre descriptions.
 */
const GENRE_DESCRIPTIONS = {
  'action':        'High-energy stories featuring physical feats, combat, and adrenaline-pumping sequences.',
  'adventure':     'Stories centered around journeys, exploration, and discovering new worlds.',
  'comedy':        'Light-hearted stories focused on humor and entertainment.',
  'drama':         'Character-driven stories with emotional depth and complex relationships.',
  'fantasy':       'Stories set in worlds with magic, mythical creatures, and supernatural elements.',
  'horror':        'Stories designed to frighten, unsettle, or create tension.',
  'mystery':       'Stories revolving around puzzles, crimes, and uncovering hidden truths.',
  'psychological': 'Stories exploring the human mind, mental states, and inner conflicts.',
  'romance':       'Stories centered on love, relationships, and emotional connections.',
  'sci-fi':        'Stories exploring futuristic technology, space, and scientific concepts.',
  'slice-of-life': 'Realistic stories depicting everyday life and ordinary experiences.',
  'sports':        'Stories focused on athletic competition and sporting events.',
  'supernatural':  'Stories involving ghosts, spirits, and paranormal phenomena.',
  'thriller':      'Suspenseful stories designed to keep readers on edge.',
  'martial-arts':  'Stories focused on fighting techniques, dojos, and combat mastery.',
  'murim':         'Korean martial arts stories set in ancient martial arts worlds.',
  'system':        'Stories featuring game-like systems, stats, and leveling mechanics.',
  'isekai':        'Stories where characters are transported to another world.',
  'reincarnation': 'Stories where characters are reborn into new lives or worlds.',
  'harem':         'Stories featuring one protagonist surrounded by multiple love interests.',
  'mecha':         'Stories featuring giant robots and mechanical combat.',
  'military':      'Stories set in military contexts with warfare and strategy.',
  'music':         'Stories centered around musicians, bands, or musical journeys.',
  'parody':        'Stories that humorously imitate or satirize other works.',
  'police':        'Stories following law enforcement officers and investigations.',
  'samurai':       'Stories set in feudal Japan featuring samurai warriors.',
  'school':        'Stories set in educational institutions with student life themes.',
  'seinen':        'Stories targeted at adult male audiences with mature themes.',
  'shoujo':        'Stories targeted at young female audiences with romance focus.',
  'shounen':       'Stories targeted at young male audiences with action and friendship themes.',
  'space':         'Stories set in outer space with cosmic exploration themes.',
  'super-power':   'Stories featuring characters with extraordinary abilities.',
  'tragedy':       'Stories with sad, devastating, or emotionally heavy outcomes.',
  'vampire':       'Stories featuring vampires and blood-drinking creatures.',
  'game':          'Stories centered around gaming, game worlds, or game mechanics.',
  'historical':    'Stories set in specific historical periods with period-accurate details.',
  'demons':        'Stories featuring demons, devils, and infernal beings.',
  'magic':         'Stories centered on spellcasting, wizards, and magical systems.',
  'ecchi':         'Stories with mild fan service and suggestive themes.',
};

/**
 * GET handler for /api/v1/genres
 *
 * Returns the complete genre list with descriptions.
 * Since genres are static data, they're served from
 * constants without hitting the upstream API.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with genre list
 *
 * @example
 * GET /api/v1/genres
 * // → { success: true, data: [{ slug: "action", name: "Action", ... }] }
 */
export async function GET(request) {
  /* Handle CORS preflight */
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    /* Build genre objects with names, slugs, and descriptions */
    const genres = GENRES.map(slug => ({
      slug,
      name: slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      description: GENRE_DESCRIPTIONS[slug] || null,
    }));

    return success(genres);

  } catch (err) {
    console.error(`[Genres API] Error:`, err.message);
    return error(
      500,
      'An unexpected error occurred while fetching genres.',
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
