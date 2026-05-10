/*
 * ╔══════════════════════════════════════════════════════╗
 * ║  SHINEIAPI v2.0.2                                    ║
 * ║  API Documentation — Neo-Brutalist                   ║
 * ║  github.com/Shineii86/ShineiAPI                      ║
 * ╚══════════════════════════════════════════════════════╝
 */

import Link from 'next/link';
import ApiPlayground from '@/components/ApiPlayground';
import {
  IconGlobe, IconFileText, IconBook, IconList, IconSearch,
  IconShuffle, IconTrophy, IconCalendar, IconTag, IconClock,
  IconDatabase, IconAlertTriangle, IconHelpCircle, IconArrowRight,
  IconGithub, IconStarFilled, IconCode, IconShield, IconLayers,
  IconLock,
} from '@/components/icons';

/* ─── Reusable Components ─── */

function Section({ id, title, icon: Icon, children }) {
  return (
    <section id={id} className="mb-20 scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold uppercase font-display flex items-center gap-3">
          {Icon && (
            <span className="w-9 h-9 bg-accent border-4 border-primary flex items-center justify-center text-primary">
              <Icon size={17} />
            </span>
          )}
          {title}
        </h2>
        <div className="mt-3 h-1 bg-primary" />
      </div>
      {children}
    </section>
  );
}

function CodeBlock({ language, children }) {
  return (
    <div className="code-brutal mb-5">
      <div className="code-brutal-header">
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.1em]">{language}</span>
      </div>
      <pre className="p-3 sm:p-5 text-xs sm:text-sm leading-relaxed overflow-x-auto">
        <code className="text-green-400">{children}</code>
      </pre>
    </div>
  );
}

function EndpointHeader({ method, path }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="method-get">{method}</span>
      <code className="text-sm font-mono font-medium">{path}</code>
    </div>
  );
}

