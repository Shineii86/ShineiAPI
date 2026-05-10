/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  Landing Page Data — static content                  ║
 * ╚══════════════════════════════════════════════════════╝
 */

import {
  IconSearch, IconBook, IconZap, IconLock, IconGlobe,
  IconShuffle, IconCode, IconLayers,
  IconShield, IconTerminal,
} from '@/components/icons';

export const features = [
  { icon: IconSearch, title: 'Full-Text Search', desc: 'Search thousands of manga, manhwa, and webtoons by title, genre, or author.' },
  { icon: IconBook, title: 'Rich Metadata', desc: 'Synopsis, rating, genres, chapters, authors, artists, cover images, alt titles.' },
  { icon: IconZap, title: 'Sub-Second Responses', desc: 'In-memory caching with configurable TTL. Repeated requests served in milliseconds.' },
  { icon: IconLock, title: 'Zero Authentication', desc: 'No API keys, no sign-ups, no OAuth dances. Make a request, get JSON.' },
  { icon: IconGlobe, title: 'CORS Ready', desc: 'Call directly from any frontend — browser, mobile, desktop, extension.' },
  { icon: IconLayers, title: 'Middleware Architecture', desc: 'Built on Toraka with caching, rate limiting, error handling, normalization.' },
  { icon: IconShield, title: 'Rate Limiting', desc: '60 req/min per IP with informative headers. Fair usage enforced.' },
  { icon: IconTerminal, title: 'Developer First', desc: 'Consistent envelope, descriptive errors, multi-language examples.' },
];

export const endpoints = [
  { method: 'GET', path: '/api/v1/series', desc: 'Browse all series' },
  { method: 'GET', path: '/api/v1/series/{slug}', desc: 'Full series details' },
  { method: 'GET', path: '/api/v1/series/{slug}/chapters', desc: 'Chapter list' },
  { method: 'GET', path: '/api/v1/search?q={query}', desc: 'Search with filters' },
  { method: 'GET', path: '/api/v1/popular?type={type}', desc: 'Popular & trending' },
  { method: 'GET', path: '/api/v1/random', desc: 'Random discovery' },
  { method: 'GET', path: '/api/v1/top', desc: 'Top rated' },
  { method: 'GET', path: '/api/v1/schedule?day={day}', desc: 'Release schedule' },
  { method: 'GET', path: '/api/v1/genres', desc: 'All genres' },
  { method: 'GET', path: '/api/v1/stats', desc: 'API statistics' },
];

export const stats = [
  { value: '10', label: 'Endpoints', icon: IconCode },
  { value: '1000+', label: 'Series', icon: IconBook },
  { value: '60', label: 'Req/Min', icon: IconZap },
  { value: '0', label: 'Auth Needed', icon: IconLock },
];

export const recipes = [
  {
    id: 'search',
    icon: IconSearch,
    title: 'Search for a Series',
    desc: 'Find any manga or manhwa by title with full-text search and relevance ranking.',
    code: `const res = await fetch(
  'https://shineiapi.vercel.app/api/v1/search?q=Naruto'
);
const { data } = await res.json();

data.forEach(series => {
  console.log(series.title);      // "Naruto"
  console.log(series.rating);     // 9.2
  console.log(series.chapters_count); // 700+
});`,
    lang: 'javascript',
  },
  {
    id: 'details',
    icon: IconBook,
    title: 'Series Details + Chapters',
    desc: 'Retrieve full metadata and chapter list for any series in one request.',
    code: `const res = await fetch(
  'https://shineiapi.vercel.app/api/v1/series/solo-leveling?include=chapters'
);
const { data } = await res.json();

console.log(data.title);              // "Solo Leveling"
console.log(data.rating);             // 9.8
console.log(data.status);             // "Completed"
console.log(data.chapters.length);    // 201

data.chapters.forEach(ch => {
  console.log(\`\${ch.title} — \${ch.published_at}\`);
});`,
    lang: 'javascript',
  },
  {
    id: 'random',
    icon: IconShuffle,
    title: 'Random Discovery',
    desc: 'Build a "random recommendation" widget for your app.',
    code: `const res = await fetch(
  'https://shineiapi.vercel.app/api/v1/random'
);
const { data } = await res.json();

const card = {
  title:    data.title,
  cover:    data.cover.large,
  rating:   data.rating,
  genres:   data.genres.map(g => g.name),
  synopsis: data.synopsis.slice(0, 150) + '...',
};

console.log(card);`,
    lang: 'javascript',
  },
];
