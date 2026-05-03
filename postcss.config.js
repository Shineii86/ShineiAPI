/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.1                                    ║
 * ║  Unofficial Toraka REST API Wrapper                  ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 *
 * File       : postcss.config.js
 * Purpose    : PostCSS configuration for Tailwind CSS
 *
 * Summary    :
 * Standard PostCSS config that enables Tailwind CSS processing
 * and autoprefixer for cross-browser CSS compatibility.
 *
 * Author     : Shineii86
 * License    : MIT
 * Created    : 2026-05-03
 * Updated    : 2026-05-03
 *
 */

module.exports = {
  plugins: {
    /* Process Tailwind CSS directives (@tailwind, @apply, etc.) */
    tailwindcss: {},
    /* Add vendor prefixes for cross-browser compatibility */
    autoprefixer: {},
  },
};

// ──── ShineiAPI · Shineii86 · github.com/Shineii86/ShineiAPI ────
