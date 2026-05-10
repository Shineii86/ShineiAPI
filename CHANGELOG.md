# Changelog

All notable changes to ShineiAPI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.3] - 2026-05-11

### 📝 Documentation
- **README.md updated for v2.0.3** — Version badges, changelog section, project structure (added BrowseContent, GenresContent, SeriesContent, Footer, LandingNav, LegalLayout), Key Features table (marquee + performance), removed stale entries.

### ✨ New Features
- **Infinite scroll marquee banner** — Added a seamless looping marquee between the hero and stats sections on the landing page. Displays 15 rotating keywords (Free API, No Authentication, Manga Data, CORS Enabled, etc.) with accent-colored dots. Pauses on hover. Responsive sizing for mobile. Inspired by neo-brutalist marquee patterns.

### ⚡ Performance Optimizations
- **Dynamic imports for heavy components** — `ApiPlayground` is now lazy-loaded with `next/dynamic` on both the landing page and docs page. Only loads when scrolled into view, reducing initial JS bundle by ~300 lines of client code.
- **Removed redundant Google Fonts** — Removed `<link>` tag loading 4 unused fonts (Acme, Lora, Playfair Display, Noto Serif JP). Only the 3 `next/font/google` fonts (Space Grotesk, Inter, JetBrains Mono) remain, which self-host during build.
- **System serif fallback for logo** — Replaced external Noto Serif JP dependency with system CJK serif font stack (`Hiragino Mincho ProN`, `Yu Mincho`, `MS Mincho`, `SimSun`) for the `水` logo character.
- **Removed duplicate SVG icon definitions** — `IconDatabase`, `IconZap`, `IconLayers`, `IconTerminal` were defined locally in `HomeContent.js` despite being exported from `icons.js`. `IconCode` was duplicated in `BrowseContent.js`. All now import from the shared icon library.
- **Created shared Footer component** — Extracted `Footer.js` to eliminate copy-pasted footer code across pages.
- **Fixed invalid client-side fetch option** — Removed `{ next: { revalidate: 60 } }` from `fetchJSON()` in `BrowseContent.js` — this Next.js server-only API had no effect in client components.

### 🐛 Bug Fixes
- **Duplicate `style` attribute on EndpointRow** — The component had two `style` props; the second overrode the first, losing border radius, border, and shadow styles. Merged into one.
- **Duplicate chapter date rendering** — `SeriesContent.js` rendered `ch.published_at` twice per chapter row. Removed the duplicate.

## [2.0.2] - 2026-05-10

### 🐛 Bug Fixes
- **Build: npm install failure** — Dependabot bumped `react` to v19.2.5 while `react-dom` stayed at v18.3.1 and `next` at v14.2.15 (requires React 18). Also `tailwindcss` was bumped to v4 which uses a different config format. Fixed by pinning `react` to `^18.3.1` and `tailwindcss` to `^3.4.17` to match the existing codebase.
- **Build: CSS circular dependency** — Dark mode override targeting `.btn-brutal` inside `footer` caused a circular dependency with Tailwind's `@apply bg-primary`. Removed the conflicting selector override.
- **Dark mode colors** — Full dark mode audit: text-gray-600/500/400 now readable on dark backgrounds, bg-gray-100 adapts, bg-primary/5 and border-primary/8 properly visible, footer bg-primary text-white fixed (was invisible in dark), nav logo inverted, search input, genre pills, info cards, method badges, code block headers all adapted for dark mode.
- **Emojis removed** — Genre cards on /browse/genres now use inline SVG icons instead of emoji characters.
- **Docs footer inconsistency** — The docs page footer now matches the rest of the site with all five navigation links.

### ✨ Improvements
- **Live Browse Page (`/browse`)** — Full manhwa-style browsing experience powered entirely by ShineiAPI endpoints. Features a hero banner with featured series, horizontally scrollable Popular and Trending rows with Load More buttons, Top Rated grid with ranked cards, live search with debounce and genre filtering, and a detailed series modal with chapter list, metadata grid, genres, authors, artists, and official sources.
- **Genre Browse Page (`/browse/genres`)** — Dedicated genre browsing page with color-coded genre cards with SVG icons. Clicking a genre loads matching series with pagination and Load More support.
- **Series Detail Page (`/browse/series/[slug]`)** — Deep-linkable, shareable series pages with full metadata, chapter list, banner, cover, genres, authors, artists, official sources, and API source callout. Dynamic OG metadata for social sharing.
- **Dark Mode Toggle** — Light/dark theme switch persisted to localStorage. System preference detection on first visit. Floating toggle button on all pages. Full dark theme with inverted colors. Inline script prevents flash of unstyled content.
- **Load More for Browse Rows** — Popular and Trending horizontal scroll rows now have a "Load More" card at the end that fetches the next page of results.
- **Browse link added to navigation** — Landing page nav (desktop + mobile), docs sidebar, and browse page nav all updated with Browse/Genres/Home links.
- **Home page Browse CTAs** — Hero section has "Explore Series" button, bottom CTA has "Browse Series" button.
- **Sitemap updated** — Added `/browse` and `/browse/genres` routes.
- **Version sync to v2.0.2** — All source files synced.

