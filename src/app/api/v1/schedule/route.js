/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : src/app/api/v1/schedule/route.js
 * Purpose    : Release schedule endpoint — GET /api/v1/schedule
 *
 * Summary    :
 * Returns series release schedules organized by day of the
 * week. Accepts an optional 'day' parameter to filter for
 * a specific day. Useful for building "what's airing today"
 * features and weekly release calendars.
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
const { DAYS } = require('@/lib/constants');

/**
 * Series slugs organized by release day
 *
 * Maps each day of the week to series that typically release
 * new chapters on that day. This is a curated mapping based
 * on observed release patterns.
 */
const SCHEDULE_MAP = {
  monday: [
    'tower-of-god',
    'lookism',
    'weak-hero',
  ],
  tuesday: [
    'eleceed',
    'unOrdinary',
    'mercenary-enrollment',
  ],
  wednesday: [
    'nano-machine',
    'the-beginning-after-the-end',
    'legend-of-the-northern-blade',
  ],
  thursday: [
    'omniscient-readers-viewpoint',
    'wind-breaker',
    'return-of-the-mount-hua-sect',
  ],
  friday: [
    'solo-leveling-ragnarok',
    'the-remarried-empress',
    'true-beauty',
  ],
  saturday: [
    'god-of-high-school',
    'sweet-home',
    'age-of-arrogance',
  ],
  sunday: [
    'noblesse',
    'bastard',
    'i-grow-stronger-by-eating',
  ],
};

/**
 * GET handler for /api/v1/schedule
 *
 * Returns release schedule data. If a day parameter is provided,
 * returns only that day's releases. Otherwise returns the full
 * weekly schedule.
 *
 * Query Parameters:
 *   - day (optional) — Day of the week (monday-sunday)
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Response} JSON response with schedule data
 *
 * @example
 * GET /api/v1/schedule
 * GET /api/v1/schedule?day=monday
 */
export async function GET(request) {
  /* Handle CORS preflight */
  if (request.method === 'OPTIONS') {
    return cors();
  }

  try {
    /* Parse the day parameter */
    const { searchParams } = new URL(request.url);
    const dayParam = searchParams.get('day')?.toLowerCase();

    /* If a specific day is requested, return just that day */
    if (dayParam) {
      /* Validate the day parameter */
      if (!DAYS.includes(dayParam)) {
        return error(
          400,
          `Invalid day "${dayParam}". Must be one of: ${DAYS.join(', ')}`,
          'INVALID_DAY'
        );
      }

      /* Check cache for this specific day */
      const cacheKey = cache.makeKey('schedule', { day: dayParam });
      const cached = cache.get(cacheKey);
      if (cached) return success(cached);

      /* Fetch series data for the requested day */
      const slugs = SCHEDULE_MAP[dayParam] || [];
      const results = await Promise.allSettled(
        slugs.map(slug => toraka.getSeries(slug))
      );

      const daySchedule = {
        day: dayParam,
        series: results
          .filter(r => r.status === 'fulfilled')
          .map(r => ({
            id:       r.value.id,
            title:    r.value.title,
            slug:     r.value.slug,
            cover:    r.value.cover,
            status:   r.value.status,
            type:     r.value.type,
            chapters: r.value.chapters_count,
          })),
      };

      /* Cache for 30 minutes */
      cache.set(cacheKey, daySchedule, 1800);
      return success(daySchedule);
    }

    /* ─── Return full weekly schedule ─── */
    const cacheKey = cache.makeKey('schedule', { full: true });
    const cached = cache.get(cacheKey);
    if (cached) return success(cached);

    /* Fetch schedules for all days in parallel */
    const fullSchedule = {};

    await Promise.allSettled(
      DAYS.map(async (day) => {
        const slugs = SCHEDULE_MAP[day] || [];
        const results = await Promise.allSettled(
          slugs.map(slug => toraka.getSeries(slug))
        );

        fullSchedule[day] = results
          .filter(r => r.status === 'fulfilled')
          .map(r => ({
            id:       r.value.id,
            title:    r.value.title,
            slug:     r.value.slug,
            cover:    r.value.cover,
            status:   r.value.status,
          }));
      })
    );

    /* Cache the full schedule for 30 minutes */
    cache.set(cacheKey, fullSchedule, 1800);
    return success(fullSchedule);

  } catch (err) {
    console.error(`[Schedule API] Error fetching schedule:`, err.message);
    return error(
      500,
      'An unexpected error occurred while fetching the schedule.',
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
