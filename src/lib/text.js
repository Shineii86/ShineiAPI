/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.3                                    ║
 * ║  Text Utilities — Sanitize upstream markdown          ║
 * ╚══════════════════════════════════════════════════════╝
 */

/**
 * Strip markdown syntax from Toraka synopsis text.
 *
 * Upstream data contains raw markdown links, bold, italic,
 * and other formatting that looks broken when rendered as
 * plain text. This cleans it to readable prose.
 *
 * @param {string} text - Raw synopsis from Toraka
 * @param {object} [opts]
 * @param {number} [opts.maxLen] - Truncate to this length (default: no limit)
 * @param {boolean} [opts.stripLinks] - Remove link URLs, keep text (default: true)
 * @returns {string} Cleaned text
 */
export function cleanSynopsis(text, opts = {}) {
  if (!text || typeof text !== 'string') return '';

  const { maxLen, stripLinks = true } = opts;
  let s = text;

  /* ── Remove markdown links: [text](url) → text ── */
  if (stripLinks) {
    s = s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  }

  /* ── Remove bold/italic markers ── */
  s = s.replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1');

  /* ── Remove inline code ── */
  s = s.replace(/`([^`]+)`/g, '$1');

  /* ── Remove headings ── */
  s = s.replace(/^#{1,6}\s+/gm, '');

  /* ── Remove horizontal rules ── */
  s = s.replace(/^[-*_]{3,}\s*$/gm, '');

  /* ── Remove HTML tags ── */
  s = s.replace(/<[^>]+>/g, '');

  /* ── Collapse whitespace ── */
  s = s.replace(/\n{3,}/g, '\n\n').trim();

  /* ── Truncate if needed ── */
  if (maxLen && s.length > maxLen) {
    s = s.slice(0, maxLen).replace(/\s+\S*$/, '') + '…';
  }

  return s;
}

/**
 * Clean a synopsis specifically for meta description tags.
 * Strips everything and truncates to ~160 chars.
 *
 * @param {string} text - Raw synopsis
 * @returns {string} Clean meta description
 */
export function cleanMetaDescription(text) {
  return cleanSynopsis(text, { maxLen: 160 });
}

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