## [2.0.1] - 2026-05-03

### 🐛 Bug Fixes
- **Vercel build: Tailwind color classes** — `text-green-400`, `bg-green-500`, `bg-red-500`, `bg-yellow-400` etc. failed because custom colors were defined as flat CSS variables without shade scales. Added proper shade values (400/500/700) for green, yellow, red, blue in tailwind config.
- **Vercel build: opacity modifiers** — Classes like `bg-accent/20`, `border-primary/10` failed because CSS variables can't be decomposed for Tailwind's `/opacity` syntax. Converted all color variables to RGB space-separated format (`26 26 26` instead of `#1a1a1a`) and updated tailwind config to use `rgb(var(--primary) / <alpha-value>)`.
- **SSR crash: `window is not defined`** — `ApiPlayground.buildUrl()` used `window.location.origin` during server-side pre-rendering. Added `typeof window` guard with fallback origin.
- **Version mismatch** — 8 files (API routes, User-Agent strings, docs, tests, README) still referenced `2.0.0`. Synced all to `2.0.1`.
- **Logo font: Noto Serif JP** — The "水" kanji in the logo was falling back to inconsistent system fonts because Space Grotesk is Latin-only. Added Noto Serif JP via Google Fonts CSS with weights 200–900. Applied to all 6 logo instances across LandingNav, LegalLayout, docs layout, and HomeContent footer.
- **Google Fonts: full CSS link** — Loaded Acme, Lora, Noto Serif JP, and Playfair Display in a single optimized `<link>` tag with `preconnect` for fast font delivery.
- **Heart icon: SVG replaced emoji** — Footer credit "Built with ❤" used a plain emoji. Replaced with a proper `IconHeart` SVG component (filled heart, Lucide-style) and a `heartbeat` CSS animation that pulses with a realistic double-beat rhythm.
- **Redundant /docs links removed** — Landing page had 7 links pointing to `/docs` (nav Docs, nav Get Started ×2, hero CTA, recipe "See full docs", footer Documentation, bottom CTA). Removed 3 redundant ones (Get Started desktop/mobile, "See full docs"). Final count: 4 (nav, hero, bottom CTA).
- **Docs page self-reference fixed** — Docs nav and footer both linked to `/docs` while already on the docs page. Renamed to "API Reference" for clarity.
- **Footer self-links removed** — Landing, legal, and docs footers all had redundant Documentation/API Reference links already covered by nav or hero CTAs. Cleaned up across all 3 layouts.
- **Redundant cross-links removed** — Support, privacy, and terms pages had cross-link buttons at the bottom that duplicated footer navigation. Removed all three.
- **Support page added** — New `/support` page with 8 FAQs, 4 troubleshooting guides, quick links (docs, bugs, features), API status checks, and community links (Issues, Discussions, Source, Changelog). Added to footer and sitemap.

### ✨ Improvements
- **Shared normalization logic** — Extracted `normalizeSeries()` helper in toraka.js to eliminate code duplication between basic and chapter-inclusive responses.
- **Better slug validation** — Returns clear error messages for invalid slugs after normalization.
- **Updated test suite** — Added tests for `include=chapters` behavior and slug normalization with encoded spaces.
- **README** — Documented slug normalization behavior with examples.