function ParamTable({ params }) {
  return (
    <div className="overflow-x-auto mb-5">
      <table className="api-table">
        <thead>
          <tr>
            <th>Parameter</th>
            <th>Type</th>
            <th>Required</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p, i) => (
            <tr key={i}>
              <td><code className="text-tertiary text-xs font-bold">{p.name}</code></td>
              <td className="text-gray-500 text-xs">{p.type}</td>
              <td>
                {p.required ? (
                  <span className="text-secondary text-xs font-bold">Yes</span>
                ) : (
                  <span className="text-gray-400 text-xs">No</span>
                )}
              </td>
              <td className="text-gray-600 text-xs">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoCard({ children, variant = 'default' }) {
  const styles = {
    default: 'info-brutal-info',
    warning: 'info-brutal-warning',
    success: 'info-brutal-success',
  };
  return (
    <div className={styles[variant]}>
      {children}
    </div>
  );
}

/* ─── Main Page ─── */

export default function DocsPage() {
  return (
    <div>
      {/* ═══ Page Header ═══ */}
      <div className="mb-16 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-accent border-4 border-primary shadow-brutal-sm text-xs font-bold font-mono uppercase tracking-wider">
          <IconStarFilled size={12} />
          v2.0.2
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold uppercase mb-6 font-display tracking-tight leading-tight">
          API Documentation
        </h1>
        <div className="border-l-8 border-primary pl-6 mb-6">
          <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
            Everything you need to integrate ShineiAPI into your application.
            All endpoints return <code className="text-tertiary text-sm font-bold">application/json</code> and require no authentication.
          </p>
        </div>
        <div className="h-1 bg-primary" />
      </div>

      {/* ═══ Quick Start ═══ */}
      <Section id="quickstart" title="Quick Start" icon={IconCode}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'No Auth', desc: 'Just make requests', icon: IconLock },
            { label: 'CORS Enabled', desc: 'Call from any origin', icon: IconGlobe },
            { label: 'Consistent', desc: 'Same envelope format', icon: IconLayers },
          ].map((item, i) => {
            const ItemIcon = item.icon;
            return (
              <div key={i} className="card-brutal text-center !p-4">
                <div className="w-10 h-10 bg-accent border-4 border-primary flex items-center justify-center mx-auto mb-3 text-primary">
                  <ItemIcon size={18} />
                </div>
                <div className="text-sm font-bold uppercase mb-0.5">{item.label}</div>
                <div className="text-xs text-gray-500">{item.desc}</div>
              </div>
            );
          })}
        </div>
        <CodeBlock language="bash">
{`# Try it now — no API key needed
curl https://shineiapi.vercel.app/api/v1/series/solo-leveling`}
        </CodeBlock>
      </Section>

      {/* ═══ Base URL ═══ */}
      <Section id="base-url" title="Base URL" icon={IconGlobe}>
        <p className="text-gray-600 mb-4">
          All API requests are made to the following base URL:
        </p>
        <CodeBlock language="url">https://shineiapi.vercel.app/api/v1</CodeBlock>
        <InfoCard>
          <ul className="space-y-2 text-sm text-gray-600">
            {[
              'All endpoints use GET method only',
              'No authentication required',
              'CORS enabled for all origins',
              'All responses are application/json',
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2.5">
                <span className="w-2 h-2 bg-green-500 border border-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </InfoCard>
      </Section>

      {/* ═══ Response Format ═══ */}
      <Section id="response-format" title="Response Format" icon={IconFileText}>
        <p className="text-gray-600 mb-4">
          Every response follows a consistent envelope format:
        </p>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": { ... }
}`}
        </CodeBlock>
        <p className="text-gray-600 mb-3 text-sm">
          Paginated responses include an additional <code className="text-tertiary text-xs font-bold">pagination</code> object:
        </p>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": [...],
  "pagination": {
    "last_visible_page": 1,
    "has_next_page": true,
    "current_page": 1,
    "items": {
      "count": 25,
      "total": 200,
      "per_page": 25
    }
  }
}`}
        </CodeBlock>
      </Section>

      {/* ═══ Live API Playground ═══ */}
      <Section id="try-it" title="API Playground" icon={IconCode}>
        <p className="text-gray-600 mb-6">
          Test any endpoint live — select, configure, and send. Real JSON responses from the API.
        </p>
        <ApiPlayground />
      </Section>

      {/* ═══ Browse Series ═══ */}
      <Section id="browse" title="Browse Series" icon={IconList}>
        <EndpointHeader method="GET" path="/api/v1/series" />
        <p className="text-gray-600 mb-4">
          Browse all series with filtering, sorting, and pagination. Returns a paginated list from the Toraka catalog.
        </p>
        <ParamTable params={[
          { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
          { name: 'sort', type: 'string', required: false, description: 'Sort field: popularity_rank, trending_rank, rating, updated_at, created_at (default: popularity_rank)' },
          { name: 'genre', type: 'string', required: false, description: 'Genre slug to filter by (e.g., "action", "fantasy")' },
          { name: 'q', type: 'string', required: false, description: 'Search string to filter results' },
        ]} />
        <CodeBlock language="bash">
{`# Browse all series (default: popularity)
curl https://shineiapi.vercel.app/api/v1/series

# Browse with filters
curl "https://shineiapi.vercel.app/api/v1/series?sort=rating&genre=action&page=2"`}
        </CodeBlock>
      </Section>

      {/* ═══ Popular & Trending ═══ */}
      <Section id="popular" title="Popular & Trending" icon={IconTrophy}>
        <EndpointHeader method="GET" path="/api/v1/popular" />
        <p className="text-gray-600 mb-4">
          Get popular or trending series. Proxies the Toraka series listing with the appropriate sort parameter.
        </p>
        <ParamTable params={[
          { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
          { name: 'type', type: 'string', required: false, description: '"popular" or "trending" (default: popular)' },
        ]} />
        <CodeBlock language="bash">
{`# Popular series
curl https://shineiapi.vercel.app/api/v1/popular

# Trending series, page 2
curl "https://shineiapi.vercel.app/api/v1/popular?type=trending&page=2"`}
        </CodeBlock>
      </Section>

      {/* ═══ Series Detail ═══ */}
      <Section id="series" title="Series Detail" icon={IconBook}>
        <EndpointHeader method="GET" path="/api/v1/series/{slug}" />
        <p className="text-gray-600 mb-4">
          Returns complete information for a single series including metadata,
          chapters, ratings, cover images, authors, artists, and official sources.
          Pass <code className="text-tertiary text-xs font-bold">include=chapters</code> to embed the full chapter list.
        </p>
        <ParamTable params={[
          { name: 'slug', type: 'string', required: true, description: 'URL-friendly series identifier (e.g., "solo-leveling", "nano-machine")' },
          { name: 'include', type: 'string', required: false, description: 'Comma-separated includes. Use "chapters" to embed full chapter list in response' },
        ]} />
        <CodeBlock language="bash">
{`# Standard (chapters stripped)
curl https://shineiapi.vercel.app/api/v1/series/nano-machine

# With chapters included
curl "https://shineiapi.vercel.app/api/v1/series/nano-machine?include=chapters"`}
        </CodeBlock>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "id": "abc-123",
    "title": "Nano Machine",
    "slug": "nano-machine",
    "synopsis": "Nanotechnology meets martial arts...",
    "rating": 9.6,
    "status": "Releasing",
    "type": "Manhwa",
    "genres": [
      { "id": "g-1", "name": "Action", "slug": "action" },
      { "id": "g-2", "name": "Fantasy", "slug": "fantasy" }
    ],
    "authors": [
      { "id": "a-1", "name": "Geobalhan", "slug": "geobalhan" }
    ],
    "artists": [
      { "id": "ar-1", "name": "Gang-Bul-Goe Geum", "slug": "gang-bul-goe-geum" }
    ],
    "alt_titles": ["나노마신", "Nano Machine", "奈米魔神"],
    "cover": {
      "small": "https://media.toraka.com/.../small.webp",
      "large": "https://media.toraka.com/.../large.webp"
    },
    "banner": null,
    "official_sources": [
      { "name": "KakaoPage", "url": "https://...", "language": null, "type": "webtoon" }
    ],
    "popularity_rank": 7,
    "score_ranking": 3,
    "rating_count": 1046,
    "bookmarks_count": 2764,
    "chapters_count": 310,
    "chapters": [
      {
        "id": "ch-310",
        "order": 310,
        "title": "Chapter 310",
        "source": "Asura Scans",
        "published_at": "2026-04-30T01:39:48Z"
      }
    ]
  }
}`}
        </CodeBlock>
      </Section>

      {/* ═══ Chapter List ═══ */}
      <Section id="chapters" title="Chapter List" icon={IconList}>
        <EndpointHeader method="GET" path="/api/v1/series/{slug}/chapters" />
        <p className="text-gray-600 mb-4">
          Returns all chapters for a series with metadata including release dates, sources, and lock status.
        </p>
        <ParamTable params={[
          { name: 'slug', type: 'string', required: true, description: 'Series slug identifier' },
        ]} />
        <CodeBlock language="bash">{'curl https://shineiapi.vercel.app/api/v1/series/solo-leveling/chapters'}</CodeBlock>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": [
    {
      "id": "ch-001",
      "order": 1,
      "title": "Chapter 1",
      "source": "KakaoPage",
      "published_at": "2018-03-04T00:00:00Z"
    }
  ],
  "pagination": {
    "last_visible_page": 7,
    "has_next_page": true,
    "current_page": 1,
    "items": {
      "count": 100,
      "total": 650,
      "per_page": 100
    }
  }
}`}
        </CodeBlock>
      </Section>

      {/* ═══ Search ═══ */}
      <Section id="search" title="Search" icon={IconSearch}>
        <EndpointHeader method="GET" path="/api/v1/search?q={query}" />
        <p className="text-gray-600 mb-4">
          Full-text search across the manga, manhwa, and webtoon catalog with optional filters.
          Fully backward compatible — only <code className="text-tertiary text-xs font-bold">q</code> still works.
        </p>
        <ParamTable params={[
          { name: 'q', type: 'string', required: true, description: 'Search query (minimum 2 characters)' },
          { name: 'page', type: 'integer', required: false, description: 'Page number (default: 1)' },
          { name: 'genre', type: 'string', required: false, description: 'Genre slug filter (e.g., "action", "fantasy")' },
          { name: 'source', type: 'string', required: false, description: 'Source name filter (e.g., "kakao-page")' },
          { name: 'type', type: 'string', required: false, description: 'Content type (e.g., "manhwa", "manga")' },
          { name: 'status', type: 'string', required: false, description: 'Release status (e.g., "releasing", "completed")' },
        ]} />
        <CodeBlock language="bash">
{`# Basic search (backward compatible)
curl "https://shineiapi.vercel.app/api/v1/search?q=tower+of+god"

# Search with filters
curl "https://shineiapi.vercel.app/api/v1/search?q=solo&genre=action&type=manhwa&status=completed"`}
        </CodeBlock>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Tower of God",
      "slug": "tower-of-god",
      "synopsis": "What do you desire?...",
      "rating": 9.5,
      "status": "Releasing",
      "type": "Manhwa",
      "genres": [
        { "id": "...", "name": "Action", "slug": "action" }
      ],
      "chapters_count": 600,
      "bookmarks_count": 8500,
      "cover": { "small": "...", "large": "..." }
    }
  ],
  "pagination": {
    "last_visible_page": 1,
    "has_next_page": false,
    "current_page": 1,
    "items": { "count": 1, "total": 1, "per_page": 25 }
  }
}`}
        </CodeBlock>
      </Section>

      {/* ═══ Random ═══ */}
      <Section id="random" title="Random Series" icon={IconShuffle}>
        <EndpointHeader method="GET" path="/api/v1/random" />
        <p className="text-gray-600 mb-4">
          Returns a random series from a curated list of popular titles. Great for discovery features.
          Response format is identical to the Series Detail endpoint.
        </p>
        <CodeBlock language="bash">{'curl https://shineiapi.vercel.app/api/v1/random'}</CodeBlock>
      </Section>

      {/* ═══ Top Rated ═══ */}
      <Section id="top" title="Top Rated" icon={IconTrophy}>
        <EndpointHeader method="GET" path="/api/v1/top" />
        <p className="text-gray-600 mb-4">
          Returns the highest-rated series sorted by rating in descending order. Cached for 15 minutes.
        </p>
        <CodeBlock language="bash">{'curl https://shineiapi.vercel.app/api/v1/top'}</CodeBlock>
      </Section>

      {/* ═══ Schedule ═══ */}
      <Section id="schedule" title="Release Schedule" icon={IconCalendar}>
        <EndpointHeader method="GET" path="/api/v1/schedule" />
        <p className="text-gray-600 mb-4">
          Returns popular ongoing series as a release schedule approximation. Optionally filter by day.
        </p>
        <ParamTable params={[
          { name: 'day', type: 'string', required: false, description: 'Day of the week (e.g., "monday", "tuesday")' },
        ]} />
        <CodeBlock language="bash">{'curl "https://shineiapi.vercel.app/api/v1/schedule?day=monday"'}</CodeBlock>
      </Section>

      {/* ═══ Genres ═══ */}
      <Section id="genres" title="Genres" icon={IconTag}>
        <EndpointHeader method="GET" path="/api/v1/genres" />
        <p className="text-gray-600 mb-4">
          Returns all supported genres with names, slugs, and descriptions. Static data that rarely changes.
        </p>
        <CodeBlock language="bash">{'curl https://shineiapi.vercel.app/api/v1/genres'}</CodeBlock>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": [
    { "slug": "action", "name": "Action", "description": "High-energy stories..." },
    { "slug": "fantasy", "name": "Fantasy", "description": "Worlds with magic..." }
  ]
}`}
        </CodeBlock>
      </Section>

      {/* ═══ Rate Limiting ═══ */}
      <Section id="rate-limiting" title="Rate Limiting" icon={IconClock}>
        <p className="text-gray-600 mb-4">
          ShineiAPI allows <strong className="text-primary">60 requests per minute</strong> per IP address.
          Rate limit info is included in response headers:
        </p>
        <div className="overflow-x-auto mb-5">
          <table className="api-table">
            <thead>
              <tr>
                <th>Header</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['X-RateLimit-Limit', 'Maximum requests per window (60)'],
                ['X-RateLimit-Remaining', 'Remaining requests in current window'],
                ['Retry-After', 'Seconds to wait (only on 429 responses)'],
              ].map(([header, desc], i) => (
                <tr key={i}>
                  <td><code className="text-tertiary text-xs font-bold">{header}</code></td>
                  <td className="text-gray-600 text-xs">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock language="json">
{`// 429 Too Many Requests
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Maximum 60 requests per minute. Please retry after 45 seconds.",
    "status": 429,
    "retry_after": 45
  }
}`}
        </CodeBlock>
        <InfoCard variant="warning">
          <p className="text-sm text-gray-600">
            <strong className="text-secondary">Tip:</strong> Always check the <code className="text-tertiary text-xs font-bold">Retry-After</code> header on 429 responses and wait before retrying.
          </p>
        </InfoCard>
      </Section>

      {/* ═══ Caching ═══ */}
      <Section id="caching" title="Caching" icon={IconDatabase}>
        <p className="text-gray-600 mb-4">
          Responses are cached in-memory to improve performance and reduce upstream load:
        </p>
        <div className="overflow-x-auto">
          <table className="api-table">
            <thead>
              <tr>
                <th>Endpoint</th>
                <th>Cache TTL</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['/api/v1/series/{slug}', '5 minutes'],
                ['/api/v1/series/{slug}/chapters', '5 minutes'],
                ['/api/v1/search', '10 minutes'],
                ['/api/v1/top', '15 minutes'],
                ['/api/v1/schedule', '15 minutes'],
                ['/api/v1/random', '2 minutes'],
                ['/api/v1/stats', '5 minutes'],
              ].map(([ep, ttl], i) => (
                <tr key={i}>
                  <td><code className="text-tertiary text-xs font-bold">{ep}</code></td>
                  <td className="text-gray-600 text-xs">{ttl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ═══ Error Codes ═══ */}
      <Section id="errors" title="Error Codes" icon={IconAlertTriangle}>
        <p className="text-gray-600 mb-4">
          When an error occurs, the response includes a descriptive error message:
        </p>
        <div className="overflow-x-auto">
          <table className="api-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['200', 'OK — Request successful'],
                ['400', 'Bad Request — Invalid parameters or missing required fields'],
                ['404', 'Not Found — The requested resource does not exist'],
                ['429', 'Too Many Requests — Rate limit exceeded (60 req/min)'],
                ['500', 'Internal Server Error — Something went wrong on our end'],
                ['503', 'Service Unavailable — Upstream API is temporarily down'],
              ].map(([status, desc], i) => (
                <tr key={i}>
                  <td><code className="text-secondary text-xs font-bold">{status}</code></td>
                  <td className="text-gray-600 text-xs">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ═══ Health Check ═══ */}
      <Section id="health" title="Health Check" icon={IconHelpCircle}>
        <EndpointHeader method="GET" path="/api/v1/health" />
        <p className="text-gray-600 mb-4">
          Returns API health status, upstream Toraka connectivity, cache statistics, and uptime.
          Use this for monitoring, load balancer health checks, and status pages.
          Also supports <code className="text-tertiary text-xs font-bold">HEAD</code> requests for lightweight probes (same status code, no body).
        </p>
        <CodeBlock language="bash">{'curl https://shineiapi.vercel.app/api/v1/health'}</CodeBlock>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "2.0.2",
    "uptime": { "ms": 86400000, "human": "1d 0h 0m" },
    "checks": {
      "api": "healthy",
      "upstream": "healthy",
      "cache": "healthy",
      "cacheStats": {
        "entries": 42,
        "hitRate": "78.5%",
        "hits": 1520,
        "misses": 418
      }
    },
    "timestamp": "2026-05-03T12:00:00.000Z"
  }
}`}
        </CodeBlock>
        <InfoCard variant="success">
          <p className="text-sm text-gray-600">
            <strong className="text-green-700">Monitoring:</strong> The health endpoint returns <code className="text-tertiary text-xs font-bold">503</code> when upstream is down, so you can use it for automated alerting.
          </p>
        </InfoCard>
      </Section>

      {/* ═══ API Stats ═══ */}
      <Section id="stats" title="API Stats" icon={IconDatabase}>
        <EndpointHeader method="GET" path="/api/v1/stats" />
        <p className="text-gray-600 mb-4">
          Returns public API statistics including uptime, cache performance, rate limit configuration, and metadata.
          Useful for status pages and dashboards.
        </p>
        <CodeBlock language="bash">{'curl https://shineiapi.vercel.app/api/v1/stats'}</CodeBlock>
        <CodeBlock language="json">
{`{
  "success": true,
  "data": {
    "name": "ShineiAPI",
    "version": "2.0.2",
    "description": "Free manga, manhwa, and webtoon REST API",
    "uptime": { "ms": 86400000, "human": "1d 0h 0m" },
    "cache": { "entries": 42, "hits": 1520, "misses": 418 },
    "endpoints": 10,
    "rate_limit": { "max_requests": 60, "window": "60s", "scope": "per IP" },
    "data_source": "Toraka (toraka.com)",
    "documentation": "https://shineiapi.vercel.app/docs",
    "repository": "https://github.com/Shineii86/ShineiAPI",
    "license": "MIT"
  }
}`}
        </CodeBlock>
      </Section>

      {/* ═══ FAQ ═══ */}
      <Section id="faq" title="FAQ" icon={IconHelpCircle}>
        <div className="space-y-3">
          {[
            { q: 'Do I need an API key?', a: 'No! ShineiAPI is completely free and requires no authentication. Just start making requests.' },
            { q: 'What are the rate limits?', a: '60 requests per minute per IP. Rate limit headers are included in every response.' },
            { q: 'Can I use this in my frontend?', a: 'Yes! CORS is enabled for all origins. You can call the API directly from any browser.' },
            { q: 'Where does the data come from?', a: 'ShineiAPI wraps the Toraka API (toraka.com), normalizing and caching the data for easier consumption.' },
            { q: 'How often is the data updated?', a: 'Data is fetched from Toraka in real-time and cached for 2-15 minutes depending on the endpoint.' },
            { q: 'Can I self-host this?', a: 'Yes! Clone the repo, run npm install, and deploy to Vercel, Netlify, or any Node.js host.' },
          ].map((item, i) => (
            <details key={i} className="border-4 border-primary bg-surface group">
              <summary className="flex items-center justify-between p-5 cursor-pointer font-bold text-sm uppercase tracking-wider hover:bg-accent/20 transition-colors list-none">
                {item.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200 ml-4">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </summary>
              <div className="px-5 pb-5 -mt-1">
                <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* ═══ Footer CTA ═══ */}
      <div className="mt-20 border-4 border-primary bg-primary text-white p-12 md:p-16 text-center shadow-brutal-lg">
        <h3 className="text-3xl md:text-4xl font-bold uppercase font-display tracking-tight mb-4">
          Ready to <span className="text-accent">Build?</span>
        </h3>
        <p className="text-white/70 mb-8 max-w-md mx-auto text-lg">
          Start using ShineiAPI in your project today. No signup required.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a
            href="https://github.com/Shineii86/ShineiAPI"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider bg-accent text-primary border-4 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all duration-150 hover:bg-yellow-300"
          >
            <IconGithub size={16} /> View on GitHub
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 font-bold text-sm uppercase tracking-wider bg-transparent text-white border-4 border-white/40 hover:border-white hover:bg-white/10 active:translate-y-1 active:translate-x-1 transition-all duration-150"
          >
            <IconArrowRight size={16} className="rotate-180" /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