### 🎨 Frontend Upgrades
- **`next/font` optimization** — Replaced Google Fonts `<link>` tags with next/font (Space Grotesk, Inter, JetBrains Mono). Zero layout shift, automatic subsetting, inlined critical CSS.
- **Server Component split** — `page.js` is now a proper server component with `metadata` export. Client interactivity extracted to `HomeContent.js`. Better SEO and RSC architecture.
- **Integrated unused components** — `BackToTop`, `ScrollProgress`, and `ThemeToggle` were built but never used. Now live in layout and landing page.
- **Fixed observer leak** — `useInView` hook was called inside `.map()` causing observer recreation. Extracted into dedicated sub-components (`Reveal`, `StatItem`, `FeatureCard`, `EndpointRow`).
- **Relative API URLs** — `ApiPlayground` uses relative paths instead of hardcoded domain. Works in local dev, staging, and production.
- **Error page navigation** — Root and docs error pages use `next/link` instead of `<a>` tags for client-side navigation.
- **Removed duplicate config** — Deleted `next.config.js`, kept `next.config.mjs`.
- **Version sync** — All source files, constants, middleware, OpenAPI spec, tests, and README synced to v2.0.1.
- **Removed dark theme** — Deleted `ThemeToggle` component, `[data-theme="dark"]` CSS block, and all theme toggle imports. Light-only theme.
- **Global container width** — Defined site-wide max-width (`1152px`) in a single place: `max-w-containerWidth` in Tailwind config + `--container-width` CSS custom property on `:root`. All pages (landing, docs, privacy, terms) use this shared constant. Docs layout restructured so main content and footer share the same container wrapper — footer no longer breaks out of the content width.
- **Unified nav sizing** — Docs and legal page navs now match landing page: `text-sm` links, `sm:` breakpoints, `15px` icons, consistent hover styles.
- **iOS/macOS polish** — Blended neo-brutalist personality with Apple-inspired refinements. Frosted glass nav (`backdrop-filter: blur(20px) saturate(1.8)`) on all pages. Soft layered shadows replacing hard drop shadows (`--shadow-sm/md/lg/xl` tokens). Larger border-radius (12–16px) on cards, buttons, code blocks, and badges. Apple system font stack (`-apple-system`, SF Pro Display/Text/Mono). Spring-physics easing on reveal animations (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Pill-shaped section tags with backdrop blur. Refined scrollbar (rounded, translucent). Softer section dividers and borders throughout. Rounded terminal window dots. Spring-animated recipe tabs. Refined footer with translucent version badge. No dark mode.
- **New `IconHeart` component** — SVG filled heart icon added to the icon library for consistent use across the frontend.

## [2.0.0] - 2026-05-03

### 📊 Public Stats Endpoint
- **`/api/v1/stats`** — Public API statistics: uptime, cache hit rate, endpoint count, rate limit config
- Returns real-time cache stats from the in-memory cache layer

### 🧪 API Test Suite
- **`tests/api.test.js`** — Comprehensive tests for all 10 endpoints
- Tests response format, status codes, error handling, rate limit headers
- Run with `npm test`

### 🔒 Security Hardening
- **Content-Security-Policy** header added to all pages
- **SECURITY.md** — Vulnerability reporting policy and security measures

### 🤝 GitHub Community Files
- **CI Pipeline** — `.github/workflows/ci.yml` (lint + build on push/PR)
- **Issue Templates** — Bug report + feature request forms
- **PR Template** — Checklist for contributors
- **Dependabot** — Auto npm dependency updates
- **FUNDING.yml** — GitHub Sponsors config

### 🌐 PWA & SEO
- **Web App Manifest** — `manifest.json` for PWA support
- **`humans.txt`** — Site credits for crawlers

### 🎨 Neo-Brutalist Redesign

Complete frontend redesign from dark glassmorphism to warm, bold neo-brutalist style inspired by fragment-api.arijitiyan.cc. Cream backgrounds, 4px black borders, brutal drop shadows, yellow accents, and Space Grotesk typography.

### ✨ Added

#### Live API Playground
- **Interactive Endpoint Testing** — Select from 10 API endpoints, configure parameters, and send live requests
- **Real-Time JSON Preview** — Syntax-highlighted response with color-coded keys, strings, numbers, and booleans
- **Response Metadata** — Status badge (200/404/429), request timing in ms, expandable response headers
- **Parameter Inputs** — Smart form fields per endpoint (text inputs, dropdowns for sort/day/type)
- **Copy to Clipboard** — One-click copy of full JSON response
- **Loading States** — Animated spinner during requests with 10s timeout
- **Landing Page Integration** — Featured "Try It Now" section with live playground
- **Docs Page Integration** — Replaces static "Try It Out" section

#### Legal Pages
- **Terms of Service** (`/terms`) — 11-section ToS covering acceptable use, rate limits, IP, liability, termination
- **Privacy Policy** (`/privacy`) — 11-section policy covering data collection, cookies, retention, security, children's privacy
- **Cross-Linked** — Footer links on landing page, nav headers, and inter-linked from each legal page

#### Neo-Brutalist Design System
- **Color Palette** — Warm cream `#f5f0e8`, near-black `#1a1a1a`, red `#e63b2e`, blue `#0055ff`, yellow `#ffcc00`
- **Typography** — Space Grotesk for headlines (bold, uppercase, tight tracking), Inter for body
- **Brutal Shadows** — `4px 4px 0px 0px #1a1a1a` and `8px 8px 0px 0px #1a1a1a` variants
- **Border System** — 4px solid black borders on cards, sections, and interactive elements
- **Press Effects** — `active:translate-y-1 active:translate-x-1` on buttons for tactile feedback
- **Light-Only Theme** — Simplified from light/dark toggle to single warm theme

### 🔧 Changed

- **Landing Page** — Complete rewrite: brutal nav, uppercase hero, stats bar, architecture cards, features grid, endpoint list, recipe tabs, code blocks, dark footer
- **Docs Layout** — Cream sidebar with yellow active states, brutal search modal, removed glassmorphism
- **Docs Page** — Brutalist tables, dark terminal code blocks, colored info cards, clean FAQ
- **404 Page** — Brutal not-found page with accent colors
- **Tailwind Config** — New palette, brutal shadows, Space Grotesk font family
- **Global CSS** — Complete rewrite: brutal component classes, no orbs/glassmorphism
- **Root Layout** — Space Grotesk + Inter fonts, removed dark mode script
- **Scroll Progress** — Simplified to black bar
- **Back-to-Top** — Yellow brutal button with press effect
- **Docs Search** — Brutal input modal styling
- **Theme Toggle** — Disabled (light-only theme)

### 🗑️ Removed

- **Dark Mode** — Theme toggle and dark theme variables removed (light-only)
- **Parallax Orbs** — Mouse-tracking floating orbs removed
- **Glassmorphism** — Backdrop blur, glass cards, and glass nav removed
- **Animated Gradients** — Hero gradient animation removed
- **Mouse Tracking** — Cursor position listener removed

### 📝 Files Modified

- `src/app/page.js` — Landing page: neo-brutalist redesign + API Playground section
- `src/app/globals.css` — Brutal design system, component classes
- `src/app/layout.js` — Space Grotesk + Inter fonts, removed dark mode
- `src/app/not-found.js` — Brutal 404 page
- `src/app/terms/page.js` — New Terms of Service page
- `src/app/privacy/page.js` — New Privacy Policy page
- `src/app/docs/layout.js` — Brutal docs layout with sidebar
- `src/app/docs/page.js` — Brutal docs + live API Playground
- `src/components/ApiPlayground.js` — New interactive API testing component
- `src/components/ThemeToggle.js` — Disabled (light-only)
- `src/components/ScrollProgress.js` — Simplified
- `src/components/BackToTop.js` — Brutal button style
- `src/components/DocsSearch.js` — Brutal modal style
- `tailwind.config.js` — New palette, shadows, fonts
- `public/favicon.svg/png` — Brutal favicon: cream bg, black border, yellow star
- `public/logo.svg/png` — Full brutal logo with SHINEI/API, corner accents, v2.0.0 badge
- `public/banner.svg/png` — Wide README banner with code preview and feature badges
- `public/og-image.svg/png` — Social sharing image with terminal mockup
- `public/apple-touch-icon.png` — Updated 180×180 brutal icon
- `public/sitemap.xml` — Added /terms and /privacy routes
- `README.md` — Updated features, structure, links, legal section
- `.github/workflows/ci.yml` — CI pipeline
- `.github/ISSUE_TEMPLATE/` — Bug report & feature request templates
- `.github/PULL_REQUEST_TEMPLATE.md` — PR template
- `.github/dependabot.yml` — Dependency updates
- `.github/FUNDING.yml` — GitHub Sponsors
- `SECURITY.md` — Security policy
- `tests/api.test.js` — API test suite
- `public/manifest.json` — PWA manifest
- `public/humans.txt` — Site credits
- `CHANGELOG.md` — This file

---

## [1.0.0] - 2024-01-01

### 🎉 Initial Release

The first public release of ShineiAPI — a free, open-source REST API for manga, manhwa, and webtoon data.

### ✨ Features

#### API Endpoints
- **GET /api/v1/series/{slug}** — Get detailed series information including title, synopsis, rating, genres, chapters, and cover images
- **GET /api/v1/series/{slug}/chapters** — Get chapter list for a specific series with release dates and sources
- **GET /api/v1/search?q={query}** — Search for series by title with full-text matching
- **GET /api/v1/random** — Get a random series for discovery
- **GET /api/v1/top** — Get top-rated series sorted by rating
- **GET /api/v1/schedule** — Get release schedule with optional day filtering

#### Infrastructure
- **Rate Limiting** — 60 requests per minute per IP with sliding window algorithm
- **CORS Support** — All origins allowed for public API access
- **Response Caching** — In-memory cache with configurable TTL (5 min series, 10 min search)
- **Error Handling** — Consistent error responses with proper HTTP status codes
- **Request Logging** — Console logging for all API requests

#### Documentation
- **Landing Page** — Dark-themed landing page with hero section, features, and quick start guides
- **API Documentation** — Complete endpoint documentation with examples and response schemas
- **Code Examples** — JavaScript, Python, and cURL examples for all endpoints

#### Tech Stack
- **Next.js 14** — App Router with API routes
- **Tailwind CSS** — Dark theme with gradient animations
- **Vercel** — Serverless deployment
- **Toraka API** — Upstream data source
